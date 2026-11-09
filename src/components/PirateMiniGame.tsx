import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Shield, Sparkles, Swords, RefreshCw, Zap, Trophy,
  SlidersHorizontal, CheckCircle2, XCircle, PenTool, Skull, ArrowRight, Flame, Bomb
} from 'lucide-react';
import { DifficultyLevel, MathOperation, Question } from '../types';
import { generateQuestion, getLevelMaxConfig } from '../utils/mathGenerator';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { getTranslation } from '../utils/translations';

interface SeaMonster {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  bountyReward: number;
  themeColor: string;
  attackName: string;
  avatarType: 'kraken' | 'shark' | 'crab' | 'serpent' | 'neptune';
}

interface FloatingCombatText {
  id: string;
  target: 'player' | 'monster';
  text: string;
  color: string;
  isCritical?: boolean;
}

const SEA_MONSTERS: SeaMonster[] = [
  {
    id: 'kraken_kuro',
    name: 'Gurita Kurotako',
    title: 'Monster Tentakel Ungu',
    maxHp: 100,
    bountyReward: 30000000,
    themeColor: 'from-purple-500 to-indigo-600',
    attackName: 'Semprotan Tinta Laut! 🐙💦',
    avatarType: 'kraken'
  },
  {
    id: 'shark_chomper',
    name: 'Hiu Karang Sharko',
    title: 'Pemangsa Karang Tajam',
    maxHp: 120,
    bountyReward: 50000000,
    themeColor: 'from-cyan-500 to-blue-700',
    attackName: 'Gigitan Ombak Ganas! 🦈⚡',
    avatarType: 'shark'
  },
  {
    id: 'crab_iron',
    name: 'Kepiting Kanimon',
    title: 'Penjepit Baja Karang',
    maxHp: 140,
    bountyReward: 75000000,
    themeColor: 'from-orange-500 to-rose-600',
    attackName: 'Capitan Karang Raksasa! 🦀💥',
    avatarType: 'crab'
  },
  {
    id: 'serpent_levi',
    name: 'Naga Samudera Leviathan',
    title: 'Penguasa Badai Laut',
    maxHp: 160,
    bountyReward: 100000000,
    themeColor: 'from-emerald-500 to-teal-800',
    attackName: 'Pusaran Naga Air! 🐉🌊',
    avatarType: 'serpent'
  },
  {
    id: 'king_neptune',
    name: 'Kaisar Laut Purba',
    title: 'Raja Monster Grand Line',
    maxHp: 200,
    bountyReward: 150000000,
    themeColor: 'from-amber-500 to-orange-700',
    attackName: 'Murka Trisula Samudera! 👑🔱',
    avatarType: 'neptune'
  }
];

