import React from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import {
  LayoutDashboard,
  Layers,
  Dumbbell,
  Flame,
  User,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { liveSession } = useWorkout();

  const mobileTabs = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'muscle_map', label: 'نقشه عضلات', icon: Layers },
    { id: 'tracker', label: 'ثبت تمرین', icon: Flame, isLive: !!liveSession },
    { id: 'library', label: 'حرکات', icon: Dumbbell },
    { id: 'profile', label: 'پروفایل', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-2 no-print">
      <div className="grid grid-cols-5 gap-1">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-lime-400 font-bold bg-zinc-900/80'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.isLive && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-pulse"></span>
                )}
              </div>
              <span className="text-[10px] mt-1 line-clamp-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
