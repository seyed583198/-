import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Navbar } from './components/navigation/Navbar';
import { BottomNav } from './components/navigation/BottomNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { InteractiveMuscleMap } from './components/muscle-map/InteractiveMuscleMap';
import { ExerciseLibrary } from './components/exercises/ExerciseLibrary';
import { AIWorkoutGenerator } from './components/workout-generator/AIWorkoutGenerator';
import { MyProgramView } from './components/my-program/MyProgramView';
import { LiveWorkoutTracker } from './components/workout-tracker/LiveWorkoutTracker';
import { PersianCalendar } from './components/calendar/PersianCalendar';
import { ProgressAnalytics } from './components/analytics/ProgressAnalytics';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { MotionLogoSplash } from './components/brand/MotionLogoSplash';
import { MuscleId } from './types/fitness';
import { Sparkles, Layers, Dumbbell, Flame, Bot, Calendar, BarChart3, User } from 'lucide-react';

function MainApp({ onReplaySplash }: { onReplaySplash: () => void }) {
  const { currentUser } = useWorkout();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleId | null>(null);
  const [libraryMuscleFilter, setLibraryMuscleFilter] = useState<MuscleId | null>(null);

  if (!currentUser) {
    return <AuthScreen onReplaySplash={onReplaySplash} />;
  }

  const handleNavigateToExercises = (muscleId: MuscleId) => {
    setLibraryMuscleFilter(muscleId);
    setActiveTab('library');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenMuscleMapWithMuscle={(mId) => {
              setSelectedMuscle(mId);
              setActiveTab('muscle_map');
            }}
          />
        );

      case 'muscle_map':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-500/20 to-emerald-500/10 border border-lime-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-lime-500/10">
                  <Layers className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-lime-500/15 border border-lime-500/30 text-lime-400 text-[10px] font-black uppercase tracking-wider">
                      3D ANATOMY ATLAS
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold">
                      سید بدنساز • آناتومی الیاف عضلانی
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    اطلس سه‌بعدی و نقشه تعاملی عضلات بدن
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    اسکن آناتومیک قدامی و خلفی با تفکیک الیاف عضلانی، تاندون‌ها و عضلات کمکی؛ روی هر عضله کلیک کنید.
                  </p>
                </div>
              </div>
            </div>

            <InteractiveMuscleMap
              selectedMuscle={selectedMuscle}
              onSelectMuscle={(mId) => setSelectedMuscle(mId)}
              onNavigateToExercises={handleNavigateToExercises}
            />
          </div>
        );

      case 'library':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
                  <Dumbbell className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                      PRO EXERCISE VAULT
                    </span>
                    <span className="text-[11px] text-lime-400 font-bold">
                      ۱۲۰+ حرکت با کلیپ واقعی + آناتومی
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    بانک جامع حرکات سید بدنساز (Exercise Library)
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    کلیپ اجرای واقعی ورزشکاران، شبیه‌ساز بیومکانیکی مفاصل، نکات تکنیکی مربیان و هشدارهای ایمنی.
                  </p>
                </div>
              </div>
            </div>

            <ExerciseLibrary
              initialMuscleFilter={libraryMuscleFilter}
              onClearMuscleFilter={() => setLibraryMuscleFilter(null)}
            />
          </div>
        );

      case 'generator':
        return (
          <AIWorkoutGenerator
            onProgramActivated={() => setActiveTab('my_program')}
          />
        );

      case 'my_program':
        return (
          <MyProgramView
            onStartSession={() => {
              setActiveTab('tracker');
            }}
            onOpenLibraryForDay={() => {
              setActiveTab('library');
            }}
          />
        );

      case 'tracker':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/40 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  دفترچه ثبت و اجرای تمرین زنده باشگاه
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  ثبت وزنه‌ها و تکرارها، تیک زدن ست‌ها، تایمر خودکار استراحت و محاسبه آنی تناژ بار تمرینی (Volume Load).
                </p>
              </div>
            </div>

            <LiveWorkoutTracker
              onSessionFinished={() => setActiveTab('calendar')}
              onSelectProgramDay={() => setActiveTab('my_program')}
            />
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-lime-500/10 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  تقویم شمسی و سوابق تمرینی سید بدنساز
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  بررسی روزهای تمرین‌شده، روزهای ریکاوری و مرور جزئیات تمام جلسات گذشته.
                </p>
              </div>
            </div>

            <PersianCalendar />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  داشبورد آنالیز و پیشرفت ورزشی
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  نمودارهای توزیع حجم عضلانی، تالار رکوردهای شخصی (PR) و شاخص پایبندی به برنامه.
                </p>
              </div>
            </div>

            <ProgressAnalytics />
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-500/20 to-cyan-500/10 border border-lime-500/40 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-lime-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  پروفایل شخصی ورزشکار و تنظیمات حساب
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  مشخصات بدنی، تغییر رمز عبور، تنظیمات زنگ تایمر و مدیریت داده‌های اختصاصی حساب شما در سید بدنساز.
                </p>
              </div>
            </div>

            <ProfileSettings />
          </div>
        );

      default:
        return <Dashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-athletic-mesh text-zinc-100 flex flex-col font-sans relative">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onReplaySplash={onReplaySplash}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 lg:mb-6 relative z-10">
        {renderActiveTab()}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  return (
    <WorkoutProvider>
      {showSplash && (
        <MotionLogoSplash onComplete={() => setShowSplash(false)} />
      )}
      <MainApp onReplaySplash={() => setShowSplash(true)} />
    </WorkoutProvider>
  );
}
