import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { SCENES, SceneData } from '../data/scenes';
import { BRAND } from '../data/brand';
import { ChevronDown, Calendar, Sparkles, X, Check, MessageCircle } from 'lucide-react';

/**
 * Helper to compute DPR cap:
 * Cap at 1.5 above 1440px wide, and 1.25 on mobile / smaller viewports
 */
function getDprCap(): number {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  if (width <= 768) {
    // Mobile: Cap at 1.0 for battery efficiency and buttery smooth 60fps scrolling
    return 1.0;
  }
  return width > 1440 ? Math.min(dpr, 1.5) : Math.min(dpr, 1.25);
}

/**
 * Preload and downscale image to at most 1920px wide (max 1920x1080)
 * Uses createImageBitmap with resizeWidth when available, falling back to an offscreen canvas.
 */
async function loadAndDownscaleImage(url: string): Promise<HTMLCanvasElement | ImageBitmap> {
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const blob = await res.blob();

    // Check createImageBitmap with resizeWidth support
    if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
      try {
        const probe = await createImageBitmap(blob);
        const origW = probe.width;
        const origH = probe.height;
        probe.close();

        const targetW = Math.min(origW, MAX_WIDTH);
        const aspect = origH / (origW || 1);
        const targetH = Math.min(Math.round(targetW * aspect), MAX_HEIGHT);

        return await createImageBitmap(blob, {
          resizeWidth: targetW,
          resizeHeight: targetH,
          resizeQuality: 'high',
        });
      } catch {
        // Fall back to canvas draw
      }
    }

    // Canvas fallback with ObjectURL
    return await new Promise<HTMLCanvasElement>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const origW = img.naturalWidth || MAX_WIDTH;
        const origH = img.naturalHeight || MAX_HEIGHT;
        const targetW = Math.min(origW, MAX_WIDTH);
        const aspect = origH / (origW || 1);
        const targetH = Math.min(Math.round(targetW * aspect), MAX_HEIGHT);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetW, targetH);
          resolve(canvas);
        } else {
          reject(new Error('2D context failed'));
        }
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };
      img.src = objectUrl;
    });
  } catch {
    // Direct Image loader fallback if fetch fails
    return await new Promise<HTMLCanvasElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const origW = img.naturalWidth || MAX_WIDTH;
        const origH = img.naturalHeight || MAX_HEIGHT;
        const targetW = Math.min(origW, MAX_WIDTH);
        const aspect = origH / (origW || 1);
        const targetH = Math.min(Math.round(targetW * aspect), MAX_HEIGHT);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetW, targetH);
          resolve(canvas);
        } else {
          reject(new Error('2D context failed'));
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}

