import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND } from '../data/brand';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1400; // ms
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 250);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-4 select-none"
      >
        <div className="flex flex-col items-center max-w-sm w-full">
          {/* Logo with pure black background or screen blend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mb-6 flex justify-center"
          >
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="h-32 sm:h-40 w-auto object-contain pointer-events-none"
              style={{ mixBlendMode: 'screen' }}
            />
          </motion.div>

          {/* Thin gold progress bar */}
          <div className="w-48 sm:w-60 h-[2px] bg-[#1a1815] overflow-hidden rounded-full mb-3 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8A6A2B] via-[#E6C36A] to-[#B98A2E]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="flex justify-between w-48 sm:w-60 text-[10px] tracking-widest text-[#A89F8D] uppercase font-sans">
            <span>Loading Experience</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
