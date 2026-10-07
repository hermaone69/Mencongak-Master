import React, { createContext, useContext, useEffect, useState } from 'react';
import { Achievement, Language, LeaderboardEntry, PlayerProfile, ShopItem, UserStats } from '../types';
import { sounds } from '../utils/audio';

interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  playerLevel: number;
  playerTitle: string;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addXP: (amount: number) => void;
  stats: UserStats;
  recordAnswer: (isCorrect: boolean, mode: string, pointsEarned: number) => void;
  leaderboard: LeaderboardEntry[];
  submitScore: (score: number, modeName: string) => void;
  achievements: Achievement[];
  shopItems: ShopItem[];
  buyShopItem: (itemId: string) => boolean;
  usePowerUp: (powerUpId: string) => boolean;
  unlockedTricks: string[];
  unlockTrickWithCoins: (trickId: string, cost: number) => boolean;
  isVip: boolean;
  activeTheme: string;
  soundEnabled: boolean;
  toggleSound: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  resetAllProgress: () => void;
  // Multi-profile management
  profiles: PlayerProfile[];
  activeProfileId: string;
  switchProfile: (nameOrId: string) => void;
  createProfile: (name: string) => void;
  deleteProfile: (profileId: string) => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'Langkah Pertama',
    description: 'Jawab soal mencongak pertamamu dengan benar',
    icon: '🎯',
    rewardCoins: 20,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'streak_10',
    title: 'Konsentrasi Baja',
    description: 'Raih combo 10 jawaban benar beruntun',
    icon: '🔥',
    rewardCoins: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'streak_25',
    title: 'Otak Kalkulator',
    description: 'Raih combo 25 jawaban benar beruntun',
    icon: '⚡',
    rewardCoins: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'centurion',
    title: 'Pahlawan 100 Soal',
    description: 'Selesaikan total 100 soal mencongak',
    icon: '💯',
    rewardCoins: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'duel_master',
    title: 'Gladiator Mencongak',
    description: 'Menangkan 5 duel melawan Bot AI',
    icon: '⚔️',
    rewardCoins: 120,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'trick_scholar',
    title: 'Kolektor Trik Aritmatika',
    description: 'Buka dan kuasai 3 trik mencongak cepat',
    icon: '📜',
    rewardCoins: 80,
    unlocked: false,
    progress: 0,
    maxProgress: 3
  }
];

