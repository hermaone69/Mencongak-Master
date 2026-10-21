import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Swords, Bot, User, Trophy, Play, RefreshCw, Flame, ArrowLeft, 
  Zap, AlertCircle, PenTool, Sparkles, SlidersHorizontal, CheckCircle2 
} from 'lucide-react';
import { DifficultyLevel, MathOperation, Question, Language } from '../types';
import { generateQuestion, getQuestionHint, getLevelMaxConfig, clearQuestionHistory } from '../utils/mathGenerator';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { getTranslation } from '../utils/translations';

interface BotOpponent {
  id: string;
  name: string;
  avatar: string;
  levelTitle: string;
  difficulty: DifficultyLevel;
  avgSpeedSec: number;
  accuracy: number;
  description: string;
  personality: {
    thinking: string[];
    onPlayerWinRound: string[];
    onBotWinRound: string[];
    onBotFailRound: string[];
  };
}

const BOT_OPPONENTS_ID: BotOpponent[] = [
  {
    id: 'bot_bobi',
    name: 'Robot Bobi',
    avatar: '🤖',
    levelTitle: 'SD Pemula',
    difficulty: 'sd_awal',
    avgSpeedSec: 3.4,
    accuracy: 0.80,
    description: 'Kecepatan santai (~3.4 detik). Ramah dan cocok untuk pemanasan.',
    personality: {
      thinking: [
        'Bobi sedang memutar roda hitung... 💭',
        'Tunggu ya, memoriku sedang memproses! 🤖',
        'Bip bop... angka-angkanya seru! ⚙️'
      ],
      onPlayerWinRound: [
        'Wah, jarimu cepat sekali! Hebat! 😲',
        'Aduh, Bobi kalah cepat kali ini! 👏',
        'Keren! Refleksmu mantap! ⚡'
      ],
      onBotWinRound: [
        'Yey! Bobi dapat poin ronde ini! 🤖✨',
        'Bip bop! Kecepatan robot berhasil! 🏆',
        'Asyik, poin untuk Bobi! 🎯'
      ],
      onBotFailRound: [
        'Oops! Baterai konsentrasi Bobi goyang! 😅',
        'Aduh keliru hitung! Cepat rebut poinnya! ⚠️'
      ]
    }
  },
  {
    id: 'bot_alpha',
    name: 'Kalkulator Alpha',
    avatar: '🦾',
    levelTitle: 'SMP Aritmatika',
    difficulty: 'sd_lanjut',
    avgSpeedSec: 2.2,
    accuracy: 0.90,
    description: 'Kecepatan menengah (~2.2 detik). Cukup tangkas dan konsisten.',
    personality: {
      thinking: [
        'Alpha: Algoritma kalkulasi 95% aktif... ⚡',
        'Alpha: Memindai opsi jawaban terbaik... 🔬',
        'Alpha: Sinkronisasi rumus kilat... 🦾'
      ],
      onPlayerWinRound: [
        'Alpha: Luar biasa! Kecepatanmu di atas rata-rata! 🚀',
        'Alpha: Logika dan kecepatanmu melampaui prediksiku! 💡',
        'Alpha: Poin layak untuk reflek secepat itu! 👏'
      ],
      onBotWinRound: [
        'Alpha: Eksekusi tepat waktu berhasil! 🎯',
        'Alpha: Algoritma mencongak sukses! Poin diamankan! ⚡',
        'Alpha: Kecepatan kalkulasi optimal! 🦾'
      ],
      onBotFailRound: [
        'Alpha: Anomali hitung terdeteksi! Peluang emasmu! ⚠️',
        'Alpha: Kesalahan presisi! Jawab sebelum habis! 🛑'
      ]
    }
  },
  {
    id: 'bot_sigma',
    name: 'Grandmaster Sigma',
    avatar: '🧠',
    levelTitle: 'Olimpiade Master',
    difficulty: 'sma_pro',
    avgSpeedSec: 1.4,
    accuracy: 0.98,
    description: 'Refleks kilat (~1.4 detik). Sangat akurat mendekati sempurna!',
    personality: {
      thinking: [
        'Sigma: Mencongak adalah seni ketenangan dan fokus... 🧠',
        'Sigma: Membaca pola angka sekejap mata... ✨',
        'Sigma: Intuisi master sedang berjalan... ⚡'
      ],
      onPlayerWinRound: [
        'Sigma: Sungguh intuisi berhitung yang spektakuler! 👑',
        'Sigma: Kamu memiliki bakat juara sejati! 🌟',
        'Sigma: Hebat! Jarang ada yang bisa mendahuluiku! 🏆'
      ],
      onBotWinRound: [
        'Sigma: Presisi dan ketenangan selalu membuahkan hasil. 🎯',
        'Sigma: Poin master diamankan dengan indah. ✨',
        'Sigma: Terus asah fokusmu, kamu pasti bisa! 🧠'
      ],
      onBotFailRound: [
        'Sigma: Hmm, kesalahan langka! Manfaatkan kesempatanmu! 💡',
        'Sigma: Kelengahan kecil! Cepat ambil poinnya! ⚠️'
      ]
    }
  }
];

