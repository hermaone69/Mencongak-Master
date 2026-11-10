import React, { useState, useEffect } from 'react';
import { X, User, Trophy, Flame, Zap, Award, Edit3, Check, RotateCcw, Users, Plus, UserCheck, Trash2, Sun, Moon, Palette, Keyboard, CheckSquare, Clock, History, CheckCircle2, XCircle, Code, Copy, Download, ExternalLink, HelpCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { getTranslation, getLocalizedAchievement } from '../utils/translations';
import { QuestionHistoryItem } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  initialTab?: 'profile' | 'history' | 'gas';
  onClose: () => void;
  onOpenCertificate: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  initialTab = 'profile',
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
    language,
    themeMode,
    setThemeMode,
    defaultInputMode,
    setDefaultInputMode,
    questionHistory,
    clearQuestionHistory
  } = useGame();

  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';
  const t = getTranslation(language);

  const [activeModalTab, setActiveModalTab] = useState<'profile' | 'history' | 'gas'>(initialTab);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'correct' | 'wrong'>('all');
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState<boolean>(false);
  const [copiedGasFile, setCopiedGasFile] = useState<'code' | 'index' | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(playerName);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showAddPlayerInput, setShowAddPlayerInput] = useState<boolean>(false);
  const [newPlayerInput, setNewPlayerInput] = useState<string>('');

  // Sync tab when opened with initialTab prop
  useEffect(() => {
    if (isOpen) {
      setActiveModalTab(initialTab || 'profile');
      setShowClearHistoryConfirm(false);
      setNameInput(playerName);
    }
  }, [isOpen, initialTab, playerName]);

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

  // Stats calculation
  const totalHistory = questionHistory.length;
  const correctHistoryCount = questionHistory.filter(q => q.isCorrect).length;
  const wrongHistoryCount = totalHistory - correctHistoryCount;
  const historyAccuracy = totalHistory > 0 ? Math.round((correctHistoryCount / totalHistory) * 100) : 100;

  const filteredHistory = questionHistory.filter(q => {
    if (historyFilter === 'correct') return q.isCorrect;
    if (historyFilter === 'wrong') return !q.isCorrect;
    return true;
  });

  const accuracy = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100)
    : 100;

  // Format timestamp relative
  const formatTimeAgo = (timestamp: string | number) => {
    const timeMs = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
    if (isNaN(timeMs)) return '';
    const diffSeconds = Math.floor((Date.now() - timeMs) / 1000);
    if (diffSeconds < 60) return language === 'id' ? 'Baru saja' : 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} ${language === 'id' ? 'menit lalu' : 'mins ago'}`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} ${language === 'id' ? 'jam lalu' : 'hours ago'}`;
    const date = new Date(timeMs);
    return `${date.getDate()}/${date.getMonth() + 1} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Mode badge helper
  const getModeLabel = (mode?: string) => {
    switch (mode) {
      case 'demon_train_mini_game': return { label: 'Kereta Iblis', emoji: '🗡️' };
      case 'pirate_mini_game': return { label: 'Bajak Laut', emoji: '🏴‍☠️' };
      case 'audio': return { label: 'Dikte Suara', emoji: '🎧' };
      case 'survival': return { label: 'Bertahan', emoji: '🛡️' };
      case 'daily': return { label: 'Misi Harian', emoji: '📅' };
      case 'focus': return { label: 'Fokus Angka', emoji: '🎯' };
      case 'sprint': return { label: 'Sprint', emoji: '⏱️' };
      case 'blitz': return { label: 'Kilat 60s', emoji: '⚡' };
      default: return { label: 'Latihan', emoji: '✏️' };
    }
  };

  // Google Apps Script source code
  const codeGsSource = `/**
 * Mencongak Master Pro - Google Apps Script Backend
 * File: Code.gs
 * Versi: 3.1 (Fitur: Total Revamp Karakter Bajak Laut Chibi Anime SVG: Kapten Luffy & 5 Wave Musuh Samudera [Gurita Kurotako, Manusia Hiu Arlong, Bajak Laut Hantu Skeleton, Golem Karang, Boss Naga Leviathan], Pukulan Melar Gomu-Gomu, Arena Terbuka Dek Geladak Kapal, Animasi Berkedip Merah & Screen Shake)
 * Diperbarui otomatis untuk deployment Web App GAS
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Mencongak Master Pro - Latihan Hitung Cepat Mental & Mini Game Bajak Laut vs Monster Samudera')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Endpoint pencatatan riwayat belajar & skor Buronan / Skor Pembasmi ke Google Sheets
 */