export const PirateMiniGame: React.FC = () => {
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

  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);

  // Combat State
  const PLAYER_MAX_HP = 100;
  const [playerHp, setPlayerHp] = useState<number>(PLAYER_MAX_HP);
  const [currentMonsterIdx, setCurrentMonsterIdx] = useState<number>(0);
  const activeMonster = SEA_MONSTERS[currentMonsterIdx % SEA_MONSTERS.length];
  const [monsterHp, setMonsterHp] = useState<number>(activeMonster.maxHp);
  const [bounty, setBounty] = useState<number>(30000000);
  const [monstersDefeated, setMonstersDefeated] = useState<number>(0);
  
  // Question generated strictly following menu Main filters
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => 
    generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber)
  );
  const [userInput, setUserInput] = useState<string>('');

  // Re-generate question when main filters update
  useEffect(() => {
    const q = generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber);
    setCurrentQuestion(q);
    setUserInput('');
    setFuseTime(FUSE_MAX_SECONDS);
  }, [mainDifficulty, mainOperations, mainMaxNumber, language]);

  // Visual Timer: Sumbu Meriam (Cannon Fuse) - 20 Seconds
  const FUSE_MAX_SECONDS = 20.0;
  const [fuseTime, setFuseTime] = useState<number>(FUSE_MAX_SECONDS);
  const [isFusePaused, setIsFusePaused] = useState<boolean>(false);

  // Floating Combat Texts (Teks Damage Melayang)
  const [floatingTexts, setFloatingTexts] = useState<FloatingCombatText[]>([]);

  // White Impact Flash (Kilatan Cahaya 100ms)
  const [showImpactFlash, setShowImpactFlash] = useState<boolean>(false);

  // Animations & Visual Effects
  const [isPunching, setIsPunching] = useState<boolean>(false);
  const [isMonsterHit, setIsMonsterHit] = useState<boolean>(false);
  const [isMonsterAttacking, setIsMonsterAttacking] = useState<boolean>(false);
  const [isPlayerHit, setIsPlayerHit] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [hitComicText, setHitComicText] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'hit' | 'miss'; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showTouchKeypad, setShowTouchKeypad] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);

  // Spawn floating combat damage text and auto remove after animation (850ms)
  const spawnFloatingDamage = useCallback((target: 'player' | 'monster', text: string, color: string, isCritical: boolean = false) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, target, text, color, isCritical }]);

    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 850);
  }, []);

  // Trigger white impact flash (100ms)
  const triggerImpactFlash = useCallback(() => {
    setShowImpactFlash(true);
    setTimeout(() => {
      setShowImpactFlash(false);
    }, 110);
  }, []);

  // Auto-focus input when game is active
  useEffect(() => {
    if (!isGameOver && !isPunching && !isMonsterAttacking) {
      inputRef.current?.focus();
    }
  }, [currentQuestion, isGameOver, isPunching, isMonsterAttacking]);

  // Generate next question using main filters and reset Cannon Fuse
  const nextQuestion = useCallback(() => {
    const q = generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber);
    setCurrentQuestion(q);
    setUserInput('');
    setFuseTime(FUSE_MAX_SECONDS);
    setIsFusePaused(false);
    inputRef.current?.focus();
  }, [mainDifficulty, mainOperations, language, mainMaxNumber]);

  const playerHpRef = useRef(playerHp);
  playerHpRef.current = playerHp;

  // Monster counter-attacks Luffy
  const handleMonsterCounterAttack = useCallback((reason: string, customDamage?: number) => {
    setIsFusePaused(true);
    // Retro 8-bit synthetic sound for taking hit / wrong answer
    sounds.play8BitHit();
    sounds.playMonsterAttack();
    setIsMonsterAttacking(true);
    setHitComicText(null);

    setTimeout(() => {
      setIsPlayerHit(true);
      setIsScreenShaking(true);
      const monsterDamage = customDamage ?? 25;
      const currentHp = playerHpRef.current;
      const newPlayerHp = Math.max(0, currentHp - monsterDamage);
      setPlayerHp(newPlayerHp);

      // Spawn floating damage above Luffy
      spawnFloatingDamage('player', `-${monsterDamage}`, 'text-rose-500');

      setFeedbackMsg({
        type: 'miss',
        text: reason
      });

      if (newPlayerHp <= 0) {
        setTimeout(() => {
          sounds.playGameOver();
          setIsGameOver(true);
          setIsMonsterAttacking(false);
          setIsPlayerHit(false);
          setIsScreenShaking(false);
        }, 700);
      } else {
        setTimeout(() => {
          setIsMonsterAttacking(false);
          setIsPlayerHit(false);
          setIsScreenShaking(false);
          setFeedbackMsg(null);
          nextQuestion();
        }, 1100);
      }
    }, 250);
  }, [spawnFloatingDamage, nextQuestion]);

  // Defeat Monster handler
  const handleDefeatMonster = useCallback(() => {
    setIsFusePaused(true);
    sounds.playDefeatMonster();
    confetti({
      particleCount: 85,
      spread: 80,
      origin: { y: 0.6 }
    });

    const defeatedCount = monstersDefeated + 1;
    setMonstersDefeated(defeatedCount);

    const bonusBounty = activeMonster.bountyReward;
    setBounty(prev => prev + bonusBounty);
    addCoins(25);

    setFeedbackMsg({
      type: 'hit',
      text: language === 'id' 
        ? `🎉 ${activeMonster.name} TUMBANG! +฿ ${(bonusBounty / 1000000).toFixed(0)} JUTA & +25 KOIN!` 
        : `🎉 ${activeMonster.name} DEFEATED! +฿ ${(bonusBounty / 1000000).toFixed(0)}M & +25 COINS!`
    });

    setTimeout(() => {
      setIsPunching(false);
      setIsMonsterHit(false);
      setIsScreenShaking(false);
      setHitComicText(null);
      setFeedbackMsg(null);

      const nextIdx = currentMonsterIdx + 1;
      setCurrentMonsterIdx(nextIdx);
      const nextMon = SEA_MONSTERS[nextIdx % SEA_MONSTERS.length];
      setMonsterHp(nextMon.maxHp);
      nextQuestion();
    }, 1600);
  }, [activeMonster, monstersDefeated, addCoins, language, currentMonsterIdx, nextQuestion]);

  // Visual Cannon Fuse (Sumbu Meriam) countdown interval (100ms ticks)
  useEffect(() => {
    if (isGameOver || isPunching || isMonsterAttacking || isFusePaused || feedbackMsg !== null) {
      return;
    }

    const interval = setInterval(() => {
      setFuseTime(prev => {
        if (prev <= 0.1) {
          return 0;
        }
        return Math.max(0, +(prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver, isPunching, isMonsterAttacking, isFusePaused, feedbackMsg]);

  // Handle Fuse Timeout cleanly when fuseTime reaches 0
  useEffect(() => {
    if (fuseTime <= 0 && !isGameOver && !isFusePaused && !isPunching && !isMonsterAttacking && feedbackMsg === null) {
      setIsFusePaused(true);
      recordQuestionAttempt({
        questionText: currentQuestion.questionText,
        question: currentQuestion.questionText,
        userAnswer: 0,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        mode: 'pirate_mini_game',
        level: mainDifficulty,
        responseTimeSec: 20.0
      });

      handleMonsterCounterAttack(
        language === 'id' 
          ? `💣 Waktu habis! Sumbu meriam meledak! (Kunci: ${currentQuestion.correctAnswer})`
          : `💣 Time out! Fuse blew! (Answer: ${currentQuestion.correctAnswer})`,
        25
      );
    }
  }, [fuseTime, isGameOver, isFusePaused, isPunching, isMonsterAttacking, feedbackMsg, currentQuestion, mainDifficulty, language, recordQuestionAttempt, handleMonsterCounterAttack]);

  // Trigger attack from user submission
  const handleAttack = () => {
    if (isGameOver || isPunching || isMonsterAttacking || isFusePaused) return;

    const trimmed = userInput.trim();
    if (!trimmed) {
      handleMonsterCounterAttack(language === 'id' ? 'Ketik jawaban dulu!' : 'Type an answer first!');
      return;
    }

    const numericAnswer = Number(trimmed);
    const isCorrect = numericAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.max(0.5, +(FUSE_MAX_SECONDS - fuseTime).toFixed(1));

    // Record attempt in player history
    recordQuestionAttempt({
      questionText: currentQuestion.questionText,
      question: currentQuestion.questionText,
      userAnswer: numericAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      mode: 'pirate_mini_game',
      level: mainDifficulty,
      responseTimeSec: timeSpent
    });

    if (isCorrect) {
      // --- PLAYER CORRECT: GUM-GUM PUNCH ATTACK ---
      setIsFusePaused(true);
      // Retro 8-bit synthetic sound for correct attack
      sounds.play8BitAttack();
      sounds.playPunch();

      setIsPunching(true);
      setHitComicText(language === 'id' ? '💥 KENA!' : '💥 HIT!');
      setIsScreenShaking(true);

      setTimeout(() => {
        // High impact flash on hit connect
        triggerImpactFlash();
        setIsMonsterHit(true);

        const damage = Math.floor(Math.random() * 15) + 35; // 35-50 damage
        const isCrit = damage >= 45;
        const newMonsterHp = Math.max(0, monsterHp - damage);
        setMonsterHp(newMonsterHp);

        // Spawn floating damage above Monster
        spawnFloatingDamage('monster', `-${damage}`, isCrit ? 'text-amber-300' : 'text-rose-400', isCrit);

        // Bounty increase
        const bountyGain = 5000000;
        setBounty(prev => prev + bountyGain);

        setFeedbackMsg({
          type: 'hit',
          text: language === 'id' ? `Serangan Kena! Monster -${damage} HP` : `Hit! Monster took -${damage} HP`
        });

        if (newMonsterHp <= 0) {
          handleDefeatMonster();
        } else {
          setTimeout(() => {
            setIsPunching(false);
            setIsMonsterHit(false);
            setIsScreenShaking(false);
            setHitComicText(null);
            setFeedbackMsg(null);
            nextQuestion();
          }, 650);
        }
      }, 200);

    } else {
      // --- PLAYER WRONG: MONSTER COUNTERATTACK ---
      handleMonsterCounterAttack(
        language === 'id' 
          ? `Kurang tepat! Kunci: ${currentQuestion.correctAnswer}` 
          : `Wrong! Answer: ${currentQuestion.correctAnswer}`
      );
    }
  };

  // Restart Game
  const handleRestart = () => {
    sounds.playTap();
    setPlayerHp(PLAYER_MAX_HP);
    setCurrentMonsterIdx(0);
    setMonsterHp(SEA_MONSTERS[0].maxHp);
    setBounty(30000000);
    setMonstersDefeated(0);
    setIsGameOver(false);
    setFeedbackMsg(null);
    setHitComicText(null);
    setFloatingTexts([]);
    nextQuestion();
  };

  // Touch Keypad handler for mobile kids
  const handleKeypadPress = (val: string) => {
    sounds.playTap();
    if (val === 'C') {
      setUserInput('');
    } else if (val === 'DEL') {
      setUserInput(prev => prev.slice(0, -1));
    } else {
      if (userInput.length < 7) {
        setUserInput(prev => prev + val);
      }
    }
  };

  const formatBounty = (num: number) => {
    return '฿ ' + num.toLocaleString('id-ID');
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none relative ${
      isScreenShaking ? 'animate-screen-shake' : ''
    } ${
      isLight 
        ? 'bg-gradient-to-b from-sky-100/50 via-white to-amber-50/60' 
        : 'bg-gradient-to-b from-slate-950 via-[#071326] to-[#04101e]'
    }`}>
      {/* WHITE IMPACT FLASH OVERLAY (100ms on correct hit) */}
      {showImpactFlash && (
        <div className="absolute inset-0 bg-white pointer-events-none z-50 animate-impact-flash rounded-3xl" />
      )}

      {/* SUB-HEADER / HUD */}
      <div className={`px-3 py-1.5 border-b ${
        isLight ? 'bg-amber-50/65 border-amber-200/70' : 'bg-slate-950/60 border-slate-800/60'
      } flex items-center justify-between text-xs shrink-0 z-20 backdrop-blur-md`}>
        {/* Bounty */}
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-500 font-black flex items-center justify-center text-xs">
            ฿
          </span>
          <div className="flex flex-col">
            <span className="text-[8px] font-black tracking-wider text-amber-600 uppercase">
              {t.bountyLabel || 'BURONAN'}
            </span>
            <span className="text-xs font-black font-mono-math text-amber-500 leading-none">
              {formatBounty(bounty)}
            </span>
          </div>
        </div>

        {/* Defeated Monsters & Scratchpad */}
        <div className="flex items-center gap-1.5">
          <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${
            isLight ? 'bg-white/80 border-amber-300 text-amber-900' : 'bg-slate-900/60 border-slate-700 text-amber-300'
          } backdrop-blur-xs`}>
            <Skull className="w-3 h-3 text-amber-500" />
            <span>{monstersDefeated} K.O.</span>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              setShowScratchpad(true);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight ? 'bg-white/80 border-slate-300 text-slate-700' : 'bg-slate-900/60 border-slate-700 text-slate-300'
            } backdrop-blur-xs`}
            title="Coretan Hitung"
          >
            <PenTool className="w-3 h-3 text-amber-500" />
          </button>
        </div>
      </div>

      {/* BATTLE STAGE AREA */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 py-2 space-y-2 relative">
        {/* DYNAMIC SKY & DRIFTING CLOUDS (Latar Belakang Dinamis) */}
        <div className="absolute top-2 inset-x-0 h-16 pointer-events-none overflow-hidden opacity-80 select-none z-0">
          <div className="flex justify-between items-center px-4 animate-cloud-drift">
            <span className="text-2xl filter drop-shadow-sm">☁️</span>
            <span className="text-xl mt-1 opacity-80">☁️</span>
            <span className="text-2xl opacity-90">☁️</span>
            <span className="text-lg -mt-2 opacity-75">☁️</span>
            <span className="text-2xl">☁️</span>
          </div>
        </div>

        {/* DYNAMIC MOVING OCEAN WAVES AT BOTTOM (2-Layered Waves) */}
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none overflow-hidden opacity-85 select-none z-0">
          {/* Back wave layer */}
          <div className="absolute inset-x-[-50px] bottom-4 flex justify-around text-xl animate-wave-drift-reverse">
            <span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span>
          </div>
          {/* Front wave layer */}
          <div className="absolute inset-x-[-50px] bottom-0 flex justify-around text-2xl animate-wave-drift">
            <span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-sky-600/40 to-transparent" />
        </div>

        {/* BATTLE STAGE: LUFFY vs MONSTER LAUT */}
        <div className="grid grid-cols-2 gap-2.5 items-center pt-0.5 z-10">
          {/* LEFT: LUFFY */}
          <div className={`p-2.5 rounded-2xl border transition-all ${
            isPlayerHit 
              ? 'bg-rose-500/25 border-rose-500 animate-shake shadow-lg' 
              : isLight 
              ? 'bg-white/45 border-amber-300/40 shadow-sm backdrop-blur-md' 
              : 'bg-slate-950/40 border-amber-500/30 shadow-lg backdrop-blur-md'
          } flex flex-col items-center relative overflow-visible`}>
            
            {/* Floating Combat Text for Luffy */}
            {floatingTexts.filter(ft => ft.target === 'player').map(ft => (
              <div 
                key={ft.id}
                className={`absolute -top-3 left-1/2 -translate-x-1/2 font-mono-math font-black text-2xl sm:text-3xl ${ft.color} animate-float-damage pointer-events-none z-40 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
              >
                {ft.text}
              </div>
            ))}

            {/* Luffy Title & HP */}
            <div className="w-full mb-1">
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="flex items-center gap-1 text-amber-500 truncate">
                  <span>👒</span>
                  <span className="truncate">Kapten Luffy</span>
                </span>
                <span className={`font-mono-math ${playerHp <= 25 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-emerald-500 font-bold'}`}>
                  {playerHp}/{PLAYER_MAX_HP}
                </span>
              </div>

              {/* Player HP Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden mt-0.5 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    playerHp > 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : playerHp > 25 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-600 to-red-500'
                  }`}
                  style={{ width: `${(playerHp / PLAYER_MAX_HP) * 100}%` }}
                />
              </div>
            </div>

            {/* Anime Luffy Graphic */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-0.5">
              {isPlayerHit && (
                <div className="absolute -top-2.5 -right-1 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-md animate-bounce z-20">
                  Aduh! 💥
                </div>
              )}

              <div className={`relative transition-all duration-200 ${
                isPunching ? 'scale-105 translate-x-3' : isPlayerHit ? 'scale-90 -translate-x-2 rotate-6' : 'animate-sea-bob'
              }`}>
                {/* Straw Hat Graphic */}
                <div className="relative flex flex-col items-center">
                  <div className="w-14 h-7 bg-amber-400 rounded-t-full border-2 border-amber-600 relative overflow-hidden shadow-xs">
                    <div className="absolute bottom-0 inset-x-0 h-2 bg-rose-600 border-t border-b border-rose-800" />
                  </div>
                  <div className="w-18 h-3 bg-amber-400 rounded-full border-2 border-amber-600 shadow-md -mt-1 z-10" />

                  {/* Head */}
                  <div className="w-12 h-10 bg-amber-100 rounded-2xl border-2 border-amber-300 -mt-1.5 flex flex-col items-center justify-center relative shadow-xs">
                    <div className="flex items-center gap-2.5 mt-0.5">
                      <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                      <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                    </div>
                    <div className="absolute top-4 left-2.5 w-1 h-0.5 bg-rose-600 rotate-12" />
                    <div className="w-4 h-1.5 border-b-2 border-slate-900 rounded-full mt-0.5" />
                  </div>

                  {/* Vest */}
                  <div className="w-10 h-8 bg-rose-600 rounded-t-lg border border-rose-700 flex items-center justify-between px-1 -mt-0.5 relative">
                    <div className="w-2 h-5 bg-amber-100 rounded-full" />
                    <div className="w-3 h-3 bg-amber-200/40 rounded-full" />
                    <div className="w-2 h-5 bg-amber-100 rounded-full" />
                  </div>
                </div>

                {/* STRETCHING RUBBER PUNCH ANIMATION */}
                {isPunching && (
                  <div className="absolute top-10 left-8 w-32 sm:w-40 h-7 flex items-center z-30 animate-punch-stretch pointer-events-none">
                    <div className="h-3.5 bg-amber-200 border-2 border-amber-500 flex-1 rounded-full shadow-md" />
                    <div className="text-3xl filter drop-shadow-md -ml-1">
                      🥊💨
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[9px] font-bold text-amber-600 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.2 rounded-full border border-amber-300/50">
              Topi Jerami ⚔️
            </div>
          </div>

          {/* RIGHT: SEA MONSTER */}
          <div className={`p-2.5 rounded-2xl border transition-all ${
            isMonsterHit 
              ? 'bg-rose-500/30 border-rose-500 animate-monster-hit shadow-lg' 
              : isLight 
              ? 'bg-white/45 border-sky-300/40 shadow-sm backdrop-blur-md' 
              : 'bg-slate-950/40 border-sky-500/30 shadow-lg backdrop-blur-md'
          } flex flex-col items-center relative overflow-visible`}>

            {/* Floating Combat Text for Sea Monster */}
            {floatingTexts.filter(ft => ft.target === 'monster').map(ft => (
              <div 
                key={ft.id}
                className={`absolute -top-3 left-1/2 -translate-x-1/2 font-mono-math font-black text-2xl sm:text-3xl ${ft.color} animate-float-damage pointer-events-none z-40 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
              >
                {ft.text} {ft.isCritical ? '⚡CRIT!' : ''}
              </div>
            ))}

            {/* Monster Title & HP */}
            <div className="w-full mb-1">
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="flex items-center gap-1 text-sky-500 truncate">
                  <span>🌊</span>
                  <span className="truncate">{activeMonster.name}</span>
                </span>
                <span className={`font-mono-math ${monsterHp <= 30 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-sky-500 font-bold'}`}>
                  {monsterHp}/{activeMonster.maxHp}
                </span>
              </div>

              {/* Monster HP Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden mt-0.5 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${(monsterHp / activeMonster.maxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Monster Sprite */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-0.5">
              {hitComicText && isMonsterHit && (
                <div className="absolute -top-3 inset-x-0 mx-auto text-center font-black text-xs text-yellow-300 bg-rose-600 px-2 py-0.5 rounded-lg border border-yellow-300 shadow-md animate-comic-pop z-30 whitespace-nowrap">
                  {hitComicText}
                </div>
              )}

              <div className={`relative transition-all duration-200 ${
                isMonsterHit ? 'scale-90 rotate-6 filter brightness-150' : isMonsterAttacking ? 'scale-120 -translate-x-3' : 'animate-sea-bob'
              }`}>
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl p-0.5 shadow-md flex items-center justify-center overflow-hidden"
                     style={{
                       background: activeMonster.avatarType === 'kraken'
                         ? 'linear-gradient(135deg, #a855f7, #6366f1)'
                         : activeMonster.avatarType === 'shark'
                         ? 'linear-gradient(135deg, #06b6d4, #1d4ed8)'
                         : activeMonster.avatarType === 'crab'
                         ? 'linear-gradient(135deg, #f97316, #dc2626)'
                         : activeMonster.avatarType === 'serpent'
                         ? 'linear-gradient(135deg, #10b981, #0f766e)'
                         : 'linear-gradient(135deg, #f59e0b, #b45309)'
                     }}
                >
                  <div className={`w-full h-full rounded-[14px] ${
                    isLight ? 'bg-white/90' : 'bg-slate-950/90'
                  } flex flex-col items-center justify-center text-4xl select-none`}>
                    {activeMonster.avatarType === 'kraken' && '🐙'}
                    {activeMonster.avatarType === 'shark' && '🦈'}
                    {activeMonster.avatarType === 'crab' && '🦀'}
                    {activeMonster.avatarType === 'serpent' && '🐉'}
                    {activeMonster.avatarType === 'neptune' && '👑🌊'}
                  </div>
                </div>

                {isMonsterAttacking && (
                  <div className="absolute top-1/2 right-10 w-24 h-6 text-xl flex items-center justify-end animate-ping z-30">
                    🌊💥
                  </div>
                )}
              </div>
            </div>

            <div className="text-[9px] font-bold text-sky-600 bg-sky-100/70 dark:bg-sky-950/60 px-2 py-0.2 rounded-full border border-sky-300/50 truncate max-w-[110px]">
              {activeMonster.title}
            </div>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {feedbackMsg && (
          <div className={`p-1.5 rounded-xl text-center font-black text-xs border animate-in zoom-in-95 z-20 ${
            feedbackMsg.type === 'hit'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
              : 'bg-rose-500 text-white border-rose-400 shadow-xs'
          }`}>
            {feedbackMsg.text}
          </div>
        )}

        {/* THE MATH PROBLEM CARD (TRANSLUCENT & RESPONSIVE) */}
        <div className={`p-3 sm:p-4 rounded-3xl border-2 ${
          isLight
            ? 'bg-white/50 border-amber-300/60 shadow-md'
            : 'bg-slate-950/45 border-amber-400/40 shadow-[0_4px_25px_rgba(245,158,11,0.15)]'
        } flex flex-col items-center justify-center space-y-2 z-10 backdrop-blur-md w-full max-w-sm mx-auto`}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Soal Hitung:</span>
            <div className="font-mono-math font-black text-2xl sm:text-3xl text-amber-500 tracking-wider">
              {currentQuestion.questionText.includes('= ?') ? currentQuestion.questionText : `${currentQuestion.questionText} = ?`}
            </div>
          </div>

          {/* WAKTU KETEGANGAN: VISUAL TIMER "SUMBU MERIAM" (CANNON FUSE) */}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold px-0.5">
              <span className="flex items-center gap-1 text-amber-500">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-fuse-spark" />
                <span>{language === 'id' ? 'Sumbu Meriam' : 'Cannon Fuse'}</span>
              </span>
              <span className={`font-mono-math ${fuseTime <= 5 ? 'text-rose-500 font-black animate-pulse' : 'text-amber-500'}`}>
                {fuseTime.toFixed(1)}s
              </span>
            </div>

            {/* Fuse Bar */}
            <div className="relative w-full h-3 rounded-full bg-slate-800/80 p-0.5 border border-amber-900/50 overflow-visible">
              <div 
                className={`h-full rounded-full transition-all duration-100 ${
                  fuseTime > 10
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500'
                    : fuseTime > 5
                    ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-rose-500'
                    : 'bg-gradient-to-r from-rose-700 via-rose-600 to-red-500 animate-pulse'
                }`}
                style={{ width: `${(fuseTime / FUSE_MAX_SECONDS) * 100}%` }}
              />

              {/* Spark / Flame at burning edge */}
              {fuseTime > 0 && !isGameOver && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 text-sm pointer-events-none animate-fuse-spark z-20 transition-all duration-100"
                  style={{ left: `calc(${Math.min(96, Math.max(2, (fuseTime / FUSE_MAX_SECONDS) * 100))}% - 8px)` }}
                >
                  🔥
                </div>
              )}
            </div>
          </div>

          {/* Form with Autofocus input and Serang! button (NEVER CUT OFF ON MOBILE) */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAttack();
            }}
            className="flex items-center gap-1.5 w-full pt-1"
          >
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Jawaban..."
              disabled={isGameOver || isPunching || isMonsterAttacking || isFusePaused}
              className={`flex-1 min-w-0 px-3 py-2 text-center font-mono-math font-black text-lg sm:text-xl rounded-2xl border-2 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                isLight 
                  ? 'bg-amber-50/70 border-amber-400 text-slate-900 focus:ring-2 focus:ring-amber-400' 
                  : 'bg-slate-950/60 border-amber-400/80 text-white focus:ring-2 focus:ring-amber-400'
              }`}
            />

            <button
              type="submit"
              disabled={isGameOver || isPunching || isMonsterAttacking || isFusePaused}
              className="shrink-0 px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform whitespace-nowrap"
            >
              <Swords className="w-4 h-4 shrink-0" />
              <span>{t.attackBtnText || 'Serang!'}</span>
            </button>
          </form>
        </div>

        {/* ON-SCREEN NUMPAD (TRANSLUCENT) */}
        {showTouchKeypad && (
          <div className="w-full max-w-xs mx-auto pt-0.5 pb-0.5 z-10">
            <div className="grid grid-cols-4 gap-1.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadPress(key)}
                  className={`py-2 rounded-xl font-mono-math font-bold text-sm sm:text-base border transition-all cursor-pointer active:scale-90 ${
                    key === 'C'
                      ? 'bg-rose-100/80 dark:bg-rose-950/60 border-rose-300 dark:border-rose-500/70 text-rose-800 dark:text-rose-300'
                      : key === 'DEL'
                      ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/70 text-amber-900 dark:text-amber-300'
                      : isLight
                      ? 'bg-white/45 hover:bg-white/75 border-slate-200/60 text-slate-800 shadow-2xs backdrop-blur-xs'
                      : 'bg-slate-950/45 hover:bg-slate-900/65 border-slate-800/60 text-slate-100 shadow-2xs backdrop-blur-xs'
                  }`}
                >
                  {key === 'DEL' ? '⌫' : key}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GAME OVER MODAL */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-3xl p-5 border-2 text-center space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-rose-300 text-slate-900' : 'bg-slate-900 border-rose-500 text-white'
          }`}>
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto text-3xl animate-bounce">
              ☠️
            </div>

            <div>
              <h3 className="font-black text-xl text-rose-500 uppercase tracking-wide">
                {t.pirateGameOver || 'KAPAL KARAM! (GAME OVER)'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kapten Luffy kehabisan tenaga melawan monster laut!
              </p>
            </div>

            <div className={`p-3 rounded-2xl border space-y-2 ${
              isLight ? 'bg-amber-50 border-amber-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">{t.finalBountyLabel || 'Buronan Dicapai'}:</span>
                <span className="font-mono-math font-black text-amber-500 text-sm">{formatBounty(bounty)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">{t.monstersDefeatedLabel || 'Monster Ditumbangkan'}:</span>
                <span className="font-mono-math font-black text-emerald-500">{monstersDefeated} Monster</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.playAgainBtn || 'Main Lagi 🔄'}</span>
            </button>
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
