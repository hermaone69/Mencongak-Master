import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, Heart, Trophy, Sparkles, RefreshCw, Volume2, 
  ChevronRight, CheckCircle2, XCircle, 
  Flame, Award, ArrowLeft, Clock, ShieldAlert, PenTool
} from 'lucide-react';
import { DifficultyLevel, GameMode, MathOperation, Question } from '../types';
import { generateQuestion, getQuestionHint } from '../utils/mathGenerator';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { getTranslation } from '../utils/translations';

interface SessionQuestionRecord {
  id: string;
  questionText: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  responseTimeSec: number;
  hint?: string;
  hintId?: string;
  hintEn?: string;
}

interface PlayScreenProps {
  onOpenTricks: () => void;
  onOpenLeaderboard: () => void;
  onOpenShop: () => void;
  onOpenProfile?: () => void;
  onOpenCertificate?: () => void;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  onOpenTricks,
  onOpenLeaderboard,
  onOpenShop,
  onOpenProfile,
  onOpenCertificate
}) => {
  const { 
    playerName,
    recordAnswer, 
    submitScore, 
    usePowerUp, 
    shopItems, 
    coins, 
    stats,
    isVip,
    language
  } = useGame();

  const t = getTranslation(language);

  // Modals state
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [powerupToast, setPowerupToast] = useState<string | null>(null);

  // Selection state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('blitz');
  const [level, setLevel] = useState<DifficultyLevel>('sd_lanjut');
  const [operation, setOperation] = useState<MathOperation>('mixed');
  const [inputMode, setInputMode] = useState<'options' | 'keypad'>('options');

  // Session History for Evaluation Review
  const [sessionRecords, setSessionRecords] = useState<SessionQuestionRecord[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('all');

  // Active game session state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [isDoubleXpActive, setIsDoubleXpActive] = useState<boolean>(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameSummary, setGameSummary] = useState<{
    score: number;
    correct: number;
    wrong: number;
    maxCombo: number;
    coinsEarned: number;
    avgTimeSec: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const totalResponseTimeRef = useRef<number>(0);

  // Powerup quantities from context
  const freezeItem = shopItems.find(i => i.id === 'freeze_time');
  const hintItem = shopItems.find(i => i.id === 'hint_5050');
  const doubleXpItem = shopItems.find(i => i.id === 'double_xp');

  // Start new game
  const startGame = (mode: GameMode) => {
    sounds.playTap();
    setGameMode(mode);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setQuestionCount(0);
    setLives(mode === 'survival' ? (isVip ? 4 : 3) : 3);
    setTimeLeft(mode === 'blitz' ? 60 : mode === 'daily' ? 45 : 90);
    setGameOver(false);
    setGameSummary(null);
    setFeedback(null);
    setKeypadInput('');
    setHiddenOptions([]);
    setIsFrozen(false);
    setIsDoubleXpActive(false);
    setSessionRecords([]);
    setReviewFilter('all');
    totalResponseTimeRef.current = 0;

    const firstQ = generateQuestion(level, operation, language);
    setCurrentQuestion(firstQ);
    questionStartTimeRef.current = Date.now();
    setIsPlaying(true);
  };

  // Timer loop
  useEffect(() => {
    if (isPlaying && !gameOver) {
      timerRef.current = setInterval(() => {
        if (!isFrozen && (gameMode === 'blitz' || gameMode === 'daily')) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              endGame();
              return 0;
            }
            if (prev <= 6) {
              sounds.playTick(true);
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameOver, isFrozen, gameMode]);

  // End Game
  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameOver(true);
    setIsPlaying(false);
    sounds.playVictory();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas unavailable
    }

    const totalAttempted = sessionRecords.length;
    const correctCount = sessionRecords.filter(r => r.isCorrect).length;
    const wrongCount = sessionRecords.filter(r => !r.isCorrect).length;
    const finalScore = score;
    const coinsEarned = Math.max(5, Math.floor(finalScore / 25) + (isDoubleXpActive ? 15 : 0));
    const avgSpeed = totalAttempted > 0 
      ? Math.round((totalResponseTimeRef.current / totalAttempted) / 100) / 10 
      : 2.5;

    setGameSummary({
      score: finalScore,
      correct: correctCount,
      wrong: wrongCount,
      maxCombo,
      coinsEarned,
      avgTimeSec: avgSpeed
    });

    submitScore(finalScore, level);
  };

  // Handle Answer
  const handleAnswer = (selectedAnswer: number) => {
    if (!currentQuestion || gameOver || feedback) return;

    const responseTime = Date.now() - questionStartTimeRef.current;
    totalResponseTimeRef.current += responseTime;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Record question result for session evaluation
    const record: SessionQuestionRecord = {
      id: 'qrec_' + Math.random().toString(36).substring(2, 9),
      questionText: currentQuestion.questionText,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      responseTimeSec: Math.round((responseTime / 1000) * 10) / 10,
      hint: currentQuestion.hint,
      hintId: currentQuestion.hintId,
      hintEn: currentQuestion.hintEn
    };
    setSessionRecords(prev => [...prev, record]);

    if (isCorrect) {
      setFeedback('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));

      // Calculate points with speed and streak multiplier
      const basePoints = level === 'sma_pro' ? 25 : level === 'smp' ? 18 : 10;
      const speedBonus = responseTime < 2000 ? 10 : responseTime < 3500 ? 5 : 0;
      const multiplier = Math.min(5, 1 + Math.floor(newCombo / 3));
      const totalPoints = (basePoints + speedBonus) * multiplier * (isDoubleXpActive ? 2 : 1);

      setScore(prev => prev + totalPoints);
      recordAnswer(true, gameMode, totalPoints);
      sounds.playCorrect(newCombo);

      // In blitz mode, add time bonus for fast answers
      if (gameMode === 'blitz' && responseTime < 2500) {
        setTimeLeft(prev => Math.min(60, prev + 1));
      }

      setTimeout(() => {
        setFeedback(null);
        setKeypadInput('');
        setHiddenOptions([]);
        setQuestionCount(prev => prev + 1);

        if (gameMode === 'daily' && questionCount >= 4) {
          // Daily quest completed!
          endGame();
        } else {
          setCurrentQuestion(generateQuestion(level, operation, language));
          questionStartTimeRef.current = Date.now();
        }
      }, 350);
    } else {
      setFeedback('wrong');
      setCombo(0);
      sounds.playWrong();
      recordAnswer(false, gameMode, 0);

      if (gameMode === 'survival') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            endGame();
          }, 500);
          return;
        }
      }

      setTimeout(() => {
        setFeedback(null);
        setKeypadInput('');
        setHiddenOptions([]);
        setQuestionCount(prev => prev + 1);
        setCurrentQuestion(generateQuestion(level, operation, language));
        questionStartTimeRef.current = Date.now();
      }, 600);
    }
  };

  // Handle Keypad submission
  const handleKeypadPress = (val: string) => {
    sounds.playTap();
    if (val === 'DEL') {
      setKeypadInput(prev => prev.slice(0, -1));
      return;
    }
    if (val === 'ENTER') {
      if (keypadInput.trim() !== '') {
        handleAnswer(parseInt(keypadInput, 10));
      }
      return;
    }
    if (keypadInput.length < 6) {
      setKeypadInput(prev => prev + val);
    }
  };

  // Activate Powerups
  const activateFreeze = () => {
    if ((freezeItem?.quantity || 0) > 0 && !isFrozen) {
      if (usePowerUp('freeze_time')) {
        setIsFrozen(true);
        setTimeout(() => setIsFrozen(false), 8000);
      }
    } else {
      sounds.playWrong();
      setPowerupToast(t.outOfFreezeToast);
      setTimeout(() => setPowerupToast(null), 2200);
    }
  };

  const activate5050 = () => {
    if (!currentQuestion) return;
    if ((hintItem?.quantity || 0) > 0 && hiddenOptions.length === 0) {
      if (usePowerUp('hint_5050')) {
        const wrongOpts = currentQuestion.options.filter(o => o !== currentQuestion.correctAnswer);
        const toHide = wrongOpts.slice(0, 2);
        setHiddenOptions(toHide);
      }
    } else {
      sounds.playWrong();
      setPowerupToast(t.outOfHintToast);
      setTimeout(() => setPowerupToast(null), 2200);
    }
  };

  const activateDoubleXp = () => {
    if ((doubleXpItem?.quantity || 0) > 0 && !isDoubleXpActive) {
      if (usePowerUp('double_xp')) {
        setIsDoubleXpActive(true);
      }
    } else {
      sounds.playWrong();
      setPowerupToast(t.outOfDoubleXpToast);
      setTimeout(() => setPowerupToast(null), 2200);
    }
  };

  // If in active gameplay screen
  if (isPlaying && currentQuestion) {
    return (
      <div className="flex-1 flex flex-col justify-between p-3 bg-slate-950 text-slate-100 select-none relative overflow-y-auto">
        {/* Background glow when high combo */}
        {combo >= 3 && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none animate-pulse" />
        )}

        {/* Top In-Game Status Bar */}
        <div className="w-full flex items-center justify-between text-xs shrink-0 z-10">
          {/* Back / Surrender */}
          <button
            onClick={() => {
              sounds.playTap();
              setIsPlaying(false);
              setGameOver(false);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Mode Indicator & Timer */}
          {(gameMode === 'blitz' || gameMode === 'daily') && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full">
              <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
              <span className={`font-mono-math font-bold ${timeLeft <= 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                {timeLeft}s
              </span>
              {isFrozen && (
                <span className="text-[10px] text-sky-400 font-bold ml-1 animate-pulse">
                  {t.frozenBadge}
                </span>
              )}
            </div>
          )}

          {/* Survival Hearts */}
          {gameMode === 'survival' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              <span className="text-[10px] font-bold text-rose-400">
                {t.lives}: {lives}/{isVip ? 4 : 3}
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: isVip ? 4 : 3 }).map((_, idx) => (
                  <Heart
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < lives
                        ? 'text-rose-500 fill-rose-500'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                ))}
              </div>
              {isVip && (
                <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1 rounded">
                  VIP +1
                </span>
              )}
            </div>
          )}

          {/* Current Score & Combo */}
          <div className="flex items-center gap-2">
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-lg text-xs animate-bounce shadow-md">
                <Flame className="w-3 h-3 fill-slate-950" />
                <span>{combo}x</span>
              </div>
            )}
            <div className="font-mono-math font-bold text-amber-400 text-sm">
              {score} pts
            </div>
          </div>
        </div>

        {/* Progress Bar for Timer */}
        {(gameMode === 'blitz' || gameMode === 'daily') && (
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-2 mb-1">
            <div
              className={`h-full transition-all duration-300 ${
                timeLeft > 20
                  ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                  : timeLeft > 10
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${(timeLeft / (gameMode === 'blitz' ? 60 : 45)) * 100}%` }}
            />
          </div>
        )}

        {/* Main Question Card Area */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
          {/* In-game Toast Notification */}
          {powerupToast && (
            <div className="absolute top-0 z-20 px-3 py-1.5 bg-rose-500/90 text-white font-bold text-xs rounded-xl shadow-lg animate-bounce text-center">
              {powerupToast}
            </div>
          )}

          {/* Question Box */}
          <div
            className={`w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-900/90 border rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-200 ${
              feedback === 'correct'
                ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-950/30 scale-[1.02]'
                : feedback === 'wrong'
                ? 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-950/30 scale-95'
                : 'border-slate-800 ring-1 ring-slate-700/50'
            }`}
          >
            {/* Top row inside question card: Question number + Prominent Scratchpad button */}
            <div className="w-full flex items-center justify-between mb-2">
              <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold truncate">
                {language === 'id' ? 'Soal' : 'Question'} #{questionCount + 1} · {(level === 'sd_awal' ? t.diffSd13 : level === 'sd_lanjut' ? t.diffSd46 : level === 'smp' ? t.diffSmp : t.diffPro).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsScratchpadOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 hover:border-sky-400 text-sky-300 hover:text-white rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm shrink-0 ml-2"
                title={language === 'id' ? 'Buka Papan Coretan Hitung' : 'Open Scratchpad'}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Coretan' : 'Scratchpad'}</span>
              </button>
            </div>

            {/* Arithmetic Expression */}
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-mono-math tracking-tight my-2">
              {currentQuestion.questionText.replace(' = ?', '')}
            </div>

            {/* Equal sign & Input field display if in keypad mode */}
            {inputMode === 'keypad' ? (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-slate-400">=</span>
                <div className="min-w-[100px] h-11 px-4 bg-slate-950 rounded-xl border-2 border-amber-500 flex items-center justify-center text-2xl font-mono-math font-bold text-amber-300">
                  {keypadInput || <span className="opacity-30">?</span>}
                </div>
              </div>
            ) : (
              <div className="text-xl font-bold text-amber-400 mt-1">= ?</div>
            )}

            {/* Hint or Trick prompt */}
            {getQuestionHint(currentQuestion, language) && (
              <p className="text-[11px] text-slate-400 mt-3 max-w-xs text-balance">
                💡 {getQuestionHint(currentQuestion, language)}
              </p>
            )}
          </div>
        </div>

        {/* Powerups Floating Bar */}
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-2 shrink-0 flex-wrap">

          {/* Freeze Button: ONLY in timed modes (Blitz / Daily) */}
          {(gameMode === 'blitz' || gameMode === 'daily') && (
            <button
              onClick={activateFreeze}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border rounded-xl text-xs transition-colors cursor-pointer ${
                isFrozen ? 'border-sky-400 text-sky-300 ring-2 ring-sky-400/30' : 'border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Freeze Timer"
            >
              <span>❄️ {t.freezeTime}</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono-math text-sky-400">
                {freezeItem?.quantity || 0}
              </span>
            </button>
          )}

          <button
            onClick={activate5050}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="50:50"
          >
            <span>🪄 50:50</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono-math text-amber-400">
              {hintItem?.quantity || 0}
            </span>
          </button>

          <button
            onClick={activateDoubleXp}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border rounded-xl text-xs transition-colors cursor-pointer ${
              isDoubleXpActive ? 'border-amber-500 text-amber-400 ring-2 ring-amber-500/30' : 'border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Double Score & XP"
          >
            <span>🚀 {t.doubleXp}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono-math text-emerald-400">
              {isDoubleXpActive ? 'AKTIF' : doubleXpItem?.quantity || 0}
            </span>
          </button>

          {/* Toggle Keypad vs Multiple Choice */}
          <button
            onClick={() => {
              sounds.playTap();
              setInputMode(prev => (prev === 'options' ? 'keypad' : 'options'));
            }}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Input Mode"
          >
            {inputMode === 'options' ? (language === 'id' ? '⌨️ Numpad' : '⌨️ Keypad') : (language === 'id' ? '🔘 Opsi' : '🔘 Options')}
          </button>
        </div>

        {/* Input Area: Multiple Choice Options OR Ergonomic Numeric Keypad */}
        {inputMode === 'options' ? (
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mx-auto shrink-0 pb-1">
            {currentQuestion.options.map((opt, idx) => {
              const isHidden = hiddenOptions.includes(opt);
              return (
                <button
                  key={idx}
                  disabled={isHidden || !!feedback}
                  onClick={() => handleAnswer(opt)}
                  className={`h-14 sm:h-16 rounded-2xl font-mono-math text-xl sm:text-2xl font-bold flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md active:scale-95 ${
                    isHidden
                      ? 'opacity-20 pointer-events-none bg-slate-900 border border-slate-800 text-slate-600'
                      : 'bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/60 text-white hover:text-amber-300'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          /* Ergonomic Numpad */
          <div className="grid grid-cols-3 gap-1.5 w-full max-w-xs mx-auto shrink-0 pb-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'DEL', '0', 'ENTER'].map(key => (
              <button
                key={key}
                onClick={() => handleKeypadPress(key)}
                className={`h-11 sm:h-12 rounded-xl font-mono-math font-bold text-lg flex items-center justify-center transition-all duration-100 cursor-pointer active:scale-90 ${
                  key === 'ENTER'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                    : key === 'DEL'
                    ? 'bg-slate-800 hover:bg-slate-700 text-rose-400 text-sm font-semibold'
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white'
                }`}
              >
                {key === 'ENTER' ? '✓' : key}
              </button>
            ))}
          </div>
        )}

        {/* Interactive Freehand Scratchpad Canvas */}
        <ScratchpadCanvas
          isOpen={isScratchpadOpen}
          onClose={() => setIsScratchpadOpen(false)}
          questionText={currentQuestion?.questionText}
        />
      </div>
    );
  }

  // If Game Over Screen
  if (gameOver && gameSummary) {
    const totalAttempted = sessionRecords.length;
    const correctCount = sessionRecords.filter(r => r.isCorrect).length;
    const wrongCount = sessionRecords.filter(r => !r.isCorrect).length;
    const accuracyPct = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

    // Qualitative grade title and badge styling
    let gradeTitle = t.evaluationGradeGreat;
    let gradeBadgeColor = 'from-amber-400 to-orange-500';
    if (accuracyPct === 100 && totalAttempted > 0) {
      gradeTitle = t.evaluationGradePerfect;
      gradeBadgeColor = 'from-emerald-400 to-teal-500';
    } else if (accuracyPct >= 75) {
      gradeTitle = t.evaluationGradeGreat;
      gradeBadgeColor = 'from-amber-400 to-orange-500';
    } else if (accuracyPct >= 50) {
      gradeTitle = t.evaluationGradeGood;
      gradeBadgeColor = 'from-sky-400 to-blue-500';
    } else {
      gradeTitle = t.evaluationGradeNeedsPractice;
      gradeBadgeColor = 'from-rose-500 to-pink-600';
    }

    // Speed rating title
    let speedRating = t.speedRatingFast;
    if (gameSummary.avgTimeSec < 2.2) {
      speedRating = t.speedRatingSuper;
    } else if (gameSummary.avgTimeSec > 3.8) {
      speedRating = t.speedRatingRelaxed;
    }

    const displayedRecords = reviewFilter === 'wrong'
      ? sessionRecords.filter(r => !r.isCorrect)
      : sessionRecords;

    return (
      <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-5 bg-slate-950 text-slate-100 select-none overflow-y-auto">
        <div className="space-y-3">
          {/* Top Grade Badge & Title */}
          <div className="text-center pt-1">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-tr ${gradeBadgeColor} flex items-center justify-center text-2xl sm:text-3xl shadow-lg mb-2 animate-bounce`}>
              {accuracyPct === 100 ? '🌟' : accuracyPct >= 75 ? '⚡' : accuracyPct >= 50 ? '👍' : '💡'}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white font-display">
              {gradeTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
              {language === 'id'
                ? `Akurasi ${accuracyPct}% (${correctCount} benar, ${wrongCount} salah dari ${totalAttempted} soal). Rata-rata ${gameSummary.avgTimeSec}s/soal (${speedRating}).`
                : `Accuracy ${accuracyPct}% (${correctCount} correct, ${wrongCount} wrong of ${totalAttempted} questions). Avg speed ${gameSummary.avgTimeSec}s/q (${speedRating}).`}
            </p>
          </div>

          {/* 4 Score Metrics Cards */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 grid grid-cols-2 gap-2 shadow-md">
            <div className="bg-slate-950/80 rounded-xl p-2 sm:p-2.5 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">{t.totalScore}</div>
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono-math">
                {gameSummary.score} Pts
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-2 sm:p-2.5 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">{t.accuracy}</div>
              <div className={`text-lg sm:text-xl font-black font-mono-math ${accuracyPct >= 80 ? 'text-emerald-400' : accuracyPct >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {accuracyPct}% ({correctCount}/{totalAttempted})
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-2 sm:p-2.5 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">{t.avgTimeLabel}</div>
              <div className="text-sm font-black text-sky-400 font-mono-math">
                {gameSummary.avgTimeSec}s
              </div>
              <div className="text-[9px] text-slate-400 truncate">{speedRating}</div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-2 sm:p-2.5 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">{t.bonusCoinsEarned}</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono-math">
                +{gameSummary.coinsEarned} 🪙
              </div>
            </div>
          </div>

          {/* Detailed Question Review & Evaluation Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-md space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">📋</span>
                <h3 className="font-extrabold text-xs text-white">
                  {t.reviewQuestionsTitle} ({totalAttempted})
                </h3>
              </div>

              {/* Filter Toggle: All vs Wrong Only */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    reviewFilter === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.showAllQuestions} ({totalAttempted})
                </button>
                {wrongCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setReviewFilter('wrong')}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                      reviewFilter === 'wrong'
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.showWrongOnly} ({wrongCount})
                  </button>
                )}
              </div>
            </div>

            {/* Question List Cards */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {displayedRecords.length === 0 ? (
                <div className="p-4 text-center text-slate-500 italic text-xs">
                  {language === 'id' ? 'Tidak ada soal dalam kategori ini.' : 'No questions in this category.'}
                </div>
              ) : (
                displayedRecords.map((rec, idx) => {
                  const hintText = getQuestionHint(rec, language);
                  return (
                    <div
                      key={rec.id || idx}
                      className={`p-2.5 rounded-xl border transition-all ${
                        rec.isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-rose-950/20 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 text-[10px]">
                            #{idx + 1}
                          </span>
                          <span className="font-mono-math font-extrabold text-white text-sm">
                            {rec.questionText}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          rec.isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {rec.isCorrect ? `✓ ${rec.responseTimeSec}s` : `✕ ${rec.responseTimeSec}s`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] mt-1 text-slate-300">
                        <div>
                          <span className="text-slate-500 font-medium mr-1">{t.yourAnswer}</span>
                          <span className={`font-mono-math font-bold ${
                            rec.isCorrect ? 'text-emerald-400' : 'text-rose-400 line-through'
                          }`}>
                            {rec.userAnswer}
                          </span>
                        </div>
                        {!rec.isCorrect && (
                          <div>
                            <span className="text-slate-500 font-medium mr-1">{t.correctAnswer}</span>
                            <span className="font-mono-math font-bold text-emerald-400">
                              {rec.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pembahasan / Hint */}
                      {hintText && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[10px] text-amber-300/90 font-medium">
                          💡 <span className="text-slate-400">{t.explanation}</span> {hintText}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => startGame(gameMode)}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.playAgain}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setGameOver(false);
              onOpenLeaderboard();
            }}
            className="w-full h-10 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{t.viewLeaderboardButton}</span>
          </button>

          {onOpenCertificate && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onOpenCertificate();
              }}
              className="w-full h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-500/25 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'id' ? `Buka E-Sertifikat Prestasi (${playerName})` : `Open Certificate (${playerName})`}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setGameOver(false);
            }}
            className="w-full h-9 text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer"
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // Home / Mode Selector Screen
  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 bg-slate-950 text-slate-100 select-none overflow-y-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              {language === 'id' ? 'Aritmatika Mental' : 'Mental Arithmetic'}
            </span>
            <h1 className="text-xl font-black text-white tracking-tight font-display">
              {language === 'id' ? 'Pilih Mode Latihan' : 'Choose Practice Mode'}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">{t.totalExercises}:</span>
            <span className="text-xs font-bold text-amber-300 font-mono-math">
              {stats.totalQuestionsAnswered} {t.questions}
            </span>
          </div>
        </div>

        {/* Game Mode Cards (Clean, Polished, Zero Truncation) */}
        <div className="space-y-2.5 my-2">
          {/* Mode 1: Kilat 60 Detik (Blitz) */}
          <button
            onClick={() => startGame('blitz')}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900/80 border border-amber-500/30 hover:border-amber-400 p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                    {t.modeBlitz}
                  </h3>
                  <span className="text-[9px] font-bold bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {language === 'id' ? 'POPULER 🔥' : 'POPULAR 🔥'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {t.modeBlitzDesc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </button>

          {/* Mode 2: Bertahan Hidup (Survival) */}
          <button
            onClick={() => startGame('survival')}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-slate-900/80 border border-rose-500/30 hover:border-rose-400 p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-black shadow-md shrink-0">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-white group-hover:text-rose-300 transition-colors truncate">
                    {t.modeSurvival}
                  </h3>
                  <span className="text-[9px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {isVip ? t.vipLivesBadge : t.normalLivesBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {isVip ? t.modeSurvivalDescVip : t.modeSurvivalDescNormal}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </button>

          {/* Mode 3: Tantangan Harian (Daily Quest) */}
          <button
            onClick={() => startGame('daily')}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                <Award className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                    {t.modeDaily}
                  </h3>
                  <span className="text-[9px] font-bold bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {t.bonusRewardDaily}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {t.modeDailyDesc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </button>
        </div>

        {/* Configuration Panel: Difficulty & Math Operations */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2.5 shadow-md">
          {/* Difficulty Level Segmented Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-300">
                {t.difficultyLabel}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">
                {level === 'sd_awal' ? t.diffSd13 : level === 'sd_lanjut' ? t.diffSd46 : level === 'smp' ? t.diffSmp : t.diffPro}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
              {[
                { id: 'sd_awal', label: t.diffSd13 },
                { id: 'sd_lanjut', label: t.diffSd46 },
                { id: 'smp', label: t.diffSmp },
                { id: 'sma_pro', label: t.diffPro }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    sounds.playTap();
                    setLevel(lvl.id as DifficultyLevel);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    level === lvl.id
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.02]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operation Filter */}
          <div>
            <span className="text-[11px] font-bold text-slate-300 block mb-1">
              {t.operationsLabel}
            </span>
            <div className="grid grid-cols-5 gap-1.5 text-xs">
              {[
                { id: '+', label: '+' },
                { id: '-', label: '−' },
                { id: '×', label: '×' },
                { id: '÷', label: '÷' },
                { id: 'mixed', label: t.opAll }
              ].map(op => (
                <button
                  key={op.id}
                  onClick={() => {
                    sounds.playTap();
                    setOperation(op.id as MathOperation);
                  }}
                  className={`py-2 rounded-xl border font-mono-math font-bold text-sm transition-all cursor-pointer active:scale-95 ${
                    operation === op.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access to Tricks / Masterclass Bottom Banner & Free Scratchpad */}
      <div className="pt-2 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            sounds.playTap();
            onOpenTricks();
          }}
          className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-400 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-[11px] text-amber-200 truncate">
              {t.masterclassBanner}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setIsScratchpadOpen(true);
          }}
          className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-500/10 via-slate-900 to-slate-900 border border-sky-500/30 hover:border-sky-400 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <div className="flex items-center gap-1.5 truncate">
            <PenTool className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-[11px] text-sky-200 truncate">
              {language === 'id' ? 'Papan Coretan' : 'Scratchpad'}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-1" />
        </button>
      </div>


      {/* Interactive Freehand Scratchpad Canvas */}
      <ScratchpadCanvas
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />
    </div>
  );
};