function simpanRiwayatKeSheet(profileName, questionData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Mencongak Master - Database');
    var sheet = ss.getSheetByName('Riwayat_Soal');
    if (!sheet) {
      sheet = ss.insertSheet('Riwayat_Soal');
      sheet.appendRow(['Waktu', 'Nama Profil', 'Soal', 'Jawaban Pemain', 'Kunci Jawaban', 'Status', 'Waktu (dtk)', 'Mode']);
    }
    sheet.appendRow([
      new Date(),
      profileName,
      questionData.questionText || questionData.question,
      questionData.userAnswer,
      questionData.correctAnswer,
      questionData.isCorrect ? 'BENAR' : 'SALAH',
      questionData.responseTimeSec || 0,
      questionData.mode || 'Latihan'
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Endpoint opsional untuk membaca leaderboard skor buronan bajak laut / pembasmi iblis
 */
function getTopBounties() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return [];
    var sheet = ss.getSheetByName('Riwayat_Soal');
    if (!sheet) return [];
    return { success: true };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}`;

  const indexHtmlSource = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>Mencongak Master Pro - Latihan Hitung Cepat Mental</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Inter & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #020617;
      color: #f8fafc;
      overflow-x: hidden;
      touch-action: manipulation;
    }
    .font-mono-math {
      font-family: 'JetBrains Mono', monospace;
    }
    /* Mencegah zoom ganda di perangkat touch */
    input, button, select, textarea {
      font-size: 16px;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col justify-center items-center">
  <div id="root" class="w-full h-full min-h-screen flex flex-col">
    <!-- Embedded Container: Aplikasi Mencongak Master Pro berjalan lancar di iFrame Google Apps Script -->
    <iframe 
      id="mencongak-app-frame" 
      src="https://${window.location.host}" 
      class="w-full flex-1 border-0 min-h-screen" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>

  <script>
    console.log("Mencongak Master Pro GAS Web App v3.0 initialized with Mobile Native Keyboard Prevention & Touch Numpad.");
  </script>
</body>
</html>`;

  const copyToClipboard = (text: string, type: 'code' | 'index') => {
    sounds.playTap();
    navigator.clipboard.writeText(text);
    setCopiedGasFile(type);
    setTimeout(() => setCopiedGasFile(null), 2500);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isLight ? 'bg-slate-900/40' : 'bg-slate-950/85'} backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150`}>
      <div className={`w-full max-w-md ${
        isLight ? 'bg-white border-2 border-amber-200 text-slate-900' : 'bg-slate-900 border border-slate-700/90 text-slate-100'
      } rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]`}>
        {/* Header */}
        <div className={`px-4 sm:px-5 py-3 border-b ${isLight ? 'border-slate-200 bg-amber-50/50' : 'border-slate-800 bg-slate-900'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {language === 'id' ? 'Profil & Statistik Belajar' : 'Player Profile & Learning Stats'}
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className={`p-1.5 rounded-xl ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation: Profil vs Riwayat Soal vs Export GAS */}
        <div className={`flex border-b ${isLight ? 'border-slate-200 bg-slate-100/70' : 'border-slate-800 bg-slate-950/50'} p-1 gap-1 text-xs font-bold`}>
          <button
            onClick={() => {
              sounds.playTap();
              setActiveModalTab('profile');
            }}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeModalTab === 'profile'
                ? isLight
                  ? 'bg-white text-amber-900 shadow-sm border border-amber-300 font-black'
                  : 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700 font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.profileTabLabel}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveModalTab('history');
            }}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeModalTab === 'history'
                ? isLight
                  ? 'bg-white text-amber-900 shadow-sm border border-amber-300 font-black'
                  : 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700 font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.historyTabLabel}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeModalTab === 'history'
                ? 'bg-amber-500 text-slate-950'
                : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
            }`}>
              {questionHistory.length}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveModalTab('gas');
            }}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeModalTab === 'gas'
                ? isLight
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-300 font-black'
                  : 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700 font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Export Code GAS (Google Apps Script)"
          >
            <Code className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Export GAS</span>
            <span className="sm:hidden">GAS</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PROFIL & AKUN */}
          {activeModalTab === 'profile' && (
            <>
              {/* Avatar & Player Name */}
              <div className={`flex items-center gap-3.5 ${
                isLight ? 'bg-amber-50/80 border-2 border-amber-200 text-slate-900' : 'bg-slate-950/80 border border-slate-800 text-white'
              } p-3.5 rounded-2xl`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-md shrink-0">
                  <div className={`w-full h-full ${isLight ? 'bg-white' : 'bg-slate-900'} rounded-[14px] flex items-center justify-center text-2xl`}>
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
                        className={`px-2.5 py-1 text-xs ${
                          isLight ? 'bg-white border-2 border-amber-400 text-slate-900' : 'bg-slate-900 border border-amber-400 text-white'
                        } rounded-lg font-bold focus:outline-none w-full`}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1.5 bg-amber-500 text-slate-950 rounded-lg font-bold cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`font-black text-sm ${isLight ? 'text-slate-900' : 'text-white'} truncate`}>
                            {playerName}
                          </h4>
                          {isVip && (
                            <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md shadow-sm">
                              VIP PRO
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-amber-600 font-bold">
                          {playerTitle} · Lv.{playerLevel}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setNameInput(playerName);
                          setIsEditing(true);
                        }}
                        className={`p-1.5 ${isLight ? 'text-slate-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'} transition-colors cursor-pointer`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className={`text-[10px] ${isLight ? 'text-slate-600' : isNeon ? 'text-emerald-300' : 'text-slate-400'} mt-1 font-medium`}>
                    {xp} Total XP · {coins} {t.coins}
                  </div>
                </div>
              </div>

              {/* Theme Selection Section */}
              <div className={`${
                isLight
                  ? 'bg-white border-2 border-slate-200 text-slate-900 shadow-sm'
                  : isNeon
                  ? 'bg-[#04241d]/90 border border-emerald-500/40 text-emerald-100 shadow-lg'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-100'
              } p-3 rounded-2xl space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${
                    isLight ? 'text-slate-900 font-extrabold' : isNeon ? 'text-emerald-300 font-bold' : 'text-slate-200'
                  } flex items-center gap-1.5`}>
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'id' ? 'Pilih Tema Tampilan:' : 'App Theme:'}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isLight
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : isNeon
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {themeMode === 'light' ? 'Mode Terang' : themeMode === 'neon' ? 'Mode Neon' : 'Mode Gelap'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'dark', label: 'Gelap', icon: Moon, desc: 'Midnight Arcade' },
                    { id: 'light', label: 'Terang', icon: Sun, desc: 'Clean Paper' },
                    { id: 'neon', label: 'Neon', icon: Palette, desc: 'Cyber Glow' }
                  ].map(theme => {
                    const Icon = theme.icon;
                    const isSelected = themeMode === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setThemeMode(theme.id as any)}
                        className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? isLight
                              ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-sm ring-1 ring-amber-400/50'
                              : isNeon
                              ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-400/40'
                              : 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                            : isLight
                            ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                            : isNeon
                            ? 'bg-[#021411] border border-emerald-500/30 text-emerald-400/70 hover:text-emerald-200'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold leading-tight">{theme.label}</span>
                        <span className="text-[8px] opacity-70 mt-0.5">{theme.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Opsi Pengaturan Jawaban: Pilihan Ganda vs Ketik Sendiri */}
              <div className={`${
                isLight
                  ? 'bg-white border-2 border-slate-200 text-slate-900 shadow-sm'
                  : isNeon
                  ? 'bg-[#04241d]/90 border border-emerald-500/40 text-emerald-100 shadow-lg'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-100'
              } p-3 rounded-2xl space-y-2`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-[11px] font-bold ${
                      isLight ? 'text-slate-900 font-extrabold' : isNeon ? 'text-emerald-300 font-bold' : 'text-slate-200'
                    } flex items-center gap-1.5`}>
                      <Keyboard className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t.answerInputModeTitle}</span>
                    </span>
                    <p className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'} mt-0.5`}>
                      {t.answerInputModeSubtitle}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    isLight
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : isNeon
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {defaultInputMode === 'options' ? (language === 'id' ? '🔘 4 Pilihan' : '🔘 Options') : (language === 'id' ? '⌨️ Numpad' : '⌨️ Keypad')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Option 1: Pilihan Ganda (4 Opsi) */}
                  <button
                    onClick={() => setDefaultInputMode('options')}
                    className={`p-2.5 rounded-xl border flex flex-col items-start text-left transition-all cursor-pointer ${
                      defaultInputMode === 'options'
                        ? isLight
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-sm ring-1 ring-amber-400/50'
                          : isNeon
                          ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-400/40'
                          : 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                        : isNeon
                        ? 'bg-[#021411] border border-emerald-500/30 text-emerald-400/70 hover:text-emerald-200'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full mb-1">
                      <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-xs font-bold leading-tight">{t.inputModeOptionsTitle}</span>
                      {defaultInputMode === 'options' && (
                        <span className="ml-auto text-[9px] bg-amber-500 text-slate-950 px-1 rounded font-black">✓</span>
                      )}
                    </div>
                    <span className={`text-[9px] ${
                      defaultInputMode === 'options' 
                        ? isLight ? 'text-amber-900' : 'text-amber-200/90' 
                        : isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {t.inputModeOptionsSubtitle}
                    </span>
                  </button>

                  {/* Option 2: Ketik Sendiri (Numpad) */}
                  <button
                    onClick={() => setDefaultInputMode('keypad')}
                    className={`p-2.5 rounded-xl border flex flex-col items-start text-left transition-all cursor-pointer ${
                      defaultInputMode === 'keypad'
                        ? isLight
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-sm ring-1 ring-amber-400/50'
                          : isNeon
                          ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-400/40'
                          : 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                        : isNeon
                        ? 'bg-[#021411] border border-emerald-500/30 text-emerald-400/70 hover:text-emerald-200'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full mb-1">
                      <Keyboard className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-xs font-bold leading-tight">{t.inputModeKeypadTitle}</span>
                      {defaultInputMode === 'keypad' && (
                        <span className="ml-auto text-[9px] bg-amber-500 text-slate-950 px-1 rounded font-black">✓</span>
                      )}
                    </div>
                    <span className={`text-[9px] ${
                      defaultInputMode === 'keypad' 
                        ? isLight ? 'text-amber-900' : 'text-amber-200/90' 
                        : isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {t.inputModeKeypadSubtitle}
                    </span>
                  </button>
                </div>
              </div>

              {/* Family Profiles Multi-Player Switcher */}
              <div className={`${
                isLight
                  ? 'bg-white border-2 border-slate-200'
                  : isNeon
                  ? 'bg-[#04241d]/90 border border-emerald-500/40'
                  : 'bg-slate-950/90 border border-slate-800'
              } p-3 rounded-2xl space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${
                    isLight ? 'text-slate-900 font-extrabold' : isNeon ? 'text-emerald-200' : 'text-slate-300'
                  } flex items-center gap-1.5`}>
                    <Users className="w-3.5 h-3.5 text-amber-500" /> {language === 'id' ? 'Profil Pemain di HP Ini:' : 'Profiles On This Device:'}
                  </span>
                  <button
                    onClick={() => setShowAddPlayerInput(prev => !prev)}
                    className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300"
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
                      className={`flex-1 px-2.5 py-1 text-xs ${
                        isLight ? 'bg-amber-50 border-2 border-amber-300 text-slate-900' : 'bg-slate-900 border border-slate-700 text-white'
                      } rounded-xl font-medium focus:border-amber-400 focus:outline-none`}
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
                            : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <button
                          onClick={() => switchProfile(p.id)}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          {isActive ? <UserCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{p.name}</span>
                          <span className={`text-[9px] px-1 rounded ${isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : isLight ? 'text-slate-600' : 'text-slate-500'}`}>
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
                <p className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-500'} leading-tight`}>
                  💡 {language === 'id' 
                    ? 'Level, XP, akurasi, dan riwayat belajar tersimpan otomatis & mandiri untuk masing-masing anak.'
                    : 'Levels, XP, accuracy, and records are automatically saved independently for each player.'}
                </p>
              </div>

              {/* Stats Summary Grid (Menyesuaikan dengan profil aktif) */}
              <div className="grid grid-cols-3 gap-2">
                <div className={`${isLight ? 'bg-amber-50/80 border border-amber-200' : 'bg-slate-950/80 border border-slate-800'} p-2.5 rounded-xl text-center`}>
                  <div className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.accuracy}</div>
                  <div className="text-base font-extrabold text-emerald-600 font-mono-math">
                    {accuracy}%
                  </div>
                </div>
                <div className={`${isLight ? 'bg-amber-50/80 border border-amber-200' : 'bg-slate-950/80 border border-slate-800'} p-2.5 rounded-xl text-center`}>
                  <div className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.bestStreak}</div>
                  <div className="text-base font-extrabold text-orange-500 font-mono-math">
                    {stats.highestStreak}x 🔥
                  </div>
                </div>
                <div className={`${isLight ? 'bg-amber-50/80 border border-amber-200' : 'bg-slate-950/80 border border-slate-800'} p-2.5 rounded-xl text-center`}>
                  <div className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.questions}</div>
                  <div className="text-base font-extrabold text-sky-600 font-mono-math">
                    {stats.totalQuestionsAnswered}
                  </div>
                </div>
              </div>

              {/* Achievements Badges */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'} flex items-center gap-1.5`}>
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> {language === 'id' ? `Lencana Pencapaian (${playerName})` : `Achievements (${playerName})`}
                  </h4>
                  <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
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
                            ? isLight ? 'bg-amber-100/90 border-amber-300' : 'bg-amber-500/10 border-amber-500/30'
                            : isLight ? 'bg-slate-100/80 border-slate-200 opacity-80' : 'bg-slate-950/60 border-slate-800/80 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{ach.icon}</span>
                          <div>
                            <h5 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {localized.title || ach.title}
                            </h5>
                            <p className={`text-[10px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                              {localized.description || ach.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {ach.unlocked ? (
                            <span className={`text-[10px] ${isLight ? 'bg-emerald-200 text-emerald-950 font-black' : 'bg-emerald-500/20 text-emerald-300 font-bold'} px-2 py-0.5 rounded-md`}>
                              {language === 'id' ? 'Selesai ✓' : 'Done ✓'}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-mono-math font-bold">
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
                className={`w-full py-2.5 rounded-xl ${
                  isLight ? 'bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 shadow-xs' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300'
                } font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>{language === 'id' ? 'Buka E-Sertifikat Prestasi Mencongak' : 'Open Achievement E-Certificate'}</span>
              </button>

              {/* Danger zone / Reset */}
              <div className="pt-2">
                {showResetConfirm ? (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-center space-y-2">
                    <p className="text-[11px] text-rose-800 font-bold">
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
                        className="px-3 py-1 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className={`w-full text-center text-[10px] ${isLight ? 'text-slate-500 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'} transition-colors cursor-pointer font-medium`}
                  >
                    {language === 'id' ? 'Reset Semua Data & Skor' : 'Reset All Progress & Scores'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* TAB 2: RIWAYAT SOAL */}
          {activeModalTab === 'history' && (
            <div className="space-y-3.5">
              {/* Profile Switcher Chips inside History Tab */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {language === 'id' ? 'Riwayat Belajar Untuk Profil:' : 'Learning History For Profile:'}
                  </span>
                  <span className={`text-[10px] font-bold text-amber-500`}>
                    {playerName}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profiles.map(p => {
                    const isCurrent = p.id === activeProfileId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => switchProfile(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isCurrent ? <UserCheck className="w-3 h-3" /> : <User className="w-3 h-3 text-slate-400" />}
                        <span>{p.name}</span>
                        <span className="text-[9px] opacity-75">
                          ({p.questionHistory?.length || 0})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* History Scoreboard Summary Cards */}
              <div className="grid grid-cols-4 gap-1.5">
                <div className={`p-2 rounded-xl text-center border ${
                  isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div className={`text-[9px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {language === 'id' ? 'Total Soal' : 'Total'}
                  </div>
                  <div className={`text-base font-black font-mono-math ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {totalHistory}
                  </div>
                </div>

                <div className={`p-2 rounded-xl text-center border ${
                  isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/30 border-emerald-500/30'
                }`}>
                  <div className="text-[9px] text-emerald-600 font-bold flex items-center justify-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{language === 'id' ? 'Benar' : 'Correct'}</span>
                  </div>
                  <div className="text-base font-black font-mono-math text-emerald-500">
                    {correctHistoryCount}
                  </div>
                </div>

                <div className={`p-2 rounded-xl text-center border ${
                  isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-950/30 border-rose-500/30'
                }`}>
                  <div className="text-[9px] text-rose-600 font-bold flex items-center justify-center gap-0.5">
                    <XCircle className="w-2.5 h-2.5" />
                    <span>{language === 'id' ? 'Salah' : 'Wrong'}</span>
                  </div>
                  <div className="text-base font-black font-mono-math text-rose-500">
                    {wrongHistoryCount}
                  </div>
                </div>

                <div className={`p-2 rounded-xl text-center border ${
                  isLight ? 'bg-sky-50 border-sky-200' : 'bg-sky-950/30 border-sky-500/30'
                }`}>
                  <div className="text-[9px] text-sky-600 font-bold">
                    {language === 'id' ? 'Akurasi' : 'Accuracy'}
                  </div>
                  <div className="text-base font-black font-mono-math text-sky-500">
                    {historyAccuracy}%
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Clear Button */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHistoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      historyFilter === 'all'
                        ? isLight
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-amber-500 text-slate-950 font-black'
                        : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.filterAllHistory} ({totalHistory})
                  </button>

                  <button
                    onClick={() => setHistoryFilter('correct')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      historyFilter === 'correct'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isLight
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40'
                    }`}
                  >
                    <span>{t.filterCorrectHistory}</span>
                    <span className="text-[10px] opacity-80">({correctHistoryCount})</span>
                  </button>

                  <button
                    onClick={() => setHistoryFilter('wrong')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      historyFilter === 'wrong'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : isLight
                        ? 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                        : 'bg-rose-950/40 text-rose-400 hover:bg-rose-900/40'
                    }`}
                  >
                    <span>{t.filterWrongHistory}</span>
                    <span className="text-[10px] opacity-80">({wrongHistoryCount})</span>
                  </button>
                </div>

                {totalHistory > 0 && (
                  <button
                    onClick={() => setShowClearHistoryConfirm(true)}
                    className={`p-1.5 rounded-lg text-[10px] ${
                      isLight ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'
                    } transition-colors cursor-pointer`}
                    title={t.clearHistoryBtn}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Clear History Confirmation dialog */}
              {showClearHistoryConfirm && (
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                } animate-in fade-in space-y-2`}>
                  <p className="text-xs font-bold text-center">
                    {t.clearHistoryConfirm}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        clearQuestionHistory();
                        setShowClearHistoryConfirm(false);
                      }}
                      className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-500"
                    >
                      {language === 'id' ? 'Ya, Bersihkan' : 'Yes, Clear'}
                    </button>
                    <button
                      onClick={() => setShowClearHistoryConfirm(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}

              {/* Question History Cards List */}
              {filteredHistory.length === 0 ? (
                <div className={`py-8 text-center px-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950/50 border-slate-800 text-slate-400'
                }`}>
                  <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                  <p className="text-xs font-medium">
                    {historyFilter === 'correct' 
                      ? t.noHistoryCorrectYet 
                      : historyFilter === 'wrong' 
                      ? t.noHistoryWrongYet 
                      : t.noHistoryYet}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredHistory.map((item: QuestionHistoryItem) => {
                    const modeInfo = getModeLabel(item.mode);
                    const isOk = item.isCorrect;

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isOk
                            ? isLight
                              ? 'bg-emerald-50/70 border-emerald-300/80 shadow-xs'
                              : 'bg-emerald-950/20 border-emerald-500/40 shadow-xs'
                            : isLight
                            ? 'bg-rose-50/70 border-rose-300/80 shadow-xs'
                            : 'bg-rose-950/25 border-rose-500/40 shadow-xs'
                        }`}
                      >
                        {/* Card Header: Mode badge, level & timestamp */}
                        <div className="flex items-center justify-between text-[10px] mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                              isLight
                                ? 'bg-white border-slate-200 text-slate-800'
                                : 'bg-slate-900 border-slate-700 text-slate-200'
                            }`}>
                              <span>{modeInfo.emoji}</span>
                              <span>{modeInfo.label}</span>
                            </span>
                            {(item.difficulty || item.level) && (
                              <span className={`text-[9px] font-semibold opacity-70 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                · {String(item.difficulty || item.level).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {item.responseTimeSec !== undefined && item.responseTimeSec > 0 && (
                              <span className={`flex items-center gap-0.5 font-mono-math font-bold ${
                                isLight ? 'text-slate-600' : 'text-slate-400'
                              }`}>
                                <Clock className="w-2.5 h-2.5" />
                                <span>{item.responseTimeSec.toFixed(1)}s</span>
                              </span>
                            )}
                            <span className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                              {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Card Main: Question & Status */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Math Question Text */}
                          <div className="flex items-center gap-2">
                            <span className={`font-mono-math font-black text-lg ${
                              isLight ? 'text-slate-900' : 'text-white'
                            }`}>
                              {item.questionText || item.question}
                            </span>
                            <span className="text-slate-400 font-mono-math text-base font-bold">=</span>
                            <span className={`font-mono-math font-black text-lg ${
                              isOk 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {isOk ? item.userAnswer : item.correctAnswer}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {isOk ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-500 text-slate-950 shadow-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>BENAR</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-rose-500 text-white shadow-xs">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>SALAH</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: Detail comparison if wrong */}
                        {!isOk && (
                          <div className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
                            isLight ? 'border-rose-200/80 text-rose-950' : 'border-rose-900/60 text-rose-200'
                          }`}>
                            <div className="flex items-center gap-1.5">
                              <span className="opacity-70 font-medium">{t.yourChoiceLabel}</span>
                              <span className="font-mono-math font-bold px-1.5 py-0.5 rounded bg-rose-200/70 dark:bg-rose-900/50 text-rose-900 dark:text-rose-200">
                                {item.userAnswer !== undefined && item.userAnswer !== null && item.userAnswer !== '' 
                                  ? item.userAnswer 
                                  : (language === 'id' ? 'Waktu habis (0)' : 'Timeout (0)')}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="opacity-70 font-medium">{t.wrongCorrectionAnswer}</span>
                              <span className="font-mono-math font-black px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-xs">
                                {item.correctAnswer}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXPORT CODE GAS (Google Apps Script) */}
          {activeModalTab === 'gas' && (
            <div className="space-y-4">
              <div className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-[#04241d]/90 border-emerald-500/40 text-emerald-100'
              } space-y-1`}>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-black text-xs">
                    {language === 'id' ? 'Ekspor Kode Google Apps Script (GAS)' : 'Export Google Apps Script (GAS)'}
                  </h4>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {language === 'id'
                    ? 'Deploy Mencongak Master Pro menjadi Web App mandiri di Google Apps Script hanya dengan 2 file ini.'
                    : 'Deploy Mencongak Master Pro as a standalone Web App in Google Apps Script using these 2 files.'}
                </p>
              </div>

              {/* File 1: Code.gs */}
              <div className={`p-3 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              } space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-math font-bold text-xs text-amber-500">Code.gs</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-bold">Backend</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeGsSource, 'code')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 cursor-pointer hover:bg-amber-400 transition-colors"
                  >
                    {copiedGasFile === 'code' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Code.gs</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className={`p-2.5 rounded-xl text-[10px] font-mono-math overflow-x-auto max-h-36 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-900 text-slate-300'
                }`}>
                  {codeGsSource}
                </pre>
              </div>

              {/* File 2: Index.html */}
              <div className={`p-3 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              } space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-math font-bold text-xs text-sky-500">Index.html</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-500 font-bold">Frontend</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(indexHtmlSource, 'index')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500 text-slate-950 cursor-pointer hover:bg-sky-400 transition-colors"
                  >
                    {copiedGasFile === 'index' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Index.html</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className={`p-2.5 rounded-xl text-[10px] font-mono-math overflow-x-auto max-h-36 ${
                  isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-900 text-slate-300'
                }`}>
                  {indexHtmlSource}
                </pre>
              </div>

              {/* Cara Deploy Panduan Singkat */}
              <div className={`p-3 rounded-2xl border text-[11px] space-y-1.5 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="font-bold text-amber-500 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'id' ? 'Langkah Deploy di Google Apps Script:' : 'Steps to Deploy on GAS:'}</span>
                </div>
                <ol className="list-decimal list-inside space-y-0.5 text-[10px] leading-relaxed">
                  <li>Buka <span className="font-mono-math text-sky-500">script.google.com</span> lalu buat Proyek Baru.</li>
                  <li>Paste kode <span className="font-mono-math text-amber-500 font-bold">Code.gs</span> di atas ke file Code.gs.</li>
                  <li>Buat file HTML baru bernama <span className="font-mono-math text-sky-500 font-bold">Index</span> lalu paste kode <span className="font-mono-math text-sky-500 font-bold">Index.html</span>.</li>
                  <li>Klik <b>Terapkan (Deploy) &gt; Penerapan Baru (New Deployment)</b>.</li>
                  <li>Pilih jenis <b>Aplikasi Web (Web App)</b>, set akses ke <b>Siapa saja (Anyone)</b>.</li>
                  <li>Klik <b>Terapkan</b> dan bagikan URL Web App Anda!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

