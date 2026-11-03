import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import {
  Mic,
  MicOff,
  PhoneOff,
  X,
  Bot,
  User,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// Singleton Vapi instance at module level (lazy created on first click)
let vapiInstance: any = null;

// Callbacks container so singleton Vapi events update the current component state
const vapiCallbacks = {
  onCallStart: () => {},
  onCallEnd: () => {},
  onSpeechStart: () => {},
  onSpeechEnd: () => {},
  onVolumeLevel: (_level: number) => {},
  onMessage: (_msg: any) => {},
  onError: (_e: any) => {},
};

function getOrCreateVapi(publicKey: string) {
  if (!vapiInstance) {
    const VapiConstructor = (Vapi as any).default?.default || (Vapi as any).default || Vapi;
    vapiInstance = new VapiConstructor(publicKey);

    vapiInstance.on('call-start', () => vapiCallbacks.onCallStart());
    vapiInstance.on('call-end', () => vapiCallbacks.onCallEnd());
    vapiInstance.on('speech-start', () => vapiCallbacks.onSpeechStart());
    vapiInstance.on('speech-end', () => vapiCallbacks.onSpeechEnd());
    vapiInstance.on('volume-level', (level: number) => vapiCallbacks.onVolumeLevel(level));
    vapiInstance.on('message', (msg: any) => vapiCallbacks.onMessage(msg));
    vapiInstance.on('error', (e: any) => vapiCallbacks.onError(e));
  }
  return vapiInstance;
}

interface TranscriptLine {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface PartialTranscript {
  role: 'user' | 'assistant';
  text: string;
}

export const VoiceConcierge: React.FC = () => {
  // Environment variables
  const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
  const isLiveConfigured = Boolean(publicKey && assistantId);

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<
    'Idle' | 'Connecting' | 'Listening' | 'Speaking' | 'Ended'
  >('Idle');
  const [isMuted, setIsMuted] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  const [partialTranscript, setPartialTranscript] = useState<PartialTranscript | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeContextProperty, setActiveContextProperty] = useState<string>('home page');
  const [forceDemoMode, setForceDemoMode] = useState(false);

  // Refs for throttled volume updates and RAF orb animation
  const orbRef = useRef<HTMLDivElement>(null);
  const lastVolTimeRef = useRef<number>(0);
  const targetVolumeRef = useRef<number>(0);
  const isStartingRef = useRef<boolean>(false);
  const callTimeoutRef = useRef<any>(null);
  const demoIntervalRef = useRef<any>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, partialTranscript]);

  // Wire module-level Vapi callbacks to component state
  useEffect(() => {
    vapiCallbacks.onCallStart = () => {
      setCallStatus('Listening');
      setCallActive(true);
      setErrorMessage(null);
      isStartingRef.current = false;
    };

    vapiCallbacks.onCallEnd = () => {
      setCallStatus('Ended');
      setCallActive(false);
      targetVolumeRef.current = 0;
      setPartialTranscript(null);
      isStartingRef.current = false;
    };

    vapiCallbacks.onSpeechStart = () => {
      setCallStatus('Speaking');
    };

    vapiCallbacks.onSpeechEnd = () => {
      setCallStatus('Listening');
    };

    // Throttle volume-level updates (max 20 per second = 50ms)
    vapiCallbacks.onVolumeLevel = (level: number) => {
      const now = performance.now();
      if (now - lastVolTimeRef.current >= 50) {
        lastVolTimeRef.current = now;
        targetVolumeRef.current = Math.min(1, Math.max(0, level));
      }
    };

    // Only append type "transcript" with transcriptType "final"
    // Show partials in temporary line
    vapiCallbacks.onMessage = (msg: any) => {
      if (msg?.type === 'transcript') {
        const role = msg.role === 'assistant' ? 'assistant' : 'user';
        const text = (msg.transcript || '').trim();

        if (msg.transcriptType === 'final') {
          setPartialTranscript(null);
          if (text) {
            setTranscripts((prev) => [
              ...prev,
              {
                id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                role,
                text,
              },
            ]);
          }
        } else if (msg.transcriptType === 'partial') {
          if (text) {
            setPartialTranscript({ role, text });
          }
        }
      }
    };

    // Error handling: log every error with console.error, show raw message,
    // and treat call as ended ONLY when call-end fires (do not end call for non-fatal errors)
    vapiCallbacks.onError = (e: any) => {
      const errStr =
        typeof e === 'string'
          ? e
          : e?.error?.message || e?.message || JSON.stringify(e || {});

      const isAbort =
        e?.error?.name === 'AbortError' ||
        e?.name === 'AbortError' ||
        e?.type === 'microphone-preflight-AbortError' ||
        errStr.includes('cancelled');

      const isMeetingEnded =
        errStr.includes('Meeting ended due to ejection') ||
        errStr.includes('Meeting has ended') ||
        errStr.includes('ejection: Meeting has ended');

      if (isAbort) {
        console.warn('Vapi preflight cancelled or aborted:', e);
        return;
      }

      if (isMeetingEnded) {
        console.warn('Vapi meeting ended by host/server cleanly:', e);
        setCallStatus('Ended');
        setCallActive(false);
        targetVolumeRef.current = 0;
        setPartialTranscript(null);
        return;
      }

      console.error('Vapi error', JSON.stringify(e));
      const rawMsg =
        e?.error?.message ||
        e?.message ||
        (typeof e === 'string' ? e : JSON.stringify(e));
      setErrorMessage(rawMsg);
    };
  });

  // Animate orb from ref using requestAnimationFrame instead of React state
  useEffect(() => {
    let animId: number;
    let currentVol = 0;

    const animateOrb = () => {
      // Lerp volume smoothly
      currentVol += (targetVolumeRef.current - currentVol) * 0.25;
      if (orbRef.current) {
        const scale = 1 + currentVol * 0.45;
        const blur = 20 + currentVol * 45;
        const alpha = 0.35 + currentVol * 0.55;
        orbRef.current.style.transform = `scale(${scale.toFixed(3)})`;
        orbRef.current.style.boxShadow = `0 0 ${blur.toFixed(1)}px rgba(230, 195, 106, ${alpha.toFixed(2)})`;
      }
      animId = requestAnimationFrame(animateOrb);
    };

    animId = requestAnimationFrame(animateOrb);
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  // Listen for custom trigger from property modal: "Ask Ivy about this property"
  useEffect(() => {
    const handleOpenIvy = (e: Event) => {
      const customEvent = e as CustomEvent<{ propertyTitle?: string }>;
      const propTitle = customEvent.detail?.propertyTitle || 'Featured Property';
      setActiveContextProperty(propTitle);
      setIsOpen(true);
      if (!callActive && !isStartingRef.current) {
        startCall(propTitle);
      }
    };

    window.addEventListener('open-ivy-voice', handleOpenIvy);
    return () => window.removeEventListener('open-ivy-voice', handleOpenIvy);
  }, [callActive]);

  // Stop call ONLY when page unloads (not on component unmount or panel close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (vapiInstance) {
        try {
          vapiInstance.stop();
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // START CALL HANDLER
  const startCall = async (contextProp?: string) => {
    if (isStartingRef.current || callActive) {
      return;
    }
    isStartingRef.current = true;

    setErrorMessage(null);
    setTranscripts([]);
    setPartialTranscript(null);
    const targetProperty = contextProp || activeContextProperty;

    if (isLiveConfigured && !forceDemoMode) {
      // 1. Request microphone permission first
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Microphone media devices not supported in this browser');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop test stream tracks immediately so we don't hold an extra capture open
        stream.getTracks().forEach((track) => track.stop());
        // Allow browser audio engine a brief moment to cleanly recycle the hardware device
        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (micErr: any) {
        console.warn('Microphone permission check failed:', micErr);
        setErrorMessage('Microphone blocked. Allow the microphone for this site and try again.');
        setCallStatus('Ended');
        setCallActive(false);
        isStartingRef.current = false;
        return;
      }

      setCallStatus('Connecting');
      setCallActive(true);

      // 5-minute auto end timer
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = setTimeout(() => {
        handleEndCall();
      }, 300000);

      // 2. Start Vapi with assistantId and NO overrides
      try {
        const vapi = getOrCreateVapi(publicKey);
        await vapi.start(assistantId);
      } catch (err: any) {
        const isAbort =
          err?.error?.name === 'AbortError' ||
          err?.name === 'AbortError' ||
          err?.type === 'microphone-preflight-AbortError' ||
          err?.message?.includes('cancelled');

        if (!isAbort) {
          console.error('Vapi error', JSON.stringify(err));
          const rawMsg =
            err?.error?.message ||
            err?.message ||
            (typeof err === 'string' ? err : JSON.stringify(err));
          setErrorMessage(rawMsg);
        } else {
          console.warn('Vapi start aborted:', err);
        }
        setCallStatus('Ended');
        setCallActive(false);
      } finally {
        isStartingRef.current = false;
      }
    } else {
      // DEMO MODE (Keys missing or user explicitly activated Demo Mode)
      setCallStatus('Connecting');
      setCallActive(true);
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = setTimeout(() => {
        handleEndCall();
      }, 300000);
      runDemoModeGreeting(targetProperty);
      isStartingRef.current = false;
    }
  };

  // STOP CALL HANDLER (Explicitly called only by End Call button or page unload)
  const handleEndCall = () => {
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);

    if (vapiInstance) {
      try {
        vapiInstance.stop();
      } catch (e) {
        // safe cleanup
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setCallStatus('Ended');
    setCallActive(false);
    targetVolumeRef.current = 0;
    setPartialTranscript(null);
  };

  // TOGGLE MUTE
  const toggleMute = () => {
    if (vapiInstance && isLiveConfigured && !forceDemoMode) {
      try {
        const nextMute = !isMuted;
        vapiInstance.setMuted(nextMute);
        setIsMuted(nextMute);
      } catch (e) {
        console.warn('Mute error:', e);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  // DEMO MODE SPEECH SYNTHESIS
  const speakDemoText = (text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Victoria'))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setCallStatus('Speaking');
      demoIntervalRef.current = setInterval(() => {
        targetVolumeRef.current = 0.2 + Math.random() * 0.45;
      }, 80);
    };

    utterance.onend = () => {
      clearInterval(demoIntervalRef.current);
      targetVolumeRef.current = 0;
      setCallStatus('Listening');
      onEnd?.();
    };

    utterance.onerror = () => {
      clearInterval(demoIntervalRef.current);
      targetVolumeRef.current = 0;
      setCallStatus('Listening');
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  const runDemoModeGreeting = (contextProp: string) => {
    setCallStatus('Speaking');
    const greeting =
      contextProp && contextProp !== 'home page'
        ? `Greetings from IVY Developers. I am Ivy, your private concierge. I see you are inquiring about ${contextProp}. How may I brief you on this property's floorplans and possession details?`
        : `Greetings from IVY Developers. I am Ivy, your private real estate concierge for Lahore's premier developments. How may I assist your portfolio today?`;

    setTimeout(() => {
      setTranscripts([
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: greeting,
        },
      ]);
      speakDemoText(greeting);
    }, 400);
  };

  const handleCannedQuestion = (userQuery: string, ivyReply: string) => {
    setTranscripts((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: userQuery,
      },
    ]);

    setTimeout(() => {
      setTranscripts((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: ivyReply,
        },
      ]);
      speakDemoText(ivyReply);
    }, 350);
  };

  return (
    <>
      {/* FLOATING GOLD ORB BUTTON (Bottom right, above WhatsApp button) */}
      <aside aria-label="Voice concierge button" className="fixed bottom-20 right-6 z-30">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            if (!callActive && !isStartingRef.current) {
              startCall();
            }
          }}
          className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-black/90 border border-[#E6C36A]/50 text-[#F3EBDD] font-semibold text-xs tracking-wider uppercase shadow-[0_4px_25px_rgba(230,195,106,0.35)] hover:shadow-[0_6px_35px_rgba(230,195,106,0.6)] hover:border-[#E6C36A] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Talk to Ivy AI Concierge"
        >
          {/* Animated Gold Orb Icon */}
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] animate-pulse" />
            <span className="absolute -inset-1 rounded-full bg-[#E6C36A]/30 animate-ping opacity-75" />
          </div>

          <span className="font-heading tracking-[0.14em] text-gold-gradient font-bold">
            Talk to Ivy
          </span>

          {/* Active Call Dot */}
          {callActive && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          )}
        </button>
      </aside>

      {/* VOICE CONCIERGE GLASS PANEL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full sm:max-w-md h-[88vh] sm:h-[620px] bg-[#0B0B0C]/95 backdrop-blur-xl border border-[#8A6A2B]/40 sm:rounded-2xl flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden relative">
            {/* Header: Title, Status, Demo Badge, Close */}
            <div className="p-4 sm:p-5 border-b border-[#1f1e1b] bg-black/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#141310] to-[#0B0B0C] border border-[#8A6A2B]/50 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#E6C36A]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-heading font-semibold text-[#F3EBDD]">
                      Ivy Concierge
                    </h3>
                    {(!isLiveConfigured || forceDemoMode) && (
                      <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#8A6A2B]/30 border border-[#E6C36A]/40 text-[#E6C36A] font-mono">
                        Demo Mode
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#A89F8D] font-mono block">
                    Context: {activeContextProperty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#A89F8D] hover:text-[#F3EBDD] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                  aria-label="Close concierge panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Error Message in small text in panel with Try Again button */}
            {errorMessage && (
              <div className="mx-4 mt-3 p-3 rounded-xl bg-[#141310] border border-[#8A6A2B]/40 text-[#F3EBDD] flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E6C36A] shrink-0 mt-0.5" />
                  <span className="text-[11px] font-mono text-[#F3EBDD] break-words leading-relaxed">
                    {errorMessage}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      startCall();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A] text-black font-semibold text-[11px] uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer font-sans flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Try again</span>
                  </button>

                  {!forceDemoMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setForceDemoMode(true);
                        setErrorMessage(null);
                        runDemoModeGreeting(activeContextProperty);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-black border border-white/20 text-[#A89F8D] hover:text-[#F3EBDD] hover:border-[#E6C36A] text-[11px] transition-colors cursor-pointer font-sans"
                    >
                      Use Demo Mode
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Center: Reactive Golden Orb & Live Status */}
            <div className="py-5 flex flex-col items-center justify-center text-center">
              {/* Outer Glow Halo & Orb (animated directly via RAF ref) */}
              <div className="relative flex items-center justify-center my-2">
                <div
                  ref={orbRef}
                  className="w-24 h-24 rounded-full transition-transform duration-75 ease-out flex items-center justify-center"
                  style={{
                    background:
                      'radial-gradient(circle, #E6C36A 0%, #B98A2E 50%, #8A6A2B 100%)',
                    boxShadow: '0 0 20px rgba(230, 195, 106, 0.35)',
                  }}
                >
                  <Bot className="w-8 h-8 text-black" />
                </div>

                {/* Concentric Audio Pulse Rings */}
                {callStatus === 'Speaking' && (
                  <div className="absolute -inset-3 rounded-full border border-[#E6C36A]/40 animate-ping opacity-50 pointer-events-none" />
                )}
              </div>

              {/* Status Indicator */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    callStatus === 'Speaking'
                      ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                      : callStatus === 'Listening'
                      ? 'bg-[#E6C36A] animate-pulse shadow-[0_0_8px_#E6C36A]'
                      : callStatus === 'Connecting'
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-neutral-500'
                  }`}
                />
                <span className="text-xs font-mono uppercase tracking-widest text-[#E6C36A] font-semibold">
                  {callStatus}
                </span>
              </div>

              {/* 5-minute Auto-end Notification */}
              <p className="text-[10px] text-[#A89F8D] font-mono mt-1">
                Calls end automatically after 5 minutes
              </p>
            </div>

            {/* Middle: Live Transcript Box (Finals + Temporary Partial) */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 font-sans text-xs border-y border-[#1a1917] bg-black/40">
              {transcripts.length === 0 && !partialTranscript ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#A89F8D]/60 p-4">
                  <Bot className="w-6 h-6 mb-2 text-[#8A6A2B]/40" />
                  <p className="text-xs">
                    {callActive
                      ? 'Listening for your voice... speak naturally.'
                      : 'Press Start Call or select a prompt below.'}
                  </p>
                </div>
              ) : (
                <>
                  {transcripts.map((t) => (
                    <div
                      key={t.id}
                      className={`flex gap-2.5 items-start ${
                        t.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {t.role === 'assistant' && (
                        <div className="w-5 h-5 rounded-full bg-[#E6C36A]/20 border border-[#E6C36A]/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3 h-3 text-[#E6C36A]" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                          t.role === 'user'
                            ? 'bg-gradient-to-r from-[#8A6A2B] to-[#E6C36A] text-black font-medium rounded-br-none'
                            : 'bg-[#141310] border border-[#8A6A2B]/40 text-[#F3EBDD] rounded-bl-none'
                        }`}
                      >
                        <p>{t.text}</p>
                      </div>

                      {t.role === 'user' && (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Temporary Partial Transcript Line */}
                  {partialTranscript && (
                    <div
                      className={`flex gap-2.5 items-start ${
                        partialTranscript.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {partialTranscript.role === 'assistant' && (
                        <div className="w-5 h-5 rounded-full bg-[#E6C36A]/20 border border-[#E6C36A]/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3 h-3 text-[#E6C36A]" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed italic opacity-85 ${
                          partialTranscript.role === 'user'
                            ? 'bg-gradient-to-r from-[#8A6A2B]/40 to-[#E6C36A]/40 text-[#F3EBDD] rounded-br-none border border-[#E6C36A]/40'
                            : 'bg-[#141310] border border-dashed border-[#8A6A2B]/60 text-[#F3EBDD] rounded-bl-none'
                        }`}
                      >
                        <p>
                          {partialTranscript.text}
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E6C36A] animate-ping ml-1" />
                        </p>
                      </div>

                      {partialTranscript.role === 'user' && (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              <div ref={transcriptBottomRef} />
            </div>

            {/* Canned Question Buttons (Interactive in Demo Mode & Quick Prompts) */}
            <div className="px-4 py-2.5 bg-black/70 border-t border-[#1a1917]">
              <span className="text-[9px] uppercase tracking-widest text-[#A89F8D] font-mono block mb-1.5">
                Suggested Prompts:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() =>
                    handleCannedQuestion(
                      'Show me houses in DHA',
                      'In DHA Phase 7 Lahore, we offer the IVY Residence—a 10 Marla multi-level house with 4 bedrooms, Calacatta marble, and immediate possession. We also have 2 Kanal executive plots in Phase 8.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-[#141310] border border-[#8A6A2B]/30 hover:border-[#E6C36A] text-[11px] text-[#F3EBDD] whitespace-nowrap transition-colors cursor-pointer"
                >
                  Houses in DHA
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleCannedQuestion(
                      'Book a visit',
                      'I can arrange a chauffeured on-site inspection for you. Our team conducts private visits Monday to Saturday. You can also reach our desk directly at 0370 4921264.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-[#141310] border border-[#8A6A2B]/30 hover:border-[#E6C36A] text-[11px] text-[#F3EBDD] whitespace-nowrap transition-colors cursor-pointer"
                >
                  Book a Visit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleCannedQuestion(
                      'Tell me about IVY Heights',
                      'IVY Heights is our premier commercial and residential tower on Main Boulevard Gulberg III, featuring 3-bedroom suites overlooking the Lahore Gymkhana and skyline.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-[#141310] border border-[#8A6A2B]/30 hover:border-[#E6C36A] text-[11px] text-[#F3EBDD] whitespace-nowrap transition-colors cursor-pointer"
                >
                  IVY Heights
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleCannedQuestion(
                      'What plots are available?',
                      'In our gated township masterplan, we have 5 Marla, 7 Marla, 10 Marla and 1 Kanal plots across Blocks A, B, and C with 2-year flexible installment plans.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-[#141310] border border-[#8A6A2B]/30 hover:border-[#E6C36A] text-[11px] text-[#F3EBDD] whitespace-nowrap transition-colors cursor-pointer"
                >
                  Available Plots
                </button>
              </div>
            </div>

            {/* Bottom Controls: Mute & End-Call / Start Call */}
            <div className="p-4 bg-[#0B0B0C] border-t border-[#1f1e1b] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={toggleMute}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-[#141310] border-[#8A6A2B]/40 text-[#F3EBDD] hover:border-[#E6C36A]'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#E6C36A]" />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              {callActive ? (
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startCall()}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E] text-black flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity cursor-pointer font-bold"
                >
                  <Mic className="w-4 h-4 fill-black stroke-none" />
                  <span>Start Call</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
