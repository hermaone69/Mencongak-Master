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
  const { language } = useGame();
  const t = getTranslation(language);

  const tabs = [
    { id: 'play' as TabType, label: t.navPlay, icon: Play },
    { id: 'tricks' as TabType, label: t.navTricks, icon: Sparkles },
    { id: 'duel' as TabType, label: t.navDuel, icon: Swords },
    { id: 'leaderboard' as TabType, label: t.navLeaderboard, icon: Trophy },
    { id: 'shop' as TabType, label: t.navShop, icon: ShoppingBag }
  ];

  return (
    <nav className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-1 py-1 pb-safe shrink-0 z-30 select-none">
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
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-400" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-400/15 scale-110' : 'hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-sans">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
