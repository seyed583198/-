import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import {
  getCurrentJalali,
  getDaysInJalaliMonth,
  getJalaliMonthFirstDayOfWeek,
  JALALI_MONTH_NAMES,
  JALALI_WEEK_DAYS,
  toPersianDigits,
  jalaliToGregorian,
  formatJalaliDate,
  JalaliDate,
} from '../../utils/jalali';
import { WorkoutSession } from '../../types/fitness';
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Flame,
  Clock,
  Award,
  Dumbbell,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const PersianCalendar: React.FC = () => {
  const { completedSessions } = useWorkout();

  const currentJ = getCurrentJalali();
  const [activeYear, setActiveYear] = useState<number>(currentJ.jy);
  const [activeMonth, setActiveMonth] = useState<number>(currentJ.jm);
  const [selectedDate, setSelectedDate] = useState<JalaliDate>(currentJ);

  const daysInMonth = getDaysInJalaliMonth(activeYear, activeMonth);
  const firstDayOfWeek = getJalaliMonthFirstDayOfWeek(activeYear, activeMonth);

  const handlePrevMonth = () => {
    if (activeMonth === 1) {
      setActiveMonth(12);
      setActiveYear((y) => y - 1);
    } else {
      setActiveMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 12) {
      setActiveMonth(1);
      setActiveYear((y) => y + 1);
    } else {
      setActiveMonth((m) => m + 1);
    }
  };

  // Find sessions matching a specific Jalali day
  const getSessionsForJalaliDay = (jy: number, jm: number, jd: number): WorkoutSession[] => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const jStr = `${jy}/${pad(jm)}/${pad(jd)}`;
    return completedSessions.filter((s) => s.jalaliDate === jStr);
  };

  const selectedSessions = getSessionsForJalaliDay(
    selectedDate.jy,
    selectedDate.jm,
    selectedDate.jd
  );

  return (
    <div className="space-y-8">
      {/* Calendar Header Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-lime-500/10 text-lime-400 border border-lime-500/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {JALALI_MONTH_NAMES[activeMonth - 1]} {toPersianDigits(activeYear)}
              </h2>
              <span className="text-xs text-zinc-400">تقویم خورشیدی و سوابق تمرینات</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
            {/* Note: RTL means Prev is right arrow and Next is left arrow */}
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="ماه قبل"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveYear(currentJ.jy);
                setActiveMonth(currentJ.jm);
                setSelectedDate(currentJ);
              }}
              className="px-3 py-1 text-xs font-semibold text-zinc-300 hover:text-lime-400"
            >
              امروز
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="ماه بعد"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold text-zinc-400">
          {JALALI_WEEK_DAYS.map((wd, i) => (
            <div key={i} className="py-1">
              {wd}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty_${i}`} className="h-14 sm:h-20 rounded-2xl bg-zinc-950/20" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const sessionsThisDay = getSessionsForJalaliDay(activeYear, activeMonth, dayNum);
            const hasWorkout = sessionsThisDay.length > 0;
            const isToday =
              currentJ.jy === activeYear && currentJ.jm === activeMonth && currentJ.jd === dayNum;
            const isSelected =
              selectedDate.jy === activeYear &&
              selectedDate.jm === activeMonth &&
              selectedDate.jd === dayNum;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDate({ jy: activeYear, jm: activeMonth, jd: dayNum })}
                className={`h-14 sm:h-20 p-1.5 sm:p-2 rounded-2xl border text-right transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-lime-500/20 border-lime-500 shadow-md shadow-lime-500/20'
                    : isToday
                    ? 'bg-zinc-800/80 border-zinc-700'
                    : 'bg-zinc-950/70 border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isSelected
                        ? 'text-lime-400'
                        : isToday
                        ? 'text-white'
                        : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {toPersianDigits(dayNum)}
                  </span>

                  {isToday && (
                    <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300">
                      امروز
                    </span>
                  )}
                </div>

                {/* Workout Marker */}
                {hasWorkout && (
                  <div className="w-full">
                    <div className="flex items-center gap-1 bg-lime-500/20 text-lime-400 border border-lime-500/40 px-1.5 py-0.5 rounded-lg text-[10px] font-semibold w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400 inline-block animate-pulse"></span>
                      <span className="hidden sm:inline truncate max-w-[55px]">
                        {sessionsThisDay[0].dayName.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>
              جلسه تمرین ثبت‌شده
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
              روز استراحت و ریکاوری
            </span>
          </div>
          <span>
            مجموع جلسات ماه: {completedSessions.length} جلسه
          </span>
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-xs font-semibold text-lime-400 block mb-1">
              جزئیات تاریخ انتخابی
            </span>
            <h3 className="text-xl font-bold text-white">
              {toPersianDigits(selectedDate.jd)} {JALALI_MONTH_NAMES[selectedDate.jm - 1]} {toPersianDigits(selectedDate.jy)}
            </h3>
          </div>

          <div className="text-xs text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            {formatJalaliDate(selectedDate)}
          </div>
        </div>

        {selectedSessions.length > 0 ? (
          <div className="space-y-6">
            {selectedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4"
              >
                {/* Session Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-lime-400 block mb-1">
                      {session.dayName}
                    </span>
                    <h4 className="text-base font-bold text-white">{session.programTitle}</h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-lime-400" />
                      {session.durationMinutes} دقیقه
                    </span>
                    <span className="flex items-center gap-1 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-amber-400 font-mono">
                      <Flame className="w-3.5 h-3.5" />
                      {session.totalVolumeKg.toLocaleString()} kg
                    </span>
                    <span className="bg-lime-500/10 text-lime-400 border border-lime-500/30 px-3 py-1.5 rounded-xl font-semibold">
                      حس: {session.feeling}
                    </span>
                  </div>
                </div>

                {/* Session Personal Notes */}
                {session.notes && (
                  <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
                    <span className="text-zinc-400 font-bold block mb-1">یادداشت ثبت‌شده:</span>
                    {session.notes}
                  </div>
                )}

                {/* Exercises & Sets Executed */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-zinc-400 block">
                    حرکات اجرا شده ({session.exercises.length} حرکت):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {session.exercises.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80 text-xs flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-white block">{ex.exerciseNameFa}</span>
                          <span className="text-[11px] text-zinc-400">{ex.sets.length} ست ثبت شده</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-lime-400 font-bold">
                          {ex.sets.filter((s) => s.completed).length} ✓
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 text-zinc-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-zinc-500" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">روز استراحت و ریکاوری</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              در این روز جلسه ورزشی ثبت نشده است. استراحت، خواب عمیق و تغذیه مناسب کلید ترمیم و رشد فیبرهای عضلانی هستند.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
