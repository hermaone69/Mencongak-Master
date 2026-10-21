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
    language,
    themeMode
  } = useGame();

  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';
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
    <div className={`flex-1 flex flex-col p-3.5 ${
      isLight ? 'bg-slate-50 text-slate-900' : isNeon ? 'bg-[#021411] text-emerald-100' : 'bg-slate-950 text-slate-100'
    } select-none overflow-y-auto relative transition-colors duration-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
            {t.leaderboardTitle}
          </span>
          <h1 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>
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
              className={`w-24 px-2 py-1 text-xs ${
                isLight ? 'bg-white border-2 border-amber-400 text-slate-900 font-bold' : 'bg-slate-900 border border-amber-400 text-white font-semibold'
              } rounded-lg focus:outline-none`}
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
            className={`flex items-center gap-1 text-[11px] ${
              isLight ? 'bg-white border-2 border-slate-200 text-slate-800 shadow-xs hover:border-amber-300' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400'
            } px-2 py-1 rounded-xl cursor-pointer transition-colors`}
          >
            <User className="w-3 h-3 text-amber-500" />
            <span className="max-w-[75px] truncate font-bold">{playerName}</span>
            <Edit3 className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>

      {/* Mode Switcher: Rekor HP Ini (Default) vs Liga Juara */}
      <div className={`grid grid-cols-2 gap-1 p-1 ${
        isLight ? 'bg-slate-200/80 border border-slate-300' : 'bg-slate-900 border border-slate-800'
      } rounded-2xl mb-3 shadow-sm`}>
        <button
          onClick={() => {
            sounds.playTap();
            setBoardView('local_family');
          }}
          className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            boardView === 'local_family'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.01]'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
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
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
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
            <div className={`p-3 ${
              isLight ? 'bg-white border-2 border-slate-200 text-slate-900' : 'bg-gradient-to-r from-slate-900/95 to-slate-900/80 border border-slate-800 text-white'
            } rounded-2xl mb-3 shadow-md`}>
              <h3 className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                {t.familyBoardHeading}
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'} mt-0.5 leading-snug`}>
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
                          ? isLight ? 'bg-amber-100/90 border-2 border-amber-400 ring-2 ring-amber-300/60 shadow-md' : 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900/90 border-amber-500/60 ring-1 ring-amber-500/30'
                          : isLight ? 'bg-white border-2 border-slate-200/80 hover:border-amber-300' : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
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
                            : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {index === 0 ? '👑' : index + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {p.name}
                            </h4>
                            <span className={`text-[10px] ${
                              isLight ? 'bg-amber-200 border border-amber-300 text-amber-950 font-black' : 'bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold'
                            } px-1.5 py-0.2 rounded`}>
                              Lv.{pLevel}
                            </span>
                            {isActive && (
                              <span className="text-[9px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
                                <UserCheck className="w-2.5 h-2.5" /> {t.currentlyActive}
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'} mt-0.5 block`}>
                            {p.stats.totalQuestionsAnswered} {t.questions} · {p.coins} {t.coins} · {t.accuracy} {p.stats.totalQuestionsAnswered > 0 ? Math.round((p.stats.totalCorrect / p.stats.totalQuestionsAnswered) * 100) : 100}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-mono-math font-black ${isLight ? 'text-amber-600' : 'text-amber-300'} text-base`}>
                          {p.stats.bestBlitzScore} pts
                        </div>
                        {!isActive ? (
                          <button
                            onClick={() => switchProfile(p.id)}
                            className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer transition-colors mt-0.5"
                          >
                            {t.selectThisProfile}
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold">
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
          <div className={`grid grid-cols-4 gap-1 p-1 ${
            isLight ? 'bg-slate-200/80 border border-slate-300' : 'bg-slate-900/90 border border-slate-800'
          } rounded-xl mb-2`}>
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
                className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? isLight ? 'bg-white text-slate-900 shadow-sm border border-amber-400 font-extrabold' : 'bg-slate-800 text-amber-300 shadow-sm border border-amber-400/40'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
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
                <div className={`${
                  isLight ? 'bg-white border-2 border-slate-200 text-slate-900' : 'bg-slate-900/90 border border-slate-700/60 text-slate-100'
                } rounded-2xl p-2.5 flex flex-col items-center text-center shadow-lg order-1`}>
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center -mt-5 mb-1 shadow-md border-2 border-slate-200">
                    2
                  </div>
                  <div className="text-2xl mb-1">{top3[1].avatar}</div>
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'} truncate w-full`}>
                    {top3[1].name}
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-500'} truncate w-full`}>
                    {top3[1].country}
                  </span>
                  <div className="mt-1 text-xs font-extrabold text-amber-500 font-mono-math">
                    {top3[1].score} pts
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {top3[0] && (
                <div className={`${
                  isLight ? 'bg-gradient-to-b from-amber-100 via-amber-50 to-white border-2 border-amber-400 text-slate-900' : 'bg-gradient-to-b from-amber-500/20 to-slate-900 border border-amber-500/40 text-slate-100'
                } rounded-2xl p-3 flex flex-col items-center text-center shadow-xl order-2 relative scale-105 z-10`}>
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center -mt-6 mb-1 shadow-md border-2 border-amber-300">
                    👑
                  </div>
                  <div className="text-3xl mb-1">{top3[0].avatar}</div>
                  <span className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'} truncate w-full`}>
                    {top3[0].name}
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-amber-800 font-bold' : 'text-amber-400/80'} truncate w-full`}>
                    {top3[0].country}
                  </span>
                  <div className="mt-1 text-sm font-black text-amber-500 font-mono-math">
                    {top3[0].score} pts
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {top3[2] && (
                <div className={`${
                  isLight ? 'bg-white border-2 border-slate-200 text-slate-900' : 'bg-slate-900/90 border border-slate-700/60 text-slate-100'
                } rounded-2xl p-2.5 flex flex-col items-center text-center shadow-lg order-3`}>
                  <div className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center -mt-5 mb-1 shadow-md border-2 border-slate-200">
                    3
                  </div>
                  <div className="text-2xl mb-1">{top3[2].avatar}</div>
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'} truncate w-full`}>
                    {top3[2].name}
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-500'} truncate w-full`}>
                    {top3[2].country}
                  </span>
                  <div className="mt-1 text-xs font-extrabold text-amber-500 font-mono-math">
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
                      ? isLight ? 'bg-amber-100/90 border-2 border-amber-400 shadow-sm' : 'bg-amber-500/15 border-amber-500/50 shadow-sm'
                      : isLight ? 'bg-white border-slate-200 text-slate-900 shadow-xs' : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`font-mono-math font-bold text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} w-5 text-center`}>
                      #{actualRank}
                    </span>
                    <span className="text-xl">{entry.avatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'} truncate max-w-[110px]`}>
                          {entry.name}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded">
                            {t.youBadge}
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'} flex items-center gap-1`}>
                        <span>{entry.country}</span>
                        <span>·</span>
                        <span>Lv.{entry.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-math font-bold text-amber-500 text-xs">
                      {entry.score} pts
                    </div>
                    <div className="text-[10px] text-orange-500 font-bold flex items-center justify-end gap-0.5">
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
