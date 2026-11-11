import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Dumbbell, Zap } from 'lucide-react';

interface MotionLogoSplashProps {
  onComplete: () => void;
}

export const MotionLogoSplash: React.FC<MotionLogoSplashProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => {
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-6 overflow-hidden select-none"
      >
        {/* Dynamic Stadium Carbon Grid & Spotlight Beams */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.8, 1.25, 1.1], opacity: [0.15, 0.35, 0.25] }}
          transition={{ duration: 2.8, ease: 'easeOut' }}
          className="absolute w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-lime-500/25 via-emerald-500/15 to-amber-500/20 blur-3xl pointer-events-none"
        />

        {/* Main Centerpiece Motion Emblem */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          {/* Animated SVG Shield, Barbell & Muscular Wings */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
            {/* Rotating Outer Energy Ring */}
            <motion.div
              initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 180, scale: 1, opacity: 1 }}
              transition={{ duration: 2.4, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-dashed border-lime-500/40"
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 1.18, 1], opacity: [0, 0.6, 0.2] }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="absolute inset-3 rounded-full bg-lime-500/20 blur-xl"
            />

            <motion.svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-[0_0_25px_rgba(163,230,53,0.45)]"
            >
              <defs>
                <linearGradient id="splashShield" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#27272a" />
                  <stop offset="50%" stopColor="#09090b" />
                  <stop offset="100%" stopColor="#18181b" />
                </linearGradient>
                <linearGradient id="splashNeon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ecfccb" />
                  <stop offset="45%" stopColor="#a3e635" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="splashGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>

              {/* 1. Hexagonal Shield Path Draw */}
              <motion.path
                d="M60 6 L106 28 L106 76 C106 96 85 110 60 115 C35 110 14 96 14 76 L14 28 Z"
                fill="url(#splashShield)"
                stroke="url(#splashNeon)"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />

              {/* 2. Championship Crown Reveal */}
              <motion.path
                d="M42 29 L50 18 L60 25 L70 18 L78 29 L73 35 L47 35 Z"
                fill="url(#splashGold)"
                initial={{ y: -15, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.5, type: 'spring', stiffness: 220 }}
              />

              {/* 3. Sculpted Muscular V-Taper Wings */}
              <motion.path
                d="M60 42 L32 37 L26 49 L40 57 L47 77 L58 85 L58 58 Z"
                fill="url(#splashNeon)"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
              />
              <motion.path
                d="M60 42 L88 37 L94 49 L80 57 L73 77 L62 85 L62 58 Z"
                fill="url(#splashNeon)"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
              />

              {/* 4. Core Abs Diamond */}
              <motion.polygon
                points="60,60 68,72 60,95 52,72"
                fill="#f4f4f5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              />

              {/* 5. Olympic Barbell Slam & Plates Lock-in */}
              <motion.g
                initial={{ scaleX: 0.2, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.45, type: 'spring', stiffness: 260 }}
              >
                <line
                  x1="8"
                  y1="54"
                  x2="112"
                  y2="54"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <rect x="13" y="39" width="6" height="30" rx="2" fill="url(#splashGold)" />
                <rect x="21" y="43" width="5" height="22" rx="1.5" fill="#a3e635" />
                <rect x="101" y="39" width="6" height="30" rx="2" fill="url(#splashGold)" />
                <rect x="94" y="43" width="5" height="22" rx="1.5" fill="#a3e635" />
              </motion.g>
            </motion.svg>
          </div>

          {/* Brand Title Reveal */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>سیستم جامع مهندسی تمرین و آناتومی</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              سید <span className="text-transparent bg-clip-text bg-gradient-to-l from-lime-400 via-emerald-400 to-amber-300">بدنساز</span>
            </h1>

            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.28em] text-zinc-400">
              SEYED BADANSAZ • PRO ATHLETIC CLUB
            </p>
          </motion.div>

          {/* Animated Loading Bar & Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="w-64 sm:w-72 mt-8 space-y-2"
          >
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.3, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-l from-lime-400 via-emerald-400 to-amber-400"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>
                {stage === 0 && 'آماده‌سازی اطلس آناتومیک سه‌بعدی...'}
                {stage === 1 && 'بارگذاری ۱۲۰+ حرکت و کلیپ آموزشی...'}
                {stage >= 2 && 'ورود به باشگاه اختصاصی سید بدنساز...'}
              </span>
              <Dumbbell className="w-3.5 h-3.5 text-lime-400 animate-bounce" />
            </div>
          </motion.div>

          {/* Skip / Instant Enter Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onComplete}
            className="mt-8 px-5 py-2.5 rounded-2xl bg-zinc-900/90 hover:bg-lime-500 hover:text-zinc-950 border border-zinc-800 hover:border-lime-400 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>ورود مستقیم به برنامه</span>
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