export const CinematicExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loading state (only updates during initial loading phase)
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  // Booking Modal State (pure UI interaction)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    date: '',
    preferredScene: '01 / THE ESTATE',
  });

  // DOM REFS for Direct Style Updates (Zero React re-render on scroll frames)
  const sceneOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsStripRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counterLabelRef = useRef<HTMLDivElement | null>(null);
  const scrollHelperRef = useRef<HTMLDivElement | null>(null);
  const blackFadeRef = useRef<HTMLDivElement | null>(null);
  const fallbackLayersRef = useRef<(HTMLDivElement | null)[]>([]);

  // Jump to specific scene with smooth scroll
  const jumpToScene = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    const targetY = container.offsetTop + (idx / (SCENES.length - 1)) * totalScrollable;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.phone) return;

    try {
      const stored = JSON.parse(localStorage.getItem('ivy_viewing_bookings') || '[]');
      stored.push({
        ...bookingData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('ivy_viewing_bookings', JSON.stringify(stored));
    } catch {
      // Safe fallback if local storage restricted
    }

    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setIsBookingModalOpen(false);
      setBookingData({
        name: '',
        phone: '',
        date: '',
        preferredScene: '01 / THE ESTATE',
      });
    }, 2200);
  };

  // Main Effect: Preload, Initialize WebGL, and run Single Damped RAF Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;
    let animId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let geometry: THREE.PlaneGeometry;
    const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
    const textures: THREE.Texture[] = [];

    // Scroll & Mouse Tracking Variables (Mutable, no React state on scroll)
    let targetProgress = 0;
    let currentProgress = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let curMouseX = 0;
    let curMouseY = 0;
    let isIntersecting = true;
    let isTabVisible = !document.hidden;
    let needsRender = true;
    let lastActiveIdx = -1;
    let lastClockTime = performance.now();

    const PLANE_WIDTH = 24;
    const PLANE_HEIGHT = 13.5;
    const PLANE_SPACING = 30;
    const TOTAL_TRAVEL = (SCENES.length - 1) * PLANE_SPACING;
    const START_CAMERA_Z = 16;

    // Direct DOM Overlay updater function
    const updateDomOverlays = (progress: number, activeIdx: number) => {
      // 1. Text overlays: opacity and 3D translateY
      for (let idx = 0; idx < SCENES.length; idx++) {
        const el = sceneOverlayRefs.current[idx];
        if (!el) continue;
        const sceneCenter = idx / (SCENES.length - 1);
        const dist = Math.abs(progress - sceneCenter);
        const opacity = Math.max(0, Math.min(1, 1 - dist * 6.5));
        const translateY = (progress - sceneCenter) * 40;

        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        el.style.visibility = opacity <= 0.005 ? 'hidden' : 'visible';
      }

      // 2. Stats strip on Scene 0
      if (statsStripRef.current) {
        const statsOp = Math.max(0, Math.min(1, 1 - progress * 6.5));
        statsStripRef.current.style.opacity = statsOp.toFixed(3);
        statsStripRef.current.style.visibility = statsOp <= 0.005 ? 'hidden' : 'visible';
        statsStripRef.current.style.pointerEvents = statsOp > 0.05 ? 'auto' : 'none';
      }

      // 3. Right-side progress bar height
      if (progressBarRef.current) {
        progressBarRef.current.style.height = `${(progress * 100).toFixed(2)}%`;
      }

      // 4. Active tick indicator and counter label
      if (lastActiveIdx !== activeIdx) {
        lastActiveIdx = activeIdx;
        tickRefs.current.forEach((dot, i) => {
          if (!dot) return;
          if (i === activeIdx) {
            dot.style.backgroundColor = '#E6C36A';
            dot.style.boxShadow = '0 0 12px #E6C36A';
            dot.style.transform = 'scale(1.35)';
          } else {
            dot.style.backgroundColor = 'rgba(168, 159, 141, 0.6)';
            dot.style.boxShadow = 'none';
            dot.style.transform = 'scale(1.0)';
          }
        });
        if (counterLabelRef.current) {
          counterLabelRef.current.textContent = `0${activeIdx + 1}/0${SCENES.length}`;
        }
      }

      // 5. Scroll helper fade out
      if (scrollHelperRef.current) {
        scrollHelperRef.current.style.opacity = progress < 0.03 ? '1' : '0';
      }

      // 6. Black fade at the end
      if (blackFadeRef.current) {
        const blackOp = Math.max(0, Math.min(1, (progress - 0.88) / 0.1));
        blackFadeRef.current.style.opacity = blackOp.toFixed(3);
        blackFadeRef.current.style.visibility = blackOp <= 0.005 ? 'hidden' : 'visible';
      }

      // 7. CSS Fallback layers (if WebGL unavailable)
      if (fallbackLayersRef.current.length > 0) {
        for (let i = 0; i < SCENES.length; i++) {
          const layer = fallbackLayersRef.current[i];
          if (!layer) continue;
          const dist = progress * (SCENES.length - 1) - i;
          const opacity = Math.max(0, 1 - Math.abs(dist) * 1.3);
          const scale = 1.08 - dist * 0.06;
          layer.style.opacity = opacity.toFixed(3);
          layer.style.transform = `scale(${Math.max(0.96, Math.min(1.25, scale)).toFixed(3)}) translate3d(${(curMouseX * 12).toFixed(1)}px, ${(curMouseY * 8).toFixed(1)}px, 0)`;
          layer.style.visibility = opacity <= 0.005 ? 'hidden' : 'visible';
        }
      }
    };

    // Passive scroll handler
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      targetProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      needsRender = true;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Passive mouse handler
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
      needsRender = true;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) needsRender = true;
        });
      },
      { root: null, threshold: 0.01 }
    );
    observer.observe(container);

    // Page visibility
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) needsRender = true;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Context lost handler
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost, switching to CSS cinematic fallback');
      setIsSupported(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    // Resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(getDprCap());
      needsRender = true;
    };
    window.addEventListener('resize', handleResize);

    // ASYNC PRELOAD & WEBGL INITIALIZATION
    (async () => {
      try {
        // Step A: Initialize WebGLRenderer with exact requirements:
        // antialias: false, powerPreference: 'high-performance', DPR cap 1.5 above 1440px / 1.25 mobile
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        });

        renderer.setPixelRatio(getDprCap());
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000000, 0.024);

        camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 350);
        camera.position.set(0, 0, START_CAMERA_Z);

        geometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT, 1, 1);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);

        // Step B: Preload and decode ALL scene textures upfront
        const loadedTextures: THREE.Texture[] = [];
        for (let i = 0; i < SCENES.length; i++) {
          if (isDisposed) return;
          const sceneData = SCENES[i];
          const source = await loadAndDownscaleImage(sceneData.image);

          const tex = new THREE.Texture(source);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = 4;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.y = -1;
          tex.offset.y = 1;
          tex.needsUpdate = true;

          // GPU upload happens upfront before first frame
          renderer.initTexture(tex);

          loadedTextures.push(tex);
          textures.push(tex);

          // Update loading progress state
          const percent = Math.round(((i + 1) / SCENES.length) * 100);
          setLoadPercent(percent);
        }

        if (isDisposed) return;

        // Step C: Keep all scene planes in the scene permanently
        SCENES.forEach((_, index) => {
          const zPos = -index * PLANE_SPACING;
          const xOffset = index === 0 ? 0 : index % 2 === 1 ? 0.3 : -0.3;
          const yOffset = index === 0 ? 0 : index % 3 === 1 ? -0.15 : 0.15;

          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures[index],
            color: 0xffffff,
            transparent: true,
            opacity: index === 0 ? 1 : 0.95,
            depthWrite: false,
            side: THREE.FrontSide,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(xOffset, yOffset, zPos);
          scene.add(mesh);
          meshes.push(mesh);
        });

        // Set ready
        setIsLoaded(true);
        needsRender = true;
      } catch (err) {
        console.warn('WebGL initialization or texture preloading failed:', err);
        setIsSupported(false);
        setIsLoaded(true);
      }

      // Step D: Start ONE single requestAnimationFrame Loop
      const tick = (timestamp: number) => {
        animId = requestAnimationFrame(tick);

        if (!isIntersecting || !isTabVisible) return;

        const delta = Math.min((timestamp - lastClockTime) / 1000, 0.1);
        lastClockTime = timestamp;

        // Time-based exponential damping for scroll progress
        const pDiff = targetProgress - currentProgress;
        if (Math.abs(pDiff) > 0.00005) {
          currentProgress += pDiff * (1 - Math.exp(-9.5 * delta));
          needsRender = true;
        } else if (currentProgress !== targetProgress) {
          currentProgress = targetProgress;
          needsRender = true;
        }

        // Smooth mouse damping
        const mXDiff = targetMouseX - curMouseX;
        const mYDiff = targetMouseY - curMouseY;
        if (Math.abs(mXDiff) > 0.001 || Math.abs(mYDiff) > 0.001) {
          curMouseX += mXDiff * (1 - Math.exp(-7.0 * delta));
          curMouseY += mYDiff * (1 - Math.exp(-7.0 * delta));
          needsRender = true;
        }

        // Render only when progress or mouse changed
        if (needsRender) {
          const activeIdx = Math.min(
            Math.round(currentProgress * (SCENES.length - 1)),
            SCENES.length - 1
          );

          if (renderer && scene && camera && meshes.length > 0) {
            // Update Camera Position & Parallax (respecting prefers-reduced-motion)
            const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const targetCamZ = START_CAMERA_Z - currentProgress * TOTAL_TRAVEL;
            camera.position.x = isReducedMotion ? 0 : curMouseX * 0.45;
            camera.position.y = isReducedMotion ? 0 : -curMouseY * 0.3;
            camera.position.z = targetCamZ;

            // Toggle .visible only for current and neighbouring scenes
            for (let i = 0; i < meshes.length; i++) {
              const mesh = meshes[i];
              const isNeighbour = Math.abs(activeIdx - i) <= 1;
              mesh.visible = isNeighbour;

              if (isNeighbour) {
                const distToCam = camera.position.z - mesh.position.z;
                if (distToCam < 0) {
                  mesh.material.opacity = 0;
                  mesh.visible = false;
                } else if (distToCam < 4) {
                  mesh.material.opacity = Math.max(0, (distToCam - 1.2) / 2.8);
                } else {
                  mesh.material.opacity = 1;
                }
              }
            }

            renderer.render(scene, camera);
          }

          // Direct DOM updates (no React setState)
          updateDomOverlays(currentProgress, activeIdx);

          // Settle check
          if (
            Math.abs(targetProgress - currentProgress) <= 0.00005 &&
            Math.abs(targetMouseX - curMouseX) <= 0.001 &&
            Math.abs(targetMouseY - curMouseY) <= 0.001
          ) {
            needsRender = false;
          }
        }
      };

      animId = requestAnimationFrame(tick);
    })();

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      observer.disconnect();

      if (geometry) geometry.dispose();
      textures.forEach((tex) => tex.dispose());
      meshes.forEach((m) => {
        m.material.dispose();
      });
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="experience"
      className="relative bg-black text-white w-full select-none"
    >
      {/* Tall scroll track (approx 700vh) */}
      <div className="h-[700vh] relative">
        {/* Pinned Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col justify-between">
          {/* WebGL Canvas */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full block z-0 transition-opacity duration-700 ${
              isSupported && isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Fallback CSS 3D Dolly Image Stack (Smoothly active if WebGL unsupported) */}
          {!isSupported && (
            <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none select-none">
              {SCENES.map((scene, i) => (
                <div
                  key={scene.id}
                  ref={(el) => {
                    fallbackLayersRef.current[i] = el;
                  }}
                  className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    visibility: i === 0 ? 'visible' : 'hidden',
                  }}
                >
                  <img
                    src={scene.image}
                    alt={scene.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* STATIC VIGNETTE (Plain radial-gradient div, zero CSS filter, zero film-grain animation) */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 38%, rgba(0, 0, 0, 0.45) 72%, rgba(0, 0, 0, 0.88) 100%)',
            }}
          />

          {/* Loading Screen Overlay (preloading & decoding GPU textures upfront) */}
          {!isLoaded && (
            <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center p-6 text-center">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#E6C36A]" />
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#E6C36A]">
                  IVY DEVELOPERS · LAHORE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-semibold text-white tracking-[0.1em] mb-6">
                Preparing Architectural Walkthrough
              </h2>
              {/* Gold Progress Bar */}
              <div className="w-64 sm:w-80 h-1.5 bg-[#1B1917] rounded-full overflow-hidden border border-[#8A6A2B]/30 relative">
                <div
                  className="h-full bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] transition-all duration-300"
                  style={{ width: `${loadPercent}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between w-64 sm:w-80 text-[10px] font-mono text-[#A89F8D]">
                <span>Preloading GPU Textures</span>
                <span className="text-[#E6C36A] font-semibold">{loadPercent}%</span>
              </div>
            </div>
          )}

          {/* Fade to pure black overlay after last scene */}
          <div
            ref={blackFadeRef}
            className="absolute inset-0 bg-black pointer-events-none z-15"
            style={{ opacity: 0, visibility: 'hidden' }}
          />

          {/* TOP BAR OVERLAY: Logo marker & Pinned "Book a Viewing" Gold Pill */}
          <div className="relative z-30 pt-20 sm:pt-24 px-6 sm:px-12 md:px-16 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-heading font-semibold uppercase tracking-[0.25em] text-[#E6C36A] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E6C36A]" />
                <span className="hidden sm:inline">Cinematic Architecture Walkthrough</span>
                <span className="sm:hidden">Walkthrough</span>
              </span>
            </div>

            {/* Pinned "Book a Viewing" Gold Pill */}
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-[0_0_20px_rgba(230,195,106,0.35)] hover:shadow-[0_0_30px_rgba(230,195,106,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Book a Viewing</span>
            </button>
          </div>

          {/* CENTER-LEFT OVERLAY: Large Cinzel Chapter Title & Caption updated via DOM refs */}
          <div className="relative z-20 my-auto px-6 sm:px-12 md:px-20 max-w-2xl text-left pointer-events-none">
            {SCENES.map((scene, idx) => (
              <div
                key={scene.id}
                ref={(el) => {
                  sceneOverlayRefs.current[idx] = el;
                }}
                className="transition-transform duration-75 ease-out will-change-transform"
                style={{
                  opacity: idx === 0 ? 1 : 0,
                  visibility: idx === 0 ? 'visible' : 'hidden',
                  transform: 'translate3d(0, 0px, 0)',
                }}
              >
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#E6C36A] block mb-2 font-medium">
                  Phase 0{idx + 1}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-white tracking-[0.08em] leading-tight text-gold-gradient drop-shadow-xl">
                  {scene.chapter}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-[#F3EBDD]/90 font-sans leading-relaxed mt-4 max-w-xl drop-shadow-md">
                  {scene.caption}
                </p>
              </div>
            ))}

            {/* STATS STRIP ON THE FIRST SCENE (Sample labelled) - Solid surface without backdrop-blur */}
            <div
              ref={statsStripRef}
              className="mt-8 transition-opacity duration-150 pointer-events-auto"
              style={{ opacity: 1, visibility: 'visible' }}
            >
              <div className="bg-[#0B0B0C]/95 border border-[#8A6A2B]/40 rounded-xl p-4 sm:p-5 max-w-xl shadow-2xl">
                <span className="text-[10px] uppercase tracking-widest text-[#E6C36A] font-semibold font-mono block mb-3">
                  Masterplan Baseline Specifications
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                  <div className="p-2 rounded-lg bg-black border border-white/5">
                    <span className="text-xs sm:text-sm font-semibold text-gold-gradient block">
                      from PKR 2.5 Crore
                    </span>
                    <span className="text-[10px] text-[#A89F8D] uppercase tracking-wider block mt-0.5">
                      Price (Sample)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-black border border-white/5">
                    <span className="text-xs sm:text-sm font-semibold text-[#F3EBDD] block">
                      10 Marla
                    </span>
                    <span className="text-[10px] text-[#A89F8D] uppercase tracking-wider block mt-0.5">
                      Size (Sample)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-black border border-white/5">
                    <span className="text-xs sm:text-sm font-semibold text-[#F3EBDD] block">
                      4 Bedrooms
                    </span>
                    <span className="text-[10px] text-[#A89F8D] uppercase tracking-wider block mt-0.5">
                      Layout (Sample)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-black border border-white/5">
                    <span className="text-xs sm:text-sm font-semibold text-[#F3EBDD] block">
                      20 Mins
                    </span>
                    <span className="text-[10px] text-[#A89F8D] uppercase tracking-wider block mt-0.5">
                      To City (Sample)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE OVERLAY: Thin Gold Progress Line with 7 Ticks (Click jumps with smooth scroll) */}
          <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-auto">
            <div className="relative h-64 sm:h-72 w-8 flex flex-col items-center justify-between py-2">
              <div className="absolute top-0 bottom-0 w-[1.5px] bg-white/15 left-1/2 -translate-x-1/2 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="w-full bg-gradient-to-b from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] will-change-[height]"
                  style={{ height: '0%' }}
                />
              </div>

              {SCENES.map((scene, i) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => jumpToScene(i)}
                  className="group relative z-10 p-1 flex items-center justify-center focus:outline-none cursor-pointer"
                  aria-label={`Jump to ${scene.chapter}`}
                  title={scene.chapter}
                >
                  <span
                    ref={(el) => {
                      tickRefs.current[i] = el;
                    }}
                    className="block rounded-full transition-transform duration-200"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: i === 0 ? '#E6C36A' : 'rgba(168, 159, 141, 0.6)',
                      boxShadow: i === 0 ? '0 0 12px #E6C36A' : 'none',
                      transform: i === 0 ? 'scale(1.35)' : 'scale(1.0)',
                    }}
                  />

                  <span className="absolute right-7 px-2.5 py-1 rounded bg-black border border-[#8A6A2B]/40 text-[10px] font-heading font-semibold text-[#E6C36A] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    {scene.chapter}
                  </span>
                </button>
              ))}
            </div>

            <div
              ref={counterLabelRef}
              className="mt-2 text-[10px] font-mono text-[#E6C36A] tracking-widest uppercase"
            >
              01/0{SCENES.length}
            </div>
          </div>

          {/* BOTTOM HUD / SCROLL HELPER */}
          <div className="relative z-20 pb-8 sm:pb-12 px-6 sm:px-12 flex items-center justify-between text-xs text-[#A89F8D] pointer-events-none">
            <div
              ref={scrollHelperRef}
              className="transition-opacity duration-300 flex items-center gap-2 opacity-100"
            >
              <div className="px-4 py-2 rounded-full bg-black/90 border border-[#E6C36A]/40 text-[11px] text-[#E6C36A] tracking-[0.16em] uppercase font-heading font-semibold shadow-2xl flex items-center gap-2">
                <span>Scroll to move camera</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </div>

            <span className="text-[10px] font-mono tracking-widest uppercase text-[#A89F8D]/70 hidden sm:inline">
              IVY DEVELOPERS · CINEMATIC WALKTHROUGH
            </span>
          </div>
        </div>
      </div>

      {/* BOOK A VIEWING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fadeIn">
          <div className="bg-[#0B0B0C] border border-[#8A6A2B]/40 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#A89F8D] hover:text-[#F3EBDD] cursor-pointer"
              aria-label="Close viewing modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] uppercase tracking-widest text-[#E6C36A] font-sans font-semibold">
              Private Concierge Service
            </span>
            <h3 className="text-xl font-heading font-semibold text-[#F3EBDD] mt-1">
              Book an On-Site Viewing
            </h3>
            <p className="text-xs text-[#A89F8D] mt-1 mb-6">
              Exclusive chauffeured property tour across Lahore's prime developments.
            </p>

            {bookingSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E6C36A]/20 border border-[#E6C36A] text-[#E6C36A] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-heading text-[#F3EBDD]">Viewing Confirmed</h4>
                <p className="text-xs text-[#A89F8D]">
                  Our client liaison will contact you via WhatsApp to coordinate security clearance and itinerary.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1 font-sans">
                    Investor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    placeholder="e.g. Mian Shahzaib"
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#E6C36A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1 font-sans">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    placeholder="0370 4921264"
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#E6C36A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1 font-sans">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs focus:outline-none focus:border-[#E6C36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F8D] mb-1 font-sans">
                      Focus Area
                    </label>
                    <select
                      value={bookingData.preferredScene}
                      onChange={(e) => setBookingData({ ...bookingData, preferredScene: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[#8A6A2B]/30 text-white text-xs focus:outline-none focus:border-[#E6C36A]"
                    >
                      <option value="DHA Phase 7 & 8">DHA Phase 7 & 8</option>
                      <option value="Gulberg III">Gulberg Heights</option>
                      <option value="Bahria Town">Bahria Town Villas</option>
                      <option value="Johar Town">Johar Town Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    className="w-full py-3 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] shadow-md hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center"
                  >
                    Confirm Private Viewing Request
                  </button>

                  <a
                    href={BRAND.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 min-h-[44px] text-center text-xs text-[#E6C36A] hover:underline flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-[#E6C36A] stroke-none" />
                    <span>Or coordinate directly on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
