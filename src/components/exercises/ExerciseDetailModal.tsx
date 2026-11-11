import React, { useState } from 'react';
import { Exercise } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { ExerciseAnimationPlayer } from './ExerciseAnimationPlayer';
import {
  X,
  Heart,
  Dumbbell,
  AlertTriangle,
  Lightbulb,
  XCircle,
  Plus,
  Check,
  Activity,
  Layers,
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
}) => {
  const { isFavorite, toggleFavorite, activeProgram, addExerciseToProgram } = useWorkout();
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  if (!exercise) return null;

  const favorite = isFavorite(exercise.id);

  const handleAdd = () => {
    addExerciseToProgram(selectedDayIdx, exercise);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 p-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/30">
                {exercise.muscleFa}
              </span>
              <span className="text-xs text-zinc-400">سطح: {exercise.difficulty}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{exercise.nameFa}</h2>
            <p className="text-xs font-mono text-zinc-400">{exercise.nameEn}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(exercise.id)}
              className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm">
          {/* Interactive Biomechanical Animation Player */}
          <ExerciseAnimationPlayer exercise={exercise} />

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
              <span className="text-xs text-zinc-400 block mb-1">تجهیزات:</span>
              <span className="font-semibold text-white flex items-center gap-1.5 text-xs sm:text-sm">
                <Dumbbell className="w-4 h-4 text-lime-400" />
                {exercise.equipment}
              </span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
              <span className="text-xs text-zinc-400 block mb-1">محیط تمرین:</span>
              <span className="font-semibold text-white text-xs sm:text-sm">
                {exercise.location === 'gym' ? 'باشگاه' : exercise.location === 'home' ? 'خانه' : 'خانه و باشگاه'}
              </span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
              <span className="text-xs text-zinc-400 block mb-1">ست و تکرار پیشنهادی:</span>
              <span className="font-semibold text-white text-xs sm:text-sm">
                {exercise.defaultSets} ست × {exercise.defaultReps}
              </span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
              <span className="text-xs text-zinc-400 block mb-1">استراحت بین ست:</span>
              <span className="font-semibold text-white text-xs sm:text-sm">
                {exercise.defaultRestSec} ثانیه
              </span>
            </div>
          </div>

          {/* Secondary Muscles */}
          {exercise.secondaryMusclesFa.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 font-medium">عضلات کمکی و ثانویه:</span>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondaryMusclesFa.map((sm, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300">
                    {sm}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-lime-400" />
              نحوه صحیح اجرای حرکت (مرحله به مرحله)
            </h3>
            <ol className="space-y-2.5">
              {exercise.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/70"
                >
                  <span className="w-6 h-6 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {exercise.tips.length > 0 && (
            <div className="bg-lime-950/20 border border-lime-500/30 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-lime-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                نکات مهم تکنیکی مربی
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300 list-disc list-inside">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {exercise.mistakes.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                اشتباهات رایج
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300 list-disc list-inside">
                {exercise.mistakes.map((mis, i) => (
                  <li key={i} className="leading-relaxed">{mis}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Warnings */}
          {exercise.warnings && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">هشدار ایمنی:</span>
                <p className="leading-relaxed text-amber-200/90">{exercise.warnings}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer: Add to User Program */}
        <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Layers className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-400 shrink-0">افزودن به روز:</span>
            <select
              value={selectedDayIdx}
              onChange={(e) => setSelectedDayIdx(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-lime-500 w-full sm:w-60"
            >
              {activeProgram.days.map((day, idx) => (
                <option key={day.id || idx} value={idx}>
                  {day.dayName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              addedSuccess
                ? 'bg-emerald-500 text-zinc-950'
                : 'bg-lime-500 hover:bg-lime-400 text-zinc-950 shadow-lime-500/20 active:scale-95'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>به برنامه اضافه شد!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>افزودن به برنامه من</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
