import React, { useState } from 'react';
import { Zap, Coins, Flame, Award, Settings, User, Sparkles, Globe } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { getTranslation } from '../utils/translations';

interface HeaderNavProps {
  onOpenProfile: () => void;
  onOpenShop: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenProfile, onOpenShop }) => {
  const { 
    playerName, 
    playerLevel, 
    playerTitle, 
    xp, 
    xpToNextLevel, 
    coins, 
    stats, 
    isVip,
    language,
    setLanguage
  } = useGame();
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const t = getTranslation(language);

  const currentLevelMinXp = (playerLevel - 1) * (playerLevel - 1) * 20;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.floor(((xp - currentLevelMinXp) / (xpToNextLevel - currentLevelMinXp || 1)) * 100))
  );

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5 pt-safe flex items-center justify-between shrink-0 z-30 select-none relative">
      {/* Player Profile & Level */}
      <button
        onClick={() => {
          sounds.playTap();
          onOpenProfile();
        }}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left cursor-pointer"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-base font-bold">
              {isVip ? '👑' : '😎'}
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full border border-slate-900">
            Lv{playerLevel}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-white max-w-[85px] sm:max-w-[110px] truncate">
              {playerName}
            </span>
            {isVip && (
              <span className="text-[8px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md shadow-sm shrink-0">
                VIP
              </span>
            )}
            <span className="text-[10px] text-amber-400 font-bold opacity-80 shrink-0">▾</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-12 sm:w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[9px] text-amber-400/90 font-medium">
              {progressPercent}%
            </span>
          </div>
        </div>
      </button>

      {/* Stats Counters (Language Switcher, Daily Streak & Coins) */}
      <div className="flex items-center gap-1.5">
        {/* Language Switcher Button */}
        <button
          onClick={() => {
            setLanguage(language === 'id' ? 'en' : 'id');
          }}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
          title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <Globe className="w-3 h-3 text-amber-400" />
          <span>{language === 'id' ? 'ID' : 'EN'}</span>
        </button>

        {/* Daily Streak Counter with Info Modal Trigger */}
        <button
          onClick={() => {
            sounds.playTap();
            setShowStreakModal(prev => !prev);
          }}
          className="flex items-center gap-1 px-2 py-1 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 rounded-xl transition-colors cursor-pointer"
          title="Daily Streak"
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
          <span className="text-xs font-bold text-orange-300 font-mono-math">
            {stats.dailyStreak} {language === 'id' ? 'Hari' : 'd'}
          </span>
        </button>

        {/* Coins Button (Triggers Shop) */}
        <button
          onClick={() => {
            sounds.playTap();
            onOpenShop();
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors cursor-pointer"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 font-mono-math">
            {coins}
          </span>
        </button>
      </div>

      {/* Daily Streak Explanation Popover */}
      {showStreakModal && (
        <div className="absolute top-12 right-6 sm:right-12 z-50 w-64 bg-slate-900 border border-orange-500/40 rounded-2xl p-3.5 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">🔥</span>
            <h4 className="font-bold text-xs text-white">
              {language === 'id' ? `Rekor Api Latihan (${stats.dailyStreak} Hari)` : `Daily Streak (${stats.dailyStreak} Days)`}
            </h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {language === 'id'
              ? `Ikon api ini menandakan Daily Streak (Anda sudah rajin latihan mencongak selama ${stats.dailyStreak} hari berturut-turut).`
              : `This fire icon tracks your Daily Streak (${stats.dailyStreak} consecutive days of mental math training).`}
          </p>
          <p className="text-[10px] text-orange-400/90 mt-1.5 font-medium">
            {language === 'id'
              ? '💡 Latihan minimal 1 soal setiap hari agar nyala apimu tidak padam dan pertahankan bonus koin!'
              : '💡 Solve at least 1 question daily to keep your flame alive and earn coin bonuses!'}
          </p>
          <button
            onClick={() => setShowStreakModal(false)}
            className="w-full mt-2 py-1 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
          >
            {language === 'id' ? 'Mengerti ✓' : 'Got it ✓'}
          </button>
        </div>
      )}
    </div>
  );
};