const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'freeze_time',
    name: 'Beku Waktu (Freeze Time)',
    description: 'Hentikan timer selama 8 detik di mode Kilat',
    priceCoins: 30,
    icon: '❄️',
    category: 'powerup',
    owned: false,
    quantity: 2
  },
  {
    id: 'hint_5050',
    name: 'Pelenyap Opsi (50:50)',
    description: 'Hilangkan 2 pilihan jawaban yang salah',
    priceCoins: 25,
    icon: '🪄',
    category: 'powerup',
    owned: false,
    quantity: 3
  },
  {
    id: 'double_xp',
    name: 'Pengganda Poin 2x',
    description: 'Gandakan semua perolehan skor & XP selama 1 sesi',
    priceCoins: 40,
    icon: '🚀',
    category: 'powerup',
    owned: false,
    quantity: 1
  },
  {
    id: 'vip_pro_pass',
    name: 'VIP Pro Mencongak Pass',
    description: 'Buka SEMUA trik materi, tanpa iklan, mode 4 nyawa, dan lencana emas eksklusif',
    priceIdr: 'Rp 29.000',
    originalPriceIdr: 'Rp 49.000',
    discountBadge: 'DISKON 40%',
    coinsReward: 200,
    icon: '👑',
    category: 'vip',
    owned: false
  },
  {
    id: 'coin_pack_100',
    name: 'Kantong Koin (100 Koin)',
    description: 'Untuk membeli power-up dan membuka trik kilat',
    priceIdr: 'Rp 5.000',
    coinsReward: 100,
    icon: '💰',
    category: 'coin_pack',
    owned: false
  },
  {
    id: 'coin_pack_500',
    name: 'Peti Koin Juara (500 + 100 Bonus)',
    description: 'Paket terfavorit pemain untuk stok power-up berlimpah',
    priceIdr: 'Rp 19.000',
    originalPriceIdr: 'Rp 25.000',
    discountBadge: 'PALING POPULER',
    coinsReward: 600,
    icon: '🪙',
    category: 'coin_pack',
    owned: false
  },
  {
    id: 'coin_pack_1500',
    name: 'Gudang Koin Sultan (1.500 + 500 Bonus)',
    description: 'Bonus 500 koin gratis & buka semua trik seketika',
    priceIdr: 'Rp 49.000',
    originalPriceIdr: 'Rp 75.000',
    discountBadge: 'HEMAT 35%',
    coinsReward: 2000,
    icon: '💎',
    category: 'coin_pack',
    owned: false
  },
  {
    id: 'theme_neon_cyber',
    name: 'Tema Cyber Matrix',
    description: 'Tampilan visual arena kalkulasi warna emerald neon',
    priceCoins: 150,
    icon: '🌌',
    category: 'theme',
    owned: false
  },
  {
    id: 'cert_pro',
    name: 'Sertifikat Mencongak Resmi',
    description: 'Generate e-sertifikat berlisensi digital berformat PDF / Gambar dengan skor & nama',
    priceIdr: 'Rp 15.000',
    originalPriceIdr: 'Rp 25.000',
    discountBadge: 'PROMO',
    icon: '🎓',
    category: 'certificate',
    owned: false
  }
];

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb_1', name: 'Rian MathGod', avatar: '🦁', score: 1420, rank: 1, level: 42, streak: 38, country: 'Jakarta', category: 'sma_pro' },
  { id: 'lb_2', name: 'Nadia Sempoa', avatar: '🦊', score: 1290, rank: 2, level: 36, streak: 31, country: 'Surabaya', category: 'smp' },
  { id: 'lb_3', name: 'Budi Aritmatika', avatar: '🦅', score: 1150, rank: 3, level: 31, streak: 27, country: 'Bandung', category: 'sma_pro' },
  { id: 'lb_4', name: 'Clara SmartKid', avatar: '🐱', score: 980, rank: 4, level: 25, streak: 22, country: 'Yogyakarta', category: 'sd_lanjut' },
  { id: 'lb_5', name: 'Farhan Kilat', avatar: '⚡', score: 870, rank: 5, level: 22, streak: 19, country: 'Medan', category: 'smp' },
  { id: 'lb_6', name: 'Aisyah Ceria', avatar: '🌸', score: 760, rank: 6, level: 18, streak: 16, country: 'Makassar', category: 'sd_awal' },
  { id: 'lb_7', name: 'Dimas Speed', avatar: '🐺', score: 650, rank: 7, level: 15, streak: 14, country: 'Semarang', category: 'smp' },
  { id: 'lb_8', name: 'Kevin Solver', avatar: '🐼', score: 540, rank: 8, level: 12, streak: 11, country: 'Denpasar', category: 'sd_lanjut' }
];

