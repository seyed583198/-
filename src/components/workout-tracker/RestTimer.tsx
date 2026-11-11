import React, { useState, useEffect } from 'react';
import { playShortBeep, playTimerCompletionChime } from '../../utils/audio';
import { Play, Pause, RotateCcw, Plus, X, Bell } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
  onFinish?: () => void;
  soundEnabled?: boolean;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 60,
  isOpen,
  onClose,
  onFinish,
  soundEnabled = true,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setSecondsLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 4 && soundEnabled) {
            playShortBeep(520, 100);
          } else if (prev === 3 && soundEnabled) {
            playShortBeep(520, 100);
          } else if (prev === 2 && soundEnabled) {
            playShortBeep(520, 100);
          } else if (prev === 1) {
            if (soundEnabled) playTimerCompletionChime();
            if (onFinish) onFinish();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, soundEnabled, onFinish]);

  if (!isOpen) return null;

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 100;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const addTime = (secs: number) => {
    setSecondsLeft((prev) => prev + secs);
    setTotalSeconds((prev) => prev + secs);
  };

  const resetTimer = () => {
    setSecondsLeft(totalSeconds);
    setIsActive(true);
  };

  return (
    <div className="fixed bottom-24 sm:bottom-8 left-4 sm:left-8 z-50 bg-zinc-900 border-2 border-lime-500/80 rounded-3xl p-4 shadow-2xl shadow-lime-500/20 backdrop-blur-xl w-72 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800 text-xs">
        <span className="font-bold text-lime-400 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5" />
          تایمر استراحت بین ست
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Circular Progress & Display */}
      <div className="flex items-center justify-center py-2 relative">
        <div className="text-center">
          <div className="text-4xl font-mono font-black text-white tracking-wider">
            {formattedTime}
          </div>
          <span className="text-[11px] text-zinc-400">
            {secondsLeft === 0 ? 'استراحت تمام شد!' : 'زمان تا ست بعدی'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden my-3 border border-zinc-800">
        <div
          className="bg-lime-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Quick Interval Buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 text-xs">
        {[30, 60, 90, 120].map((sec) => (
          <button
            key={sec}
            onClick={() => {
              setTotalSeconds(sec);
              setSecondsLeft(sec);
              setIsActive(true);
            }}
            className={`py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
              totalSeconds === sec
                ? 'bg-lime-500/20 text-lime-400 border-lime-500/40'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {sec}ث
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex-1 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'توقف' : 'ادامه'}</span>
        </button>

        <button
          onClick={() => addTime(30)}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1"
          title="افزودن ۳۰ ثانیه"
        >
          <Plus className="w-4 h-4" />
          <span>۳۰ث</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          title="شروع مجدد"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
