import React from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { toPersianDigits } from '../../utils/jalali';
import {
  TrendingUp,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  Dumbbell,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const ProgressAnalytics: React.FC = () => {
  const { completedSessions, personalRecords, activeProgram } = useWorkout();

  // Metrics
  const totalSessionsCount = completedSessions.length;
  const totalMinutes = completedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalTonnageKg = completedSessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const totalExercisesExecuted = completedSessions.reduce(
    (acc, s) => acc + (s.completedExercisesCount || s.exercises.length),
    0
  );

  // Muscle Volume Distribution
  const muscleCounts: Record<string, number> = {
    سینه: 0,
    زیربغل: 0,
    سرشانه: 0,
    چهارسر: 0,
    همسترینگ: 0,
    بازوها: 0,
    شکم: 0,
  };

  completedSessions.forEach((s) => {
    s.exercises.forEach((ex) => {
      const name = ex.exerciseNameFa;
      if (name.includes('سینه')) muscleCounts['سینه'] += 1;
      else if (name.includes('زیربغل') || name.includes('لت')) muscleCounts['زیربغل'] += 1;
      else if (name.includes('سرشانه')) muscleCounts['سرشانه'] += 1;
      else if (name.includes('اسکوات') || name.includes('پرس پا') || name.includes('جلو ران')) muscleCounts['چهارسر'] += 1;
      else if (name.includes('ددلیفت') || name.includes('پشت ران')) muscleCounts['همسترینگ'] += 1;
      else if (name.includes('بازو')) muscleCounts['بازوها'] += 1;
      else if (name.includes('شکم') || name.includes('پلانک') || name.includes('کرانچ')) muscleCounts['شکم'] += 1;
    });
  });

  const maxMuscleCount = Math.max(...Object.values(muscleCounts), 1);

  // Adherence calculation (sessions completed vs planned in weekly cycle)
  const plannedWeekly = activeProgram.days.length || 4;
  const recentWeekSessions = completedSessions.slice(0, 4).length;
  const adherenceRate = Math.min(100, Math.round((recentWeekSessions / plannedWeekly) * 100));

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-semibold">تعداد جلسات تمرینی</span>
            <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {toPersianDigits(totalSessionsCount)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">جلسه ثبت شده</span>
        </div>

        {/* Total Workout Time */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-semibold">مجموع زمان تمرین</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {toPersianDigits(Math.round(totalMinutes / 60))} <span className="text-base font-normal">ساعت</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {toPersianDigits(totalMinutes)} دقیقه فعالیت سنگین
          </span>
        </div>

        {/* Total Tonnage */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-semibold">مجموع تناژ وزنه</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {toPersianDigits((totalTonnageKg / 1000).toFixed(1))} <span className="text-base font-normal">تُن</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {totalTonnageKg.toLocaleString()} کیلوگرم جابجایی بار
          </span>
        </div>

        {/* Adherence Rate */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-semibold">پایبندی به برنامه</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-lime-400 font-mono">
            {adherenceRate}٪
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">شاخص نظم و انضباط ورزشی</span>
        </div>
      </div>

      {/* Main Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Muscle Volume Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-lime-400" />
              <h3 className="text-lg font-bold text-white">توزیع حجم تمرین گروه‌های عضلانی</h3>
            </div>
            <span className="text-xs text-zinc-400">تعداد حرکات اجرا شده</span>
          </div>

          <div className="space-y-4">
            {Object.entries(muscleCounts).map(([muscle, count]) => {
              const pct = Math.round((count / maxMuscleCount) * 100);
              return (
                <div key={muscle} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">{muscle}</span>
                    <span className="font-mono text-zinc-400">{count} حرکت ({pct}٪)</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-gradient-to-r from-lime-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Records (PR) Hall of Fame */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">تالار رکوردهای شخصی (Personal Records)</h3>
              </div>
              <span className="text-xs text-lime-400 font-semibold">تخمین 1RM فرمول Epley</span>
            </div>

            <div className="space-y-3">
              {personalRecords.map((pr, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{pr.exerciseName}</h4>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        رکورد: {pr.maxWeight} kg × {pr.repsAtMax} تکرار ({pr.date})
                      </span>
                    </div>
                  </div>

                  <div className="text-left bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">تخمین 1RM</span>
                    <span className="text-sm font-black text-lime-400 font-mono">
                      {pr.estimated1RM} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400 shrink-0" />
            <span>رکوردهای شما با هر بار ثبت وزنه سنگین‌تر در جلسات تمرینی خودکار به‌روزرسانی می‌شوند.</span>
          </div>
        </div>
      </div>

      {/* Historical Sessions Log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-lime-400" />
            <h3 className="text-lg font-bold text-white">تاریخچه تفصیلی آخرین جلسات</h3>
          </div>
          <span className="text-xs text-zinc-400">{completedSessions.length} جلسه ثبت شده</span>
        </div>

        <div className="space-y-3">
          {completedSessions.map((session) => (
            <div
              key={session.id}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-sm">{session.dayName}</span>
                  <span className="text-zinc-400 font-mono">({session.jalaliDate})</span>
                </div>
                <p className="text-zinc-400">{session.programTitle}</p>
                {session.notes && (
                  <p className="text-zinc-300 mt-1 italic">«{session.notes}»</p>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <span className="text-zinc-300">{session.durationMinutes} دقیقه</span>
                <span className="text-amber-400 font-bold">{session.totalVolumeKg.toLocaleString()} kg</span>
                <span className="bg-lime-500/10 text-lime-400 border border-lime-500/30 px-2.5 py-1 rounded-xl">
                  {session.feeling}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