const BOT_OPPONENTS_EN: BotOpponent[] = [
  {
    id: 'bot_bobi',
    name: 'Robot Bobi',
    avatar: '🤖',
    levelTitle: 'Junior Beginner',
    difficulty: 'sd_awal',
    avgSpeedSec: 3.4,
    accuracy: 0.80,
    description: 'Relaxed speed (~3.4s). Friendly and perfect for warm-ups.',
    personality: {
      thinking: [
        'Bobi is spinning the calculation wheel... 💭',
        'Hang on, my memory is processing! 🤖',
        'Beep boop... numbers are fun! ⚙️'
      ],
      onPlayerWinRound: [
        'Wow, your fingers are so fast! Great job! 😲',
        'Oh no, Bobi was too slow this time! 👏',
        'Awesome! Fantastic reflexes! ⚡'
      ],
      onBotWinRound: [
        'Yay! Bobi got the point for this round! 🤖✨',
        'Beep boop! Robot speed victory! 🏆',
        'Hurray, point for Bobi! 🎯'
      ],
      onBotFailRound: [
        'Oops! Bobi\'s concentration battery slipped! 😅',
        'Oh no, miscalculated! Grab the point quickly! ⚠️'
      ]
    }
  },
  {
    id: 'bot_alpha',
    name: 'Alpha Calculator',
    avatar: '🦾',
    levelTitle: 'Middle School',
    difficulty: 'sd_lanjut',
    avgSpeedSec: 2.2,
    accuracy: 0.90,
    description: 'Medium speed (~2.2s). Agile and very consistent.',
    personality: {
      thinking: [
        'Alpha: Calculation algorithm 95% active... ⚡',
        'Alpha: Scanning optimal answer choices... 🔬',
        'Alpha: Synchronizing lightning math formula... 🦾'
      ],
      onPlayerWinRound: [
        'Alpha: Incredible! Your speed is above average! 🚀',
        'Alpha: Your logic exceeded my projections! 💡',
        'Alpha: Well-deserved point for lightning reflexes! 👏'
      ],
      onBotWinRound: [
        'Alpha: Timely execution successful! 🎯',
        'Alpha: Math algorithm success! Point secured! ⚡',
        'Alpha: Optimal speed calculation! 🦾'
      ],
      onBotFailRound: [
        'Alpha: Calculation anomaly detected! Your golden chance! ⚠️',
        'Alpha: Precision glitch! Answer before time runs out! 🛑'
      ]
    }
  },
  {
    id: 'bot_sigma',
    name: 'Grandmaster Sigma',
    avatar: '🧠',
    levelTitle: 'Olympiad Master',
    difficulty: 'sma_pro',
    avgSpeedSec: 1.4,
    accuracy: 0.98,
    description: 'Lightning reflexes (~1.4s). Near-perfect accuracy and focus!',
    personality: {
      thinking: [
        'Sigma: Mental math is the art of calmness and focus... 🧠',
        'Sigma: Reading number patterns in a split second... ✨',
        'Sigma: Master intuition engaged... ⚡'
      ],
      onPlayerWinRound: [
        'Sigma: Truly a spectacular calculation intuition! 👑',
        'Sigma: You possess the talent of a true champion! 🌟',
        'Sigma: Impressive! Rarely can anyone beat me to the answer! 🏆'
      ],
      onBotWinRound: [
        'Sigma: Precision and poise always yield results. 🎯',
        'Sigma: Master point secured beautifully. ✨',
        'Sigma: Keep sharpening your focus, you can do it! 🧠'
      ],
      onBotFailRound: [
        'Sigma: Hmm, a rare error! Seize your opportunity! 💡',
        'Sigma: A slight slip! Quick, take the point! ⚠️'
      ]
    }
  }
];

export function getBotOpponents(lang: Language = 'id'): BotOpponent[] {
  return lang === 'en' ? BOT_OPPONENTS_EN : BOT_OPPONENTS_ID;
}

