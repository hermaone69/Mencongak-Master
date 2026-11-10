import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Shield, Sparkles, Swords, RefreshCw, Zap, Trophy,
  SlidersHorizontal, CheckCircle2, XCircle, PenTool, Skull, ArrowRight, Flame, Gauge, Wind, Keyboard
} from 'lucide-react';
import { DifficultyLevel, MathOperation, Question } from '../types';
import { generateQuestion, getLevelMaxConfig } from '../utils/mathGenerator';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { getTranslation } from '../utils/translations';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { DemonCharacterSvg } from './DemonCharacterSvg';
import { SlayerCharacterSvg, SlayerAvatarSvg } from './SlayerCharacterSvg';
import { DemonTrainSceneryBg } from './DemonTrainSceneryBg';


interface TrainDemon {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  scoreReward: number;
  avatarType: 'shadow' | 'spider' | 'dream' | 'flame' | 'upper_moon';
  attackName: string;
}

interface FloatingCombatText {
  id: string;
  target: 'player' | 'enemy';
  text: string;
  color: string;
  isCritical?: boolean;
}

const TRAIN_DEMONS: TrainDemon[] = [
  {
    id: 'shadow_demon',
    name: 'Iblis Bayangan Rel',
    title: 'Iblis Kegelapan Utara',
    maxHp: 100,
    scoreReward: 50000,
    avatarType: 'shadow',
    attackName: 'Cakar Kegelapan Malam! 🌑⚡'
  },
  {
    id: 'flame_demon',
    name: 'Iblis Api Merah',
    title: 'Penguasa Tungku Batubara',
    maxHp: 125,
    scoreReward: 80000,
    avatarType: 'flame',
    attackName: 'Cakaran Magma Membara! 🌋💥'
  },
  {
    id: 'spider_demon',
    name: 'Monster Tengkorak Baja',
    title: 'Iblis Bersenjata Cerobong',
    maxHp: 150,
    scoreReward: 120000,
    avatarType: 'spider',
    attackName: 'Hantaman Tengkorak Berduri! 💀⚡'
  },
  {
    id: 'dream_demon',
    name: 'Iblis Ilusi Kereta',
    title: 'Penguasa Benang Halusinasi',
    maxHp: 175,
    scoreReward: 160000,
    avatarType: 'dream',
    attackName: 'Jeratan Benang Uap Halusinasi! 🕸️💨'
  },
  {
    id: 'upper_moon_demon',
    name: 'Iblis Bulan Atas Mugen',
    title: 'Raja Iblis 6 Mata Abadi',
    maxHp: 220,
    scoreReward: 250000,
    avatarType: 'upper_moon',
    attackName: 'Pukulan Hampa Kehancuran Dimensi! 👁️⚡'
  }
];

