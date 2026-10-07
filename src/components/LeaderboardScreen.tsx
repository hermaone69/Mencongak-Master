import React, { useState } from 'react';
import { Trophy, Medal, Flame, Globe, Sparkles, User, Edit3, Check, Users, Target, UserCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { getTranslation } from '../utils/translations';

export const LeaderboardScreen: React.FC = () => {
  const { 
    leaderboard, 
    playerName, 
    setPlayerName, 
    playerLevel, 
    stats,
    profiles,
    activeProfileId,
    switchProfile,
    language
  } = useGame();

  const t = getTranslation(language);

  // Set 'local_family' (Rekor HP Ini) as default view
  const [boardView, setBoardView] = useState<'local_family' | 'league'>('local_family');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(playerName);

  const filteredList = leaderboard.filter(entry => {
    if (filterCategory === 'all') return true;
    return entry.category === filterCategory;
  });

  const top3 = filteredList.slice(0, 3);
  const restList = filteredList.slice(3);

  const handleSaveName = () => {
    sounds.playTap();
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3.5 bg-slate-950 text-slate-100 select-none overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            {t.leaderboardTitle}
          </span>
          <h1 className="text-xl font-black text-white font-display">
            {boardView === 'local_family' ? t.tabThisDevice : t.tabNational}
          </h1>
        </div>

        {/* Edit Name Button */}
        {isEditingName ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              maxLength={15}
              className="w-24 px-2 py-1 text-xs bg-slate-900 border border-amber-400 rounded-lg text-white font-semibold focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="p-1.5 bg-amber-500 text-slate-950 rounded-lg cursor-pointer font-bold"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setTempName(playerName);
              setIsEditingName(true);
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition-colors bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 cursor-pointer"
          >
            <User className="w-3 h-3" />
            <span className="max-w-[75px] truncate font-semibold">{playerName}</span>
            <Edit3 className="w-3 h-3 text-slate-500" />
          </button>
        )}
      </div>

      {/* Mode Switcher: Rekor HP Ini (Default) vs Liga Juara */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-3 shadow-sm">
        <button
          onClick={() => {
            sounds.playTap();
            setBoardView('local_family');
          }}
          className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            boardView === 'local_family'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.01]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.tabThisDevice}</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setBoardView('league');
          }}
          className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            boardView === 'league'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.01]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>{t.tabNational}</span>
        </button>
      </div>

      {boardView === 'local_family' ? (
        /* Local Family / Device High Scores (DEFAULT VIEW) */
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="p-3 bg-gradient-to-r from-slate-900/95 to-slate-900/80 border border-slate-800 rounded-2xl mb-3 shadow-md">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {t.familyBoardHeading}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {t.familyBoardSubheading}
              </p>
            </div>

            <div className="space-y-2">
              {profiles
                .slice()
                .sort((a, b) => b.stats.bestBlitzScore - a.stats.bestBlitzScore)
                .map((p, index) => {
                  const isActive = p.id === activeProfileId;
                  const pLevel = Math.max(1, Math.floor(Math.sqrt(p.xp / 20)));

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all shadow-md ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900/90 border-amber-500/60 ring-1 ring-amber-500/30'
                          : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                          index === 0
                            ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 ring-2 ring-amber-400/40'
                            : index === 1
                            ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950'
                            : index === 2
                            ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {index === 0 ? '👑' : index + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-sm text-white">
                              {p.name}
                            </h4>
                            <span className="text-[10px] bg-amber-400/15 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                              Lv.{pLevel}
                            </span>
                            {isActive && (
                              <span className="text-[9px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
                                <UserCheck className="w-2.5 h-2.5" /> {t.currentlyActive}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">
                            {p.stats.totalQuestionsAnswered} {t.questions} · {p.coins} {t.coins} · {t.accuracy} {p.stats.totalQuestionsAnswered > 0 ? Math.round((p.stats.totalCorrect / p.stats.totalQuestionsAnswered) * 100) : 100}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono-math font-black text-amber-300 text-base">
                          {p.stats.bestBlitzScore} pts
                        </div>
                        {!isActive ? (
                          <button
                            onClick={() => switchProfile(p.id)}
                            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 hover:underline cursor-pointer transition-colors mt-0.5"
                          >
                            {t.selectThisProfile}
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            {t.yourProfileBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        /* National Benchmark League */
        <>
          {/* Category Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-2">
            {[
              { id: 'all', label: t.filterAll },
              { id: 'sd_awal', label: t.filterSd13 },
              { id: 'sd_lanjut', label: t.filterSd46 },
              { id: 'smp', label: t.filterSmpPro }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playTap();
                  setFilterCategory(cat.id);
                }}
                className={`py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-slate-800 text-amber-300 shadow-sm border border-amber-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Podium Top 3 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-2 my-2 items-end">
              {/* Rank 2 (Silver) */}
              {top3[1] && (
                <div className="bg-slate-900/90 border border-slate-700/60 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-lg order-1">
                  <div className="w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center -mt-5 mb-1 shadow-md border-2 border-slate-900">
                    2
                  </div>
                  <div className="text-2xl mb-1">{top3[1].avatar}</div>
                  <span className="text-xs font-bold text-slate-200 truncate w-full">
                    {top3[1].name}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate w-full">
                    {top3[1].country}
                  </span>
                  <div className="mt-1 text-xs font-extrabold text-amber-300 font-mono-math">
                    {top3[1].score} pts
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {top3[0] && (
                <div className="bg-gradient-to-b from-amber-500/20 to-slate-900 border border-amber-500/40 rounded-2xl p-3 flex flex-col items-center text-center shadow-xl order-2 relative scale-105 z-10">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center -mt-6 mb-1 shadow-md border-2 border-slate-900">
                    👑
                  </div>
                  <div className="text-3xl mb-1">{top3[0].avatar}</div>
                  <span className="text-xs font-black text-white truncate w-full">
                    {top3[0].name}
                  </span>
                  <span className="text-[10px] text-amber-400/80 truncate w-full">
                    {top3[0].country}
                  </span>
                  <div className="mt-1 text-sm font-black text-amber-400 font-mono-math">
                    {top3[0].score} pts
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {top3[2] && (
                <div className="bg-slate-900/90 border border-slate-700/60 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-lg order-3">
                  <div className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center -mt-5 mb-1 shadow-md border-2 border-slate-900">
                    3
                  </div>
                  <div className="text-2xl mb-1">{top3[2].avatar}</div>
                  <span className="text-xs font-bold text-slate-200 truncate w-full">
                    {top3[2].name}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate w-full">
                    {top3[2].country}
                  </span>
                  <div className="mt-1 text-xs font-extrabold text-amber-300 font-mono-math">
                    {top3[2].score} pts
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ranked List for Remaining */}
          <div className="space-y-1.5 mt-1 flex-1">
            {restList.map((entry, idx) => {
              const actualRank = idx + 4;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    entry.isCurrentUser
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono-math font-bold text-xs text-slate-400 w-5 text-center">
                      #{actualRank}
                    </span>
                    <span className="text-xl">{entry.avatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate max-w-[110px]">
                          {entry.name}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded">
                            {t.youBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>{entry.country}</span>
                        <span>·</span>
                        <span>Lv.{entry.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-math font-bold text-amber-400 text-xs">
                      {entry.score} pts
                    </div>
                    <div className="text-[10px] text-orange-400 flex items-center justify-end gap-0.5">
                      <Flame className="w-2.5 h-2.5" />
                      <span>{entry.streak}x</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