export const DuelScreen: React.FC = () => {
  const { recordAnswer, addCoins, addXP, stats, language, playerName, themeMode } = useGame();
  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';
  const t = getTranslation(language);
  const botList = getBotOpponents(language);

  // Settings
  const [selectedBotId, setSelectedBotId] = useState<string>(botList[0].id);
  const [selectedOperations, setSelectedOperations] = useState<MathOperation[]>(['+', '-', '×', '÷']);
  const [totalRounds, setTotalRounds] = useState<number>(8);
  const [maxNumber, setMaxNumber] = useState<number | null>(null);
  const [isCustomMax, setIsCustomMax] = useState<boolean>(false);
  const [customMaxInput, setCustomMaxInput] = useState<string>('');

  const selectedBot = botList.find(b => b.id === selectedBotId) || botList[0];
  const activeBotConfig = getLevelMaxConfig(selectedBot.difficulty, language);

  const handleSelectBot = (botId: string) => {
    sounds.playTap();
    setSelectedBotId(botId);
    const targetBot = botList.find(b => b.id === botId) || botList[0];
    const targetCfg = getLevelMaxConfig(targetBot.difficulty, language);
    // If active maxNumber exceeds target bot's hardCap (e.g. Bobi SD 1-3 hardCap 50), adapt it
    if (maxNumber !== null && maxNumber > targetCfg.hardCap) {
      setMaxNumber(null);
      setIsCustomMax(false);
      setCustomMaxInput('');
    }
  };

  const toggleOperation = (op: MathOperation) => {
    sounds.playTap();
    setSelectedOperations(prev => {
      if (prev.includes(op)) {
        if (prev.length <= 1) return prev;
        return prev.filter(o => o !== op);
      } else {
        return [...prev, op];
      }
    });
  };

  const selectAllOperations = () => {
    sounds.playTap();
    setSelectedOperations(['+', '-', '×', '÷']);
  };

  const handleSelectMaxNumber = (val: number | null) => {
    sounds.playTap();
    if (val !== null) {
      const clamped = Math.min(val, activeBotConfig.hardCap);
      setMaxNumber(clamped);
      setIsCustomMax(false);
      setCustomMaxInput(String(clamped));
    } else {
      setMaxNumber(null);
      setIsCustomMax(false);
      setCustomMaxInput('');
    }
  };

  const handleCustomMaxChange = (valStr: string) => {
    setCustomMaxInput(valStr);
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed >= 5) {
      // Clamp to active bot's hard cap
      const clamped = Math.min(parsed, activeBotConfig.hardCap);
      setMaxNumber(clamped);
    } else if (valStr.trim() === '') {
      setMaxNumber(null);
    }
  };

  // Active Duel State
  const [isDueling, setIsDueling] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [botScore, setBotScore] = useState<number>(0);
  const [consecutivePlayerWins, setConsecutivePlayerWins] = useState<number>(0);

  // Modals & Tools
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);

  // Status & Dynamic Dialogue
  const [botDialogue, setBotDialogue] = useState<string>('');
  const [botIsThinking, setBotIsThinking] = useState<boolean>(false);
  const [roundWinnerBadge, setRoundWinnerBadge] = useState<{
    text: string;
    type: 'player' | 'bot' | 'bot_wrong';
  } | null>(null);

  const [duelWinner, setDuelWinner] = useState<'player' | 'bot' | 'draw' | null>(null);
  const [highlightedAnswer, setHighlightedAnswer] = useState<{
    option: number;
    isCorrect: boolean;
  } | null>(null);

  // Timers
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextRoundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRoundActiveRef = useRef<boolean>(false);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
      if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);
    };
  }, []);

  const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // Start new duel session
  const startDuel = (bot: BotOpponent) => {
    sounds.playTap();
    setSelectedBotId(bot.id);
    setIsDueling(true);
    setCurrentRound(1);
    setPlayerScore(0);
    setBotScore(0);
    setConsecutivePlayerWins(0);
    setDuelWinner(null);
    setHighlightedAnswer(null);
    clearQuestionHistory();

    const botCfg = getLevelMaxConfig(bot.difficulty, language);
    const effectiveMax = maxNumber !== null ? Math.min(maxNumber, botCfg.hardCap) : null;
    const firstQ = generateQuestion(bot.difficulty, selectedOperations, language, effectiveMax);
    setCurrentQuestion(firstQ);
    startRound(firstQ, bot, 1);
  };

  // Start round
  const startRound = (q: Question, bot: BotOpponent, roundNum: number) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);

    isRoundActiveRef.current = true;
    setRoundWinnerBadge(null);
    setHighlightedAnswer(null);
    setBotIsThinking(true);
    setBotDialogue(pickRandom(bot.personality.thinking));

    const variance = (Math.random() * 0.8 - 0.4);
    const delayMs = Math.max(900, Math.round((bot.avgSpeedSec + variance) * 1000));

    botTimerRef.current = setTimeout(() => {
      if (isRoundActiveRef.current) {
        handleBotAttempt(q, bot, roundNum);
      }
    }, delayMs);
  };

  // Bot attempts to answer
  const handleBotAttempt = (q: Question, bot: BotOpponent, roundNum: number) => {
    setBotIsThinking(false);
    const doesBotAnswerCorrectly = Math.random() < bot.accuracy;

    if (doesBotAnswerCorrectly) {
      isRoundActiveRef.current = false;
      sounds.playWrong();
      setBotScore(prev => prev + 1);
      setConsecutivePlayerWins(0);
      setHighlightedAnswer({ option: q.correctAnswer, isCorrect: true });
      setRoundWinnerBadge({
        text: `⚡ ${bot.name} ${language === 'id' ? 'menjawab lebih dulu!' : 'answered first!'} (${q.correctAnswer})`,
        type: 'bot'
      });
      setBotDialogue(pickRandom(bot.personality.onBotWinRound));

      nextRoundTimerRef.current = setTimeout(() => {
        proceedToNextRound(roundNum, bot);
      }, 1400);
    } else {
      sounds.playTap();
      setRoundWinnerBadge({
        text: `⚠️ ${bot.name} ${language === 'id' ? 'salah hitung! Dia sedang menghitung ulang... Rebut poinnya!' : 'miscalculated! Recalculating... Grab the point now!'}`,
        type: 'bot_wrong'
      });
      setBotDialogue(pickRandom(bot.personality.onBotFailRound));

      const retryDelayMs = Math.round((bot.avgSpeedSec + 0.8) * 1000);
      botTimerRef.current = setTimeout(() => {
        if (isRoundActiveRef.current) {
          isRoundActiveRef.current = false;
          sounds.playWrong();
          setBotScore(prev => prev + 1);
          setConsecutivePlayerWins(0);
          setHighlightedAnswer({ option: q.correctAnswer, isCorrect: true });
          setRoundWinnerBadge({
            text: `⏱️ ${language === 'id' ? 'Waktu habis!' : 'Time up!'} ${bot.name} ${language === 'id' ? 'selesai menghitung ulang' : 'finished recalculating'} (${q.correctAnswer})`,
            type: 'bot'
          });
          setBotDialogue(`${bot.name}: ${language === 'id' ? `Akhirnya ketemu! Jawaban yang benar adalah ${q.correctAnswer}!` : `Got it at last! The correct answer is ${q.correctAnswer}!`}`);

          nextRoundTimerRef.current = setTimeout(() => {
            proceedToNextRound(roundNum, bot);
          }, 1400);
        }
      }, retryDelayMs);
    }
  };

  // Player answers
  const handlePlayerAnswer = (option: number) => {
    if (!currentQuestion || !isRoundActiveRef.current) return;

    isRoundActiveRef.current = false;
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setBotIsThinking(false);

    const isCorrect = option === currentQuestion.correctAnswer;
    setHighlightedAnswer({ option, isCorrect });

    if (isCorrect) {
      sounds.playCorrect(playerScore + 1);
      setPlayerScore(prev => prev + 1);
      setConsecutivePlayerWins(prev => prev + 1);
      recordAnswer(true, 'duel', 15);
      setRoundWinnerBadge({
        text: `🎯 ${language === 'id' ? 'Kamu lebih cepat & tepat! (+1 Poin)' : 'You were faster & correct! (+1 Point)'}`,
        type: 'player'
      });
      setBotDialogue(pickRandom(selectedBot.personality.onPlayerWinRound));
    } else {
      sounds.playWrong();
      recordAnswer(false, 'duel', 0);
      setBotScore(prev => prev + 1);
      setConsecutivePlayerWins(0);
      setRoundWinnerBadge({
        text: `❌ ${language === 'id' ? 'Jawabanmu salah' : 'Wrong answer'} (${currentQuestion.correctAnswer}) · ${language === 'id' ? 'Poin untuk' : 'Point for'} ${selectedBot.name}`,
        type: 'bot'
      });
      setBotDialogue(pickRandom(selectedBot.personality.onBotWinRound));
    }

    nextRoundTimerRef.current = setTimeout(() => {
      proceedToNextRound(currentRound, selectedBot);
    }, 1400);
  };

  // Move to next round
  const proceedToNextRound = (completedRound: number, bot: BotOpponent) => {
    const nextRound = completedRound + 1;

    if (nextRound > totalRounds) {
      finishDuel();
    } else {
      setCurrentRound(nextRound);
      const botCfg = getLevelMaxConfig(bot.difficulty, language);
      const effectiveMax = maxNumber !== null ? Math.min(maxNumber, botCfg.hardCap) : null;
      const nextQ = generateQuestion(bot.difficulty, selectedOperations, language, effectiveMax);
      setCurrentQuestion(nextQ);
      startRound(nextQ, bot, nextRound);
    }
  };

  // Finish Duel & determine winner
  const finishDuel = () => {
    sounds.playVictory();
    if (playerScore > botScore) {
      setDuelWinner('player');
      addCoins(25);
      addXP(50);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else if (playerScore < botScore) {
      setDuelWinner('bot');
      addCoins(5);
      addXP(10);
    } else {
      setDuelWinner('draw');
      addCoins(10);
      addXP(20);
    }
  };

  // Sudden Death round trigger for ties
  const playSuddenDeath = () => {
    sounds.playTap();
    setDuelWinner(null);
    setCurrentRound(totalRounds + 1);
    setTotalRounds(prev => prev + 1);

    const botCfg = getLevelMaxConfig(selectedBot.difficulty, language);
    const effectiveMax = maxNumber !== null ? Math.min(maxNumber, botCfg.hardCap) : null;
    const suddenQ = generateQuestion(selectedBot.difficulty, selectedOperations, language, effectiveMax);
    setCurrentQuestion(suddenQ);
    startRound(suddenQ, selectedBot, totalRounds + 1);
  };

  // 1. ARENA BERTANDING REAL-TIME
  if (isDueling && currentQuestion && !duelWinner) {
    return (
      <div className={`flex-1 flex flex-col justify-between p-3 sm:p-4 select-none relative overflow-y-auto transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-900'
          : isNeon
          ? 'bg-[#021411] text-emerald-100'
          : 'bg-slate-950 text-slate-100'
      }`}>
        {/* Top Navigation & Surrender Button */}
        <div className="flex items-center justify-between z-10">
          <button
            onClick={() => {
              sounds.playTap();
              setIsDueling(false);
            }}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              isLight
                ? 'bg-white border-slate-300 text-slate-700 hover:text-slate-950 shadow-xs'
                : isNeon
                ? 'bg-[#04241d] border-emerald-500/40 text-emerald-300 hover:text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isLight
              ? 'bg-amber-100 border-amber-300 text-amber-950 font-black shadow-xs'
              : isNeon
              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-amber-400'
          }`}>
            <Swords className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.duelRounds} {currentRound} / {totalRounds}</span>
          </div>

          <button
            onClick={() => setIsScratchpadOpen(true)}
            className={`p-2 rounded-xl border cursor-pointer flex items-center gap-1 text-xs font-bold shadow-sm transition-colors ${
              isLight
                ? 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200'
                : isNeon
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:text-amber-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{t.scratchpad}</span>
          </button>
        </div>

        {/* Scoreboard Dual Racer Bar */}
        <div className={`my-2 rounded-2xl p-3 border shadow-md transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : isNeon
            ? 'bg-[#04241d]/90 border-emerald-500/40 text-emerald-100 shadow-lg'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            {/* Player Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                😎
              </div>
              <div>
                <span className={`text-xs font-bold block truncate max-w-[110px] ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{playerName || t.duelYou}</span>
                <span className={`text-sm font-black font-mono-math leading-none ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  {playerScore} Pts
                </span>
              </div>
            </div>

            {/* Streak Flame Badge */}
            {consecutivePlayerWins >= 2 && (
              <div className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center gap-1 animate-bounce shadow-md">
                <Flame className="w-3 h-3 fill-slate-950" />
                <span>🔥 {consecutivePlayerWins}x Streak</span>
              </div>
            )}

            {/* Bot Info */}
            <div className="flex items-center gap-2 text-right">
              <div>
                <span className={`text-xs font-bold block ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{selectedBot.name}</span>
                <span className={`text-sm font-black font-mono-math leading-none ${
                  isLight ? 'text-sky-700' : 'text-sky-400'
                }`}>
                  {botScore} Pts
                </span>
              </div>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-lg shadow-inner ${
                isLight ? 'bg-slate-100 border-slate-300' : isNeon ? 'bg-[#021411] border-emerald-500/40' : 'bg-slate-800 border-slate-700'
              }`}>
                {selectedBot.avatar}
              </div>
            </div>
          </div>

          {/* Tug-of-war Progress Racer */}
          <div className={`w-full h-2.5 rounded-full overflow-hidden flex border ${
            isLight ? 'bg-slate-200 border-slate-300' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-950 border-slate-800'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
              style={{
                width: `${
                  playerScore + botScore === 0
                    ? 50
                    : (playerScore / (playerScore + botScore)) * 100
                }%`
              }}
            />
            <div
              className={`h-full transition-all duration-300 flex-1 ${
                isLight ? 'bg-slate-300' : isNeon ? 'bg-emerald-950' : 'bg-slate-700'
              }`}
            />
          </div>
        </div>

        {/* Bot Dialogue Reaction Speech Bubble */}
        <div className={`my-1.5 p-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm border transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : isNeon
            ? 'bg-[#04241d]/90 border-emerald-500/30 text-emerald-100'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}>
          <span className="text-xl animate-pulse">{selectedBot.avatar}</span>
          <div className="flex-1 min-w-0">
            <span className={`text-[10px] font-bold block ${
              isLight ? 'text-amber-800 font-extrabold' : 'text-amber-400'
            }`}>{selectedBot.name}:</span>
            <p className={`text-xs font-medium truncate italic ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}>
              "{botDialogue || (botIsThinking ? '...' : '')}"
            </p>
          </div>
        </div>

        {/* Question Card Box */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
          {/* Round Winner Notification Badge */}
          {roundWinnerBadge && (
            <div
              className={`absolute top-0 z-20 px-3.5 py-1.5 font-bold text-xs rounded-2xl shadow-xl animate-bounce text-center border ${
                roundWinnerBadge.type === 'player'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : roundWinnerBadge.type === 'bot_wrong'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-rose-500 text-white border-rose-400'
              }`}
            >
              {roundWinnerBadge.text}
            </div>
          )}

          <div className={`w-full max-w-sm rounded-3xl p-5 sm:p-7 flex flex-col items-center justify-center text-center shadow-xl border transition-colors ${
            isLight
              ? 'bg-white border-2 border-slate-200 text-slate-900'
              : isNeon
              ? 'bg-[#04241d] border-2 border-emerald-500/40 text-emerald-100 shadow-emerald-500/10'
              : 'bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 text-white shadow-2xl'
          }`}>
            <div className="w-full flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] uppercase font-bold tracking-widest ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {t.duelTopic} · {currentQuestion.operation.toUpperCase()}
                </span>
                {maxNumber && (
                  <span className={`text-[9px] border px-1.5 py-0.5 rounded-md font-mono-math font-bold ${
                    isLight
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    ≤ {maxNumber}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsScratchpadOpen(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm border ${
                  isLight
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950'
                    : isNeon
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/50 text-emerald-300'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white'
                }`}
                title={t.scratchpad}
              >
                <PenTool className="w-3 h-3" />
                <span>{t.scratchpad}</span>
              </button>
            </div>
            <div className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono-math tracking-tight my-2 ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              {currentQuestion.questionText.replace(' = ?', '')} = ?
            </div>

            {/* Hint prompt if available */}
            {getQuestionHint(currentQuestion, language) && (
              <p className={`text-[11px] mt-2 max-w-xs text-balance font-medium ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                💡 {getQuestionHint(currentQuestion, language)}
              </p>
            )}
          </div>
        </div>

        {/* Multiple Choice Answer Buttons */}
        <div className="grid grid-cols-2 gap-2.5 my-2">
          {currentQuestion.options.map((option, idx) => {
            const isHighlighted = highlightedAnswer?.option === option;

            return (
              <button
                key={idx}
                disabled={!isRoundActiveRef.current}
                onClick={() => handlePlayerAnswer(option)}
                className={`h-14 sm:h-16 rounded-2xl font-mono-math font-extrabold text-xl sm:text-2xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 border ${
                  isHighlighted && highlightedAnswer?.isCorrect
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-4 ring-emerald-400/40 font-black'
                    : isHighlighted && !highlightedAnswer?.isCorrect
                    ? 'bg-rose-500 text-white border-rose-400 ring-4 ring-rose-400/40'
                    : isLight
                    ? 'bg-white hover:bg-amber-50/80 border-2 border-slate-300 text-slate-950 hover:border-amber-400 shadow-sm'
                    : isNeon
                    ? 'bg-[#04241d] hover:bg-[#063328] border-2 border-emerald-500/40 text-emerald-100 hover:border-emerald-400 shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white hover:border-amber-400/50'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <ScratchpadCanvas
          isOpen={isScratchpadOpen}
          onClose={() => setIsScratchpadOpen(false)}
          questionText={currentQuestion?.questionText}
        />
      </div>
    );
  }

  // 2. HASIL AKHIR DUEL (GAME OVER / RESULTS SUMMARY)
  if (duelWinner) {
    const isPlayerVictory = duelWinner === 'player';
    const isTie = duelWinner === 'draw';

    return (
      <div className={`flex-1 flex flex-col justify-between p-4 select-none overflow-y-auto transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-900'
          : isNeon
          ? 'bg-[#021411] text-emerald-100'
          : 'bg-slate-950 text-slate-100'
      }`}>
        <div className="text-center pt-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 mb-3 animate-bounce">
            {isPlayerVictory ? '🏆' : isTie ? '🤝' : '🦾'}
          </div>

          <h2 className={`text-2xl font-black font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isPlayerVictory ? t.duelWin : isTie ? t.duelTie : `${selectedBot.name} ${t.duelLoss}`}
          </h2>
          <p className={`text-xs mt-1 max-w-xs mx-auto font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {isPlayerVictory ? t.duelWinDesc : isTie ? t.duelTieDesc : t.duelLossDesc}
          </p>
        </div>

        {/* Final Duel Scoreboard */}
        <div className={`rounded-3xl p-4 my-3 space-y-3 border transition-colors shadow-md ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : isNeon
            ? 'bg-[#04241d]/90 border-emerald-500/40 text-emerald-100 shadow-lg'
            : 'bg-slate-900/90 border border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center justify-around py-2">
            <div className="text-center">
              <span className={`text-xs font-bold block truncate max-w-[110px] ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}>{playerName || t.duelYou}</span>
              <span className={`text-3xl font-black font-mono-math ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}>{playerScore}</span>
            </div>
            <div className={`text-xl font-black font-mono-math ${
              isLight ? 'text-slate-400' : 'text-slate-600'
            }`}>VS</div>
            <div className="text-center">
              <span className={`text-xs font-bold block ${
                isLight ? 'text-slate-700' : 'text-slate-400'
              }`}>{selectedBot.name}</span>
              <span className={`text-3xl font-black font-mono-math ${
                isLight ? 'text-sky-700' : 'text-sky-400'
              }`}>{botScore}</span>
            </div>
          </div>

          {isTie && (
            <button
              onClick={playSuddenDeath}
              className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-sm border ${
                isLight
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                  : isNeon
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/50'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-400'
              }`}
            >
              {t.duelSuddenDeath}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => startDuel(selectedBot)}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.rematch}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setDuelWinner(null);
              setIsDueling(false);
            }}
            className={`w-full h-11 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                : isNeon
                ? 'bg-[#04241d] hover:bg-[#063328] border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.chooseOtherBot}
          </button>
        </div>
      </div>
    );
  }

  // 3. TAMPILAN UTAMA: PENGATURAN & PILIH LAWAN DUEL
  return (
    <div className={`flex-1 flex flex-col justify-between p-3.5 sm:p-4 select-none overflow-y-auto transition-colors duration-200 ${
      isLight
        ? 'bg-slate-50 text-slate-900'
        : isNeon
        ? 'bg-[#021411] text-emerald-100'
        : 'bg-slate-950 text-slate-100'
    }`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 ${
            isLight ? 'text-amber-800 font-extrabold' : isNeon ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            <Swords className="w-3.5 h-3.5" />
            {t.duelHeader}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
            isLight
              ? 'bg-white border-slate-300 text-slate-700 shadow-xs'
              : isNeon
              ? 'bg-[#04241d] border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            🏆 {stats.totalDuelsWon} {t.duelWinsCount}
          </span>
        </div>
        <h1 className={`text-xl font-black font-display ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          {t.duelTitle}
        </h1>
        <p className={`text-xs mt-0.5 ${
          isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
        }`}>
          {t.duelSubtitle}
        </p>

        {/* Filter Pengaturan Duel: Operasi Hitung & Jumlah Ronde */}
        <div className={`my-3 p-3 rounded-2xl border space-y-2.5 transition-colors shadow-sm ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : isNeon
            ? 'bg-[#04241d]/90 border-emerald-500/40 text-emerald-100 shadow-lg'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold flex items-center gap-1 ${
              isLight ? 'text-slate-900 font-extrabold' : 'text-slate-300'
            }`}>
              <SlidersHorizontal className="w-3 h-3 text-amber-500" />
              <span>{t.duelTopic}</span>
            </span>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.duelRounds}:</span>
              {[5, 8, 10].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    sounds.playTap();
                    setTotalRounds(r);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
                    totalRounds === r
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                      : isLight
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : isNeon
                      ? 'bg-[#021411] text-emerald-300 hover:text-white border border-emerald-500/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Tombol Pilihan Operasi (Multi-Select) */}
          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={selectAllOperations}
              className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                selectedOperations.length === 4
                  ? isLight
                    ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-xs'
                    : isNeon
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-sm'
                    : 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-sm'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                  : isNeon
                  ? 'bg-[#021411] hover:bg-[#031d17] border border-emerald-500/30 text-emerald-400/60'
                  : 'bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-xs">🔀</span>
              <span className="text-[9px] font-bold mt-0.5 truncate w-full text-center">
                {t.opAll}
              </span>
            </button>
            {[
              { id: '×', label: language === 'id' ? 'Kali (×)' : 'Mult (×)', icon: '✖️' },
              { id: '÷', label: language === 'id' ? 'Bagi (÷)' : 'Div (÷)', icon: '➗' },
              { id: '+', label: language === 'id' ? 'Tambah (+)' : 'Add (+)', icon: '➕' },
              { id: '-', label: language === 'id' ? 'Kurang (−)' : 'Sub (−)', icon: '➖' }
            ].map(op => {
              const isSelected = selectedOperations.includes(op.id as MathOperation);
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => toggleOperation(op.id as MathOperation)}
                  className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-xs'
                        : isNeon
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-sm'
                        : 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-sm'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                      : isNeon
                      ? 'bg-[#021411] hover:bg-[#031d17] border border-emerald-500/30 text-emerald-400/60'
                      : 'bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <span className="text-xs">{op.icon}</span>
                  <span className="text-[9px] font-bold mt-0.5 truncate w-full text-center">
                    {op.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Angka Tertinggi / Max Number Filter */}
          <div className={`pt-2.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[11px] font-bold block leading-tight ${
                    isLight ? 'text-slate-900 font-extrabold' : 'text-slate-300'
                  }`}>
                    {t.maxNumberLabel}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                    isLight
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : isNeon
                      ? 'bg-[#021411] text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-amber-300 border-slate-700'
                  }`}>
                    {selectedBot.name} ({selectedBot.levelTitle})
                  </span>
                </div>
                <span className={`text-[9px] font-medium ${
                  isLight ? 'text-amber-800 font-bold' : 'text-amber-300/90'
                }`}>
                  {maxNumber
                    ? `${language === 'id' ? 'Batas aktif: Maksimal s/d' : 'Active limit: Up to'} ${maxNumber}`
                    : `${t.maxNumberAuto} (${language === 'id' ? 'otomatis sesuai level bot' : 'auto per bot level'})`}
                </span>
              </div>
              {maxNumber !== null && (
                <button
                  type="button"
                  onClick={() => handleSelectMaxNumber(null)}
                  className={`text-[9px] px-2 py-0.5 rounded-md cursor-pointer font-bold transition-all border ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      : isNeon
                      ? 'bg-[#021411] hover:bg-[#031d17] text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  ↺ Reset {t.maxNumberAuto}
                </button>
              )}
            </div>

            {/* Presets Grid adapted to selected bot difficulty */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[11px]">
              {activeBotConfig.presets.map(preset => {
                const isSelected = !isCustomMax && maxNumber === preset.value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectMaxNumber(preset.value)}
                    className={`py-1.5 px-1 rounded-lg border font-bold text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-sm scale-[1.02]'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        : isNeon
                        ? 'bg-[#021411] border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Level Pedagogical Guidance Note */}
            <div className={`mt-1.5 flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-950 font-medium'
                : 'text-amber-300/80 bg-amber-500/10 border-amber-500/20'
            }`}>
              <span>💡</span>
              <span className="leading-tight font-medium">{activeBotConfig.description}</span>
            </div>

            {/* Custom Max Number Field */}
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsCustomMax(true);
                  if (!maxNumber) setMaxNumber(Math.min(50, activeBotConfig.defaultMax));
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  isCustomMax
                    ? isLight
                      ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 shadow-xs'
                      : isNeon
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm ring-1 ring-amber-400/30'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.maxNumberCustom}
              </button>

              {isCustomMax ? (
                <div className="flex-1 flex items-center gap-1.5 animate-in fade-in duration-150">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={5}
                      max={activeBotConfig.hardCap}
                      value={customMaxInput || (maxNumber ? String(maxNumber) : '')}
                      onChange={e => handleCustomMaxChange(e.target.value)}
                      placeholder={selectedBot.difficulty === 'sd_awal' ? 'Contoh: 10, 15, 20...' : t.maxNumberCustomPlaceholder}
                      className={`w-full rounded-xl px-2.5 py-1 text-xs font-mono-math font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 border ${
                        isLight
                          ? 'bg-white border-amber-400 text-slate-900 placeholder:text-slate-400'
                          : isNeon
                          ? 'bg-[#021411] border-emerald-500 text-emerald-200 placeholder:text-emerald-700'
                          : 'bg-slate-950 border-amber-500/60 text-amber-300 placeholder:text-slate-600'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] shrink-0 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {language === 'id' ? `Maks ≤ ${activeBotConfig.hardCap}` : `Cap ≤ ${activeBotConfig.hardCap}`}
                  </span>
                </div>
              ) : (
                <span className={`text-[10px] italic truncate font-medium ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                  {maxNumber ? `${t.maxNumberNote}` : `${language === 'id' ? 'Pilih batas angka di atas atau masukkan angka bebas.' : 'Pick ceiling above or enter custom number.'}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Daftar Bot AI */}
        <div className="space-y-2.5">
          {botList.map(bot => {
            const isBotSelected = bot.id === selectedBotId;
            return (
              <div
                key={bot.id}
                onClick={() => handleSelectBot(bot.id)}
                className={`rounded-2xl p-3 flex items-center justify-between transition-all shadow-sm cursor-pointer ${
                  isBotSelected
                    ? isLight
                      ? 'bg-amber-50/90 border-2 border-amber-400 ring-2 ring-amber-300/60 shadow-md'
                      : isNeon
                      ? 'bg-[#042e25] border-2 border-emerald-400 ring-1 ring-emerald-400/50 shadow-emerald-500/20'
                      : 'bg-slate-900 border-2 border-amber-400/80 ring-1 ring-amber-400/40 shadow-amber-500/10'
                    : isLight
                    ? 'bg-white border-2 border-slate-200/90 hover:border-amber-300 shadow-sm'
                    : isNeon
                    ? 'bg-[#04241d]/90 border border-emerald-500/30 hover:border-emerald-400 shadow-md'
                    : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700/90'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                    isLight ? 'bg-slate-100 border-slate-300' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-800 border-slate-700'
                  }`}>
                    {bot.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold text-xs sm:text-sm truncate ${
                        isLight ? 'text-slate-900 font-extrabold' : 'text-white'
                      }`}>
                        {bot.name}
                      </h3>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                        isLight
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : isNeon
                          ? 'bg-[#021411] text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-amber-300 border-slate-700'
                      }`}>
                        {bot.levelTitle}
                      </span>
                      {isBotSelected && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          isLight
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : isNeon
                            ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          ✓ {language === 'id' ? 'Aktif' : 'Selected'}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-tight line-clamp-2 ${
                      isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}>
                      {bot.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startDuel(bot);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Duel</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Aturan */}
      <div className={`mt-3 rounded-2xl p-3 text-center border transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
          : isNeon
          ? 'bg-[#04241d]/80 border-emerald-500/30 text-emerald-300'
          : 'bg-slate-900/60 border border-slate-800/80 text-slate-400'
      }`}>
        <p className={`text-xs leading-relaxed font-medium ${
          isLight ? 'text-slate-700' : 'text-slate-400'
        }`}>
          ⚡ {t.duelTips}
        </p>
      </div>
    </div>
  );
};
