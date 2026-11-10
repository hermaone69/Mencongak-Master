import React, { useState } from 'react';
import { Swords, Bot, Skull, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { PirateMiniGame } from './PirateMiniGame';
import { DemonTrainMiniGame } from './DemonTrainMiniGame';
import { AiDuelGame } from './AiDuelGame';
import { getTranslation } from '../utils/translations';

export const DuelScreen: React.FC = () => {
  const { 
    language, 
    themeMode, 
    mainDifficulty, 
    mainOperations, 
    mainMaxNumber 
  } = useGame();

  const isLight = themeMode === 'light';
  const t = getTranslation(language);

  // Sub-tabs: 'demon_train' (Kereta Uap Pembasmi Iblis), 'pirate' (Bajak Laut Luffy), 'ai_duel' (Duel Lawan AI)
  const [activeSubMode, setActiveSubMode] = useState<'demon_train' | 'pirate' | 'ai_duel'>('demon_train');

  // Format active filter summary from menu Main
  const getDifficultyLabel = () => {
    switch (mainDifficulty) {
      case 'sd_awal': return 'SD 1-3';
      case 'sd_lanjut': return 'SD 4-6';
      case 'smp': return 'SMP';
      case 'sma_pro': return 'Pro 🏆';
      default: return 'SD 1-3';
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none ${
      isLight ? 'bg-sky-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* MODE SELECTOR HEADER (KERETA IBLIS vs BAJAK LAUT vs DUEL AI) */}
      <div className={`px-3 py-2 border-b ${
        isLight ? 'bg-white/60 border-amber-200/50' : 'bg-slate-950/40 border-slate-800/40'
      } flex flex-col gap-1.5 shrink-0 z-30 shadow-xs backdrop-blur-md`}>
        {/* Top Switcher 3 Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-200/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/50 backdrop-blur-md">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveSubMode('demon_train');
            }}
            className={`flex-1 py-1.5 px-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubMode === 'demon_train'
                ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-md ring-1 ring-cyan-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🗡️</span>
            <span className="truncate">{language === 'id' ? 'Kereta Iblis' : 'Demon Train'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveSubMode('pirate');
            }}
            className={`flex-1 py-1.5 px-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubMode === 'pirate'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md ring-1 ring-amber-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🏴‍☠️</span>
            <span className="truncate">{language === 'id' ? 'Bajak Laut' : 'Pirate Battle'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveSubMode('ai_duel');
            }}
            className={`flex-1 py-1.5 px-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubMode === 'ai_duel'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md ring-1 ring-sky-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="truncate">{language === 'id' ? 'Duel AI' : 'AI Duel'}</span>
          </button>
        </div>

        {/* ACTIVE MAIN MENU FILTER BADGE */}
        <div className="flex items-center justify-between text-[10px] px-1 text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <SlidersHorizontal className="w-2.5 h-2.5 text-amber-500" />
            <span className="font-bold">{language === 'id' ? 'Mengikuti Filter Menu Main:' : 'Syncing Main Menu Filter:'}</span>
          </span>

          <div className="flex items-center gap-1 font-mono-math font-bold">
            <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/30">
              {getDifficultyLabel()}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-400/30">
              {mainOperations.join(' ')}
            </span>
            {mainMaxNumber !== null && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30">
                ≤{mainMaxNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVE GAME VIEW */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeSubMode === 'demon_train' ? (
          <DemonTrainMiniGame />
        ) : activeSubMode === 'pirate' ? (
          <PirateMiniGame />
        ) : (
          <AiDuelGame />
        )}
      </div>
    </div>
  );
};
