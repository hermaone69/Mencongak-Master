import React from 'react';
import { Play, Sparkles, Swords, Trophy, ShoppingBag } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useGame } from '../context/GameContext';
import { getTranslation } from '../utils/translations';

export type TabType = 'play' | 'tricks' | 'duel' | 'leaderboard' | 'shop';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { language, themeMode } = useGame();
  const t = getTranslation(language);
  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';

  const tabs = [
    { id: 'play' as TabType, label: t.navPlay, icon: Play },
    { id: 'tricks' as TabType, label: t.navTricks, icon: Sparkles },
    { id: 'duel' as TabType, label: t.navDuel, icon: Swords },
    { id: 'leaderboard' as TabType, label: t.navLeaderboard, icon: Trophy },
    { id: 'shop' as TabType, label: t.navShop, icon: ShoppingBag }
  ];

  return (
    <nav className={`w-full ${
      isLight 
        ? 'bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md' 
        : isNeon
        ? 'bg-[#031d17]/95 backdrop-blur-md border-t border-emerald-500/40 shadow-emerald-900/10'
        : 'bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90'
    } px-1 py-1 pb-safe shrink-0 z-30 select-none transition-colors duration-200`}>
      <div className="grid grid-cols-5 items-center h-14">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playTap();
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center h-full transition-all duration-150 relative cursor-pointer ${
                isActive 
                  ? isLight ? 'text-amber-800 font-black' : isNeon ? 'text-emerald-300 font-black' : 'text-amber-400 font-bold' 
                  : isLight ? 'text-slate-600 hover:text-slate-950 font-bold' : isNeon ? 'text-emerald-400/70 hover:text-emerald-200 font-semibold' : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {isActive && (
                <div className={`absolute top-0 w-8 h-0.5 ${
                  isLight ? 'bg-amber-600 shadow-xs shadow-amber-600' : isNeon ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400 shadow-sm shadow-amber-400'
                } rounded-full`} />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive 
                    ? isLight ? 'bg-amber-100 scale-110' : isNeon ? 'bg-emerald-500/20 scale-110' : 'bg-amber-400/15 scale-110' 
                    : isLight ? 'hover:bg-slate-100' : isNeon ? 'hover:bg-[#04241d]' : 'hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-sans font-bold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
