import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Bot, User, Trophy, Play, RefreshCw, Flame, 
  Zap, AlertCircle, PenTool, Sparkles, CheckCircle2, XCircle, ArrowRight
} from 'lucide-react';
import { DifficultyLevel, MathOperation, Question } from '../types';
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
  avgSpeedSec: number;
  accuracy: number;
  rewardCoins: number;
  description: string;
  personality: {
    thinking: string[];
    onPlayerWinRound: string[];
    onBotWinRound: string[];
    onBotFailRound: string[];
  };
}

const BOTS: BotOpponent[] = [
  {
    id: 'bot_bobi',
    name: 'Robot Bobi',
    avatar: '🤖',
    levelTitle: 'SD Pemula',
    avgSpeedSec: 3.5,
    accuracy: 0.78,
    rewardCoins: 30,
    description: 'Kecepatan santai (~3.5 dtk). Ramah dan cocok untuk pemanasan.',
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
        'Aduh keliru hitung! Rebut poinnya! ⚠️'
      ]
    }
  },
  {
    id: 'bot_alpha',
    name: 'Kalkulator Alpha',
    avatar: '🦾',
    levelTitle: 'SMP Aritmatika',
    avgSpeedSec: 2.2,
    accuracy: 0.90,
    rewardCoins: 60,
    description: 'Kecepatan menengah (~2.2 dtk). Cukup tangkas dan konsisten.',
    personality: {
      thinking: [
        'Alpha: Algoritma kalkulasi 95% aktif... ⚡',
        'Alpha: Memindai opsi jawaban terbaik... 🔬',
        'Alpha: Sinkronisasi rumus kilat... 🦾'
      ],
      onPlayerWinRound: [
        'Alpha: Luar biasa! Kecepatanmu di atas rata-rata! 🚀',
        'Alpha: Logika dan refleksmu melampaui prediksiku! 💡',
        'Alpha: Poin layak untuk reflek secepat itu! 👏'
      ],
      onBotWinRound: [
        'Alpha: Eksekusi tepat waktu berhasil! 🎯',
        'Alpha: Algoritma mencongak sukses! Poin diamankan! ⚡',
        'Alpha: Kecepatan kalkulasi optimal! 🦾'
      ],
      onBotFailRound: [
        'Alpha: Anomali hitung terdeteksi! Peluang emasmu! ⚠️',
        'Alpha: Kesalahan presisi! Jawab sekarang! 🛑'
      ]
    }
  },
  {
    id: 'bot_sigma',
    name: 'Grandmaster Sigma',
    avatar: '🧠',
    levelTitle: 'Olimpiade Master',
    avgSpeedSec: 1.4,
    accuracy: 0.98,
    rewardCoins: 100,
    description: 'Kecepatan super kilat (~1.4 dtk). Lawan terkuat para juara!',
    personality: {
      thinking: [
        'Sigma: Menghitung secara instan di dalam memori... 🧠⚡',
        'Sigma: Pola angka telah terpecahkan... ♟️',
        'Sigma: Mencongak adalah seni harmoni... 🌌'
      ],
      onPlayerWinRound: [
        'Sigma: Refleks mencongakmu sungguh mengagumkan! 👑',
        'Sigma: Jarang ada manusia secepat ini! Hormat! 🎖️',
        'Sigma: Kecepatan luar biasa! Poin mutlak milikmu! 🔥'
      ],
      onBotWinRound: [
        'Sigma: Eksekusi mental hitung sempurna! ⚡',
        'Sigma: Kecepatan grandmaster berbicara! ♟️',
        'Sigma: Poin ronde diamankan! Teruslah berlatih! 🧠'
      ],
      onBotFailRound: [
        'Sigma: Kemencongakanmu mendahului perhitungan saya! 🌟',
        'Sigma: Gangguan fokus sejenak! Cepat kunci jawaban! ⚡'
      ]
    }
  }
];

const WINNING_SCORE = 5;

