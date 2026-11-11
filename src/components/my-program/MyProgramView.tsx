import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { ProgramDay, ProgramExercise } from '../../types/fitness';
import {
  Calendar,
  Play,
  Printer,
  Copy,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  Utensils,
  Flame,
  Target,
  Zap,
  Activity,
  Droplets,
} from 'lucide-react';

export const MyProgramView: React.FC<{
  onStartSession: (day: ProgramDay) => void;
  onOpenLibraryForDay?: (dayIdx: number) => void;
}> = ({ onStartSession, onOpenLibraryForDay }) => {
  const {
    activeProgram,
    updateActiveProgramDay,
    removeExerciseFromProgram,
    reorderExercisesInDay,
    saveProgram,
  } = useWorkout();

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [editingExId, setEditingExId] = useState<string | null>(null);
  const [editSets, setEditSets] = useState<number>(3);
  const [editReps, setEditReps] = useState<string>('10-12');
  const [copySuccess, setCopySuccess] = useState(false);

  const currentDay = activeProgram.days[selectedDayIdx] || activeProgram.days[0];

  const handleStartEditing = (ex: ProgramExercise) => {
    setEditingExId(ex.id);
    setEditSets(ex.sets);
    setEditReps(ex.reps);
  };

  const handleSaveEditing = (exId: string) => {
    if (!currentDay) return;
    const updatedExercises = currentDay.exercises.map((e) =>
      e.id === exId ? { ...e, sets: editSets, reps: editReps } : e
    );
    updateActiveProgramDay(selectedDayIdx, { ...currentDay, exercises: updatedExercises });
    setEditingExId(null);
  };

  const handleMoveUp = (exIdx: number) => {
    if (exIdx === 0) return;
    reorderExercisesInDay(selectedDayIdx, exIdx, exIdx - 1);
  };

  const handleMoveDown = (exIdx: number) => {
    if (!currentDay || exIdx === currentDay.exercises.length - 1) return;
    reorderExercisesInDay(selectedDayIdx, exIdx, exIdx + 1);
  };

  const handleCloneWeek = () => {
    const cloned = {
      ...activeProgram,
      id: `prog_clone_${Date.now()}`,
      title: `${activeProgram.title} (هفته جدید)`,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    saveProgram(cloned);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Program Header Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-500/10 text-lime-400 border border-lime-500/30">
                برنامه فعال شما
              </span>
              <span className="text-xs text-zinc-400">{activeProgram.splitType}</span>
              <span className="text-xs text-zinc-400">• تاریخ: {activeProgram.createdAt}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{activeProgram.title}</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {activeProgram.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 no-print">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="خروجی PDF یا پرینت"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / PDF</span>
            </button>

            <button
              onClick={handleCloneWeek}
              className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="کپی برنامه برای چرخه بعد"
            >
              <Copy className="w-4 h-4" />
              <span>{copySuccess ? 'کپی شد!' : 'کپی به هفته بعد'}</span>
            </button>
          </div>
        </div>

        {/* Nutrition & Macro Summary if available on Active Program */}
        {activeProgram.nutritionPlan && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-lime-400" />
                <span>جدول کالری و ماکروهای روزانه برنامه شما</span>
              </h3>
              <span className="text-[11px] text-zinc-400">تنظیم‌شده بر اساس مشخصات بدنی شما</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center">
                <Flame className="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
                <span className="text-[10px] text-zinc-400 block">کالری هدف</span>
                <span className="text-sm font-black text-white font-mono">
                  {activeProgram.nutritionPlan.calories} kcal
                </span>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center">
                <Target className="w-3.5 h-3.5 text-lime-400 mx-auto mb-0.5" />
                <span className="text-[10px] text-zinc-400 block">پروتئین</span>
                <span className="text-sm font-black text-lime-400 font-mono">
                  {activeProgram.nutritionPlan.proteinGrams}g
                </span>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center">
                <Zap className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-0.5" />
                <span className="text-[10px] text-zinc-400 block">کربوهیدرات</span>
                <span className="text-sm font-black text-cyan-400 font-mono">
                  {activeProgram.nutritionPlan.carbsGrams}g
                </span>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center">
                <Activity className="w-3.5 h-3.5 text-amber-400 mx-auto mb-0.5" />
                <span className="text-[10px] text-zinc-400 block">چربی سالم</span>
                <span className="text-sm font-black text-amber-400 font-mono">
                  {activeProgram.nutritionPlan.fatsGrams}g
                </span>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 text-center col-span-2 sm:col-span-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400 mx-auto mb-0.5" />
                <span className="text-[10px] text-zinc-400 block">هیدراتاسیون</span>
                <span className="text-sm font-black text-sky-400 font-mono">
                  {activeProgram.nutritionPlan.waterLiters} لیتر
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Periodization / Cardio / Posture notes if present */}
        {(activeProgram.periodizationNote ||
          activeProgram.cardioProtocol ||
          activeProgram.postureCorrection) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {activeProgram.periodizationNote && (
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-lime-400 font-bold block mb-1">📈 استراتژی پیشرفت:</span>
                <p className="text-zinc-300 leading-relaxed">{activeProgram.periodizationNote}</p>
              </div>
            )}
            {activeProgram.cardioProtocol && (
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-cyan-400 font-bold block mb-1">🏃 برنامه هوازی:</span>
                <p className="text-zinc-300 leading-relaxed">{activeProgram.cardioProtocol}</p>
              </div>
            )}
            {activeProgram.postureCorrection && (
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-amber-400 font-bold block mb-1">🧘 پروتکل اصلاحی:</span>
                <p className="text-zinc-300 leading-relaxed">{activeProgram.postureCorrection}</p>
              </div>
            )}
          </div>
        )}

        {/* Days Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-print">
          {activeProgram.days.map((day, idx) => (
            <button
              key={day.id || idx}
              onClick={() => setSelectedDayIdx(idx)}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                selectedDayIdx === idx
                  ? 'bg-lime-500 text-zinc-950 border-lime-500 shadow-md shadow-lime-500/20'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{day.dayName}</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20">
                {day.exercises.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Workout Sheet */}
      {currentDay && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print-card">
          {/* Day Header & Start Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <span className="text-xs font-bold text-lime-400 block mb-1">
                جلسه {currentDay.dayNumber}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentDay.dayName}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                تمرکز: {currentDay.focus} • زمان تخمینی: {currentDay.estimatedDuration} دقیقه
              </p>
            </div>

            <div className="no-print">
              <button
                onClick={() => onStartSession(currentDay)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-zinc-950" />
                <span>شروع تمرین این روز</span>
              </button>
            </div>
          </div>

          {/* Warmup & Cooldown info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
              <span className="text-lime-400 font-bold block mb-1">گرم کردن پیشنهادی:</span>
              <span className="text-zinc-300 leading-relaxed">{currentDay.warmup}</span>
            </div>
            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
              <span className="text-cyan-400 font-bold block mb-1">سرد کردن و کشش:</span>
              <span className="text-zinc-300 leading-relaxed">{currentDay.cooldown}</span>
            </div>
          </div>

          {/* Exercises List with Reorder & Edit controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 px-1">
              <span>ترتیب و حرکات این روز ({currentDay.exercises.length} حرکت):</span>
              {onOpenLibraryForDay && (
                <button
                  onClick={() => onOpenLibraryForDay(selectedDayIdx)}
                  className="text-lime-400 hover:text-lime-300 flex items-center gap-1 no-print"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن حرکت جدید از کتابخانه</span>
                </button>
              )}
            </div>

            {currentDay.exercises.map((ex, exIdx) => {
              const isEditing = editingExId === ex.id;
              return (
                <div
                  key={ex.id || exIdx}
                  className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-zinc-900 border border-zinc-800 text-lime-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {exIdx + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{ex.nameFa}</h4>
                        <span className="text-xs font-mono text-zinc-400">({ex.nameEn})</span>
                        {ex.technique && (
                          <span className="px-2 py-0.5 rounded-md bg-lime-500/10 border border-lime-500/30 text-lime-400 text-[10px] font-semibold">
                            {ex.technique}
                          </span>
                        )}
                      </div>
                      {ex.notes && (
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">نکته: {ex.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Sets / Reps / Tempo / RPE & Management */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0 self-end lg:self-center">
                    {isEditing ? (
                      <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                        <input
                          type="number"
                          value={editSets}
                          min={1}
                          max={10}
                          onChange={(e) => setEditSets(Number(e.target.value))}
                          className="w-12 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white text-center font-bold"
                        />
                        <span className="text-zinc-500">×</span>
                        <input
                          type="text"
                          value={editReps}
                          onChange={(e) => setEditReps(e.target.value)}
                          className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white text-center font-bold"
                        />
                        <button
                          onClick={() => handleSaveEditing(ex.id)}
                          className="p-1.5 rounded-lg bg-lime-500 text-zinc-950 font-bold"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-800 text-xs">
                        <div>
                          <span className="text-zinc-400 ml-1">ست و تکرار:</span>
                          <span className="font-bold text-lime-400 font-mono">
                            {ex.sets} × {ex.reps}
                          </span>
                        </div>
                        {ex.tempo && (
                          <>
                            <span className="text-zinc-700">|</span>
                            <div>
                              <span className="text-zinc-400 ml-1">تمپو:</span>
                              <span className="font-mono font-bold text-cyan-400">{ex.tempo}</span>
                            </div>
                          </>
                        )}
                        {ex.rpe && (
                          <>
                            <span className="text-zinc-700">|</span>
                            <div>
                              <span className="text-zinc-400 ml-1">RPE:</span>
                              <span className="font-mono font-bold text-amber-400">{ex.rpe}</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Reorder and Delete Buttons */}
                    <div className="flex items-center gap-1 no-print">
                      <button
                        onClick={() => handleStartEditing(ex)}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        title="ویرایش ست و تکرار"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveUp(exIdx)}
                        disabled={exIdx === 0}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveDown(exIdx)}
                        disabled={exIdx === currentDay.exercises.length - 1}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => removeExerciseFromProgram(selectedDayIdx, ex.id)}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-400"
                        title="حذف از روز"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
