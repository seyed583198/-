import React, { useState, useEffect } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { WorkoutSession } from '../../types/fitness';
import { RestTimer } from './RestTimer';
import {
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Flame,
  Save,
  Check,
  Award,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const LiveWorkoutTracker: React.FC<{
  onSessionFinished?: () => void;
  onSelectProgramDay?: () => void;
}> = ({ onSessionFinished, onSelectProgramDay }) => {
  const {
    liveSession,
    updateLiveSet,
    addLiveSet,
    removeLiveSet,
    finishLiveSession,
    cancelLiveSession,
    activeProgram,
    startLiveSession,
    profile,
  } = useWorkout();

  // Elapsed Time
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeRestSeconds, setActiveRestSeconds] = useState<number | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [sessionFeeling, setSessionFeeling] = useState<WorkoutSession['feeling']>('عالی');
  const [sessionNotes, setSessionNotes] = useState('');

  useEffect(() => {
    let timer: any = null;
    if (liveSession) {
      setElapsedSeconds(Math.floor((Date.now() - liveSession.startTime) / 1000));
      timer = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - liveSession.startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [liveSession]);

  if (!liveSession) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 mb-4">
            <Flame className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            جلسه تمرینی فعالی در جریان نیست
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed mb-6">
            یک روز از برنامه تمرینی خود را انتخاب کنید تا وارد حالت ثبت تعاملی تمرین، تایمر استراحت و ثبت وزنه‌ها شوید.
          </p>

          {/* Quick Start from Active Program */}
          <div className="w-full max-w-xl text-right">
            <span className="text-xs font-bold text-zinc-400 block mb-3">
              روزهای برنامه فعال ({activeProgram.title}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeProgram.days.map((day) => (
                <button
                  key={day.id}
                  onClick={() => startLiveSession(day)}
                  className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500 hover:bg-zinc-900 text-right transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-lime-400 block mb-1">
                      {day.dayName}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors">
                      {day.focus}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mt-4 pt-2 border-t border-zinc-900">
                    <span>{day.exercises.length} حرکت</span>
                    <span className="text-lime-400 font-semibold group-hover:underline">
                      شروع تمرین ←
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Completion % & Total Volume
  let totalSets = 0;
  let completedSets = 0;
  let totalVolumeKg = 0;

  liveSession.exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      totalSets++;
      if (set.completed) {
        completedSets++;
        totalVolumeKg += (set.weight || 0) * (set.reps || 0);
      }
    });
  });

  const completionPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const formatElapsedTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSetToggle = (exIdx: number, setIdx: number, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    updateLiveSet(exIdx, setIdx, { completed: nextCompleted });
    if (nextCompleted) {
      // Trigger rest timer
      setActiveRestSeconds(60);
    }
  };

  const confirmFinish = () => {
    finishLiveSession(sessionFeeling, sessionNotes);
    setShowFinishModal(false);
    if (onSessionFinished) onSessionFinished();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Live Session Sticky HUD */}
      <div className="bg-zinc-900/95 border border-zinc-800 rounded-3xl p-5 sticky top-2 z-20 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse"></span>
              <span className="text-xs font-bold text-lime-400">جلسه تمرینی زنده</span>
              <span className="text-xs text-zinc-400">• {liveSession.dayName}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {liveSession.programTitle}
            </h2>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
            <div className="bg-zinc-950 px-3 py-2 rounded-2xl border border-zinc-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime-400 shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-400 block font-sans">زمان سپری‌شده</span>
                <span className="text-sm font-bold text-white">
                  {formatElapsedTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            <div className="bg-zinc-950 px-3 py-2 rounded-2xl border border-zinc-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-400 block font-sans">حجم وزنه (تناژ)</span>
                <span className="text-sm font-bold text-amber-400">
                  {totalVolumeKg.toLocaleString()} kg
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowFinishModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs transition-all shadow-md shadow-lime-500/20 active:scale-95"
            >
              اتمام جلسه
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-3">
          <div className="flex-1 bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-lime-400 h-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-lime-400 shrink-0">
            {completionPercent}٪ تکمیل ({completedSets} از {totalSets} ست)
          </span>
        </div>
      </div>

      {/* Exercises Logger List */}
      <div className="space-y-4">
        {liveSession.exercises.map((ex, exIdx) => {
          return (
            <div
              key={ex.exerciseId || exIdx}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl transition-all"
            >
              {/* Exercise Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/30 flex items-center justify-center text-xs font-bold">
                    {exIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{ex.exerciseNameFa}</h3>
                    <p className="text-xs font-mono text-zinc-400">{ex.exerciseNameEn}</p>
                  </div>
                </div>

                <button
                  onClick={() => addLiveSet(exIdx)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-lime-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن ست</span>
                </button>
              </div>

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="text-zinc-400 border-b border-zinc-800">
                      <th className="py-2 px-2 font-medium w-14">ست</th>
                      <th className="py-2 px-3 font-medium">وزنه (کیلوگرم)</th>
                      <th className="py-2 px-3 font-medium">تکرار</th>
                      <th className="py-2 px-3 font-medium text-center w-20">ثبت ست</th>
                      <th className="py-2 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {ex.sets.map((set, setIdx) => (
                      <tr
                        key={setIdx}
                        className={`transition-colors ${
                          set.completed ? 'bg-lime-950/20' : 'hover:bg-zinc-950/40'
                        }`}
                      >
                        <td className="py-2.5 px-2 font-bold text-zinc-300">
                          ست {set.setNumber}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={set.weight || ''}
                            placeholder="0"
                            onChange={(e) =>
                              updateLiveSet(exIdx, setIdx, {
                                weight: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:border-lime-500 outline-none text-left"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            value={set.reps || ''}
                            placeholder="10"
                            onChange={(e) =>
                              updateLiveSet(exIdx, setIdx, {
                                reps: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:border-lime-500 outline-none text-left"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => handleSetToggle(exIdx, setIdx, set.completed)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all ${
                              set.completed
                                ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/30 scale-105'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-white'
                            }`}
                          >
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </td>
                        <td className="py-2 px-2 text-center">
                          {ex.sets.length > 1 && (
                            <button
                              onClick={() => removeLiveSet(exIdx, setIdx)}
                              className="p-1 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                              title="حذف ست"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Rest Timer */}
      {activeRestSeconds !== null && (
        <RestTimer
          isOpen={true}
          initialSeconds={activeRestSeconds}
          onClose={() => setActiveRestSeconds(null)}
          soundEnabled={profile.soundEnabled}
        />
      )}

      {/* Finish Session Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-lime-500/10 border border-lime-500/30 text-lime-400 flex items-center justify-center mx-auto mb-3">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white">ثبت و اتمام جلسه تمرین</h3>
              <p className="text-xs text-zinc-400 mt-1">
                خسته نباشید! اطلاعات تمرین امروز شما در تاریخچه و نمودارهای پیشرفت ذخیره می‌شود.
              </p>
            </div>

            {/* Stats Summary */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px]">مدت زمان</span>
                <span className="font-bold text-white font-mono">
                  {Math.round(elapsedSeconds / 60)} دقیقه
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">مجموع تناژ</span>
                <span className="font-bold text-amber-400 font-mono">
                  {totalVolumeKg.toLocaleString()} kg
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">میزان تکمیل</span>
                <span className="font-bold text-lime-400">{completionPercent}٪</span>
              </div>
            </div>

            {/* Feeling Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                احساس و انرژی شما در طول این جلسه:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(['عالی', 'خوب', 'معمولی', 'خسته'] as const).map((feel) => (
                  <button
                    key={feel}
                    type="button"
                    onClick={() => setSessionFeeling(feel)}
                    className={`py-2 rounded-xl font-medium border transition-all ${
                      sessionFeeling === feel
                        ? 'bg-lime-500 text-zinc-950 border-lime-500 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {feel}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                یادداشت شخصی مربی یا احساسات (اختیاری):
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="مثلا: رکورد پرس سینه شکسته شد، پمپ عالی بود..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-xs text-white focus:border-lime-500 outline-none resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={confirmFinish}
                className="flex-1 py-3 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-lime-500/20 active:scale-95"
              >
                ثبت نهایی و جشن اتمام 🎉
              </button>
              <button
                onClick={() => setShowFinishModal(false)}
                className="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
              >
                بازگشت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
