import React, { useState } from 'react';
import { X, User, Trophy, Flame, Zap, Award, Edit3, Check, RotateCcw, Users, Plus, UserCheck, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { getTranslation, getLocalizedAchievement } from '../utils/translations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenCertificate
}) => {
  const { 
    playerName, 
    setPlayerName, 
    playerLevel, 
    playerTitle, 
    xp, 
    xpToNextLevel, 
    coins, 
    stats, 
    achievements, 
    isVip,
    resetAllProgress,
    profiles,
    activeProfileId,
    switchProfile,
    createProfile,
    deleteProfile,
    language
  } = useGame();

  const t = getTranslation(language);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(playerName);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showAddPlayerInput, setShowAddPlayerInput] = useState<boolean>(false);
  const [newPlayerInput, setNewPlayerInput] = useState<string>('');

  if (!isOpen) return null;

  const handleSaveName = () => {
    sounds.playTap();
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setIsEditing(false);
    }
  };

  const handleAddNewProfile = () => {
    sounds.playTap();
    const clean = newPlayerInput.trim();
    if (!clean) return;

    createProfile(clean);
    setNameInput(clean);
    setNewPlayerInput('');
    setShowAddPlayerInput(false);
  };

  const accuracy = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100)
    : 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              {language === 'id' ? 'Profil & Multi-Pemain' : 'Player Profile & Multi-Users'}
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Avatar & Player Name */}
          <div className="flex items-center gap-3.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
                {isVip ? '👑' : '😎'}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    maxLength={18}
                    className="px-2.5 py-1 text-xs bg-slate-900 border border-amber-400 rounded-lg text-white font-bold focus:outline-none w-full"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-amber-500 text-slate-950 rounded-lg font-bold"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-white truncate">
                        {playerName}
                      </h4>
                      {isVip && (
                        <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md shadow-sm">
                          VIP PRO
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-amber-400 font-semibold">
                      {playerTitle} · Lv.{playerLevel}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setNameInput(playerName);
                      setIsEditing(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="text-[10px] text-slate-500 mt-1">
                {xp} Total XP · {coins} {t.coins}
              </div>
            </div>
          </div>

          {/* Family Profiles Multi-Player Switcher */}
          <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> {language === 'id' ? 'Profil Pemain di HP Ini:' : 'Profiles On This Device:'}
              </span>
              <button
                onClick={() => setShowAddPlayerInput(prev => !prev)}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30"
              >
                <Plus className="w-3 h-3" /> {language === 'id' ? 'Tambah Profil' : 'Add Profile'}
              </button>
            </div>

            {/* Quick add form */}
            {showAddPlayerInput && (
              <div className="flex items-center gap-1.5 pt-1 animate-in fade-in">
                <input
                  type="text"
                  value={newPlayerInput}
                  onChange={e => setNewPlayerInput(e.target.value)}
                  placeholder={language === 'id' ? 'Nama (misal: Alex)' : 'Name (e.g. Alex)'}
                  maxLength={18}
                  className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-amber-400 focus:outline-none"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddNewProfile();
                  }}
                />
                <button
                  onClick={handleAddNewProfile}
                  className="px-3 py-1 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold cursor-pointer hover:bg-amber-400"
                >
                  {t.save}
                </button>
              </div>
            )}

            {/* Profiles Badges / Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {profiles.map(p => {
                const isActive = p.id === activeProfileId;
                const pLevel = Math.max(1, Math.floor(Math.sqrt(p.xp / 20)));

                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <button
                      onClick={() => switchProfile(p.id)}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {isActive ? <UserCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{p.name}</span>
                      <span className={`text-[9px] px-1 rounded ${isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'text-slate-500'}`}>
                        Lv.{pLevel}
                      </span>
                    </button>

                    {profiles.length > 1 && (
                      <button
                        onClick={() => deleteProfile(p.id)}
                        className={`p-1 rounded hover:bg-rose-500 hover:text-white transition-colors cursor-pointer ${
                          isActive ? 'text-slate-950/60' : 'text-slate-500'
                        }`}
                        title={language === 'id' ? 'Hapus profil ini' : 'Delete profile'}
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              💡 {language === 'id' 
                ? 'Level, XP, akurasi, dan riwayat belajar tersimpan otomatis & mandiri untuk masing-masing anak.'
                : 'Levels, XP, accuracy, and records are automatically saved independently for each player.'}
            </p>
          </div>

          {/* Stats Summary Grid (Menyesuaikan dengan profil aktif) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">{t.accuracy}</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono-math">
                {accuracy}%
              </div>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">{t.bestStreak}</div>
              <div className="text-base font-extrabold text-orange-400 font-mono-math">
                {stats.highestStreak}x 🔥
              </div>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">{t.questions}</div>
              <div className="text-base font-extrabold text-sky-400 font-mono-math">
                {stats.totalQuestionsAnswered}
              </div>
            </div>
          </div>

          {/* Achievements Badges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> {language === 'id' ? `Lencana Pencapaian (${playerName})` : `Achievements (${playerName})`}
              </h4>
              <span className="text-[10px] text-slate-500">
                {achievements.filter(a => a.unlocked).length} / {achievements.length}
              </span>
            </div>

            <div className="space-y-2">
              {achievements.map(ach => {
                const localized = getLocalizedAchievement(ach.id, language);
                return (
                  <div
                    key={ach.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      ach.unlocked
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{ach.icon}</span>
                      <div>
                        <h5 className="font-bold text-xs text-white">
                          {localized.title || ach.title}
                        </h5>
                        <p className="text-[10px] text-slate-400">
                          {localized.description || ach.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {ach.unlocked ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                          {language === 'id' ? 'Selesai ✓' : 'Done ✓'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-mono-math">
                          {ach.progress}/{ach.maxProgress}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate Button */}
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
              onOpenCertificate();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{language === 'id' ? 'Buka E-Sertifikat Prestasi Mencongak' : 'Open Achievement E-Certificate'}</span>
          </button>

          {/* Danger zone / Reset */}
          <div className="pt-2">
            {showResetConfirm ? (
              <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-center space-y-2">
                <p className="text-[11px] text-rose-300">
                  {language === 'id' ? 'Apakah Anda yakin ingin mereset semua skor & koin?' : 'Are you sure you want to reset all scores & coins?'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      resetAllProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                  >
                    {language === 'id' ? 'Ya, Reset' : 'Yes, Reset'}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full text-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                {language === 'id' ? 'Reset Semua Data & Skor' : 'Reset All Progress & Scores'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
