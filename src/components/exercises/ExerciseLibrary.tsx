import React, { useState, useMemo } from 'react';
import { MuscleId, Exercise, Difficulty, Equipment } from '../../types/fitness';
import { EXERCISES } from '../../data/exercisesData';
import { MUSCLES_LIST } from '../../data/musclesData';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { useWorkout } from '../../context/WorkoutContext';
import {
  Search,
  Filter,
  Heart,
  SlidersHorizontal,
  X,
  Dumbbell,
  Home,
  Building2,
} from 'lucide-react';

interface ExerciseLibraryProps {
  initialMuscleFilter?: MuscleId | null;
  onClearMuscleFilter?: () => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  initialMuscleFilter,
  onClearMuscleFilter,
}) => {
  const { isFavorite } = useWorkout();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleId | 'all'>(
    initialMuscleFilter || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'gym' | 'home'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);

  // Sync prop changes
  React.useEffect(() => {
    if (initialMuscleFilter) {
      setSelectedMuscle(initialMuscleFilter);
    }
  }, [initialMuscleFilter]);

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((ex) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchFa = ex.nameFa.toLowerCase().includes(q);
        const matchEn = ex.nameEn.toLowerCase().includes(q);
        const matchMuscle = ex.muscleFa.toLowerCase().includes(q);
        if (!matchFa && !matchEn && !matchMuscle) return false;
      }

      // Muscle
      if (selectedMuscle !== 'all') {
        const matchesPrimary = ex.primaryMuscle === selectedMuscle;
        const matchesSecondary = ex.secondaryMuscles.includes(selectedMuscle);
        if (!matchesPrimary && !matchesSecondary) return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) {
        return false;
      }

      // Equipment
      if (selectedEquipment !== 'all' && ex.equipment !== selectedEquipment) {
        return false;
      }

      // Location
      if (selectedLocation !== 'all') {
        if (selectedLocation === 'gym' && ex.location === 'home') return false;
        if (selectedLocation === 'home' && ex.location === 'gym') return false;
      }

      // Favorites
      if (onlyFavorites && !isFavorite(ex.id)) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedMuscle,
    selectedDifficulty,
    selectedEquipment,
    selectedLocation,
    onlyFavorites,
    isFavorite,
  ]);

  const activeFiltersCount =
    (selectedMuscle !== 'all' ? 1 : 0) +
    (selectedDifficulty !== 'all' ? 1 : 0) +
    (selectedEquipment !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0) +
    (onlyFavorites ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedMuscle('all');
    setSelectedDifficulty('all');
    setSelectedEquipment('all');
    setSelectedLocation('all');
    setOnlyFavorites(false);
    if (onClearMuscleFilter) onClearMuscleFilter();
  };

  const muscleFilterButtons: { id: MuscleId | 'all'; label: string }[] = [
    { id: 'all', label: 'همه عضلات' },
    { id: 'chest', label: 'سینه' },
    { id: 'chest_upper', label: 'بالا سینه' },
    { id: 'chest_lower', label: 'زیر سینه' },
    { id: 'lats', label: 'زیربغل' },
    { id: 'back_upper', label: 'پشت بالایی' },
    { id: 'traps', label: 'کول' },
    { id: 'back_lower', label: 'پایین کمر' },
    { id: 'deltoid_front', label: 'سرشانه قدامی' },
    { id: 'deltoid_side', label: 'سرشانه میانی' },
    { id: 'deltoid_rear', label: 'سرشانه خلفی' },
    { id: 'biceps', label: 'جلو بازو' },
    { id: 'triceps', label: 'پشت بازو' },
    { id: 'forearms', label: 'ساعد' },
    { id: 'abs', label: 'شکم' },
    { id: 'obliques', label: 'پهلو' },
    { id: 'quads', label: 'چهارسر ران' },
    { id: 'hamstrings', label: 'همسترینگ' },
    { id: 'glutes', label: 'باسن' },
    { id: 'adductors', label: 'داخل ران' },
    { id: 'calves', label: 'ساق پا' },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Top Action Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی حرکت (مثلاً: پرس سینه، اسکوات، Bench Press)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pr-12 pl-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-lime-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters: Favorites & Location */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all ${
                onlyFavorites
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>علاقه‌مندی‌ها</span>
            </button>

            {/* Clear Filters if any active */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-3 rounded-2xl text-xs text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors flex items-center gap-1"
                title="پاک کردن فیلترها"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">حذف فیلترها</span>
              </button>
            )}
          </div>
        </div>

        {/* Muscle Pills Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {muscleFilterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedMuscle(btn.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                selectedMuscle === btn.id
                  ? 'bg-lime-500 text-zinc-950 border-lime-500 shadow-md shadow-lime-500/20'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Difficulty */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">سطح:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-2.5 py-1.5 outline-none focus:border-lime-500"
              >
                <option value="all">تمام سطوح</option>
                <option value="مبتدی">مبتدی</option>
                <option value="متوسط">متوسط</option>
                <option value="پیشرفته">پیشرفته</option>
              </select>
            </div>

            {/* Equipment */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">تجهیزات:</span>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-2.5 py-1.5 outline-none focus:border-lime-500"
              >
                <option value="all">همه ابزارها</option>
                <option value="هالتر">هالتر</option>
                <option value="دمبل">دمبل</option>
                <option value="سیم‌کش">سیم‌کش</option>
                <option value="دستگاه">دستگاه</option>
                <option value="وزن بدن">وزن بدن</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">محیط:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-2.5 py-1.5 outline-none focus:border-lime-500"
              >
                <option value="all">خانه و باشگاه</option>
                <option value="gym">فقط باشگاه</option>
                <option value="home">فقط خانه</option>
              </select>
            </div>
          </div>

          {/* Result counter */}
          <div className="text-zinc-400 font-medium">
            نمایش <span className="text-lime-400 font-bold">{filteredExercises.length}</span> حرکت
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onOpenDetail={(ex) => setActiveModalExercise(ex)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <Dumbbell className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">حرکتی با این مشخصات یافت نشد</h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
            فیلترهای انتخابی را تغییر دهید یا واژه جستجوی دیگری را امتحان کنید.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-all"
          >
            حذف تمام فیلترها
          </button>
        </div>
      )}

      {/* Modal Detail */}
      <ExerciseDetailModal
        exercise={activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
      />
    </div>
  );
};