export const DemonTrainMiniGame: React.FC = () => {
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
  const [currentDemonIdx, setCurrentDemonIdx] = useState<number>(0);
  const activeDemon = TRAIN_DEMONS[currentDemonIdx % TRAIN_DEMONS.length];
  const [demonHp, setDemonHp] = useState<number>(activeDemon.maxHp);
  const [currentWave, setCurrentWave] = useState<number>(1);
  const [slayerScore, setSlayerScore] = useState<number>(50000);
  const [demonsDefeated, setDemonsDefeated] = useState<number>(0);

  // Question generated strictly following menu Main filters
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => 
    generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber)
  );
  const [userInput, setUserInput] = useState<string>('');

  // Tekanan Uap (Dynamic Steam Pressure Timer - 20s per question)
  const STEAM_MAX_SECONDS = 20.0;
  const [steamPressure, setSteamPressure] = useState<number>(STEAM_MAX_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Visual Effects
  const [isSlashing, setIsSlashing] = useState<boolean>(false);
  const [slashElementType, setSlashElementType] = useState<'water' | 'flame'>('water');
  const [isDemonHit, setIsDemonHit] = useState<boolean>(false);
  const [isDemonAttacking, setIsDemonAttacking] = useState<boolean>(false);
  const [isPlayerHit, setIsPlayerHit] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [isRedScreenFlash, setIsRedScreenFlash] = useState<boolean>(false);
  const [isCarriageDetaching, setIsCarriageDetaching] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'hit' | 'miss'; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showTouchKeypad, setShowTouchKeypad] = useState<boolean>(true);
  const [useNativeKeyboard, setUseNativeKeyboard] = useState<boolean>(false);

  // Floating Combat Texts (Teks Damage Melayang)
  const [floatingTexts, setFloatingTexts] = useState<FloatingCombatText[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const playerHpRef = useRef(playerHp);
  playerHpRef.current = playerHp;

  // Re-generate question when main filters update
  useEffect(() => {
    const q = generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber);
    setCurrentQuestion(q);
    setUserInput('');
    setSteamPressure(STEAM_MAX_SECONDS);
  }, [mainDifficulty, mainOperations, mainMaxNumber, language]);

  // Spawn floating combat damage text and auto remove after animation (850ms)
  const spawnFloatingDamage = useCallback((target: 'player' | 'enemy', text: string, color: string, isCritical: boolean = false) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, target, text, color, isCritical }]);

    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 850);
  }, []);

  // Auto-focus input when native keyboard is explicitly enabled
  useEffect(() => {
    if (!isGameOver && !isSlashing && !isDemonAttacking && useNativeKeyboard) {
      inputRef.current?.focus();
    }
  }, [currentQuestion, isGameOver, isSlashing, isDemonAttacking, useNativeKeyboard]);

  // Generate next question using main filters and restore Steam Pressure
  const nextQuestion = useCallback(() => {
    const q = generateQuestion(mainDifficulty, mainOperations, language, mainMaxNumber);
    setCurrentQuestion(q);
    setUserInput('');
    setSteamPressure(STEAM_MAX_SECONDS);
    setIsTimerPaused(false);
    if (useNativeKeyboard) {
      inputRef.current?.focus();
    }
  }, [mainDifficulty, mainOperations, language, mainMaxNumber, useNativeKeyboard]);

  // Demon counter-attacks Slayer (on wrong answer or timeout)
  const handleDemonCounterAttack = useCallback((reason: string, customDamage?: number) => {
    setIsTimerPaused(true);
    // Synthetic sound: explosion / heavy hit
    sounds.playExplosionHit();
    setIsDemonAttacking(true);

    setTimeout(() => {
      setIsPlayerHit(true);
      setIsScreenShaking(true);
      setIsRedScreenFlash(true);

      const demonDamage = customDamage ?? 25;
      const currentHp = playerHpRef.current;
      const newPlayerHp = Math.max(0, currentHp - demonDamage);
      setPlayerHp(newPlayerHp);

      // Spawn floating damage above Player
      spawnFloatingDamage('player', `-${demonDamage}`, 'text-rose-500 font-black');

      setFeedbackMsg({
        type: 'miss',
        text: reason
      });

      setTimeout(() => {
        setIsRedScreenFlash(false);
      }, 350);

      if (newPlayerHp <= 0) {
        setTimeout(() => {
          sounds.playGameOver();
          setIsGameOver(true);
          setIsDemonAttacking(false);
          setIsPlayerHit(false);
          setIsScreenShaking(false);
        }, 700);
      } else {
        setTimeout(() => {
          setIsDemonAttacking(false);
          setIsPlayerHit(false);
          setIsScreenShaking(false);
          setFeedbackMsg(null);
          nextQuestion();
        }, 1100);
      }
    }, 250);
  }, [spawnFloatingDamage, nextQuestion]);

  // Defeat Demon Wave handler (Gerbong terlepas, iblis baru melompat masuk)
  const handleDefeatDemonWave = useCallback(() => {
    setIsTimerPaused(true);
    sounds.playFanfare();
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.6 }
    });

    const defeatedCount = demonsDefeated + 1;
    setDemonsDefeated(defeatedCount);

    const bonusScore = activeDemon.scoreReward;
    setSlayerScore(prev => prev + bonusScore);
    addCoins(25);

    // Trigger Carriage Detach Animation (Gerbong Terlepas & Meledak)
    setIsCarriageDetaching(true);

    setFeedbackMsg({
      type: 'hit',
      text: language === 'id' 
        ? `🔥 GERBONG TERLEPAS! ${activeDemon.name} DITEBAS! +${bonusScore.toLocaleString('id-ID')} Poin!` 
        : `🔥 CARRIAGE DETACHED! ${activeDemon.name} SLAIN! +${bonusScore.toLocaleString('id-ID')} Points!`
    });

    setTimeout(() => {
      setIsCarriageDetaching(false);
      setIsSlashing(false);
      setIsDemonHit(false);
      setIsScreenShaking(false);
      setFeedbackMsg(null);

      const nextIdx = currentDemonIdx + 1;
      setCurrentDemonIdx(nextIdx);
      setCurrentWave(prev => prev + 1);
      const nextDemon = TRAIN_DEMONS[nextIdx % TRAIN_DEMONS.length];
      setDemonHp(nextDemon.maxHp);
      nextQuestion();
    }, 1500);
  }, [activeDemon, demonsDefeated, addCoins, language, currentDemonIdx, nextQuestion]);

  // Tekanan Uap countdown interval (100ms ticks)
  useEffect(() => {
    if (isGameOver || isSlashing || isDemonAttacking || isTimerPaused || feedbackMsg !== null) {
      return;
    }

    const interval = setInterval(() => {
      setSteamPressure(prev => {
        if (prev <= 0.1) {
          return 0;
        }
        return Math.max(0, +(prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver, isSlashing, isDemonAttacking, isTimerPaused, feedbackMsg]);

  // Clean timeout effect when steamPressure reaches 0
  useEffect(() => {
    if (steamPressure <= 0 && !isGameOver && !isTimerPaused && !isSlashing && !isDemonAttacking && feedbackMsg === null) {
      setIsTimerPaused(true);
      recordQuestionAttempt({
        questionText: currentQuestion.questionText,
        question: currentQuestion.questionText,
        userAnswer: 0,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        mode: 'demon_train_mini_game',
        level: mainDifficulty,
        responseTimeSec: STEAM_MAX_SECONDS
      });

      handleDemonCounterAttack(
        language === 'id' 
          ? `⏰ Tekanan Uap Habis! Iblis menyerang! (Kunci: ${currentQuestion.correctAnswer})`
          : `⏰ Steam Pressure Depleted! Demon strikes! (Answer: ${currentQuestion.correctAnswer})`,
        25
      );
    }
  }, [steamPressure, isGameOver, isTimerPaused, isSlashing, isDemonAttacking, feedbackMsg, currentQuestion, mainDifficulty, language, recordQuestionAttempt, handleDemonCounterAttack]);

  // Trigger Sword Slash attack from user submission
  const handleAttack = () => {
    if (isGameOver || isSlashing || isDemonAttacking || isTimerPaused) return;

    const trimmed = userInput.trim();
    if (!trimmed) {
      handleDemonCounterAttack(language === 'id' ? 'Ketik jawaban dulu!' : 'Type an answer first!');
      return;
    }

    const numericAnswer = Number(trimmed);
    const isCorrect = numericAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.max(0.5, +(STEAM_MAX_SECONDS - steamPressure).toFixed(1));

    // Record attempt in player history
    recordQuestionAttempt({
      questionText: currentQuestion.questionText,
      question: currentQuestion.questionText,
      userAnswer: numericAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      mode: 'demon_train_mini_game',
      level: mainDifficulty,
      responseTimeSec: timeSpent
    });

    if (isCorrect) {
      // --- PLAYER CORRECT: NICHIRIN SWORD SLASH ---
      setIsTimerPaused(true);
      sounds.playSwordSlash();

      // Alternate element between Water Breathing and Flame Breathing
      setSlashElementType(prev => prev === 'water' ? 'flame' : 'water');
      setIsSlashing(true);
      setIsScreenShaking(true);

      // Refill Steam Pressure back to full 20s
      setSteamPressure(STEAM_MAX_SECONDS);

      setTimeout(() => {
        setIsDemonHit(true);

        const damage = Math.floor(Math.random() * 15) + 35; // 35-50 damage
        const isCrit = damage >= 42;
        const newDemonHp = Math.max(0, demonHp - damage);
        setDemonHp(newDemonHp);

        // Spawn bombastic floating damage above Demon (CRITICAL! -35 or DARR!)
        const critLabel = isCrit ? `💥 CRITICAL! -${damage}` : `⚡ -${damage}`;
        spawnFloatingDamage('enemy', critLabel, isCrit ? 'text-amber-300 drop-shadow-[0_0_12px_#f59e0b]' : 'text-cyan-300', isCrit);

        // Score gain
        const scoreGain = 10000;
        setSlayerScore(prev => prev + scoreGain);

        setFeedbackMsg({
          type: 'hit',
          text: language === 'id' 
            ? `⚔️ ${isCrit ? 'TEBASAN KRITIKAL! DARR!' : 'Tebasan Telak!'} Iblis -${damage} HP` 
            : `⚔️ ${isCrit ? 'CRITICAL SLASH!' : 'Direct Hit!'} Demon took -${damage} HP`
        });

        if (newDemonHp <= 0) {
          handleDefeatDemonWave();
        } else {
          setTimeout(() => {
            setIsSlashing(false);
            setIsDemonHit(false);
            setIsScreenShaking(false);
            setFeedbackMsg(null);
            nextQuestion();
          }, 650);
        }
      }, 180);

    } else {
      // --- PLAYER WRONG: DEMON STRIKES ---
      handleDemonCounterAttack(
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
      if (isGameOver || isSlashing || isDemonAttacking || isTimerPaused) return;

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
  }, [isGameOver, isSlashing, isDemonAttacking, isTimerPaused]);

  // Restart Game
  const handleRestart = () => {
    sounds.playTap();
    setPlayerHp(PLAYER_MAX_HP);
    setCurrentDemonIdx(0);
    setDemonHp(TRAIN_DEMONS[0].maxHp);
    setCurrentWave(1);
    setSlayerScore(50000);
    setDemonsDefeated(0);
    setIsGameOver(false);
    setFeedbackMsg(null);
    setFloatingTexts([]);
    setIsCarriageDetaching(false);
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

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none relative ${
      isScreenShaking ? 'animate-screen-shake screen-shake' : ''
    } bg-gradient-to-b from-[#030712] via-[#091124] to-[#040915] text-slate-100`}>

      {/* RED SCREEN FLASH ON DAMAGE / WRONG ANSWER */}
      {isRedScreenFlash && (
        <div className="absolute inset-0 bg-rose-600/70 pointer-events-none z-50 animate-red-flash" />
      )}

      {/* SUB-HEADER / HUD */}
      <div className="px-3 py-1.5 border-b border-indigo-900/30 bg-slate-950/25 flex items-center justify-between text-xs shrink-0 z-20 backdrop-blur-md">
        {/* Wave & Slayer Score */}
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-black text-xs flex items-center gap-1 backdrop-blur-md">
            <span>🚂</span>
            <span>WAVE {currentWave}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black tracking-wider text-amber-500 uppercase">
              SKOR PEMBASMI
            </span>
            <span className="text-xs font-black font-mono-math text-amber-400 leading-none">
              {slayerScore.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Slain Demons & Scratchpad */}
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 rounded-lg border border-rose-500/30 bg-rose-950/25 text-rose-300 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
            <Skull className="w-3 h-3 text-rose-400" />
            <span>{demonsDefeated} Iblis K.O.</span>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              setShowScratchpad(true);
            }}
            className="p-1.5 rounded-lg border border-slate-700/50 bg-slate-900/30 text-slate-300 hover:text-white transition-colors cursor-pointer backdrop-blur-md"
            title="Coretan Hitung"
          >
            <PenTool className="w-3 h-3 text-amber-500" />
          </button>
        </div>
      </div>

      {/* BATTLE STAGE AREA WITH PARALLAX STEAM TRAIN ROOF */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 py-2 space-y-2 relative">
        
        {/* PARALLAX NIGHT SKY, MOON, MOUNTAINS, PINE FOREST & MUGEN EXPRESS TRAIN ROOF BACKGROUND */}
        <DemonTrainSceneryBg />

        {/* COMBAT CHARACTERS (PENDEKAR PEDANG vs IBLIS KERETA - STANDING FREELY ON CARRIAGE ROOF) */}
        <div className="w-full flex-1 min-h-[170px] max-h-[220px] sm:max-h-[240px] flex flex-col justify-between relative z-10 px-1 pt-1">
          {/* Top HUD Bars (Pure Glassmorphic) */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Player HP Bar */}
            <div 
              className="p-2 rounded-2xl border" 
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)'
              }}
            >
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="flex items-center gap-1.5 text-cyan-300 truncate">
                  <SlayerAvatarSvg className="w-4 h-4 shrink-0 shadow-xs" />
                  <span className="truncate">Pejuang (Pendekar)</span>
                </span>
                <span className={`font-mono-math ${playerHp <= 25 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-cyan-300 font-bold'}`}>
                  {playerHp}/{PLAYER_MAX_HP}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden mt-1 p-0.5 border border-slate-800/50">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    playerHp > 50 ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : playerHp > 25 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-gradient-to-r from-rose-600 to-red-500'
                  }`}
                  style={{ width: `${(playerHp / PLAYER_MAX_HP) * 100}%` }}
                />
              </div>
            </div>

            {/* Demon HP Bar */}
            <div 
              className="p-2 rounded-2xl border" 
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 15px rgba(244, 63, 94, 0.25)'
              }}
            >
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="flex items-center gap-1.5 text-rose-400 truncate">
                  <span className="text-sm">👹</span>
                  <span className="truncate">{activeDemon.name}</span>
                </span>
                <span className={`font-mono-math ${demonHp <= 30 ? 'text-rose-500 font-extrabold animate-pulse' : 'text-rose-400 font-bold'}`}>
                  {demonHp}/{activeDemon.maxHp}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden mt-1 p-0.5 border border-slate-800/50">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${(demonHp / activeDemon.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* MAIN ARENA: CHARACTERS STANDING DIRECTLY ON CARRIAGE ROOF (NO BOXES) */}
          <div className="relative w-full flex-1 flex items-end justify-between px-2 sm:px-6 pb-2 min-h-[130px]">
            {/* Floating Combat Texts */}
            {floatingTexts.map(ft => (
              <div 
                key={ft.id}
                className={`absolute ${ft.target === 'player' ? 'left-8 sm:left-16' : 'right-8 sm:right-16'} -top-2 font-mono-math font-black text-2xl sm:text-3xl ${ft.color} animate-float-damage pointer-events-none z-40 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}
              >
                {ft.text}
              </div>
            ))}

            {/* LEFT: DEMON SLAYER (Standing Freely on Carriage Roof) */}
            <div className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-end justify-center transition-transform ${
              isSlashing ? 'pejuang-menyerang' : isPlayerHit ? 'pejuang-terluka' : 'animate-train-chug'
            }`}>
              {/* Hurt Bubble */}
              {isPlayerHit && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg animate-bounce z-30 whitespace-nowrap">
                  Kena! 💥
                </div>
              )}

              <SlayerCharacterSvg
                isSlashing={isSlashing}
                isHit={isPlayerHit}
                slashElementType={slashElementType}
                className="w-full h-full filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
              />

              {/* ANIMATED ELEMENTAL SWORD SLASH ARC (Pernafasan Air / Api) */}
              {isSlashing && (
                <div className="absolute -top-4 left-10 w-44 h-28 flex items-center z-30 animate-sword-slash pointer-events-none select-none">
                  {slashElementType === 'water' ? (
                    <div className="relative text-3xl filter drop-shadow-[0_0_20px_#06b6d4]">
                      🌊⚔️✨
                      <div className="w-32 h-5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-transparent blur-[1px] -mt-2" />
                    </div>
                  ) : (
                    <div className="relative text-3xl filter drop-shadow-[0_0_20px_#f43f5e]">
                      🔥⚔️💥
                      <div className="w-32 h-5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-transparent blur-[1px] -mt-2" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* VS CENTER BADGE */}
            <div className="self-center flex flex-col items-center justify-center opacity-70 z-20">
              <span 
                className="font-black text-xs text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/40 backdrop-blur-md"
                style={{ background: 'rgba(255, 255, 255, 0.08)', boxShadow: '0 0 10px rgba(6,182,212,0.3)' }}
              >
                ⚔️ VS
              </span>
            </div>

            {/* RIGHT: TRAIN DEMON (Standing Freely on Carriage Roof) */}
            <div 
              className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-end justify-center transition-transform aura-iblis ${
                isCarriageDetaching 
                  ? 'iblis-kalah' 
                  : isDemonAttacking 
                  ? 'iblis-serang' 
                  : isDemonHit 
                  ? 'iblis-terkena-hit' 
                  : 'animate-train-chug'
              }`}
            >
              {isDemonAttacking && (
                <div className="absolute top-1/2 -left-8 text-2xl flex items-center justify-center animate-ping z-30 pointer-events-none">
                  ⚡💥
                </div>
              )}

              <DemonCharacterSvg 
                avatarType={activeDemon.avatarType}
                isAttacking={isDemonAttacking}
                isHit={isDemonHit}
                className="w-full h-full filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
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

        {/* THE MATH PROBLEM CARD WITH TEKANAN UAP TIMER (PURE GLASSMORPHISM WITH CYAN NEON GLOW) */}
        <div 
          className="p-3 sm:p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 z-10 w-full max-w-sm mx-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.35), inset 0 0 15px rgba(6, 182, 212, 0.15)'
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-bold text-cyan-200/90">Pecahkan Soal Cepat:</span>
            <div className="font-mono-math font-black text-2xl sm:text-3xl text-cyan-300 tracking-wider drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]">
              {currentQuestion.questionText.includes('= ?') ? currentQuestion.questionText : `${currentQuestion.questionText} = ?`}
            </div>
          </div>

          {/* TEKANAN UAP: DYNAMIC STEAM PRESSURE TIMER (20 Detik) */}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold px-0.5">
              <span className="flex items-center gap-1 text-cyan-300 drop-shadow-[0_0_6px_#22d3ee]">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tekanan Uap Kereta</span>
              </span>
              <span className={`font-mono-math ${steamPressure <= 5 ? 'text-rose-400 font-black animate-pulse' : 'text-cyan-300'}`}>
                {steamPressure.toFixed(1)}s
              </span>
            </div>

            {/* Steam Pressure Gauge Bar */}
            <div className="relative w-full h-3 rounded-full bg-slate-950/70 p-0.5 border border-cyan-500/40 overflow-visible shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <div 
                className={`h-full rounded-full transition-all duration-100 ${
                  steamPressure > 10
                    ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400'
                    : steamPressure > 5
                    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                    : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                }`}
                style={{ width: `${(steamPressure / STEAM_MAX_SECONDS) * 100}%` }}
              />

              {/* Steam Exhaust Icon at trailing edge */}
              {steamPressure > 0 && !isGameOver && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 text-sm pointer-events-none z-20 transition-all duration-100"
                  style={{ left: `calc(${Math.min(96, Math.max(2, (steamPressure / STEAM_MAX_SECONDS) * 100))}% - 8px)` }}
                >
                  💨
                </div>
              )}
            </div>
          </div>

          {/* Form with input and Tebas! button */}
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
              disabled={isGameOver || isSlashing || isDemonAttacking || isTimerPaused}
              onClick={() => {
                if (!useNativeKeyboard) {
                  inputRef.current?.blur();
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1.5px solid rgba(6, 182, 212, 0.6)',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)'
              }}
              className="flex-1 min-w-0 px-3 py-2 text-center font-mono-math font-black text-lg sm:text-xl rounded-2xl text-cyan-200 focus:ring-2 focus:ring-cyan-400 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-default backdrop-blur-md"
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
                background: useNativeKeyboard ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
              }}
              className="shrink-0 p-2.5 rounded-2xl flex items-center justify-center gap-1 font-bold text-xs text-cyan-300 transition-all cursor-pointer backdrop-blur-md"
              title={useNativeKeyboard ? 'Sembunyikan Keyboard HP' : 'Tampilkan Keyboard HP'}
            >
              <Keyboard className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="submit"
              disabled={isGameOver || isSlashing || isDemonAttacking || isTimerPaused}
              className="shrink-0 px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform whitespace-nowrap"
            >
              <Swords className="w-4 h-4 shrink-0" />
              <span>Tebas! ⚔️</span>
            </button>
          </form>
        </div>

        {/* ON-SCREEN NUMPAD (PURE GLASSMORPHISM WITH CYAN NEON ACCENTS) */}
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
                    boxShadow: key === 'C' ? '0 0 12px rgba(244, 63, 94, 0.3)' : '0 0 10px rgba(6, 182, 212, 0.18)'
                  }}
                  className={`py-2 rounded-xl font-mono-math font-bold text-sm sm:text-base transition-all cursor-pointer active:scale-90 ${
                    key === 'C'
                      ? 'text-rose-200'
                      : key === 'DEL'
                      ? 'text-amber-200'
                      : 'text-cyan-100 hover:text-white'
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
          <div className="w-full max-w-sm rounded-3xl p-5 border-2 border-rose-600 bg-slate-900 text-white text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🗡️💥
            </div>

            <div>
              <h3 className="font-black text-xl text-rose-500 uppercase tracking-wide">
                KERETA TERBALIK! (GAME OVER)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pendekar pedang kehabisan tenaga menahan serangan iblis!
              </p>
            </div>

            <div className="p-3 rounded-2xl border border-slate-800 bg-slate-950 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Wave Bertahan:</span>
                <span className="font-mono-math font-black text-cyan-400 text-sm">Wave {currentWave}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Skor Pembasmi:</span>
                <span className="font-mono-math font-black text-amber-400">{slayerScore.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Iblis Ditumpas:</span>
                <span className="font-mono-math font-black text-emerald-400">{demonsDefeated} Iblis</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Main Lagi 🔄</span>
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
