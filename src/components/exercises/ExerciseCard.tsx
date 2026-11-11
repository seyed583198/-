import React from 'react';
import { Exercise } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { ExerciseAnimationPlayer } from './ExerciseAnimationPlayer';
import { Heart, Dumbbell, PlayCircle, ArrowLeft } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onOpenDetail: (exercise: Exercise) => void;
  onAddToProgram?: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onOpenDetail,
  onAddToProgram,
}) => {
  const { isFavorite, toggleFavorite } = useWorkout();
  const favorite = isFavorite(exercise.id);

  const difficultyColors = {
    مبتدی: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    متوسط: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    پیشرفته: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="group bg-zinc-900 border border-zinc-800 hover:border-lime-500/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/50 relative overflow-hidden">
      {/* Top Bar: Muscle & Favorite */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            {exercise.muscleFa.split(' ')[0]}
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border ${
                difficultyColors[exercise.difficulty]
              }`}
            >
              {exercise.difficulty}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(exercise.id);
              }}
              title={favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Interactive Animated Biomechanical Preview */}
        <div onClick={() => onOpenDetail(exercise)} className="cursor-pointer mb-3.5">
          <ExerciseAnimationPlayer exercise={exercise} compact />
        </div>

        {/* Titles */}
        <h3
          onClick={() => onOpenDetail(exercise)}
          className="text-base sm:text-lg font-bold text-white group-hover:text-lime-400 transition-colors cursor-pointer line-clamp-1 mb-1"
        >
          {exercise.nameFa}
        </h3>
        <p className="text-xs font-mono text-zinc-400 mb-3 line-clamp-1">
          {exercise.nameEn}
        </p>

        {/* Badges: Equipment & Location */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800/80">
            <Dumbbell className="w-3.5 h-3.5 text-lime-400" />
            {exercise.equipment}
          </span>
          <span className="bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800/80">
            {exercise.location === 'gym'
              ? 'باشگاهی'
              : exercise.location === 'home'
              ? 'خانگی'
              : 'خانه و باشگاه'}
          </span>
        </div>

        {/* Quick steps snippet */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {exercise.steps[0]}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetail(exercise)}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1.5 transition-colors py-1.5"
        >
          <PlayCircle className="w-4 h-4" />
          <span>انیمیشن و آموزش کامل</span>
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
        </button>

        {onAddToProgram && (
          <button
            onClick={() => onAddToProgram(exercise)}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-lime-500 hover:text-zinc-950 text-zinc-200 text-xs font-medium transition-all"
          >
            + افزودن به برنامه
          </button>
        )}
      </div>
    </div>
  );
};