export const AiDuelGame: React.FC = () => {
  const { 
    language, 
    themeMode, 
    coins, 
    addCoins, 
    recordQuestionAttempt,
    playerName,
    mainDifficulty,
    mainOperations,
    mainMaxNumber
  } = useGame();

  const isLight = themeMode === 'light';
  const t = getTranslation(language);

  const [selectedBot, setSelectedBot] = useState<BotOpponent>(BOTS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [botScore, setBotScore] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [botSpeech, setBotSpeech] = useState<string>('');
  const [roundWinner, setRoundWinner] = useState<'player' | 'bot' | 'tie' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [matchWinner, setMatchWinner] = useState<'player' | 'bot' | null>(null);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);

  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, []);

  // Start new match
  const handleStartMatch = (bot: BotOpponent) => {
    sounds.playTap();
    setSelectedBot(bot);
    setPlayerScore(0);
    setBotScore(0);
    setRoundNumber(1);
    setMatchWinner(null);
    setRoundWinner(null);
    setSelectedAnswer(null);
    setIsPlaying(true);
    startRound(bot, 1);
  };

  // Start new round
  const startRound = (bot: BotOpponent, round: number) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setRoundWinner(null);
    setSelectedAnswer(null);

    // Generate question strictly following menu Main filters
    const q = generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber);
    setCurrentQuestion(q);

    // Pick random thinking dialog
    const thinkDialogs = bot.personality.thinking;
    const initialDialog = thinkDialogs[Math.floor(Math.random() * thinkDialogs.length)];
    setBotSpeech(initialDialog);

    // Schedule bot's answer attempt
    const botThinkingTime = (bot.avgSpeedSec * 1000) * (0.85 + Math.random() * 0.3);
    botTimerRef.current = setTimeout(() => {
      handleBotAnswer(bot, q);
    }, botThinkingTime);
  };

  // Bot attempts to answer
  const handleBotAnswer = (bot: BotOpponent, q: Question) => {
    if (roundWinner !== null || matchWinner !== null) return;

    const isBotAccurate = Math.random() < bot.accuracy;
    if (isBotAccurate) {
      // Bot answered correctly first!
      sounds.playWrong();
      setRoundWinner('bot');
      const dialogs = bot.personality.onBotWinRound;
      setBotSpeech(dialogs[Math.floor(Math.random() * dialogs.length)]);

      const newBotScore = botScore + 1;
      setBotScore(newBotScore);

      // Check match winner
      if (newBotScore >= WINNING_SCORE) {
        setMatchWinner('bot');
      } else {
        setTimeout(() => {
          setRoundNumber(prev => prev + 1);
          startRound(bot, roundNumber + 1);
        }, 1800);
      }
    } else {
      // Bot made a mistake! Gives player golden chance
      const failDialogs = bot.personality.onBotFailRound;
      setBotSpeech(failDialogs[Math.floor(Math.random() * failDialogs.length)]);
    }
  };

  // Player clicks answer
  const handlePlayerAnswer = (ans: number) => {
    if (roundWinner !== null || matchWinner !== null || !currentQuestion) return;
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    setSelectedAnswer(ans);
    const isCorrect = ans === currentQuestion.correctAnswer;

    // Record question in player history
    recordQuestionAttempt({
      questionText: currentQuestion.questionText,
      question: currentQuestion.questionText,
      userAnswer: ans,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      mode: 'ai_duel',
      level: mainDifficulty,
      responseTimeSec: 1.5
    });

    if (isCorrect) {
      sounds.playCorrect();
      setRoundWinner('player');
      const dialogs = selectedBot.personality.onPlayerWinRound;
      setBotSpeech(dialogs[Math.floor(Math.random() * dialogs.length)]);

      const newPlayerScore = playerScore + 1;
      setPlayerScore(newPlayerScore);

      if (newPlayerScore >= WINNING_SCORE) {
        sounds.playFanfare();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        addCoins(selectedBot.rewardCoins);
        setMatchWinner('player');
      } else {
        setTimeout(() => {
          setRoundNumber(prev => prev + 1);
          startRound(selectedBot, roundNumber + 1);
        }, 1600);
      }
    } else {
      // Player wrong
      sounds.playWrong();
      setRoundWinner('bot');
      setBotSpeech(`${selectedBot.name}: Jawaban kamu kurang tepat! Kunci: ${currentQuestion.correctAnswer}`);

      const newBotScore = botScore + 1;
      setBotScore(newBotScore);

      if (newBotScore >= WINNING_SCORE) {
        setMatchWinner('bot');
      } else {
        setTimeout(() => {
          setRoundNumber(prev => prev + 1);
          startRound(selectedBot, roundNumber + 1);
        }, 2000);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none relative">
      {/* LOBBY / BOT SELECTOR (WHEN NOT PLAYING) */}
      {!isPlaying && (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          <div className="text-center space-y-1 mb-2">
            <h3 className="font-black text-base sm:text-lg flex items-center justify-center gap-1.5 text-amber-500">
              <Bot className="w-5 h-5" />
              <span>Duel Hitung Cepat vs AI</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pilih lawan AI untuk bertanding adu kecepatan & ketepatan (First to {WINNING_SCORE} Poin)!
            </p>
          </div>

          <div className="space-y-2.5 max-w-md mx-auto">
            {BOTS.map(bot => (
              <div
                key={bot.id}
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  isLight ? 'bg-white border-slate-200 hover:border-amber-400 shadow-xs' : 'bg-slate-900 border-slate-800 hover:border-amber-500'
                } flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-3xl shrink-0">
                    {bot.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">{bot.name}</h4>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black">
                        {bot.levelTitle}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{bot.description}</p>
                    <div className="text-[9px] text-amber-600 font-bold mt-1 flex items-center gap-2">
                      <span>⚡ Kecepatan: ~{bot.avgSpeedSec}s</span>
                      <span>🎁 Hadiah: +{bot.rewardCoins} Koin</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartMatch(bot)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>Mulai</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE DUEL ARENA */}
      {isPlaying && (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-3 space-y-2.5 relative">
          {/* Top Scoreboard: Player vs Bot */}
          <div className={`p-2.5 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          } flex items-center justify-between gap-2`}>
            {/* Player Side */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5">
                <div className={`w-full h-full rounded-[10px] ${isLight ? 'bg-white' : 'bg-slate-900'} flex items-center justify-center text-base`}>
                  😎
                </div>
              </div>
              <div>
                <span className="text-xs font-black block truncate max-w-[80px]">{playerName}</span>
                <span className="text-[10px] text-slate-400 font-bold">Skor:</span>
              </div>
              <span className="font-mono-math font-black text-2xl text-emerald-500 ml-1">
                {playerScore}
              </span>
            </div>

            {/* Middle: Target Indicator */}
            <div className="text-center px-2">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Ronde {roundNumber}</span>
              <span className="text-xs font-black text-amber-500">First to {WINNING_SCORE}</span>
            </div>

            {/* Bot Side */}
            <div className="flex items-center gap-2 justify-end">
              <span className="font-mono-math font-black text-2xl text-sky-500 mr-1">
                {botScore}
              </span>
              <div className="text-right">
                <span className="text-xs font-black block truncate max-w-[80px]">{selectedBot.name}</span>
                <span className="text-[10px] text-slate-400 font-bold">AI Bot:</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-xl shrink-0">
                {selectedBot.avatar}
              </div>
            </div>
          </div>

          {/* Bot Speech Bubble Dialog */}
          <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
            isLight ? 'bg-sky-50 border-sky-200 text-sky-950' : 'bg-slate-900/90 border-sky-900/40 text-sky-200'
          }`}>
            <span className="text-base shrink-0">{selectedBot.avatar}</span>
            <span className="font-medium italic leading-tight text-[11px]">{botSpeech}</span>
          </div>

          {/* Math Problem Card */}
          {currentQuestion && (
            <div className={`p-4 rounded-3xl border-2 ${
              isLight ? 'bg-white border-amber-300 shadow-md' : 'bg-slate-900 border-amber-400/50 shadow-lg'
            } flex flex-col items-center justify-center space-y-3`}>
              <span className="text-[10px] uppercase font-bold text-slate-400">Pecahkan Soal Cepat:</span>
              <div className="font-mono-math font-black text-3xl sm:text-4xl text-amber-500 tracking-wider">
                {currentQuestion.questionText.includes('= ?') ? currentQuestion.questionText : `${currentQuestion.questionText} = ?`}
              </div>

              {/* 4 Multiple Choice Answer Buttons */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs pt-1">
                {currentQuestion.options.map((opt, idx) => {
                  const isChosen = selectedAnswer === opt;
                  const isAnswerCorrect = opt === currentQuestion.correctAnswer;
                  
                  let btnColor = isLight 
                    ? 'bg-slate-100 hover:bg-amber-100 border-slate-200 text-slate-900' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white';

                  if (roundWinner !== null) {
                    if (isAnswerCorrect) {
                      btnColor = 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md';
                    } else if (isChosen) {
                      btnColor = 'bg-rose-500 text-white font-black border-rose-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handlePlayerAnswer(opt)}
                      disabled={roundWinner !== null || matchWinner !== null}
                      className={`py-3 px-2 rounded-2xl border-2 font-mono-math font-black text-lg transition-all cursor-pointer active:scale-95 ${btnColor}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scratchpad and Give Up button */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={() => {
                sounds.playTap();
                setShowScratchpad(true);
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-amber-500 font-bold cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Buka Coretan</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                setIsPlaying(false);
              }}
              className="text-slate-400 hover:text-rose-500 font-bold cursor-pointer text-[11px]"
            >
              Keluar Duel
            </button>
          </div>
        </div>
      )}

      {/* MATCH FINISHED MODAL */}
      {matchWinner && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-3xl p-5 border-2 text-center space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-amber-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg ${
              matchWinner === 'player' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-sky-400'
            }`}>
              {matchWinner === 'player' ? '🏆' : '🤖'}
            </div>

            <div>
              <h3 className="font-black text-lg uppercase tracking-wide">
                {matchWinner === 'player' ? 'Selamat! Kamu Menang Duel!' : `${selectedBot.name} Memenangkan Duel!`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {matchWinner === 'player' 
                  ? `Luar biasa! Kamu berhasil mengalahkan ${selectedBot.name} dengan skor ${playerScore} - ${botScore}!`
                  : `Jangan menyerah! Coba lagi dan pertajam refleks mencongakmu!`}
              </p>
            </div>

            {matchWinner === 'player' && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400 text-amber-500 font-black text-xs">
                🎁 Bonus Hadiah: +{selectedBot.rewardCoins} Koin Game!
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleStartMatch(selectedBot)}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-transform"
              >
                Tanding Ulang 🔄
              </button>
              <button
                onClick={() => setIsPlaying(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Ganti Bot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scratchpad */}
      <ScratchpadCanvas
        isOpen={showScratchpad}
        onClose={() => setShowScratchpad(false)}
      />
    </div>
  );
};
