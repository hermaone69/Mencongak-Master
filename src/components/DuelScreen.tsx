import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Swords, Bot, User, Trophy, Play, RefreshCw, Flame, ArrowLeft, 
  Zap, AlertCircle, PenTool, Sparkles, SlidersHorizontal, CheckCircle2 
} from 'lucide-react';
import { DifficultyLevel, MathOperation, Question, Language } from '../types';
import { generateQuestion } from '../utils/mathGenerator';
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
  const { recordAnswer, addCoins, addXP, stats, language } = useGame();
  const t = getTranslation(language);
  const botList = getBotOpponents(language);

  // Settings
  const [selectedBotId, setSelectedBotId] = useState<string>(botList[0].id);
  const [selectedOperation, setSelectedOperation] = useState<MathOperation>('mixed');
  const [totalRounds, setTotalRounds] = useState<number>(8);

  const selectedBot = botList.find(b => b.id === selectedBotId) || botList[0];

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

    const firstQ = generateQuestion(bot.difficulty, selectedOperation, language);
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
      const nextQ = generateQuestion(bot.difficulty, selectedOperation, language);
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

    const suddenQ = generateQuestion(selectedBot.difficulty, selectedOperation, language);
    setCurrentQuestion(suddenQ);
    startRound(suddenQ, selectedBot, totalRounds + 1);
  };

  // 1. ARENA BERTANDING REAL-TIME
  if (isDueling && currentQuestion && !duelWinner) {
    return (
      <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-slate-950 text-slate-100 select-none relative overflow-y-auto">
        {/* Top Navigation & Surrender Button */}
        <div className="flex items-center justify-between z-10">
          <button
            onClick={() => {
              sounds.playTap();
              setIsDueling(false);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-amber-400">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.duelRounds} {currentRound} / {totalRounds}</span>
          </div>

          <button
            onClick={() => setIsScratchpadOpen(true)}
            className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:text-amber-200 cursor-pointer flex items-center gap-1 text-xs font-bold shadow-sm"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{t.scratchpad}</span>
          </button>
        </div>

        {/* Scoreboard Dual Racer Bar */}
        <div className="my-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            {/* Player Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                😎
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{t.duelYou}</span>
                <span className="text-sm font-black text-amber-400 font-mono-math leading-none">
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
                <span className="text-xs font-bold text-white block">{selectedBot.name}</span>
                <span className="text-sm font-black text-sky-400 font-mono-math leading-none">
                  {botScore} Pts
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow-inner">
                {selectedBot.avatar}
              </div>
            </div>
          </div>

          {/* Tug-of-war Progress Racer */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
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
              className="h-full bg-slate-700 transition-all duration-300 flex-1"
            />
          </div>
        </div>

        {/* Bot Dialogue Reaction Speech Bubble */}
        <div className="my-1.5 p-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-2.5 shadow-sm">
          <span className="text-xl animate-pulse">{selectedBot.avatar}</span>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-amber-400 block">{selectedBot.name}:</span>
            <p className="text-xs text-slate-200 font-medium truncate italic">
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

          <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col items-center justify-center text-center shadow-2xl">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {t.duelTopic} · {currentQuestion.operation.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsScratchpadOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
                title={t.scratchpad}
              >
                <PenTool className="w-3 h-3" />
                <span>{t.scratchpad}</span>
              </button>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-mono-math tracking-tight my-2">
              {currentQuestion.questionText.replace(' = ?', '')} = ?
            </div>
          </div>
        </div>

        {/* Multiple Choice Answer Buttons */}
        <div className="grid grid-cols-2 gap-2.5 my-2">
          {currentQuestion.options.map((option, idx) => {
            const isHighlighted = highlightedAnswer?.option === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;

            return (
              <button
                key={idx}
                disabled={!isRoundActiveRef.current}
                onClick={() => handlePlayerAnswer(option)}
                className={`h-14 sm:h-16 rounded-2xl font-mono-math font-extrabold text-xl sm:text-2xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  isHighlighted && highlightedAnswer?.isCorrect
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/40 font-black'
                    : isHighlighted && !highlightedAnswer?.isCorrect
                    ? 'bg-rose-500 text-white ring-4 ring-rose-400/40'
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
      <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 text-slate-100 select-none overflow-y-auto">
        <div className="text-center pt-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 mb-3 animate-bounce">
            {isPlayerVictory ? '🏆' : isTie ? '🤝' : '🦾'}
          </div>

          <h2 className="text-2xl font-black text-white font-display">
            {isPlayerVictory ? t.duelWin : isTie ? t.duelTie : `${selectedBot.name} ${t.duelLoss}`}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {isPlayerVictory ? t.duelWinDesc : isTie ? t.duelTieDesc : t.duelLossDesc}
          </p>
        </div>

        {/* Final Duel Scoreboard */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 my-3 space-y-3">
          <div className="flex items-center justify-around py-2">
            <div className="text-center">
              <span className="text-xs text-slate-400 font-bold block">{t.duelYou}</span>
              <span className="text-3xl font-black text-amber-400 font-mono-math">{playerScore}</span>
            </div>
            <div className="text-xl font-black text-slate-600 font-mono-math">VS</div>
            <div className="text-center">
              <span className="text-xs text-slate-400 font-bold block">{selectedBot.name}</span>
              <span className="text-3xl font-black text-sky-400 font-mono-math">{botScore}</span>
            </div>
          </div>

          {isTie && (
            <button
              onClick={playSuddenDeath}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-xs hover:bg-amber-500/30 cursor-pointer transition-colors shadow-sm"
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
            className="w-full h-11 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t.chooseOtherBot}
          </button>
        </div>
      </div>
    );
  }

  // 3. TAMPILAN UTAMA: PENGATURAN & PILIH LAWAN DUEL
  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 bg-slate-950 text-slate-100 select-none overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            {t.duelHeader}
          </span>
          <span className="text-[11px] text-slate-400 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
            🏆 {stats.totalDuelsWon} {t.duelWinsCount}
          </span>
        </div>
        <h1 className="text-xl font-black text-white font-display">
          {t.duelTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.duelSubtitle}
        </p>

        {/* Filter Pengaturan Duel: Operasi Hitung & Jumlah Ronde */}
        <div className="my-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-amber-400" />
              <span>{t.duelTopic}</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">{t.duelRounds}:</span>
              {[5, 8, 10].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    sounds.playTap();
                    setTotalRounds(r);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
                    totalRounds === r
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Tombol Pilihan Operasi */}
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'mixed', label: t.opAll, icon: '🔀' },
              { id: '×', label: language === 'id' ? 'Kali (×)' : 'Mult (×)', icon: '✖️' },
              { id: '÷', label: language === 'id' ? 'Bagi (÷)' : 'Div (÷)', icon: '➗' },
              { id: '+', label: language === 'id' ? 'Tambah (+)' : 'Add (+)', icon: '➕' },
              { id: '-', label: language === 'id' ? 'Kurang (−)' : 'Sub (−)', icon: '➖' }
            ].map(op => {
              const isSelected = selectedOperation === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedOperation(op.id as MathOperation);
                  }}
                  className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400'
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
        </div>

        {/* Daftar Bot AI */}
        <div className="space-y-2.5">
          {botList.map(bot => (
            <div
              key={bot.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-3 flex items-center justify-between transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {bot.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                      {bot.name}
                    </h3>
                    <span className="text-[9px] bg-slate-800 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-slate-700">
                      {bot.levelTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                    {bot.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => startDuel(bot)}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Duel</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Aturan */}
      <div className="mt-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-center">
        <p className="text-xs text-slate-400 leading-relaxed">
          ⚡ {t.duelTips}
        </p>
      </div>
    </div>
  );
};
