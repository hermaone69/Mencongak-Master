import React, { useState } from 'react';
import { Zap, Coins, Flame, Award, Settings, User, Sparkles, Globe, Sun, Moon, Palette } from 'lucide-react';
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
    setLanguage,
    themeMode,
    toggleThemeMode
  } = useGame();
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const t = getTranslation(language);

  const currentLevelMinXp = (playerLevel - 1) * (playerLevel - 1) * 20;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.floor(((xp - currentLevelMinXp) / (xpToNextLevel - currentLevelMinXp || 1)) * 100))
  );

  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';

  return (
    <div className={`w-full ${
      isLight 
        ? 'bg-white/95 backdrop-blur-md border-b border-amber-200/80 text-slate-800 shadow-xs' 
        : isNeon
        ? 'bg-[#031d17]/95 backdrop-blur-md border-b border-emerald-500/40 text-emerald-100 shadow-xs'
        : 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 text-slate-100'
    } px-2 sm:px-3 py-2 pt-safe flex items-center justify-between shrink-0 z-30 select-none relative transition-colors duration-200`}>
      {/* Player Profile & Level */}
      <button
        onClick={() => {
          sounds.playTap();
          onOpenProfile();
        }}
        className="flex items-center gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity text-left cursor-pointer shrink-0"
      >
        <div className="relative shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-sm">
            <div className={`w-full h-full ${
              isLight ? 'bg-white' : isNeon ? 'bg-[#031d17]' : 'bg-slate-900'
            } rounded-[10px] flex items-center justify-center text-sm sm:text-base font-bold`}>
              {isVip ? '👑' : '😎'}
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[8px] sm:text-[9px] px-1 rounded-full border border-slate-900">
            Lv{playerLevel}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`text-[11px] sm:text-xs font-black ${
              isLight ? 'text-slate-900' : isNeon ? 'text-emerald-100' : 'text-white'
            } max-w-[65px] xs:max-w-[85px] sm:max-w-[110px] truncate`}>
              {playerName}
            </span>
            {isVip && (
              <span className="text-[7px] sm:text-[8px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1 sm:px-1.5 py-0.2 rounded-md shadow-sm shrink-0">
                VIP
              </span>
            )}
            <span className="text-[9px] text-amber-500 font-bold opacity-80 shrink-0">▾</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className={`w-9 xs:w-11 sm:w-14 h-1.5 ${
              isLight ? 'bg-slate-200' : isNeon ? 'bg-[#021411]' : 'bg-slate-800'
            } rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={`text-[8px] sm:text-[9px] ${
              isLight ? 'text-amber-800 font-extrabold' : isNeon ? 'text-emerald-300 font-bold' : 'text-amber-400/90 font-medium'
            }`}>
              {progressPercent}%
            </span>
          </div>
        </div>
      </button>

      {/* Stats & Theme Switcher Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Playful Theme Switcher Button */}
        <button
          onClick={() => {
            toggleThemeMode();
          }}
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 ${
            isLight
              ? 'bg-amber-100 hover:bg-amber-200/80 border-2 border-amber-300 text-amber-950'
              : themeMode === 'neon'
              ? 'bg-emerald-950/90 hover:bg-emerald-900/90 border-2 border-emerald-400 text-emerald-200'
              : 'bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100'
          } rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs shrink-0`}
          title={t.themeToggleTooltip}
        >
          {themeMode === 'light' ? (
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-spin-slow shrink-0" />
          ) : themeMode === 'neon' ? (
            <Palette className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-sky-400 fill-sky-400 shrink-0" />
          )}
          <span className="hidden sm:inline font-bold text-[10px]">
            {themeMode === 'light' ? 'Terang' : themeMode === 'neon' ? 'Neon' : 'Gelap'}
          </span>
        </button>

        {/* Language Switcher Button */}
        <button
          onClick={() => {
            setLanguage(language === 'id' ? 'en' : 'id');
          }}
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 ${
            isLight
              ? 'bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900'
              : 'bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white'
          } rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-xs shrink-0`}
          title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <Globe className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="text-[10px]">{language === 'id' ? 'ID' : 'EN'}</span>
        </button>

        {/* Daily Streak Counter with Info Modal Trigger */}
        <button
          onClick={() => {
            sounds.playTap();
            setShowStreakModal(prev => !prev);
          }}
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 ${
            isLight
              ? 'bg-orange-100 hover:bg-orange-200/80 border border-orange-300 text-orange-950'
              : 'bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300'
          } rounded-xl transition-colors cursor-pointer shrink-0`}
          title="Daily Streak"
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold font-mono-math whitespace-nowrap">
            {stats.dailyStreak} {language === 'id' ? 'Hari' : 'd'}
          </span>
        </button>

        {/* Coins Button (Triggers Shop) */}
        <button
          onClick={() => {
            sounds.playTap();
            onOpenShop();
          }}
          className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 ${
            isLight
              ? 'bg-amber-100 hover:bg-amber-200/80 border border-amber-300 text-amber-950'
              : 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300'
          } rounded-xl transition-colors cursor-pointer shrink-0`}
          title={language === 'id' ? 'Toko Koin & VIP' : 'Shop'}
        >
          <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold font-mono-math whitespace-nowrap">
            {coins}
          </span>
        </button>
      </div>

      {/* Daily Streak Explanation Popover */}
      {showStreakModal && (
        <div className={`absolute top-12 right-6 sm:right-12 z-50 w-64 ${
          isLight 
            ? 'bg-white border-2 border-orange-300 shadow-2xl text-slate-900' 
            : 'bg-slate-900 border border-orange-500/40 shadow-2xl text-slate-100'
        } rounded-2xl p-3.5 animate-in fade-in zoom-in-95`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">🔥</span>
            <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {language === 'id' ? `Rekor Api Latihan (${stats.dailyStreak} Hari)` : `Daily Streak (${stats.dailyStreak} Days)`}
            </h4>
          </div>
          <p className={`text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
            {language === 'id'
              ? `Ikon api ini menandakan Daily Streak (Anda sudah rajin latihan mencongak selama ${stats.dailyStreak} hari berturut-turut).`
              : `This fire icon tracks your Daily Streak (${stats.dailyStreak} consecutive days of mental math training).`}
          </p>
          <p className={`text-[10px] ${isLight ? 'text-orange-700 font-bold' : 'text-orange-400/90 font-medium'} mt-1.5`}>
            {language === 'id'
              ? '💡 Latihan minimal 1 soal setiap hari agar nyala apimu tidak padam dan pertahankan bonus koin!'
              : '💡 Solve at least 1 question daily to keep your flame alive and earn coin bonuses!'}
          </p>
          <button
            onClick={() => setShowStreakModal(false)}
            className={`w-full mt-2 py-1 text-[11px] font-bold ${
              isLight ? 'bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            } rounded-lg cursor-pointer`}
          >
            {language === 'id' ? 'Mengerti ✓' : 'Got it ✓'}
          </button>
        </div>
      )}
    </div>
  );
};
