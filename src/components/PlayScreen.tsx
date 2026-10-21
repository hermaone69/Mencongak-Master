import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, Heart, Trophy, Sparkles, RefreshCw, Volume2, 
  ChevronRight, CheckCircle2, XCircle, 
  Flame, Award, ArrowLeft, Clock, ShieldAlert, PenTool,
  Target, Headphones, Eye, EyeOff, RotateCcw, Star
} from 'lucide-react';
import { DifficultyLevel, GameMode, MathOperation, Question } from '../types';
import { generateQuestion, getQuestionHint, getLevelMaxConfig, getLevelFocusPresets, clearQuestionHistory } from '../utils/mathGenerator';
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
    playerAvatar,
    recordAnswer, 
    submitScore, 
    usePowerUp, 
    shopItems, 
    coins, 
    stats,
    isVip,
    language,
    themeMode
  } = useGame();

  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';

  const t = getTranslation(language);

  // Modals state
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [powerupToast, setPowerupToast] = useState<string | null>(null);

  // Selection state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('blitz');
  const [level, setLevel] = useState<DifficultyLevel>('sd_awal');
  const [selectedOperations, setSelectedOperations] = useState<MathOperation[]>(['+', '-', '×', '÷']);
  const [maxNumber, setMaxNumber] = useState<number | null>(null);
  const [isCustomMax, setIsCustomMax] = useState<boolean>(false);
  const [customMaxInput, setCustomMaxInput] = useState<string>('');
  const [inputMode, setInputMode] = useState<'options' | 'keypad'>('options');

  // Mode 2: Sprint Waktu / Time Attack state
  const [sprintTarget, setSprintTarget] = useState<number>(10);
  const [sprintElapsed, setSprintElapsed] = useState<number>(0);
  const sprintStartRef = useRef<number>(0);

  // Mode 3: Dikte Suara / Audio Mencongak state
  const [isBlindfold, setIsBlindfold] = useState<boolean>(false);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Mode 4: Fokus Angka Tertentu state
  const [focusNumber, setFocusNumber] = useState<number>(7);
  const [focusTarget, setFocusTarget] = useState<number>(10);
  const [isCustomFocus, setIsCustomFocus] = useState<boolean>(false);
  const [customFocusInput, setCustomFocusInput] = useState<string>('');

  // Audio Mode Speech Feedback subtitle banner and persistent utterance ref
  const [audioFeedbackText, setAudioFeedbackText] = useState<string | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Remedial flag
  const [isRemedialSession, setIsRemedialSession] = useState<boolean>(false);

  // Audio Speech Synthesis: Question helper
  const speakQuestion = (q: Question | null) => {
    if (!q || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      let text = '';
      if (language === 'id') {
        let opWord = 'ditambah';
        if (q.operation === '-') opWord = 'dikurang';
        if (q.operation === '×') opWord = 'dikali';
        if (q.operation === '÷') opWord = 'dibagi';
        text = `${q.num1} ${opWord} ${q.num2} sama dengan berapa?`;
      } else {
        let opWord = 'plus';
        if (q.operation === '-') opWord = 'minus';
        if (q.operation === '×') opWord = 'times';
        if (q.operation === '÷') opWord = 'divided by';
        text = `What is ${q.num1} ${opWord} ${q.num2}?`;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      activeUtteranceRef.current = utterance; // Prevent garbage collection mid-speech
      utterance.lang = language === 'id' ? 'id-ID' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
      activeUtteranceRef.current = null;
    }
  };

  // Audio Speech Synthesis: Immediate Correct/Wrong Feedback (Perdengarkan Salah Benarnya)
  const speakFeedback = (isCorrect: boolean, correctAnswer: number, onComplete?: () => void) => {
    const isEn = language === 'en';
    let textToSpeak = '';
    let visualBanner = '';

    if (isCorrect) {
      textToSpeak = isEn
        ? `Correct! Answer is ${correctAnswer}.`
        : `Benar! Jawabannya ${correctAnswer}.`;
      visualBanner = isEn
        ? `🔊 "Correct! Answer is ${correctAnswer}"`
        : `🔊 "Benar! Jawabannya ${correctAnswer}"`;
    } else {
      textToSpeak = isEn
        ? `Incorrect. Answer is ${correctAnswer}.`
        : `Salah. Jawabannya ${correctAnswer}.`;
      visualBanner = isEn
        ? `🔊 "Incorrect! Answer: ${correctAnswer}"`
        : `🔊 "Salah! Jawabannya ${correctAnswer}"`;
    }

    setAudioFeedbackText(visualBanner);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTimeout(() => {
        setAudioFeedbackText(null);
        if (onComplete) onComplete();
      }, 1200);
      return;
    }

    let hasCompleted = false;
    const safeFinish = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      setIsSpeaking(false);
      setAudioFeedbackText(null);
      activeUtteranceRef.current = null;
      if (onComplete) onComplete();
    };

    // Generous safety timer (6000ms) so it NEVER cuts off speech prematurely
    const safetyTimer = setTimeout(safeFinish, 6000);

    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      activeUtteranceRef.current = utterance; // Prevent garbage collection mid-speech
      utterance.lang = isEn ? 'en-US' : 'id-ID';
      utterance.rate = 1.0;
      utterance.onend = () => {
        clearTimeout(safetyTimer);
        // Small 400ms buffer after speech finishes so the last syllable resonates cleanly
        setTimeout(safeFinish, 400);
      };
      utterance.onerror = () => {
        clearTimeout(safetyTimer);
        safeFinish();
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      clearTimeout(safetyTimer);
      safeFinish();
    }
  };

  // Active level configuration (sets pedagogical ranges & caps)
  const activeLevelConfig = getLevelMaxConfig(level, language);
  const focusPresets = getLevelFocusPresets(level, maxNumber);

  const handleLevelChange = (newLevel: DifficultyLevel) => {
    sounds.playTap();
    setLevel(newLevel);
    const newCfg = getLevelMaxConfig(newLevel, language);
    let nextMax = maxNumber;
    // If the active max number exceeds the new level's hard cap, reset to auto
    if (maxNumber !== null && maxNumber > newCfg.hardCap) {
      nextMax = null;
      setMaxNumber(null);
      setIsCustomMax(false);
      setCustomMaxInput('');
    }
    // Check focus number against new level ceiling & valid presets
    const effectiveCeiling = nextMax !== null ? nextMax : newCfg.defaultMax;
    const presets = getLevelFocusPresets(newLevel, nextMax);
    if (focusNumber >= effectiveCeiling || !presets.includes(focusNumber)) {
      setFocusNumber(presets[0] || 2);
      setIsCustomFocus(false);
      setCustomFocusInput('');
    }
  };

  // Toggle individual operation in multi-select
  const toggleOperation = (op: MathOperation) => {
    sounds.playTap();
    setSelectedOperations(prev => {
      if (prev.includes(op)) {
        if (prev.length <= 1) return prev; // keep at least 1 operation active
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
      const clamped = Math.min(val, activeLevelConfig.hardCap);
      setMaxNumber(clamped);
      setIsCustomMax(false);
      setCustomMaxInput(String(clamped));
      if (focusNumber >= clamped) {
        setFocusNumber(Math.max(1, clamped - 1));
      }
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
      // Clamp to active level's hard cap so SD 1-3 can never have hundreds
      const clamped = Math.min(parsed, activeLevelConfig.hardCap);
      setMaxNumber(clamped);
      if (focusNumber >= clamped) {
        setFocusNumber(Math.max(1, clamped - 1));
      }
    } else if (valStr.trim() === '') {
      setMaxNumber(null);
    }
  };

  const handleSelectFocusNumber = (num: number) => {
    sounds.playTap();
    const effectiveCeiling = maxNumber !== null ? maxNumber : activeLevelConfig.defaultMax;
    const clamped = Math.min(num, Math.max(1, effectiveCeiling - 1));
    setFocusNumber(clamped);
    setIsCustomFocus(false);
    setCustomFocusInput(String(clamped));
  };

  const handleCustomFocusChange = (valStr: string) => {
    setCustomFocusInput(valStr);
    const parsed = parseInt(valStr, 10);
    const effectiveCeiling = maxNumber !== null ? maxNumber : activeLevelConfig.defaultMax;
    if (!isNaN(parsed) && parsed >= 1) {
      const clamped = Math.min(parsed, Math.max(1, effectiveCeiling - 1));
      setFocusNumber(clamped);
    }
  };

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
  const [streakBanner, setStreakBanner] = useState<{ title: string; subtitle: string; isFever: boolean } | null>(null);
  const [streakBrokenNotice, setStreakBrokenNotice] = useState<{
    lostCombo: number;
    title: string;
    subtitle: string;
    wasFever: boolean;
  } | null>(null);
  const [isStreakShaking, setIsStreakShaking] = useState<boolean>(false);
  const [scorePopup, setScorePopup] = useState<{ id: string; text: string; isFever: boolean } | null>(null);
  const [gameSummary, setGameSummary] = useState<{
    score: number;
    correct: number;
    wrong: number;
    maxCombo: number;
    coinsEarned: number;
    avgTimeSec: number;
    sprintTime?: number;
    stars?: number;
    isAudio?: boolean;
    focusNumber?: number;
    focusTarget?: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const totalResponseTimeRef = useRef<number>(0);

  // Powerup quantities from context
  const freezeItem = shopItems.find(i => i.id === 'freeze_time');
  const hintItem = shopItems.find(i => i.id === 'hint_5050');
  const doubleXpItem = shopItems.find(i => i.id === 'double_xp');

  // Start new game
  const startGame = (mode: GameMode, isRemedial: boolean = false) => {
    sounds.playTap();
    clearQuestionHistory();
    setStreakBanner(null);
    setStreakBrokenNotice(null);
    setIsStreakShaking(false);
    setScorePopup(null);
    setGameMode(mode);
    setIsRemedialSession(isRemedial);
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
    setIsPeeking(false);
    totalResponseTimeRef.current = 0;

    sprintStartRef.current = Date.now();
    setSprintElapsed(0);

    const firstQ = generateQuestion(
      level, 
      selectedOperations, 
      language, 
      maxNumber,
      mode === 'focus' ? focusNumber : null
    );
    setCurrentQuestion(firstQ);
    questionStartTimeRef.current = Date.now();
    setIsPlaying(true);

    if (mode === 'audio') {
      setTimeout(() => {
        speakQuestion(firstQ);
      }, 300);
    }
  };

  // Timer loop (supports countdown for blitz/daily and stopwatch for sprint)
  useEffect(() => {
    if (isPlaying && !gameOver) {
      if (gameMode === 'blitz' || gameMode === 'daily') {
        timerRef.current = setInterval(() => {
          if (!isFrozen) {
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
      } else if (gameMode === 'sprint') {
        timerRef.current = setInterval(() => {
          const elapsed = (Date.now() - sprintStartRef.current) / 1000;
          setSprintElapsed(Math.round(elapsed * 10) / 10);
        }, 100);
      }
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

    // Stop ongoing speech if any
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }

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

    const finalSprintTime = gameMode === 'sprint' 
      ? Math.round(((Date.now() - sprintStartRef.current) / 1000) * 10) / 10
      : undefined;

    let starsEarned = 1;
    if (finalSprintTime !== undefined) {
      const avgPerQ = finalSprintTime / sprintTarget;
      if (avgPerQ <= 2.2) starsEarned = 3;
      else if (avgPerQ <= 3.8) starsEarned = 2;
      else starsEarned = 1;
    }

    setGameSummary({
      score: finalScore,
      correct: correctCount,
      wrong: wrongCount,
      maxCombo,
      coinsEarned,
      avgTimeSec: avgSpeed,
      sprintTime: finalSprintTime,
      stars: starsEarned,
      isAudio: gameMode === 'audio',
      focusNumber: gameMode === 'focus' ? focusNumber : undefined,
      focusTarget: gameMode === 'focus' ? focusTarget : undefined
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
      let points = (basePoints + speedBonus) * multiplier * (isDoubleXpActive ? 2 : 1);

      // FEVER MODE 1.5x MULTIPLIER! (Streak 10x+)
      const isFever = newCombo >= 10;
      if (isFever) {
        points = Math.round(points * 1.5);
      }
      const totalPoints = points;

      setScore(prev => prev + totalPoints);
      recordAnswer(true, gameMode, totalPoints);

      // Floating Score Toast
      setScorePopup({
        id: Math.random().toString(),
        text: isFever 
          ? `+${totalPoints} pts (⚡ 1.5x FEVER!)` 
          : `+${totalPoints} pts`,
        isFever
      });
      setTimeout(() => setScorePopup(null), 1200);

      // Audio and special milestone animations
      if (newCombo === 5) {
        sounds.playCombo5();
        setStreakBanner({
          title: language === 'id' ? '🔥 5x KOMBO MEMBARA!' : '🔥 5x STREAK ON FIRE!',
          subtitle: language === 'id' ? 'Refleks kilat menyala! Pertahankan kombo!' : 'Lightning reflexes on fire! Keep it going!',
          isFever: false
        });
        setTimeout(() => setStreakBanner(null), 2500);
        try {
          confetti({
            particleCount: 28,
            spread: 55,
            startVelocity: 22,
            origin: { y: 0.38 },
            colors: ['#f97316', '#ea580c', '#fbbf24', '#ffedd5']
          });
        } catch {}
      } else if (newCombo === 10) {
        sounds.playFeverMode();
        setStreakBanner({
          title: language === 'id' ? '⚡ DEMAM KOMBO AKTIF! ⚡' : '⚡ FEVER MODE ACTIVATED! ⚡',
          subtitle: language === 'id' 
            ? `${playerName || 'Kakak Luffy'} Super Reflex · Poin 1.5x Lipat!` 
            : `${playerName || 'Kakak Luffy'} Super Reflex · 1.5x Multiplier!`,
          isFever: true
        });
        setTimeout(() => setStreakBanner(null), 3200);
        try {
          confetti({
            particleCount: 70,
            spread: 85,
            startVelocity: 35,
            origin: { y: 0.35 },
            colors: ['#fbbf24', '#f59e0b', '#f97316', '#ef4444', '#ffffff']
          });
        } catch {}
      } else {
        sounds.playCorrect(newCombo);
      }

      // In blitz mode, add time bonus for fast answers
      if (gameMode === 'blitz' && responseTime < 2500) {
        setTimeLeft(prev => Math.min(60, prev + 1));
      }

      const advanceQuestion = () => {
        setFeedback(null);
        setKeypadInput('');
        setHiddenOptions([]);
        setIsPeeking(false);
        const nextQIndex = questionCount + 1;
        setQuestionCount(nextQIndex);

        if (gameMode === 'daily' && nextQIndex >= 5) {
          endGame();
        } else if (gameMode === 'sprint' && nextQIndex >= sprintTarget) {
          endGame();
        } else if (gameMode === 'audio' && nextQIndex >= 10) {
          endGame();
        } else if (gameMode === 'focus' && nextQIndex >= focusTarget) {
          endGame();
        } else {
          const nextQ = generateQuestion(
            level, 
            selectedOperations, 
            language, 
            maxNumber,
            gameMode === 'focus' ? focusNumber : null
          );
          setCurrentQuestion(nextQ);
          questionStartTimeRef.current = Date.now();
          if (gameMode === 'audio') {
            setTimeout(() => speakQuestion(nextQ), 600);
          }
        }
      };

      if (gameMode === 'audio') {
        speakFeedback(true, currentQuestion.correctAnswer, () => {
          advanceQuestion();
        });
      } else {
        setTimeout(advanceQuestion, 350);
      }
    } else {
      setFeedback('wrong');
      const lostCombo = combo;
      setCombo(0);
      setStreakBanner(null);
      setScorePopup(null);

      // Streak stopped / broken effect!
      if (lostCombo >= 2) {
        sounds.playStreakBroken(lostCombo);
        setIsStreakShaking(true);
        setTimeout(() => setIsStreakShaking(false), 450);

        setStreakBrokenNotice({
          lostCombo,
          title: language === 'id' ? '💔 STREAK TERPUTUS!' : '💔 STREAK BROKEN!',
          subtitle: language === 'id'
            ? `Kombo ${lostCombo}x padam! Jangan patah semangat, kumpulkan lagi! 💪`
            : `${lostCombo}x combo lost! Don't give up, build it back! 💪`,
          wasFever: lostCombo >= 10
        });
        setTimeout(() => setStreakBrokenNotice(null), 2800);

        // Extinguished flame ash & ember particles
        try {
          confetti({
            particleCount: Math.min(45, 18 + lostCombo * 2),
            spread: 60,
            startVelocity: 16,
            origin: { y: 0.38 },
            colors: ['#64748b', '#475569', '#334155', '#ea580c', '#ef4444', '#cbd5e1']
          });
        } catch {}
      } else {
        sounds.playWrong();
      }

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

      const advanceQuestionWrong = () => {
        setFeedback(null);
        setKeypadInput('');
        setHiddenOptions([]);
        setIsPeeking(false);
        const nextQIndex = questionCount + 1;
        setQuestionCount(nextQIndex);

        if (gameMode === 'sprint' && nextQIndex >= sprintTarget) {
          endGame();
        } else if (gameMode === 'audio' && nextQIndex >= 10) {
          endGame();
        } else if (gameMode === 'focus' && nextQIndex >= focusTarget) {
          endGame();
        } else {
          const nextQ = generateQuestion(
            level, 
            selectedOperations, 
            language, 
            maxNumber,
            gameMode === 'focus' ? focusNumber : null
          );
          setCurrentQuestion(nextQ);
          questionStartTimeRef.current = Date.now();
          if (gameMode === 'audio') {
            setTimeout(() => speakQuestion(nextQ), 600);
          }
        }
      };

      if (gameMode === 'audio') {
        speakFeedback(false, currentQuestion.correctAnswer, () => {
          advanceQuestionWrong();
        });
      } else {
        setTimeout(advanceQuestionWrong, 600);
      }
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
      <div className={`flex-1 flex flex-col justify-between p-3 select-none relative overflow-y-auto transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-900'
          : isNeon
          ? 'bg-[#021411] text-emerald-100'
          : 'bg-slate-950 text-slate-100'
      }`}>
        {/* Background glow when in Fever Mode or High Combo */}
        {combo >= 10 ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-orange-500/10 to-transparent pointer-events-none animate-pulse" />
        ) : combo >= 5 ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/15 via-transparent to-transparent pointer-events-none" />
        ) : combo >= 3 ? (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        ) : null}

        {/* Top In-Game Status Bar */}
        <div className="w-full flex items-center justify-between text-xs shrink-0 z-10">
          {/* Back / Surrender */}
          <button
            onClick={() => {
              sounds.playTap();
              setIsPlaying(false);
              setGameOver(false);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-xs'
                : isNeon
                ? 'bg-[#04241d] border-emerald-500/40 text-emerald-300 hover:text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Mode Indicator & Timer */}
          {(gameMode === 'blitz' || gameMode === 'daily') && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : isNeon
                ? 'bg-[#04241d] border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/90 border-slate-800 text-slate-200'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-500 animate-bounce' : isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              <span className={`font-mono-math font-bold ${timeLeft <= 10 ? 'text-rose-500 font-black' : isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                {timeLeft}s
              </span>
              {isFrozen && (
                <span className="text-[10px] text-sky-500 font-bold ml-1 animate-pulse">
                  {t.frozenBadge}
                </span>
              )}
            </div>
          )}

          {/* Sprint Mode Stopwatch & Target */}
          {gameMode === 'sprint' && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${
              isLight
                ? 'bg-cyan-50 border-cyan-300 text-cyan-950 font-bold'
                : isNeon
                ? 'bg-[#04241d] border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900/90 border-cyan-500/40 text-cyan-300'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'} animate-spin-slow`} />
              <span className={`font-mono-math font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {sprintElapsed.toFixed(1)}s
              </span>
              <span className={`text-[10px] font-semibold border-l pl-1.5 ml-0.5 ${isLight ? 'text-cyan-800 border-cyan-200' : 'text-cyan-400/80 border-slate-700'}`}>
                {questionCount + 1}/{sprintTarget}
              </span>
            </div>
          )}

          {/* Audio Dictation Mode Badge */}
          {gameMode === 'audio' && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${
              isLight
                ? 'bg-violet-50 border-violet-300 text-violet-950 font-bold'
                : isNeon
                ? 'bg-[#04241d] border-violet-500/40 text-violet-300'
                : 'bg-slate-900/90 border-violet-500/40 text-violet-300'
            }`}>
              <Headphones className={`w-3.5 h-3.5 ${isLight ? 'text-violet-600' : 'text-violet-400'} animate-pulse`} />
              <span className="font-bold text-xs">
                {language === 'id' ? 'Audio' : 'Audio'}
              </span>
              <span className={`text-[10px] font-semibold border-l pl-1.5 ml-0.5 ${isLight ? 'text-violet-800 border-violet-200' : 'text-violet-400/80 border-slate-700'}`}>
                {questionCount + 1}/10
              </span>
            </div>
          )}

          {/* Focus Number Mode Badge */}
          {gameMode === 'focus' && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${
              isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                : isNeon
                ? 'bg-[#04241d] border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
            }`}>
              <Target className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <span className="font-bold text-xs">
                {t.focusActiveBadge}: {focusNumber}
              </span>
              <span className={`text-[10px] font-semibold border-l pl-1.5 ml-0.5 ${isLight ? 'text-emerald-800 border-emerald-200' : 'text-emerald-400/80 border-slate-700'}`}>
                {questionCount + 1}/{focusTarget}
              </span>
            </div>
          )}

          {/* Survival Hearts */}
          {gameMode === 'survival' && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${
              isLight
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : isNeon
                ? 'bg-[#04241d] border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-rose-400'
            }`}>
              <span className="text-[10px] font-bold text-rose-500">
                {t.lives}: {lives}/{isVip ? 4 : 3}
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: isVip ? 4 : 3 }).map((_, idx) => (
                  <Heart
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < lives
                        ? 'text-rose-500 fill-rose-500'
                        : isLight ? 'text-slate-300 fill-slate-200' : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                ))}
              </div>
              {isVip && (
                <span className="text-[9px] bg-amber-400/20 text-amber-500 font-bold px-1 rounded">
                  VIP +1
                </span>
              )}
            </div>
          )}

          {/* Current Score & Combo */}
          <div className="flex items-center gap-2">
            {combo > 1 && (
              <div
                className={`flex items-center gap-1 px-2.5 py-0.5 text-slate-950 font-black rounded-lg text-xs shadow-md transition-all ${
                  combo >= 10
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 animate-pulse ring-2 ring-amber-300 shadow-[0_0_15px_rgba(250,204,21,0.6)]'
                    : combo >= 5
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 animate-bounce shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 animate-bounce'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                <span>{combo}x {combo >= 10 ? 'FEVER 1.5x' : combo >= 5 ? 'FIRE' : ''}</span>
              </div>
            )}
            <div className={`font-mono-math font-extrabold text-sm ${
              isLight ? 'text-amber-800' : isNeon ? 'text-amber-300' : 'text-amber-400'
            }`}>
              {score} pts
            </div>
          </div>
        </div>

        {/* Progress Bar for Timer or Sprint Target */}
        {(gameMode === 'blitz' || gameMode === 'daily') && (
          <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 mb-1 ${
            isLight ? 'bg-slate-200' : isNeon ? 'bg-[#04241d]' : 'bg-slate-900'
          }`}>
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

        {gameMode === 'sprint' && (
          <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 mb-1 ${
            isLight ? 'bg-slate-200' : isNeon ? 'bg-[#04241d]' : 'bg-slate-900'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, ((questionCount) / sprintTarget) * 100)}%` }}
            />
          </div>
        )}

        {gameMode === 'audio' && (
          <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 mb-1 ${
            isLight ? 'bg-slate-200' : isNeon ? 'bg-[#04241d]' : 'bg-slate-900'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-300"
              style={{ width: `${Math.min(100, ((questionCount) / 10) * 100)}%` }}
            />
          </div>
        )}

        {gameMode === 'focus' && (
          <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 mb-1 ${
            isLight ? 'bg-slate-200' : isNeon ? 'bg-[#04241d]' : 'bg-slate-900'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
              style={{ width: `${Math.min(100, ((questionCount) / focusTarget) * 100)}%` }}
            />
          </div>
        )}

        {/* Main Question Card Area */}
        <div className={`flex-1 flex flex-col items-center justify-center py-2 relative ${isStreakShaking ? 'animate-screen-shake' : ''}`}>
          {/* Milestone Toast (Streak 5x spark or Streak 10x Fever Mode) */}
          {streakBanner && (
            <div className={`absolute top-0 z-30 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce text-center border ${
              streakBanner.isFever
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 border-amber-300 ring-4 ring-amber-400/40'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-400 ring-2 ring-orange-500/30'
            }`}>
              <div className="text-xl">
                {streakBanner.isFever ? '⚡' : '🔥'}
              </div>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-wider">
                  {streakBanner.title}
                </div>
                <div className="text-[10px] font-bold opacity-90">
                  {streakBanner.subtitle}
                </div>
              </div>
            </div>
          )}

          {/* STREAK BROKEN EFFECT BANNER */}
          {streakBrokenNotice && (
            <div className="absolute top-0 z-40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-streak-shatter text-left border bg-gradient-to-r from-rose-950/95 via-slate-900/95 to-slate-950/95 border-rose-500/70 ring-4 ring-rose-500/30 text-white backdrop-blur-md max-w-xs sm:max-w-sm">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 shrink-0">
                <span className="text-xl">💔</span>
                <span className="absolute -top-1.5 -right-1.5 text-xs animate-smoke-puff">💨</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                    {streakBrokenNotice.title}
                  </span>
                  <span className="text-[10px] font-black bg-rose-500/30 text-rose-200 border border-rose-500/40 px-1.5 py-0.5 rounded-md font-mono-math">
                    {streakBrokenNotice.lostCombo}x
                  </span>
                </div>
                <div className="text-[10px] font-medium text-slate-300 leading-tight mt-0.5">
                  {streakBrokenNotice.subtitle}
                </div>
              </div>
            </div>
          )}

          {/* Floating Score Popup */}
          {scorePopup && (
            <div className={`absolute top-10 right-4 z-30 font-mono-math font-black px-2.5 py-1 rounded-xl text-xs shadow-lg animate-bounce pointer-events-none ${
              scorePopup.isFever
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-[0_0_15px_rgba(250,204,21,0.6)]'
                : 'bg-emerald-500 text-white'
            }`}>
              {scorePopup.text}
            </div>
          )}

          {/* In-game Toast Notification */}
          {powerupToast && (
            <div className="absolute top-0 z-20 px-3 py-1.5 bg-rose-500/90 text-white font-bold text-xs rounded-xl shadow-lg animate-bounce text-center">
              {powerupToast}
            </div>
          )}

          {/* Question Box with Fever Mode Neon Gold Glow */}
          <div
            className={`w-full max-w-sm border rounded-3xl p-5 sm:p-7 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-200 relative ${
              feedback === 'correct'
                ? isLight
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50 scale-[1.02]'
                  : 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-950/30 scale-[1.02]'
                : feedback === 'wrong'
                ? isLight
                  ? 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-50 scale-95'
                  : 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-950/30 scale-95'
                : streakBrokenNotice
                ? isLight
                  ? 'border-rose-400 ring-4 ring-rose-300/40 bg-rose-50/40 scale-[0.99]'
                  : 'border-rose-500/60 ring-4 ring-rose-500/20 bg-slate-900 scale-[0.99]'
                : combo >= 10
                ? isLight
                  ? 'border-amber-400 ring-4 ring-amber-400/50 bg-gradient-to-b from-amber-50 via-white to-white animate-fever-glow scale-[1.01]'
                  : isNeon
                  ? 'border-amber-400 ring-4 ring-amber-400/50 from-[#08382c] via-[#04241d] to-[#04241d] animate-fever-glow scale-[1.01]'
                  : 'border-amber-400 ring-4 ring-amber-400/40 from-amber-950/40 via-slate-900 to-slate-900 animate-fever-glow scale-[1.01]'
                : combo >= 5
                ? isLight
                  ? 'border-orange-400 ring-2 ring-orange-400/30 shadow-md bg-gradient-to-b from-orange-50/60 via-white to-white'
                  : isNeon
                  ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.35)] from-[#062b22] to-[#04241d]'
                  : 'border-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.35)] from-slate-900 to-slate-900/90'
                : isLight
                ? 'border-slate-200 ring-1 ring-slate-200/80 bg-white shadow-lg'
                : isNeon
                ? 'border-emerald-500/40 ring-1 ring-emerald-500/20 bg-gradient-to-b from-[#063026] to-[#031e18] shadow-lg'
                : 'border-slate-800 ring-1 ring-slate-700/50 from-slate-900 to-slate-900/90 bg-gradient-to-b shadow-lg'
            }`}
          >
            {/* Super Reflex Avatar Banner during Fever Mode (Streak 10x+) or Streak 5x+ or Streak Broken */}
            {streakBrokenNotice ? (
              <div className={`w-full mb-3 p-2 px-3 rounded-2xl border flex items-center justify-between animate-streak-shatter ${
                isLight 
                  ? 'bg-rose-50 border-rose-200 text-rose-950 shadow-xs'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-100 shadow-md'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-900/40 border border-rose-500/50 flex items-center justify-center text-base relative">
                    <span>💨</span>
                    <span className="absolute -top-1 -right-1 text-[10px]">💔</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-black uppercase tracking-wider text-rose-500">
                      {language === 'id' ? 'STREAK TERHENTI' : 'STREAK STOPPED'}
                    </div>
                    <div className={`text-[11px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {playerName || 'Kakak Luffy'} · Nyala api padam!
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black font-mono-math text-rose-500 line-through">
                    {streakBrokenNotice.lostCombo}x
                  </div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                    RESET
                  </div>
                </div>
              </div>
            ) : combo >= 10 ? (
              <div className={`w-full mb-3 p-2 px-3 rounded-2xl border shadow-md flex items-center justify-between ${
                isLight
                  ? 'bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-amber-300'
                  : 'bg-gradient-to-r from-amber-950/80 via-orange-950/80 to-amber-950/80 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 p-0.5 animate-flame-aura flex items-center justify-center">
                      <div className={`w-full h-full ${isLight ? 'bg-white' : 'bg-slate-950'} rounded-full flex items-center justify-center text-xl`}>
                        {playerAvatar || '😎'}
                      </div>
                    </div>
                    <span className="absolute -top-1 -right-1 text-xs animate-bounce">🔥</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 bg-amber-300/80 px-1.5 py-0.5 rounded border border-amber-400">
                        SUPER REFLEX
                      </span>
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-amber-200'}`}>
                        {playerName || 'Kakak Luffy'}
                      </span>
                    </div>
                    <div className={`text-[11px] font-extrabold flex items-center gap-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                      <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                      <span>{t.feverModeActive}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black font-mono-math ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                    {combo}x
                  </div>
                  <div className="text-[8px] font-extrabold text-amber-600 uppercase tracking-tighter">
                    FEVER
                  </div>
                </div>
              </div>
            ) : combo >= 5 ? (
              <div className={`w-full mb-3 p-1.5 px-3 rounded-2xl border shadow-sm flex items-center justify-between ${
                isLight
                  ? 'bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 border-orange-300'
                  : 'bg-gradient-to-r from-orange-950/60 via-amber-950/50 to-orange-950/60 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.25)]'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 flex items-center justify-center animate-pulse">
                    <div className={`w-full h-full ${isLight ? 'bg-white' : 'bg-slate-950'} rounded-full flex items-center justify-center text-base`}>
                      {playerAvatar || '😎'}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-black uppercase tracking-wider text-orange-600">
                      {t.streakFire5}
                    </div>
                    <div className={`text-[11px] font-bold ${isLight ? 'text-slate-900' : 'text-orange-200'}`}>
                      {playerName || 'Kakak Luffy'} Refleks On Fire!
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-orange-600 font-mono-math">
                    {combo}x
                  </div>
                  <div className="text-[8px] font-bold text-orange-600 uppercase">
                    STREAK
                  </div>
                </div>
              </div>
            ) : null}

            {/* Top row inside question card: Question number + Prominent Scratchpad button */}
            <div className="w-full flex items-center justify-between mb-2">
              <div className={`text-[11px] sm:text-xs uppercase tracking-wider font-semibold truncate ${
                isLight ? 'text-slate-600' : isNeon ? 'text-emerald-300/80' : 'text-slate-400'
              }`}>
                {language === 'id' ? 'Soal' : 'Question'} #{questionCount + 1}{gameMode === 'sprint' ? ` / ${sprintTarget}` : gameMode === 'audio' ? ' / 10' : gameMode === 'focus' ? ` / ${focusTarget}` : ''} · {(level === 'sd_awal' ? t.diffSd13 : level === 'sd_lanjut' ? t.diffSd46 : level === 'smp' ? t.diffSmp : t.diffPro).toUpperCase()}{maxNumber ? ` · ≤${maxNumber}` : ''}
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsScratchpadOpen(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs shrink-0 ml-2 ${
                  isLight
                    ? 'bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-900'
                    : isNeon
                    ? 'bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 hover:text-white'
                    : 'bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 hover:border-sky-400 text-sky-300 hover:text-white'
                }`}
                title={language === 'id' ? 'Buka Papan Coretan Hitung' : 'Open Scratchpad'}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Coretan' : 'Scratchpad'}</span>
              </button>
            </div>

            {/* Audio Dictation Control Toolbar */}
            {gameMode === 'audio' && (
              <div className={`w-full flex items-center justify-between mb-2 p-2 rounded-2xl gap-2 border ${
                isLight
                  ? 'bg-violet-50 border-violet-200'
                  : 'bg-violet-950/40 border-violet-500/30'
              }`}>
                <button
                  type="button"
                  onClick={() => speakQuestion(currentQuestion)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-amber-300' : ''}`} />
                  <span>{t.audioRepeatButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsBlindfold(prev => !prev);
                    setIsPeeking(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    isBlindfold
                      ? isLight ? 'bg-purple-100 border-purple-400 text-purple-900' : 'bg-purple-900/60 border-purple-400 text-purple-200'
                      : isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title={t.audioBlindfoldToggle}
                >
                  {isBlindfold ? <EyeOff className="w-3.5 h-3.5 text-purple-500" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isBlindfold ? (language === 'id' ? 'Mata Tertutup 🙈' : 'Blindfold 🙈') : (language === 'id' ? 'Lihat Teks 👁️' : 'Show Text 👁️')}</span>
                </button>
              </div>
            )}

            {/* Arithmetic Expression or Blindfold Mask */}
            {gameMode === 'audio' && isBlindfold && !isPeeking ? (
              <div className={`py-4 flex flex-col items-center justify-center my-1 w-full rounded-2xl border ${
                isLight ? 'bg-violet-50/60 border-violet-200' : 'bg-slate-950/50 border-violet-900/50'
              }`}>
                <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center mb-1.5 animate-pulse">
                  <Headphones className="w-6 h-6 text-violet-500" />
                </div>
                <div className={`text-xs font-semibold text-center px-4 mb-2 ${isLight ? 'text-violet-900' : 'text-violet-200'}`}>
                  {t.audioBlindfoldPrompt}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPeeking(true)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                    isLight ? 'bg-white border border-slate-300 text-amber-800 hover:bg-slate-50' : 'text-amber-300 hover:text-amber-200 bg-slate-900 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.audioPeekButton}</span>
                </button>
              </div>
            ) : (
              <div className="relative my-2">
                <div className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono-math tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {currentQuestion.questionText.replace(' = ?', '')}
                </div>
                {gameMode === 'audio' && isBlindfold && isPeeking && (
                  <button
                    type="button"
                    onClick={() => setIsPeeking(false)}
                    className="mt-1 text-[10px] text-amber-500 font-bold hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>{t.audioHidePeekButton}</span>
                  </button>
                )}
              </div>
            )}

            {/* Equal sign & Input field display if in keypad mode */}
            {inputMode === 'keypad' ? (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className={`text-2xl font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>=</span>
                <div className={`min-w-[100px] h-11 px-4 rounded-xl border-2 flex items-center justify-center text-2xl font-mono-math font-bold ${
                  isLight
                    ? 'bg-amber-50 border-amber-500 text-slate-950'
                    : isNeon
                    ? 'bg-[#021310] border-emerald-400 text-emerald-200'
                    : 'bg-slate-950 border-amber-500 text-amber-300'
                }`}>
                  {keypadInput || <span className="opacity-30">?</span>}
                </div>
              </div>
            ) : (
              <div className={`text-xl font-bold mt-1 ${isLight ? 'text-amber-800' : isNeon ? 'text-amber-300' : 'text-amber-400'}`}>= ?</div>
            )}

            {/* Spoken Feedback Subtitle Banner in Audio Mode */}
            {gameMode === 'audio' && audioFeedbackText && (
              <div className={`mt-2.5 px-3 py-1.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-extrabold animate-in fade-in zoom-in-95 ${
                feedback === 'correct' 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-600 shadow-sm' 
                  : 'bg-rose-500/20 border-rose-400 text-rose-600 shadow-sm'
              }`}>
                <Volume2 className="w-4 h-4 animate-bounce shrink-0" />
                <span>{audioFeedbackText}</span>
              </div>
            )}

            {/* Hint or Trick prompt */}
            {getQuestionHint(currentQuestion, language) && (
              <p className={`text-[11px] mt-3 max-w-xs text-balance ${
                isLight ? 'text-slate-700 bg-amber-50/80 border border-amber-200 p-2 rounded-xl font-medium' : isNeon ? 'text-emerald-200/90' : 'text-slate-400'
              }`}>
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
              className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xl text-xs transition-colors cursor-pointer shadow-xs ${
                isLight
                  ? isFrozen ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-400/40' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  : isNeon
                  ? isFrozen ? 'bg-[#04241d] border-sky-400 text-sky-300 ring-2 ring-sky-400/30' : 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 text-emerald-200'
                  : isFrozen ? 'bg-slate-900 border-sky-400 text-sky-300 ring-2 ring-sky-400/30' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
              title="Freeze Timer"
            >
              <span>❄️ {t.freezeTime}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-math font-bold ${
                isLight ? 'bg-sky-100 text-sky-900' : 'bg-slate-800 text-sky-400'
              }`}>
                {freezeItem?.quantity || 0}
              </span>
            </button>
          )}

          <button
            onClick={activate5050}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xl text-xs transition-colors cursor-pointer shadow-xs ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                : isNeon
                ? 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 text-emerald-200'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="50:50"
          >
            <span>🪄 50:50</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-math font-bold ${
              isLight ? 'bg-amber-100 text-amber-900' : 'bg-slate-800 text-amber-400'
            }`}>
              {hintItem?.quantity || 0}
            </span>
          </button>

          <button
            onClick={activateDoubleXp}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xl text-xs transition-colors cursor-pointer shadow-xs ${
              isLight
                ? isDoubleXpActive ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/30' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                : isNeon
                ? isDoubleXpActive ? 'bg-[#04241d] border-amber-400 text-amber-300 ring-2 ring-amber-400/30' : 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 text-emerald-200'
                : isDoubleXpActive ? 'bg-slate-900 border-amber-500 text-amber-400 ring-2 ring-amber-500/30' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Double Score & XP"
          >
            <span>🚀 {t.doubleXp}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-math font-bold ${
              isLight ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-800 text-emerald-400'
            }`}>
              {isDoubleXpActive ? 'AKTIF' : doubleXpItem?.quantity || 0}
            </span>
          </button>

          {/* Toggle Keypad vs Multiple Choice */}
          <button
            onClick={() => {
              sounds.playTap();
              setInputMode(prev => (prev === 'options' ? 'keypad' : 'options'));
            }}
            className={`px-2.5 py-1.5 border rounded-xl text-xs cursor-pointer shadow-xs font-semibold ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                : isNeon
                ? 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
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
                      : isLight
                      ? 'bg-white hover:bg-amber-50/90 border-2 border-slate-200 hover:border-amber-500 text-slate-900 hover:text-amber-950 shadow-sm'
                      : isNeon
                      ? 'bg-[#04241d] hover:bg-[#07362a] border border-emerald-500/40 hover:border-emerald-400 text-emerald-100 hover:text-white'
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
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm'
                    : key === 'DEL'
                    ? isLight ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-800 hover:bg-slate-700 text-rose-400 text-sm font-semibold'
                    : isLight
                    ? 'bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-900 font-black shadow-xs'
                    : isNeon
                    ? 'bg-[#04241d] hover:bg-[#07362a] border border-emerald-500/40 text-emerald-100'
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
      <div className={`flex-1 flex flex-col justify-between p-3.5 sm:p-5 select-none overflow-y-auto transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-900'
          : isNeon
          ? 'bg-[#021411] text-emerald-100'
          : 'bg-slate-950 text-slate-100'
      }`}>
        <div className="space-y-3">
          {/* Top Grade Badge & Title */}
          <div className="text-center pt-1">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-tr ${gradeBadgeColor} flex items-center justify-center text-2xl sm:text-3xl shadow-lg mb-2 animate-bounce`}>
              {accuracyPct === 100 ? '🌟' : accuracyPct >= 75 ? '⚡' : accuracyPct >= 50 ? '👍' : '💡'}
            </div>
            <h2 className={`text-lg sm:text-xl font-extrabold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {gradeTitle}
            </h2>
            <p className={`text-[11px] sm:text-xs mt-1 max-w-sm mx-auto leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
              {language === 'id'
                ? `Akurasi ${accuracyPct}% (${correctCount} benar, ${wrongCount} salah dari ${totalAttempted} soal). Rata-rata ${gameSummary.avgTimeSec}s/soal (${speedRating}).`
                : `Accuracy ${accuracyPct}% (${correctCount} correct, ${wrongCount} wrong of ${totalAttempted} questions). Avg speed ${gameSummary.avgTimeSec}s/q (${speedRating}).`}
            </p>
          </div>

          {/* Special Sprint Result Banner */}
          {gameSummary.sprintTime !== undefined && (
            <div className={`rounded-2xl p-3 flex items-center justify-between shadow-md border ${
              isLight
                ? 'bg-cyan-50 border-cyan-300 text-cyan-950'
                : 'bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-900 border-cyan-500/40 text-white'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>
                  {language === 'id' ? 'Hasil Sprint Waktu' : 'Sprint Time Result'} · {sprintTarget} {language === 'id' ? 'Soal' : 'Questions'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-2xl font-black font-mono-math ${isLight ? 'text-cyan-950' : 'text-white'}`}>
                    {gameSummary.sprintTime.toFixed(1)}s
                  </span>
                  <span className={`text-xs ${isLight ? 'text-cyan-800 font-semibold' : 'text-slate-400'}`}>
                    ({(gameSummary.sprintTime / sprintTarget).toFixed(2)}s {t.perQuestionShort})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (gameSummary.stars || 1)
                        ? 'fill-amber-400 text-amber-500 animate-bounce'
                        : isLight ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Special Focus Result Banner */}
          {gameSummary.focusNumber !== undefined && (
            <div className={`rounded-2xl p-3 flex items-center justify-between shadow-md border ${
              isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-900 border-emerald-500/40 text-white'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                  {language === 'id' ? `Hasil Fokus Angka ${gameSummary.focusNumber}` : `Focus Number ${gameSummary.focusNumber} Result`} · {gameSummary.focusTarget || 10} {language === 'id' ? 'Soal' : 'Questions'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-xl font-black font-mono-math ${isLight ? 'text-emerald-950' : 'text-white'}`}>
                    {accuracyPct}% {language === 'id' ? 'Akurasi' : 'Accuracy'}
                  </span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-emerald-800' : 'text-emerald-300/80'}`}>
                    ({accuracyPct === 100 ? (language === 'id' ? '🏆 Sempurna' : '🏆 Perfect') : accuracyPct >= 80 ? (language === 'id' ? '⚡ Sangat Mahir' : '⚡ Mastered') : (language === 'id' ? '💪 Terus Latihan' : '💪 Keep Practicing')})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (accuracyPct === 100 ? 3 : accuracyPct >= 70 ? 2 : 1)
                        ? 'fill-amber-400 text-amber-500 animate-bounce'
                        : isLight ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Special Audio Result Banner */}
          {gameSummary.isAudio && (
            <div className={`rounded-2xl p-3 flex items-center justify-between shadow-md border ${
              isLight
                ? 'bg-violet-50 border-violet-300 text-violet-950'
                : 'bg-gradient-to-r from-violet-950/80 via-purple-950/80 to-slate-900 border-violet-500/40 text-white'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${isLight ? 'text-violet-800' : 'text-violet-400'}`}>
                  {language === 'id' ? 'Hasil Dikte Suara (Audio Mencongak)' : 'Audio Dictation Result'} · 10 {language === 'id' ? 'Soal' : 'Questions'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-xl font-black font-mono-math ${isLight ? 'text-violet-950' : 'text-white'}`}>
                    {accuracyPct}% {language === 'id' ? 'Akurasi Dengar' : 'Listening Accuracy'}
                  </span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-violet-800' : 'text-violet-300/80'}`}>
                    ({correctCount} / {totalAttempted} {language === 'id' ? 'Benar' : 'Correct'})
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                isLight ? 'bg-violet-100 border-violet-300 text-violet-900' : 'bg-violet-500/20 border-violet-400/40 text-violet-200'
              }`}>
                🎧
              </div>
            </div>
          )}

          {/* Special Fever Mode Milestone Highlight */}
          {gameSummary.maxCombo >= 10 && (
            <div className={`rounded-2xl p-3 flex items-center justify-between shadow-md border ${
              isLight
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-gradient-to-r from-amber-950/80 via-orange-950/80 to-slate-900 border-amber-400/50 text-white'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center animate-flame-aura">
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-xl ${
                    isLight ? 'bg-white' : 'bg-slate-950'
                  }`}>
                    {playerAvatar || '😎'}
                  </div>
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${
                    isLight ? 'text-amber-800' : 'text-amber-300'
                  }`}>
                    <span>⚡ {t.feverAchieved}</span>
                    <span className="bg-amber-400/20 text-amber-600 px-1 py-0.2 rounded text-[9px] font-mono-math">1.5x POIN</span>
                  </span>
                  <div className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-amber-950' : 'text-amber-200'}`}>
                    {language === 'id' 
                      ? `Refleks Super ${playerName || 'Kakak Luffy'} aktif dengan rekor kombo ${gameSummary.maxCombo}x berturut-turut!` 
                      : `Super Reflex active with ${gameSummary.maxCombo}x streak!`}
                  </div>
                </div>
              </div>
              <div className="text-2xl animate-pulse">🔥</div>
            </div>
          )}

          {/* 4 Score Metrics Cards */}
          <div className={`rounded-2xl p-3 grid grid-cols-2 gap-2 shadow-md border ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : isNeon
              ? 'bg-[#04241d] border-emerald-500/40 text-emerald-100'
              : 'bg-slate-900/90 border-slate-800 text-slate-100'
          }`}>
            <div className={`rounded-xl p-2 sm:p-2.5 border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-950/80 border-slate-800/80'
            }`}>
              <div className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.totalScore}</div>
              <div className={`text-lg sm:text-xl font-black font-mono-math ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                {gameSummary.score} Pts
              </div>
            </div>

            <div className={`rounded-xl p-2 sm:p-2.5 border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-950/80 border-slate-800/80'
            }`}>
              <div className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.accuracy}</div>
              <div className={`text-lg sm:text-xl font-black font-mono-math ${
                accuracyPct >= 80 
                  ? isLight ? 'text-emerald-700' : 'text-emerald-400' 
                  : accuracyPct >= 50 
                  ? isLight ? 'text-amber-700' : 'text-amber-400' 
                  : isLight ? 'text-rose-700' : 'text-rose-400'
              }`}>
                {accuracyPct}% ({correctCount}/{totalAttempted})
              </div>
            </div>

            <div className={`rounded-xl p-2 sm:p-2.5 border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-950/80 border-slate-800/80'
            }`}>
              <div className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.avgTimeLabel}</div>
              <div className={`text-sm font-black font-mono-math ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>
                {gameSummary.avgTimeSec}s
              </div>
              <div className={`text-[9px] truncate font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{speedRating}</div>
            </div>

            <div className={`rounded-xl p-2 sm:p-2.5 border text-center ${
              isLight ? 'bg-slate-50 border-slate-200' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-950/80 border-slate-800/80'
            }`}>
              <div className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.bonusCoinsEarned}</div>
              <div className={`text-lg sm:text-xl font-black font-mono-math ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                +{gameSummary.coinsEarned} 🪙
              </div>
            </div>
          </div>

          {/* Detailed Question Review & Evaluation Section */}
          <div className={`rounded-2xl p-3 sm:p-3.5 shadow-md space-y-2.5 border ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : isNeon
              ? 'bg-[#04241d] border-emerald-500/40 text-emerald-100'
              : 'bg-slate-900/90 border-slate-800 text-slate-100'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">📋</span>
                <h3 className={`font-extrabold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t.reviewQuestionsTitle} ({totalAttempted})
                </h3>
              </div>

              {/* Filter Toggle: All vs Wrong Only */}
              <div className={`flex items-center gap-1 p-1 rounded-xl border text-[10px] ${
                isLight ? 'bg-slate-100 border-slate-200' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-950 border-slate-800'
              }`}>
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    reviewFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-400 hover:text-white'
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
                        ? 'bg-rose-500 text-white shadow-xs'
                        : isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-400 hover:text-white'
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
                <div className={`p-4 text-center italic text-xs ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
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
                          ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/30'
                          : isLight ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-rose-950/20 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            #{idx + 1}
                          </span>
                          <span className={`font-mono-math font-extrabold text-sm ${isLight ? 'text-slate-950' : 'text-white'}`}>
                            {rec.questionText}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          rec.isCorrect
                            ? isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isLight ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {rec.isCorrect ? `✓ ${rec.responseTimeSec}s` : `✕ ${rec.responseTimeSec}s`}
                        </span>
                      </div>

                      <div className={`flex items-center gap-3 text-[11px] mt-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                        <div>
                          <span className={`font-semibold mr-1 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>{t.yourAnswer}</span>
                          <span className={`font-mono-math font-black ${
                            rec.isCorrect 
                              ? isLight ? 'text-emerald-700' : 'text-emerald-400' 
                              : isLight ? 'text-rose-700 line-through' : 'text-rose-400 line-through'
                          }`}>
                            {rec.userAnswer}
                          </span>
                        </div>
                        {!rec.isCorrect && (
                          <div>
                            <span className={`font-semibold mr-1 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>{t.correctAnswer}</span>
                            <span className={`font-mono-math font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                              {rec.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pembahasan / Hint */}
                      {hintText && (
                        <div className={`mt-1.5 pt-1.5 border-t text-[10px] font-medium ${
                          isLight
                            ? 'border-slate-200 text-amber-900 bg-amber-50/70 p-1.5 rounded-lg'
                            : 'border-slate-800/60 text-amber-300/90'
                        }`}>
                          💡 <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}>{t.explanation}</span> {hintText}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Remedial Practice Button for wrong questions */}
            {wrongCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  startGame('sprint', true);
                }}
                className={`w-full mt-2 py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 ${
                  isLight
                    ? 'bg-rose-100 hover:bg-rose-200 border-rose-300 text-rose-900'
                    : 'bg-gradient-to-r from-rose-500/20 via-orange-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-orange-500/30 border-rose-500/40 text-rose-300 hover:text-white'
                }`}
              >
                <Target className="w-4 h-4 text-rose-500" />
                <span>{t.remedialButton} ({wrongCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => startGame(gameMode)}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
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
            className={`w-full h-10 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-xs'
                : isNeon
                ? 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{t.viewLeaderboardButton}</span>
          </button>

          {onOpenCertificate && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onOpenCertificate();
              }}
              className={`w-full h-10 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950 shadow-xs'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/25'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>{language === 'id' ? `Buka E-Sertifikat Prestasi (${playerName})` : `Open Certificate (${playerName})`}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setGameOver(false);
            }}
            className={`w-full h-9 text-xs font-bold cursor-pointer transition-colors ${
              isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // Home / Mode Selector Screen
  return (
    <div className={`flex-1 flex flex-col justify-between p-3.5 sm:p-4 select-none overflow-y-auto transition-colors duration-200 ${
      isLight
        ? 'bg-slate-50 text-slate-900'
        : isNeon
        ? 'bg-[#021411] text-emerald-100'
        : 'bg-slate-950 text-slate-100'
    }`}>
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isLight ? 'text-amber-800' : isNeon ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {language === 'id' ? 'Aritmatika Mental' : 'Mental Arithmetic'}
            </span>
            <h1 className={`text-xl font-black tracking-tight font-display ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {language === 'id' ? 'Pilih Mode Latihan' : 'Choose Practice Mode'}
            </h1>
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-semibold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.totalExercises}:
            </span>
            <span className={`text-xs font-black font-mono-math ${
              isLight ? 'text-amber-700' : 'text-amber-300'
            }`}>
              {stats.totalQuestionsAnswered} {t.questions}
            </span>
          </div>
        </div>

        {/* Configuration Panel: Difficulty & Math Operations */}
        <div className={`rounded-2xl p-3 space-y-2.5 shadow-sm my-2 border transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : isNeon
            ? 'bg-[#04241d]/90 border-emerald-500/40 text-emerald-100 shadow-lg'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}>
          {/* Difficulty Level Segmented Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                {t.difficultyLabel}
              </span>
              <span className={`text-[10px] font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                {level === 'sd_awal' ? t.diffSd13 : level === 'sd_lanjut' ? t.diffSd46 : level === 'smp' ? t.diffSmp : t.diffPro}
              </span>
            </div>
            <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : isNeon ? 'bg-[#021411] border-emerald-500/30' : 'bg-slate-950 border-slate-800/80'
            }`}>
              {[
                { id: 'sd_awal', label: t.diffSd13 },
                { id: 'sd_lanjut', label: t.diffSd46 },
                { id: 'smp', label: t.diffSmp },
                { id: 'sma_pro', label: t.diffPro }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelChange(lvl.id as DifficultyLevel)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    level === lvl.id
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md scale-[1.02]'
                      : isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-Select Operation Filter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className={`text-[11px] font-extrabold block leading-tight ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                  {t.operationsLabel}
                </span>
                <span className={`text-[9px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t.operationsMultiSubtitle}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                  {selectedOperations.length === 4
                    ? t.opAll
                    : `${selectedOperations.join(' ')} (${selectedOperations.length})`}
                </span>
                {selectedOperations.length < 4 && (
                  <button
                    type="button"
                    onClick={selectAllOperations}
                    className={`text-[9px] px-2 py-0.5 rounded-md cursor-pointer font-bold transition-all border ${
                      isLight 
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300' 
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                    }`}
                  >
                    + {t.opAll}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[
                { id: '+', label: '+', title: t.opAdd, sub: language === 'id' ? 'Tambah' : 'Add' },
                { id: '-', label: '−', title: t.opSub, sub: language === 'id' ? 'Kurang' : 'Sub' },
                { id: '×', label: '×', title: t.opMul, sub: language === 'id' ? 'Kali' : 'Mult' },
                { id: '÷', label: '÷', title: t.opDiv, sub: language === 'id' ? 'Bagi' : 'Div' }
              ].map(op => {
                const isSelected = selectedOperations.includes(op.id as MathOperation);
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => toggleOperation(op.id as MathOperation)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 shadow-sm font-black scale-[1.02]'
                          : isNeon
                          ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-sm scale-[1.02]'
                          : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm ring-1 ring-amber-400/40 scale-[1.02]'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900 font-semibold'
                        : isNeon
                        ? 'bg-[#021411] border-emerald-500/30 text-emerald-400/60 hover:text-emerald-200'
                        : 'bg-slate-950 border-slate-800/80 text-slate-500 hover:border-slate-700 hover:text-slate-300 opacity-60'
                    }`}
                    title={op.title}
                  >
                    <span className="font-mono-math font-extrabold text-base leading-none">
                      {op.label}
                    </span>
                    <span className="text-[9px] font-bold mt-1">
                      {op.sub}
                    </span>
                    <span className={`text-[8px] font-semibold mt-0.5 ${
                      isSelected 
                        ? isLight ? 'text-amber-800 font-bold' : 'text-amber-400' 
                        : isLight ? 'text-slate-500' : 'text-slate-600'
                    }`}>
                      {isSelected ? '✓ Aktif' : 'Off'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Angka Tertinggi / Max Number Filter */}
          <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className={`text-[11px] font-extrabold block leading-tight ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                  {t.maxNumberLabel}
                </span>
                <span className={`text-[9px] font-bold ${isLight ? 'text-amber-800' : 'text-amber-300/90'}`}>
                  {maxNumber ? `${language === 'id' ? 'Batas aktif: Maksimal s/d' : 'Active limit: Up to'} ${maxNumber}` : t.maxNumberAuto}
                </span>
              </div>
              {maxNumber !== null && (
                <button
                  type="button"
                  onClick={() => handleSelectMaxNumber(null)}
                  className={`text-[9px] px-2 py-0.5 rounded-md cursor-pointer font-bold transition-all border ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  ↺ Reset {t.maxNumberAuto}
                </button>
              )}
            </div>

            {/* Presets Grid adapted to difficulty level */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[11px]">
              {activeLevelConfig.presets.map(preset => {
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
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
                        : isNeon
                        ? 'bg-[#021411] border-emerald-500/30 text-emerald-300 hover:border-emerald-400 hover:text-white'
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
                ? 'bg-amber-50 border-amber-200 text-amber-950 font-semibold'
                : 'text-amber-300/80 bg-amber-500/10 border-amber-500/20'
            }`}>
              <span>💡</span>
              <span className="leading-tight font-medium">{activeLevelConfig.description}</span>
            </div>

            {/* Custom Max Number Field */}
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsCustomMax(true);
                  if (!maxNumber) setMaxNumber(Math.min(50, activeLevelConfig.defaultMax));
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
                      max={activeLevelConfig.hardCap}
                      value={customMaxInput || (maxNumber ? String(maxNumber) : '')}
                      onChange={e => handleCustomMaxChange(e.target.value)}
                      placeholder={level === 'sd_awal' ? 'Contoh: 10, 15, 20...' : t.maxNumberCustomPlaceholder}
                      className={`w-full rounded-xl px-2.5 py-1 text-xs font-mono-math font-bold focus:outline-none border ${
                        isLight
                          ? 'bg-white border-2 border-amber-500 text-slate-950 placeholder:text-slate-400 focus:ring-1 focus:ring-amber-500'
                          : isNeon
                          ? 'bg-[#021411] border border-emerald-500 text-emerald-200 placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-400'
                          : 'bg-slate-950 border border-amber-500/60 text-amber-300 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] shrink-0 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {language === 'id' ? `Maks ≤ ${activeLevelConfig.hardCap}` : `Cap ≤ ${activeLevelConfig.hardCap}`}
                  </span>
                </div>
              ) : (
                <span className={`text-[10px] italic truncate ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
                  {maxNumber ? `${t.maxNumberNote}` : `${language === 'id' ? 'Pilih batas angka di atas atau masukkan angka bebas.' : 'Pick ceiling above or enter custom number.'}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section Header: Game Modes */}
        <div className="flex items-center justify-between pt-2 pb-1">
          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
            isLight ? 'text-slate-800' : 'text-slate-400'
          }`}>
            {language === 'id' ? 'Pilih Mode Latihan' : 'Choose Game Mode'}
          </span>
          <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
            {language === 'id' ? '6 Mode Tersedia' : '6 Modes Available'}
          </span>
        </div>

        {/* Game Mode Cards */}
        <div className="space-y-2.5 my-2">
          {/* Mode 1: Kilat 60 Detik (Blitz) */}
          <button
            onClick={() => startGame('blitz')}
            className={`w-full group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm border ${
              isLight
                ? 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-400'
                : isNeon
                ? 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 hover:border-emerald-400 shadow-md'
                : 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900/80 border-amber-500/30 hover:border-amber-400 shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-extrabold text-sm truncate transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-amber-800' : 'text-white group-hover:text-amber-300'
                  }`}>
                    {t.modeBlitz}
                  </h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 border ${
                    isLight 
                      ? 'bg-amber-100 border-amber-300 text-amber-900' 
                      : 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  }`}>
                    {language === 'id' ? 'POPULER 🔥' : 'POPULAR 🔥'}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {t.modeBlitzDesc}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-all group-hover:translate-x-0.5 ${
                isLight ? 'text-slate-400 group-hover:text-amber-600' : 'text-slate-500 group-hover:text-amber-400'
              }`} />
            </div>
          </button>

          {/* Mode 2: Target Sprint (Time Attack) */}
          <div className={`w-full group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 shadow-sm border ${
            isLight
              ? 'bg-white hover:bg-cyan-50/80 border-slate-200 hover:border-cyan-400'
              : isNeon
              ? 'bg-[#04241d] border-cyan-500/40 hover:border-cyan-400 shadow-md'
              : 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-slate-900/80 border-cyan-500/30 hover:border-cyan-400 shadow-md'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0 mt-0.5">
                <Target className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-extrabold text-sm truncate transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-cyan-800' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {t.modeSprint}
                  </h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 border ${
                    isLight 
                      ? 'bg-cyan-100 border-cyan-300 text-cyan-900' 
                      : 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'
                  }`}>
                    {t.sprintBadge}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {t.modeSprintDesc}
                </p>

                {/* Sprint Target Options & Start Button */}
                <div className={`mt-2.5 pt-2 border-t flex items-center justify-between gap-2 flex-wrap ${
                  isLight ? 'border-slate-200' : 'border-slate-800/80'
                }`}>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold mr-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      {t.sprintTargetQuestions}:
                    </span>
                    {[10, 20, 30].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          setSprintTarget(cnt);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          sprintTarget === cnt
                            ? 'bg-cyan-500 text-white font-black shadow-xs'
                            : isLight
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => startGame('sprint')}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                  >
                    <span>{language === 'id' ? 'Mulai Sprint' : 'Start Sprint'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mode 3: Dikte Suara (Audio Mencongak) */}
          <div className={`w-full group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 shadow-sm border ${
            isLight
              ? 'bg-white hover:bg-violet-50/80 border-slate-200 hover:border-violet-400'
              : isNeon
              ? 'bg-[#04241d] border-violet-500/40 hover:border-violet-400 shadow-md'
              : 'bg-gradient-to-r from-violet-500/15 via-purple-500/10 to-slate-900/80 border-violet-500/30 hover:border-violet-400 shadow-md'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-400 to-purple-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0 mt-0.5">
                <Headphones className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-extrabold text-sm truncate transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-violet-800' : 'text-white group-hover:text-violet-300'
                  }`}>
                    {t.modeAudio}
                  </h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 border ${
                    isLight
                      ? 'bg-violet-100 border-violet-300 text-violet-900'
                      : 'bg-violet-400/20 border-violet-400/40 text-violet-300'
                  }`}>
                    {t.audioBadge}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {t.modeAudioDesc}
                </p>

                {/* Audio Option & Start Button */}
                <div className={`mt-2.5 pt-2 border-t flex items-center justify-between gap-2 flex-wrap ${
                  isLight ? 'border-slate-200' : 'border-slate-800/80'
                }`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playTap();
                      setIsBlindfold(prev => !prev);
                    }}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isBlindfold
                        ? isLight ? 'bg-purple-100 border-purple-400 text-purple-900 font-black' : 'bg-purple-900/60 border-purple-400 text-purple-200'
                        : isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isBlindfold ? <EyeOff className="w-3.5 h-3.5 text-purple-500" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isBlindfold ? (language === 'id' ? 'Mata Tertutup 🙈' : 'Blindfold 🙈') : (language === 'id' ? 'Teks + Suara 👁️' : 'Text + Audio 👁️')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startGame('audio')}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-violet-400 to-purple-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                  >
                    <span>{language === 'id' ? 'Mulai Dikte' : 'Start Audio'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mode 4: Latihan Fokus Angka Tertentu */}
          <div className={`w-full group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 shadow-sm border ${
            isLight
              ? 'bg-white hover:bg-emerald-50/80 border-slate-200 hover:border-emerald-400'
              : isNeon
              ? 'bg-[#04241d] border-emerald-500/40 hover:border-emerald-400 shadow-md'
              : 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900/80 border-emerald-500/30 hover:border-emerald-400 shadow-md'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0 mt-0.5">
                <Target className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-extrabold text-sm truncate transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-emerald-800' : 'text-white group-hover:text-emerald-300'
                  }`}>
                    {t.modeFocus}
                  </h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 border ${
                    isLight
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-emerald-400/20 border-emerald-400/40 text-emerald-300'
                  }`}>
                    {t.focusBadge}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {t.modeFocusDesc}
                </p>

                {/* Focus Controls */}
                <div className={`mt-2.5 pt-2 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
                  {/* Preset chips adapted to level & maxNumber */}
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className={`text-[10px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      {t.focusNumberLabel}
                    </span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {focusPresets.map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFocusNumber(num);
                          }}
                          className={`w-7 h-6 rounded-lg text-[10px] font-mono-math font-bold transition-all cursor-pointer flex items-center justify-center ${
                            focusNumber === num && !isCustomFocus
                              ? 'bg-emerald-500 text-white font-black shadow-xs scale-105'
                              : isLight
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          setIsCustomFocus(prev => !prev);
                        }}
                        className={`px-2 h-6 rounded-lg text-[9px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
                          isCustomFocus
                            ? isLight ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-black' : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t.focusNumberCustom}
                      </button>
                    </div>
                  </div>

                  {/* Custom Number Input if enabled */}
                  {isCustomFocus && (
                    <div className="flex items-center gap-2 pt-0.5 animate-in fade-in duration-150">
                      <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        {language === 'id' ? 'Ketik Angka:' : 'Enter Number:'}
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={Math.max(2, (maxNumber !== null ? maxNumber : activeLevelConfig.defaultMax) - 1)}
                        value={customFocusInput || String(focusNumber)}
                        onChange={(e) => handleCustomFocusChange(e.target.value)}
                        placeholder="Contoh: 7"
                        className={`w-20 rounded-lg px-2 py-0.5 text-xs font-mono-math font-bold focus:outline-none border ${
                          isLight
                            ? 'bg-white border-2 border-emerald-500 text-slate-900'
                            : 'bg-slate-950 border border-emerald-500/60 text-emerald-300'
                        }`}
                      />
                      <span className={`text-[9px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        ({language === 'id' ? `Maksimal < ${maxNumber !== null ? maxNumber : activeLevelConfig.defaultMax}` : `Cap < ${maxNumber !== null ? maxNumber : activeLevelConfig.defaultMax}`})
                      </span>
                    </div>
                  )}

                  {/* Target Questions selector & Start Button */}
                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-bold mr-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        {t.sprintTargetQuestions}:
                      </span>
                      {[10, 15, 20].map(cnt => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playTap();
                            setFocusTarget(cnt);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            focusTarget === cnt
                              ? 'bg-emerald-500 text-white font-black shadow-xs'
                              : isLight
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {cnt}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => startGame('focus')}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                    >
                      <span>{language === 'id' ? `Fokus Angka ${focusNumber}` : `Focus ${focusNumber}`}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode 5: Bertahan Hidup (Survival) */}
          <button
            onClick={() => startGame('survival')}
            className={`w-full group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm border ${
              isLight
                ? 'bg-white hover:bg-rose-50/80 border-slate-200 hover:border-rose-400'
                : isNeon
                ? 'bg-[#04241d] hover:bg-[#07362a] border-rose-500/40 hover:border-rose-400 shadow-md'
                : 'bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-slate-900/80 border-rose-500/30 hover:border-rose-400 shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-black shadow-md shrink-0">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-extrabold text-sm truncate transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-rose-800' : 'text-white group-hover:text-rose-300'
                  }`}>
                    {t.modeSurvival}
                  </h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 border ${
                    isLight
                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}>
                    {isVip ? t.vipLivesBadge : t.normalLivesBadge}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {isVip ? t.modeSurvivalDescVip : t.modeSurvivalDescNormal}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-all group-hover:translate-x-0.5 ${
                isLight ? 'text-slate-400 group-hover:text-rose-600' : 'text-slate-500 group-hover:text-rose-400'
              }`} />
            </div>
          </button>

          {/* Mode 6: Tantangan Harian (Daily Quest) */}
          <button
            onClick={() => startGame('daily')}
            className={`w-full group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm border ${
              isLight
                ? 'bg-white hover:bg-emerald-50/80 border-slate-200 hover:border-emerald-400'
                : isNeon
                ? 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 hover:border-emerald-400 shadow-md'
                : 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900/80 border-emerald-500/30 hover:border-emerald-400 shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                <Award className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-extrabold text-sm truncate transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-emerald-800' : 'text-white group-hover:text-emerald-300'
                  }`}>
                    {t.modeDaily}
                  </h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 border ${
                    isLight
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-emerald-400/20 border-emerald-400/40 text-emerald-300'
                  }`}>
                    {t.bonusRewardDaily}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {t.modeDailyDesc}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-all group-hover:translate-x-0.5 ${
                isLight ? 'text-slate-400 group-hover:text-emerald-600' : 'text-slate-500 group-hover:text-emerald-400'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Quick Access to Tricks / Masterclass Bottom Banner & Free Scratchpad */}
      <div className="pt-2 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            sounds.playTap();
            onOpenTricks();
          }}
          className={`w-full py-2.5 px-3 rounded-2xl border flex items-center justify-between text-xs transition-all cursor-pointer shadow-xs active:scale-98 ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
              : isNeon
              ? 'bg-[#04241d] hover:bg-[#07362a] border-emerald-500/40 text-emerald-200'
              : 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/30 hover:border-amber-400 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className={`font-bold text-[11px] truncate ${isLight ? 'text-amber-950' : 'text-amber-200'}`}>
              {t.masterclassBanner}
            </span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setIsScratchpadOpen(true);
          }}
          className={`w-full py-2.5 px-3 rounded-2xl border flex items-center justify-between text-xs transition-all cursor-pointer shadow-xs active:scale-98 ${
            isLight
              ? 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-950'
              : isNeon
              ? 'bg-[#04241d] hover:bg-[#07362a] border-cyan-500/40 text-cyan-200'
              : 'bg-gradient-to-r from-sky-500/10 via-slate-900 to-slate-900 border-sky-500/30 hover:border-sky-400 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <PenTool className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className={`font-bold text-[11px] truncate ${isLight ? 'text-sky-950' : 'text-sky-200'}`}>
              {language === 'id' ? 'Papan Coretan' : 'Scratchpad'}
            </span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 ${isLight ? 'text-sky-700' : 'text-sky-400'}`} />
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
