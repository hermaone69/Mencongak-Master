export type GameMode = 'blitz' | 'survival' | 'sprint' | 'audio' | 'focus' | 'duel' | 'tricks' | 'daily' | 'custom';

export type Language = 'id' | 'en';

export type ThemeMode = 'dark' | 'light' | 'neon';

export type DifficultyLevel = 'sd_awal' | 'sd_lanjut' | 'smp' | 'sma_pro';

export type MathOperation = '+' | '-' | '×' | '÷' | 'mixed' | 'powers';

export interface Question {
  id: string;
  questionText: string;
  operation: MathOperation;
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[]; // 4 multiple choice options
  hint?: string;
  hintId?: string;
  hintEn?: string;
  trickExplanation?: string;
  timeLimitSec?: number;
}

export interface UserStats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  highestStreak: number;
  bestBlitzScore: number;
  bestSprintTime?: number;
  totalDuelsWon: number;
  dailyStreak: number;
  lastPlayedDate: string;
  tricksMastered: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  level: number;
  streak: number;
  country: string;
  category: string;
  isCurrentUser?: boolean;
}

export interface MentalTrick {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  exampleProblem: string;
  steps: {
    stepNumber: number;
    title: string;
    explanation: string;
    formula?: string;
  }[];
  practiceQuestions: Question[];
  unlocked: boolean;
  costToUnlock?: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  coins: number;
  stats: UserStats;
  achievements: Achievement[];
  unlockedTricks: string[];
  createdAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  priceCoins?: number;
  priceIdr?: string;
  originalPriceIdr?: string;
  discountBadge?: string;
  coinsReward?: number;
  icon: string;
  category: 'powerup' | 'vip' | 'theme' | 'certificate' | 'coin_pack';
  owned: boolean;
  quantity?: number;
}
