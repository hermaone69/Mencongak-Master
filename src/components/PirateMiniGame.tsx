import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Shield, Sparkles, Swords, RefreshCw, Zap, Trophy,
  SlidersHorizontal, CheckCircle2, XCircle, PenTool, Skull, ArrowRight, Flame, Bomb, Keyboard
} from 'lucide-react';
import { DifficultyLevel, MathOperation, Question } from '../types';
import { generateQuestion, getLevelMaxConfig } from '../utils/mathGenerator';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { getTranslation } from '../utils/translations';
import { PirateSceneryBg } from './PirateSceneryBg';
import { LuffyCharacterSvg, LuffyAvatarSvg } from './LuffyCharacterSvg';
import { PirateMonsterSvg, PirateMonsterType } from './PirateMonsterSvg';


interface SeaMonster {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  bountyReward: number;
  themeColor: string;
  attackName: string;
  avatarType: PirateMonsterType;
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
    avatarType: 'kurotako'
  },
  {
    id: 'shark_arlong',
    name: 'Manusia Hiu (Arlong)',
    title: 'Hiu Gergaji Samudera',
    maxHp: 125,
    bountyReward: 50000000,
    themeColor: 'from-cyan-500 to-blue-700',
    attackName: 'Tusukan Hidung Gergaji! 🦈⚓',
    avatarType: 'arlong'
  },
  {
    id: 'ghost_skeleton',
    name: 'Bajak Laut Hantu',
    title: 'Kapten Tengkorak Lumut',
    maxHp: 150,
    bountyReward: 75000000,
    themeColor: 'from-emerald-500 to-teal-800',
    attackName: 'Ayunan Pedang Terkutuk! 💀⚔️',
    avatarType: 'skeleton'
  },
  {
    id: 'coral_golem',
    name: 'Golem Karang Laut',
    title: 'Raksasa Batu Terumbu',
    maxHp: 175,
    bountyReward: 100000000,
    themeColor: 'from-slate-500 to-cyan-700',
    attackName: 'Hantaman Tinju Batu! 🗿💥',
    avatarType: 'golem'
  },
  {
    id: 'boss_leviathan',
    name: 'Naga Laut Leviathan',
    title: 'Penguasa Badai Grand Line',
    maxHp: 220,
    bountyReward: 150000000,
    themeColor: 'from-amber-500 to-blue-900',
    attackName: 'Semburan Murka Samudera! 🐉🌊',
    avatarType: 'leviathan'
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
  const [useNativeKeyboard, setUseNativeKeyboard] = useState<boolean>(false);

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

  // Auto-focus input when native keyboard is explicitly enabled
  useEffect(() => {
    if (!isGameOver && !isPunching && !isMonsterAttacking && useNativeKeyboard) {
      inputRef.current?.focus();
    }
  }, [currentQuestion, isGameOver, isPunching, isMonsterAttacking, useNativeKeyboard]);

  // Generate next question using main filters and reset Cannon Fuse
  const nextQuestion = useCallback(() => {
    const q = generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber);
    setCurrentQuestion(q);
    setUserInput('');
    setFuseTime(FUSE_MAX_SECONDS);
    setIsFusePaused(false);
    if (useNativeKeyboard) {
      inputRef.current?.focus();
    }
  }, [mainDifficulty, mainOperations, language, mainMaxNumber, useNativeKeyboard]);

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
      setIsScreenShaking(true);

      setTimeout(() => {
        // High impact flash on hit connect
        triggerImpactFlash();
        setIsMonsterHit(true);

        const damage = Math.floor(Math.random() * 15) + 35; // 35-50 damage
        const isCrit = damage >= 42;
        const newMonsterHp = Math.max(0, monsterHp - damage);
        setMonsterHp(newMonsterHp);

        setHitComicText(isCrit ? '💥 DARR! CRITICAL!' : '💥 HIT! KENA!');

        // Spawn floating damage above Monster (CRITICAL! -35 or DARR!)
        const critLabel = isCrit ? `💥 CRITICAL! -${damage}` : `⚡ -${damage}`;
        spawnFloatingDamage('monster', critLabel, isCrit ? 'text-amber-300 drop-shadow-[0_0_14px_#f59e0b]' : 'text-orange-400', isCrit);

        // Bounty increase
        const bountyGain = 5000000;
        setBounty(prev => prev + bountyGain);

        setFeedbackMsg({
          type: 'hit',
          text: language === 'id' 
            ? `💥 ${isCrit ? 'PUKULAN KRITIKAL! DARR!' : 'Pukulan Kena!'} Monster -${damage} HP` 
            : `💥 ${isCrit ? 'CRITICAL PUNCH!' : 'Direct Hit!'} Monster took -${damage} HP`
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

  const handleAttackRef = useRef(handleAttack);
  handleAttackRef.current = handleAttack;

  // Global physical keyboard listener (desktop/laptop typing support without opening OS virtual keyboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || isPunching || isMonsterAttacking || isFusePaused) return;

      if (e.key >= '0' && e.key <= '9') {
        setUserInput(prev => (prev.length < 7 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleAttackRef.current();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        setUserInput('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPunching, isMonsterAttacking, isFusePaused]);

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
      isScreenShaking ? 'animate-screen-shake screen-shake' : ''
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
        isLight ? 'bg-amber-50/40 border-amber-200/50' : 'bg-slate-950/25 border-slate-800/40'
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
          <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 backdrop-blur-md ${
            isLight ? 'bg-white/50 border-amber-300/60 text-amber-950' : 'bg-slate-900/30 border-slate-700/60 text-amber-300'
          }`}>
            <Skull className="w-3 h-3 text-amber-500" />
            <span>{monstersDefeated} K.O.</span>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              setShowScratchpad(true);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer backdrop-blur-md ${
              isLight ? 'bg-white/50 border-slate-300/60 text-slate-700' : 'bg-slate-900/30 border-slate-700/60 text-slate-300'
            }`}
            title="Coretan Hitung"
          >
            <PenTool className="w-3 h-3 text-amber-500" />
          </button>
        </div>
      </div>

      {/* BATTLE STAGE AREA */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 py-2 space-y-2 relative">
        {/* FULL STAGE TROPICAL OCEAN & SKY SCENERY BACKGROUND */}
        <PirateSceneryBg />

        {/* BATTLE STAGE: LUFFY vs MONSTER LAUT (STANDING DIRECTLY ON SHARED SHIP DECK) */}
        <div className="w-full flex-1 min-h-[170px] max-h-[220px] sm:max-h-[240px] flex flex-col justify-between relative z-10 px-1 pt-1">
          {/* Top HUD Bars (Translucent & Minimalist) */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Luffy HP Bar */}
            <div className="p-2 rounded-2xl border bg-slate-950/30 dark:bg-slate-950/40 border-amber-500/30 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="flex items-center gap-1.5 text-amber-400 truncate">
                  <LuffyAvatarSvg className="w-4 h-4 shrink-0" />
                  <span className="truncate">Kapten Luffy</span>
                </span>
                <span className={`font-mono-math ${playerHp <= 25 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-emerald-400 font-bold'}`}>
                  {playerHp}/{PLAYER_MAX_HP}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden mt-1 p-0.5 border border-slate-800/40">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    playerHp > 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : playerHp > 25 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-600 to-red-500'
                  }`}
                  style={{ width: `${(playerHp / PLAYER_MAX_HP) * 100}%` }}
                />
              </div>
            </div>

            {/* Monster HP Bar */}
            <div className="p-2 rounded-2xl border bg-slate-950/30 dark:bg-slate-950/40 border-sky-500/30 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="flex items-center gap-1.5 text-sky-400 truncate">
                  <span className="text-sm">🌊</span>
                  <span className="truncate">{activeMonster.name}</span>
                </span>
                <span className={`font-mono-math ${monsterHp <= 35 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-sky-400 font-bold'}`}>
                  {monsterHp}/{activeMonster.maxHp}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden mt-1 p-0.5 border border-slate-800/40">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${(monsterHp / activeMonster.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* MAIN ARENA: CHARACTERS FACING EACH OTHER ON SHIP DECK FLOOR */}
          <div className="relative w-full flex-1 flex items-end justify-between px-2 sm:px-6 pb-2 min-h-[130px]">
            {/* FLOATING COMBAT TEXTS (Floating Damage Numbers) */}
            {floatingTexts.map(ft => (
              <div 
                key={ft.id}
                className={`absolute ${ft.target === 'player' ? 'left-8 sm:left-16' : 'right-8 sm:right-16'} -top-2 font-mono-math font-black text-2xl sm:text-3xl ${ft.color} animate-float-damage pointer-events-none z-40 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]`}
              >
                {ft.text} {ft.isCritical ? '⚡CRIT!' : ''}
              </div>
            ))}

            {/* Comic Hit Pop Text */}
            {hitComicText && isMonsterHit && (
              <div className="absolute top-2 right-12 sm:right-24 font-black text-xs sm:text-sm text-yellow-300 bg-rose-600 px-2.5 py-1 rounded-xl border border-yellow-300 shadow-xl animate-comic-pop z-40 whitespace-nowrap">
                {hitComicText}
              </div>
            )}

            {/* LEFT: KAPTEN LUFFY SVG (Full Body Chibi Anime Standing on Deck) */}
            <div className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-end justify-center transition-transform ${
              isPunching ? 'luffy-menyerang' : isPlayerHit ? 'luffy-terluka' : 'animate-sea-bob'
            }`}>
              {/* Hurt Bubble */}
              {isPlayerHit && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg animate-bounce z-30 whitespace-nowrap">
                  Aduh! 💥
                </div>
              )}

              <LuffyCharacterSvg 
                isPunching={isPunching}
                isHit={isPlayerHit}
                className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              />
            </div>

            {/* VS CENTER BADGE */}
            <div className="self-center flex flex-col items-center justify-center opacity-70 z-20">
              <span className="font-black text-xs text-amber-400 bg-slate-950/40 px-2 py-0.5 rounded-full border border-amber-400/40 backdrop-blur-xs">
                ⚔️ VS
              </span>
            </div>

            {/* RIGHT: SEA MONSTER SVG (Full Body Chibi Anime Standing on Deck) */}
            <div className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-end justify-center transition-transform ${
              isMonsterHit 
                ? 'animate-monster-hit' 
                : isMonsterAttacking 
                ? 'scale-115 -translate-x-6' 
                : 'animate-sea-bob'
            }`}>
              {/* Monster Attack Water/Claw Blast */}
              {isMonsterAttacking && (
                <div className="absolute top-1/2 -left-8 text-2xl flex items-center justify-center animate-ping z-30 pointer-events-none">
                  🌊💥
                </div>
              )}

              <PirateMonsterSvg
                monsterType={activeMonster.avatarType}
                isAttacking={isMonsterAttacking}
                isHit={isMonsterHit}
                className="w-full h-full filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {feedbackMsg && (
          <div className={`p-1.5 rounded-xl text-center font-black text-xs border animate-in zoom-in-95 z-20 backdrop-blur-md ${
            feedbackMsg.type === 'hit'
              ? 'bg-emerald-500/90 text-slate-950 border-emerald-400 shadow-xs'
              : 'bg-rose-500/90 text-white border-rose-400 shadow-xs'
          }`}>
            {feedbackMsg.text}
          </div>
        )}

        {/* THE MATH PROBLEM CARD (PURE GLASSMORPHISM WITH ORANGE NEON GLOW) */}
        <div 
          className="p-3 sm:p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 z-10 w-full max-w-sm mx-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.35), inset 0 0 15px rgba(245, 158, 11, 0.15)'
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-bold text-amber-200/90">Soal Hitung:</span>
            <div className="font-mono-math font-black text-2xl sm:text-3xl text-amber-400 tracking-wider drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
              {currentQuestion.questionText.includes('= ?') ? currentQuestion.questionText : `${currentQuestion.questionText} = ?`}
            </div>
          </div>

          {/* WAKTU KETEGANGAN: VISUAL TIMER "SUMBU MERIAM" (CANNON FUSE) */}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold px-0.5">
              <span className="flex items-center gap-1 text-amber-300 drop-shadow-[0_0_6px_#f59e0b]">
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-fuse-spark" />
                <span>{language === 'id' ? 'Sumbu Meriam' : 'Cannon Fuse'}</span>
              </span>
              <span className={`font-mono-math ${fuseTime <= 5 ? 'text-rose-400 font-black animate-pulse' : 'text-amber-300'}`}>
                {fuseTime.toFixed(1)}s
              </span>
            </div>

            {/* Fuse Bar */}
            <div className="relative w-full h-3 rounded-full bg-slate-950/70 p-0.5 border border-amber-500/40 overflow-visible shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <div 
                className={`h-full rounded-full transition-all duration-100 ${
                  fuseTime > 10
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-400'
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

          {/* Form with input and Serang! button */}
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
              inputMode={useNativeKeyboard ? 'numeric' : 'none'}
              readOnly={!useNativeKeyboard}
              pattern="[0-9]*"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Jawaban..."
              disabled={isGameOver || isPunching || isMonsterAttacking || isFusePaused}
              onClick={() => {
                if (!useNativeKeyboard) {
                  inputRef.current?.blur();
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1.5px solid rgba(245, 158, 11, 0.6)',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.25)'
              }}
              className="flex-1 min-w-0 px-3 py-2 text-center font-mono-math font-black text-lg sm:text-xl rounded-2xl text-amber-200 focus:ring-2 focus:ring-amber-400 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-default backdrop-blur-md"
            />

            {/* Keyboard HP Toggle Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                const nextVal = !useNativeKeyboard;
                setUseNativeKeyboard(nextVal);
                if (nextVal) {
                  setTimeout(() => inputRef.current?.focus(), 100);
                } else {
                  inputRef.current?.blur();
                }
              }}
              style={{
                background: useNativeKeyboard ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)'
              }}
              className="shrink-0 p-2.5 rounded-2xl flex items-center justify-center gap-1 font-bold text-xs text-amber-300 transition-all cursor-pointer backdrop-blur-md"
              title={useNativeKeyboard ? 'Sembunyikan Keyboard HP' : 'Tampilkan Keyboard HP'}
            >
              <Keyboard className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="submit"
              disabled={isGameOver || isPunching || isMonsterAttacking || isFusePaused}
              className="shrink-0 px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform whitespace-nowrap"
            >
              <Swords className="w-4 h-4 shrink-0" />
              <span>{t.attackBtnText || 'Serang!'}</span>
            </button>
          </form>
        </div>

        {/* ON-SCREEN NUMPAD (PURE GLASSMORPHISM WITH ORANGE NEON ACCENTS) */}
        {showTouchKeypad && (
          <div className="w-full max-w-xs mx-auto pt-0.5 pb-0.5 z-10">
            <div className="grid grid-cols-4 gap-1.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadPress(key)}
                  style={{
                    background: key === 'C' ? 'rgba(244, 63, 94, 0.25)' : key === 'DEL' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: key === 'C' ? '0 0 12px rgba(244, 63, 94, 0.3)' : '0 0 10px rgba(245, 158, 11, 0.18)'
                  }}
                  className={`py-2 rounded-xl font-mono-math font-bold text-sm sm:text-base transition-all cursor-pointer active:scale-90 ${
                    key === 'C'
                      ? 'text-rose-200'
                      : key === 'DEL'
                      ? 'text-amber-200'
                      : 'text-amber-100 hover:text-white'
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
