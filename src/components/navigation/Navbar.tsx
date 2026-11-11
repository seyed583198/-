import React from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { SeyedLogo } from '../brand/SeyedLogo';
import {
  Flame,
  LayoutDashboard,
  Layers,
  Dumbbell,
  Bot,
  Calendar,
  BarChart3,
  User,
  Heart,
  Activity,
  LogOut,
  PlayCircle,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onReplaySplash?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onReplaySplash,
}) => {
  const { liveSession, favorites, profile, currentUser, logout } = useWorkout();

  const navItems = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'muscle_map', label: 'اطلس عضلات 3D', icon: Layers, highlight: true },
    { id: 'library', label: 'بانک حرکات', icon: Dumbbell },
    { id: 'generator', label: 'مربی هوشمند', icon: Bot },
    { id: 'my_program', label: 'برنامه من', icon: Activity },
    { id: 'tracker', label: 'ثبت تمرین', icon: Flame, isLive: !!liveSession },
    { id: 'calendar', label: 'تقویم', icon: Calendar },
    { id: 'analytics', label: 'آنالیز', icon: BarChart3 },
    { id: 'profile', label: 'پروفایل', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/90 shadow-lg shadow-black/40 no-print">
      {/* Top championship accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-lime-500/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity: سید بدنساز */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onSelectTab('dashboard')}
              className="cursor-pointer group"
            >
              <SeyedLogo size="md" showSubtitle={true} />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-zinc-900/70 p-1.5 rounded-2xl border border-zinc-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-lime-500 to-emerald-400 text-zinc-950 font-black shadow-md shadow-lime-500/25'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5"></span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Right Actions (Motion Intro Replay, Live badge, Favorites & User) */}
          <div className="flex items-center gap-2">
            {onReplaySplash && (
              <button
                onClick={onReplaySplash}
                title="پخش مجدد موشن لوگو سید بدنساز"
                className="px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-400 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span className="hidden xl:inline">موشن لوگو</span>
              </button>
            )}

            {liveSession && (
              <button
                onClick={() => onSelectTab('tracker')}
                className="px-3 py-1.5 rounded-xl bg-lime-500/10 border border-lime-500/40 text-lime-400 text-xs font-bold flex items-center gap-1.5 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                <span className="hidden sm:inline">جلسه در جریان</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('library')}
              title="بانک حرکات و علاقه‌مندی‌ها"
              className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-zinc-700 transition-colors relative"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {currentUser && (
              <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 pr-2.5">
                <button
                  onClick={() => onSelectTab('profile')}
                  className="text-right hidden sm:block hover:opacity-80 transition-opacity"
                  title="مشاهده پروفایل شخصی"
                >
                  <span className="text-xs font-bold text-white block leading-tight">
                    {profile.name}
                  </span>
                  <span className="text-[10px] font-mono text-lime-400 block leading-tight" dir="ltr">
                    @{currentUser}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="خروج از حساب / تغییر کاربر"
                  className="p-2 rounded-lg bg-zinc-950 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