const DEFAULT_PROFILES: PlayerProfile[] = [
  {
    id: 'prof_1',
    name: 'Kakak Dimas',
    avatar: '😎',
    xp: 320,
    coins: 180,
    stats: {
      totalQuestionsAnswered: 45,
      totalCorrect: 40,
      totalWrong: 5,
      highestStreak: 12,
      bestBlitzScore: 720,
      totalDuelsWon: 3,
      dailyStreak: 3,
      lastPlayedDate: new Date().toISOString(),
      tricksMastered: ['trick_11', 'trick_ends5']
    },
    achievements: INITIAL_ACHIEVEMENTS.map(a => a.id === 'first_blood' || a.id === 'streak_10' ? { ...a, unlocked: true, progress: a.maxProgress } : a),
    unlockedTricks: ['trick_11', 'trick_ends5', 'trick_comp100'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prof_2',
    name: 'Adik Aisyah',
    avatar: '🌸',
    xp: 80,
    coins: 90,
    stats: {
      totalQuestionsAnswered: 20,
      totalCorrect: 18,
      totalWrong: 2,
      highestStreak: 6,
      bestBlitzScore: 450,
      totalDuelsWon: 1,
      dailyStreak: 2,
      lastPlayedDate: new Date().toISOString(),
      tricksMastered: ['trick_11']
    },
    achievements: INITIAL_ACHIEVEMENTS.map(a => a.id === 'first_blood' ? { ...a, unlocked: true, progress: 1 } : a),
    unlockedTricks: ['trick_11'],
    createdAt: new Date().toISOString()
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profiles store
  const [profiles, setProfiles] = useState<PlayerProfile[]>(() => {
    const saved = localStorage.getItem('mm_profiles_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('mm_active_profile_id') || profiles[0]?.id || 'prof_1';
  });

  // Current active profile
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];

  // Active player state derived from active profile
  const [playerName, setPlayerNameState] = useState<string>(activeProfile.name);
  const [xp, setXp] = useState<number>(activeProfile.xp);
  const [coins, setCoins] = useState<number>(activeProfile.coins);
  const [stats, setStats] = useState<UserStats>(activeProfile.stats);
  const [achievements, setAchievements] = useState<Achievement[]>(activeProfile.achievements);
  const [unlockedTricks, setUnlockedTricks] = useState<string[]>(activeProfile.unlockedTricks);

  // Global device items (Shared VIP, sound, and language settings)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('mm_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mm_lang') as Language;
    return saved === 'en' || saved === 'id' ? saved : 'id';
  });

  const setLanguage = (lang: Language) => {
    sounds.playTap();
    setLanguageState(lang);
    localStorage.setItem('mm_lang', lang);
  };

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('mm_shop');
    if (saved) {
      try {
        const parsed: ShopItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Merge with initial catalog to ensure all items exist even if localStorage has older schema
          return INITIAL_SHOP_ITEMS.map(initialItem => {
            const found = parsed.find(p => p.id === initialItem.id);
            return found ? { ...initialItem, ...found } : initialItem;
          });
        }
      } catch {}
    }
    return INITIAL_SHOP_ITEMS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('mm_leaderboard');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_LEADERBOARD;
  });

  // Derived Level & Title
  const playerLevel = Math.max(1, Math.floor(Math.sqrt(xp / 20)));
  const xpForCurrentLevel = (playerLevel - 1) * (playerLevel - 1) * 20;
  const xpToNextLevel = (playerLevel) * (playerLevel) * 20;

  const getTitleForLevel = (lvl: number, lang: Language = 'id'): string => {
    if (lang === 'en') {
      if (lvl < 3) return 'Junior Novice';
      if (lvl < 7) return 'Number Explorer';
      if (lvl < 12) return 'Math Knight';
      if (lvl < 20) return 'Calculation Expert';
      if (lvl < 35) return 'Calculation Master';
      return 'Grandmaster Speed ⚡';
    }
    if (lvl < 3) return 'Pemula Cilik';
    if (lvl < 7) return 'Penjelajah Angka';
    if (lvl < 12) return 'Ksatria Aritmatika';
    if (lvl < 20) return 'Ahli Mencongak';
    if (lvl < 35) return 'Master Kalkulasi';
    return 'Grandmaster Kilat ⚡';
  };

  const playerTitle = getTitleForLevel(playerLevel, language);
  const isVip = shopItems.find(i => i.id === 'vip_pro_pass')?.owned || false;
  const activeTheme = shopItems.find(i => i.id === 'theme_neon_cyber')?.owned ? 'neon' : 'default';

  // Save current player progress to the profile in the profiles list
  useEffect(() => {
    setProfiles(prev =>
      prev.map(p => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            name: playerName,
            xp,
            coins,
            stats,
            achievements,
            unlockedTricks
          };
        }
        return p;
      })
    );
  }, [playerName, xp, coins, stats, achievements, unlockedTricks, activeProfileId]);

  // Persist profiles to localStorage
  useEffect(() => {
    localStorage.setItem('mm_profiles_v3', JSON.stringify(profiles));
    localStorage.setItem('mm_active_profile_id', activeProfileId);
  }, [profiles, activeProfileId]);

  // Persist device settings
  useEffect(() => {
    localStorage.setItem('mm_sound', soundEnabled.toString());
    sounds.toggleSound(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('mm_shop', JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    localStorage.setItem('mm_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Function to switch active player profile
  const switchProfile = (nameOrId: string) => {
    sounds.playTap();
    const target = profiles.find(p => p.id === nameOrId || p.name.toLowerCase() === nameOrId.toLowerCase());

    if (target) {
      setActiveProfileId(target.id);
      setPlayerNameState(target.name);
      setXp(target.xp);
      setCoins(target.coins);
      setStats(target.stats);
      setAchievements(target.achievements);
      setUnlockedTricks(target.unlockedTricks);
    } else {
      // Create new profile with this name if not found
      createProfile(nameOrId);
    }
  };

  // Function to create a fresh player profile
  const createProfile = (name: string) => {
    sounds.playTap();
    const cleanName = name.trim() || 'Pemain Baru';
    const newId = 'prof_' + Date.now();

    const newProfile: PlayerProfile = {
      id: newId,
      name: cleanName,
      avatar: '🌟',
      xp: 0,
      coins: 50,
      stats: {
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        totalWrong: 0,
        highestStreak: 0,
        bestBlitzScore: 0,
        totalDuelsWon: 0,
        dailyStreak: 1,
        lastPlayedDate: new Date().toISOString(),
        tricksMastered: ['trick_11']
      },
      achievements: INITIAL_ACHIEVEMENTS,
      unlockedTricks: ['trick_11'],
      createdAt: new Date().toISOString()
    };

    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newId);
    setPlayerNameState(cleanName);
    setXp(0);
    setCoins(50);
    setStats(newProfile.stats);
    setAchievements(newProfile.achievements);
    setUnlockedTricks(newProfile.unlockedTricks);
  };

  // Function to delete a profile
  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return; // Keep at least one profile
    sounds.playTap();

    const remaining = profiles.filter(p => p.id !== profileId);
    setProfiles(remaining);

    if (activeProfileId === profileId && remaining[0]) {
      switchProfile(remaining[0].id);
    }
  };

  const setPlayerName = (name: string) => {
    const cleanName = name.trim() || 'Pemain';
    setPlayerNameState(cleanName);
    setProfiles(prev =>
      prev.map(p => (p.id === activeProfileId ? { ...p, name: cleanName } : p))
    );
  };

  const addCoins = (amount: number) => {
    setCoins(prev => Math.max(0, prev + amount));
  };

  const spendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      sounds.playBuy();
      return true;
    }
    sounds.playWrong();
    return false;
  };

  const addXP = (amount: number) => {
    setXp(prev => prev + amount);
  };

  const unlockTrickWithCoins = (trickId: string, cost: number): boolean => {
    if (unlockedTricks.includes(trickId)) return true;
    if (isVip) {
      setUnlockedTricks(prev => [...prev, trickId]);
      return true;
    }

    if (spendCoins(cost)) {
      setUnlockedTricks(prev => [...prev, trickId]);
      setStats(prev => ({
        ...prev,
        tricksMastered: Array.from(new Set([...prev.tricksMastered, trickId]))
      }));
      sounds.playVictory();
      return true;
    }
    return false;
  };

  const checkAchievements = (currentStats: UserStats) => {
    setAchievements(prev =>
      prev.map(ach => {
        let prog = ach.progress;
        let shouldUnlock = false;

        if (ach.id === 'first_blood') {
          prog = Math.min(1, currentStats.totalCorrect);
          shouldUnlock = prog >= 1;
        } else if (ach.id === 'streak_10') {
          prog = Math.min(10, currentStats.highestStreak);
          shouldUnlock = prog >= 10;
        } else if (ach.id === 'streak_25') {
          prog = Math.min(25, currentStats.highestStreak);
          shouldUnlock = prog >= 25;
        } else if (ach.id === 'centurion') {
          prog = Math.min(100, currentStats.totalQuestionsAnswered);
          shouldUnlock = prog >= 100;
        } else if (ach.id === 'duel_master') {
          prog = Math.min(5, currentStats.totalDuelsWon);
          shouldUnlock = prog >= 5;
        } else if (ach.id === 'trick_scholar') {
          prog = Math.min(3, currentStats.tricksMastered.length);
          shouldUnlock = prog >= 3;
        }

        if (shouldUnlock && !ach.unlocked) {
          addCoins(ach.rewardCoins);
          sounds.playVictory();
          return { ...ach, progress: ach.maxProgress, unlocked: true };
        }

        return { ...ach, progress: prog };
      })
    );
  };

  const recordAnswer = (isCorrect: boolean, mode: string, pointsEarned: number) => {
    setStats(prev => {
      const updated: UserStats = {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
        totalWrong: isCorrect ? prev.totalWrong : prev.totalWrong + 1,
        highestStreak: isCorrect ? Math.max(prev.highestStreak, 1) : prev.highestStreak,
        bestBlitzScore: mode === 'blitz' ? Math.max(prev.bestBlitzScore, pointsEarned) : prev.bestBlitzScore,
        totalDuelsWon: mode === 'duel_win' ? prev.totalDuelsWon + 1 : prev.totalDuelsWon
      };
      checkAchievements(updated);
      return updated;
    });

    if (isCorrect) {
      addXP(Math.max(5, Math.floor(pointsEarned / 10)));
      addCoins(1 + (isVip ? 1 : 0));
    }
  };

  const submitScore = (score: number, categoryName: string) => {
    const userEntry: LeaderboardEntry = {
      id: 'player_' + activeProfileId,
      name: playerName,
      avatar: '🌟',
      score,
      rank: 1,
      level: playerLevel,
      streak: stats.highestStreak,
      country: 'Indonesia',
      category: categoryName,
      isCurrentUser: true
    };

    setLeaderboard(prev => {
      const filtered = prev.filter(e => e.id !== 'player_' + activeProfileId && !e.isCurrentUser);
      filtered.push(userEntry);
      filtered.sort((a, b) => b.score - a.score);
      return filtered.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    });
  };

  const buyShopItem = (itemId: string): boolean => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return false;

    if (item.priceCoins) {
      if (spendCoins(item.priceCoins)) {
        setShopItems(prev =>
          prev.map(i => {
            if (i.id === itemId) {
              if (i.category === 'powerup') {
                return { ...i, quantity: (i.quantity || 0) + 1 };
              }
              return { ...i, owned: true };
            }
            return i;
          })
        );
        return true;
      }
      return false;
    } else if (item.priceIdr) {
      // Simulated Real IAP Purchase
      setShopItems(prev =>
        prev.map(i => {
          if (i.id === itemId) {
            return { ...i, owned: true };
          }
          return i;
        })
      );
      sounds.playVictory();
      if (item.coinsReward) {
        addCoins(item.coinsReward);
      }
      return true;
    }
    return false;
  };

  const usePowerUp = (powerUpId: string): boolean => {
    const item = shopItems.find(i => i.id === powerUpId);
    if (item && (item.quantity || 0) > 0) {
      setShopItems(prev =>
        prev.map(i => {
          if (i.id === powerUpId) {
            return { ...i, quantity: Math.max(0, (i.quantity || 0) - 1) };
          }
          return i;
        })
      );
      sounds.playPowerup();
      return true;
    }
    sounds.playWrong();
    return false;
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const resetAllProgress = () => {
    localStorage.clear();
    setProfiles(DEFAULT_PROFILES);
    setActiveProfileId(DEFAULT_PROFILES[0].id);
    setPlayerNameState(DEFAULT_PROFILES[0].name);
    setXp(DEFAULT_PROFILES[0].xp);
    setCoins(DEFAULT_PROFILES[0].coins);
    setStats(DEFAULT_PROFILES[0].stats);
    setAchievements(DEFAULT_PROFILES[0].achievements);
    setUnlockedTricks(DEFAULT_PROFILES[0].unlockedTricks);
    setShopItems(INITIAL_SHOP_ITEMS);
    setLeaderboard(DEFAULT_LEADERBOARD);
    sounds.playTap();
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerLevel,
        playerTitle,
        xp,
        xpToNextLevel,
        coins,
        addCoins,
        spendCoins,
        addXP,
        stats,
        recordAnswer,
        leaderboard,
        submitScore,
        achievements,
        shopItems,
        buyShopItem,
        usePowerUp,
        unlockedTricks,
        unlockTrickWithCoins,
        isVip,
        activeTheme,
        soundEnabled,
        toggleSound,
        language,
        setLanguage,
        resetAllProgress,
        profiles,
        activeProfileId,
        switchProfile,
        createProfile,
        deleteProfile
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
