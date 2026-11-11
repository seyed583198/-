import React from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { getCurrentJalali, formatJalaliLong, toPersianDigits } from '../../utils/jalali';
import { EXERCISES } from '../../data/exercisesData';
import { SeyedLogo } from '../brand/SeyedLogo';
import {
  Flame,
  Dumbbell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Play,
  CheckCircle2,
  Award,
  Layers,
  ChevronLeft,
  Trophy,
  Film,
  Bot,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenMuscleMapWithMuscle?: (muscleId: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
}) => {
  const {
    profile,
    activeProgram,
    completedSessions,
    startLiveSession,
    personalRecords,
  } = useWorkout();

  const currentJ = getCurrentJalali();
  const dateFormatted = formatJalaliLong(currentJ);

  // Today's suggested workout: pick 1st or current day of active program
  const todayDay = activeProgram.days[0];
  const weeklySessionsDone = completedSessions.slice(0, 4).length;
  const targetWeeklySessions = activeProgram.days.length || 4;
  const weeklyCompletionRate = Math.min(
    100,
    Math.round((weeklySessionsDone / targetWeeklySessions) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Championship Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl athletic-card-glow">
        {/* Ambient Athletic Lighting */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                {dateFormatted}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black">
                <Trophy className="w-3.5 h-3.5" />
                آکادمی تخصصی سید بدنساز
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              خوش آمدی قهرمان، <span className="text-transparent bg-clip-text bg-gradient-to-l from-lime-400 via-emerald-300 to-amber-300">{profile.name}</span> عزیز 💪
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              برنامه تمرینی فعال شما در <strong className="text-lime-400">سید بدنساز</strong>: «{activeProgram.title}» • آماده ثبت رکورد جدید هستی؟
            </p>
          </div>

          {/* Quick Action: Start Today's Session */}
          {todayDay && (
            <div className="shrink-0 w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  startLiveSession(todayDay);
                  onNavigateTab('tracker');
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-400 hover:from-lime-400 hover:to-emerald-300 text-zinc-950 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-lime-500/25 active:scale-95 group cursor-pointer"
              >
                <Play className="w-5 h-5 fill-zinc-950" />
                <span>شروع تمرین امروز ({todayDay.dayName.split(' ')[0]})</span>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Athletic KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Completion */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 hover:border-lime-500/40 rounded-3xl p-5 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-bold">پیشرفت برنامه هفتگی</span>
            <div className="p-2 rounded-xl bg-lime-500/15 text-lime-400 border border-lime-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{toPersianDigits(weeklyCompletionRate)}٪</span>
            <span className="text-xs text-zinc-400">
              ({toPersianDigits(weeklySessionsDone)} از {toPersianDigits(targetWeeklySessions)} جلسه)
            </span>
          </div>
          <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden mt-3 border border-zinc-800">
            <div
              className="bg-gradient-to-r from-lime-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${weeklyCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 hover:border-cyan-500/40 rounded-3xl p-5 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-bold">مجموع جلسات تمرینی</span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">
            {toPersianDigits(completedSessions.length)} <span className="text-sm font-normal text-zinc-400">جلسه</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">ثبت شده در دفترچه هوشمند سید بدنساز</span>
        </div>

        {/* PR Records */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-bold">بهترین رکورد شخصی (PR)</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {personalRecords[0] ? `${personalRecords[0].maxWeight} kg` : '---'}
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block truncate">
            {personalRecords[0] ? personalRecords[0].exerciseName : 'اولین رکورد خود را ثبت کنید'}
          </span>
        </div>

        {/* Exercise Vault Count */}
        <div
          onClick={() => onNavigateTab('library')}
          className="bg-zinc-900/90 border border-zinc-800/90 hover:border-emerald-500/50 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-bold">بانک کلیپ حرکات</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {toPersianDigits(EXERCISES.length)}+ <span className="text-sm font-normal text-zinc-400">حرکت</span>
          </div>
          <span className="text-[11px] text-emerald-400/90 font-semibold mt-2 block">
            همراه با کلیپ اجرای واقعی و آناتومی ←
          </span>
        </div>
      </div>

      {/* Main Feature Gateways (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Interactive Muscle Atlas Gateway */}
        <div
          onClick={() => onNavigateTab('muscle_map')}
          className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 hover:border-lime-500/60 rounded-3xl p-6 cursor-pointer group transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-lime-500/10 rounded-full blur-2xl group-hover:bg-lime-500/20 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-400 border border-lime-500/30 flex items-center justify-center shadow-lg shadow-lime-500/10">
                <Layers className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-[10px] font-black">
                3D ANATOMY ATLAS
              </span>
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors mb-2">
              اطلس سه‌بعدی و واقعی عضلات بدن
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              نمای قدامی و خلفی آناتومیک با تفکیک الیاف عضلانی، تاندون‌ها، نمایش خودکار عضلات کمکی و حالت‌های گرافیکی سه‌بعدی، نئون و حرارتی.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-black text-lime-400">
            <span>ورود به اطلس آناتومی عضلات</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1" />
          </div>
        </div>

        {/* Real Video Exercise Vault Gateway */}
        <div
          onClick={() => onNavigateTab('library')}
          className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 hover:border-amber-500/60 rounded-3xl p-6 cursor-pointer group transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Film className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black">
                REAL MOTION CLIPS
              </span>
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors mb-2">
              بانک جامع حرکات با کلیپ واقعی
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              بیش از ۱۲۰ حرکت تخصصی هالتر، دمبل، سیم‌کش، دستگاه و وزن بدن همراه با کلیپ اجرای واقعی ورزشکار و شبیه‌ساز بیومکانیک مفاصل.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-black text-amber-400">
            <span>مشاهده کلیپ‌ها و آموزش حرکات</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1" />
          </div>
        </div>

        {/* AI Program Generator Gateway */}
        <div
          onClick={() => onNavigateTab('generator')}
          className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 hover:border-cyan-500/60 rounded-3xl p-6 cursor-pointer group transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <Bot className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black">
                AI PRO COACH
              </span>
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors mb-2">
              مربی هوشمند و برنامه‌ساز تخصصی
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              طراحی برنامه اختصاصی بر اساس تیپ بدنی، درصد چربی، نقاط ضعف عضلانی، آسیب‌دیدگی‌ها، تمپو، RPE و محاسبه دقیق ماکروهای تغذیه.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-black text-cyan-400">
            <span>دریافت برنامه شخصی‌سازی‌شده</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1" />
          </div>
        </div>
      </div>

      {/* Today's Workout Details or Program Day Preview */}
      {todayDay && (
        <div className="bg-zinc-900/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-lime-400" />
                <span className="text-xs font-black text-lime-400">
                  برنامه پیشنهادی امروز شما
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{todayDay.dayName}</h3>
              <p className="text-xs text-zinc-400 mt-1">
                تمرکز: {todayDay.focus} • {toPersianDigits(todayDay.exercises.length)} حرکت تخصصی
              </p>
            </div>

            <button
              onClick={() => {
                startLiveSession(todayDay);
                onNavigateTab('tracker');
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-400 hover:from-lime-400 hover:to-emerald-300 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-lime-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>شروع ثبت تمرین زنده</span>
            </button>
          </div>

          {/* Exercise Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {todayDay.exercises.map((ex, idx) => (
              <div
                key={ex.id || idx}
                className="bg-zinc-950 hover:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800/90 hover:border-lime-500/40 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-lg bg-lime-500/15 border border-lime-500/30 text-lime-400 flex items-center justify-center text-[11px] font-black">
                    {toPersianDigits(idx + 1)}
                  </span>
                  <span className="font-mono text-lime-400 font-black bg-lime-500/10 px-2 py-0.5 rounded-md border border-lime-500/20">
                    {ex.sets} × {ex.reps}
                  </span>
                </div>
                <h4 className="font-bold text-white line-clamp-1 mb-0.5">{ex.nameFa}</h4>
                <p className="text-[11px] font-mono text-zinc-500 line-clamp-1">{ex.nameEn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Snapshot */}
      {completedSessions.length > 0 && (
        <div className="bg-zinc-900/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <h3 className="text-lg font-black text-white">آخرین فعالیت‌های ورزشی شما در سید بدنساز</h3>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs text-lime-400 hover:text-lime-300 font-bold cursor-pointer"
            >
              مشاهده تقویم کامل ←
            </button>
          </div>

          <div className="space-y-3">
            {completedSessions.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{s.dayName}</span>
                  <span className="text-[11px] text-zinc-400">
                    {s.jalaliDate} • {toPersianDigits(s.durationMinutes)} دقیقه تمرین
                  </span>
                </div>
                <div className="font-mono text-amber-400 font-black">
                  {s.totalVolumeKg.toLocaleString()} kg بار
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
