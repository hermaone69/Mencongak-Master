import { Language } from '../types';

export const translations = {
  id: {
    appTitle: 'Mencongak Master Pro',
    appSubtitle: 'Latihan Aritmatika & Hitung Cepat Mental',
    navPlay: 'Main',
    navTricks: 'Trik Kilat',
    navDuel: 'Duel AI',
    navLeaderboard: 'Peringkat',
    navShop: 'Toko',

    // Header & Profile
    switchPlayer: 'Ganti',
    coins: 'Koin',
    level: 'Level',
    totalExercises: 'Total Latihan',
    questions: 'Soal',
    changePlayer: 'Ganti Pemain',
    activePlayer: 'Pemain Aktif',
    allProfiles: 'Semua Profil Pemain',
    addProfile: 'Tambah Profil',
    enterName: 'Masukkan nama pemain...',
    save: 'Simpan',
    cancel: 'Batal',
    currentlyActive: 'Sedang Aktif',
    deleteProfilePrompt: 'Hapus profil ini',
    profileSubtitleNote: 'Level, XP, akurasi, dan riwayat belajar tersimpan otomatis & mandiri untuk masing-masing anak.',
    resetAllProgressPrompt: 'Apakah Anda yakin ingin mereset semua skor & koin?',
    yesReset: 'Ya, Reset',
    resetAllButton: 'Reset Semua Data & Skor',
    openCertFromProfile: 'Buka E-Sertifikat Prestasi Mencongak',
    doneBadge: 'Selesai ✓',

    // Level Titles
    titleNovice: 'Pemula Cilik',
    titleExplorer: 'Penjelajah Angka',
    titleKnight: 'Ksatria Aritmatika',
    titleExpert: 'Ahli Mencongak',
    titleMaster: 'Master Kalkulasi',
    titleGrandmaster: 'Grandmaster Kilat ⚡',

    // Play Screen Modes
    modeBlitz: 'Kilat 60 Detik',
    modeBlitzDesc: 'Jawab sebanyak mungkin soal dalam 60 detik untuk raih rekor skor tertinggi.',
    modeSurvival: 'Tantangan Bertahan',
    modeSurvivalDescVip: 'Tanpa batas waktu! Bertahan selama mungkin dengan bonus 4 nyawa.',
    modeSurvivalDescNormal: 'Tanpa batas waktu! Jangan sampai salah hitung lebih dari 3 kali.',
    modeDaily: 'Misi Harian',
    modeDailyDesc: 'Selesaikan 5 soal spesial hari ini untuk mempertahankan api latihan harian.',
    bonusRewardDaily: '+50 KOIN 🎁',
    vipLivesBadge: '4 NYAWA (VIP)',
    normalLivesBadge: '3 NYAWA',
    popularBadge: 'POPULER 🔥',

    // Difficulty labels
    difficultyLabel: 'Tingkat Kesulitan:',
    diffSd13: 'SD 1-3',
    diffSd46: 'SD 4-6',
    diffSmp: 'SMP',
    diffPro: 'Pro 🏆',
    levelInfoButton: 'Info Level',

    // Operations
    operationsLabel: 'Jenis Operasi Hitung:',
    opAll: 'Campur',
    opAdd: 'Tambah (+)',
    opSub: 'Kurang (−)',
    opMul: 'Kali (×)',
    opDiv: 'Bagi (÷)',

    // In-Game UI
    scratchpad: 'Coretan',
    freezeTime: 'Beku Waktu',
    hint5050: '50:50',
    doubleXp: '2x Poin',
    reflexPrompt: 'Aritmatika Cepat',
    streak: 'Streak',
    lives: 'Nyawa',
    seconds: 'Detik',
    questionWord: 'Soal',
    frozenBadge: 'BEKU ❄️',
    outOfFreezeToast: '❄️ Stok Beku Waktu habis! Kunjungi Toko setelah bermain.',
    outOfHintToast: '🪄 Stok Pelenyap Opsi 50:50 habis! Kunjungi Toko setelah bermain.',
    outOfDoubleXpToast: '🚀 Stok 2x Poin habis! Kunjungi Toko setelah bermain.',

    // Session Summary / Game Over
    sessionFinished: 'Sesi Mencongak Selesai!',
    sessionFinishedDesc: 'Luar biasa! Refleks dan kecepatan aritmatika kamu terus meningkat.',
    totalScore: 'Total Skor',
    accuracy: 'Akurasi',
    correctAnswers: 'Jawaban Benar',
    bestStreak: 'Streak Tertinggi',
    bonusCoinsEarned: 'Koin Didapat',
    xpEarned: 'XP Didapat',
    avgTimeLabel: 'Rata-rata Waktu',
    perQuestionShort: '/ soal',
    playAgain: 'Latihan Lagi',
    viewLeaderboardButton: 'Lihat Papan Peringkat',
    backToHome: 'Kembali ke Menu Utama',

    // Masterclass Banner
    masterclassBanner: 'Masterclass Trik Kilat Mencongak',
    masterclassDesc: 'Pelajari trik cepat kuadrat akhiran 5, perkalian 11, komplemen 100, dan jurus aritmatika mental lainnya.',
    learnNow: 'Pelajari Trik',

    // Duel AI
    duelHeader: 'Arena Duel Mencongak 1 vs 1',
    duelTitle: 'Tantang Bot Mencongak',
    duelSubtitle: 'Pilih topik operasi & bot lawan untuk beradu kecepatan kalkulasi secara real-time!',
    duelRounds: 'Ronde',
    duelWinsCount: 'Menang',
    duelTopic: 'Topik Soal Duel',
    duelYou: 'Kamu',
    duelTie: 'Hasil Seri Sengit!',
    duelWin: 'Kamu Menang Duel!',
    duelLoss: 'Unggul!',
    duelWinDesc: 'Luar biasa! Kecepatan refleks mencongak kamu berhasil mengalahkan bot!',
    duelTieDesc: 'Kalian berdua memiliki kecepatan kalkulasi yang sama persis!',
    duelLossDesc: 'Jangan patah semangat! Latih trik kilat dan coba tanding ulang.',
    duelSuddenDeath: 'Mainkan Babak Penentuan (Sudden Death 1 Soal)!',
    rematch: 'Tanding Ulang',
    chooseOtherBot: 'Pilih Bot Lawan & Opsi Lain',
    duelTips: 'Tips Juara Duel: Jawab dengan cepat & tepat sebelum bot! Manfaatkan tombol Papan Coretan di pojok atas jika menemui angka yang menantang.',
    botRecalculating: 'sedang menghitung ulang... Rebut poinnya!',
    botRecalcFinished: 'selesai menghitung ulang!',
    botMistakeSeized: 'Kamu berhasil merebut poin ronde!',
    playerAnsweredFirst: 'Kamu menjawab duluan (+1 Poin)',
    botAnsweredFirst: 'menjawab duluan (+1 Poin Bot)',
    roundWord: 'Ronde',

    // Tricks Screen
    tricksHeaderBadge: 'KELAS MENCONGAK KILAT',
    tricksTitle: 'Masterclass Trik Kilat',
    tricksSubtitle: 'Kuasai rahasia kalkulasi kilat aritmatika mental tanpa kertas dan kalkulator!',
    practiceTrick: 'Latih Trik Ini',
    unlockTrick: 'Buka Trik',
    unlockedBadge: 'Terbuka ✓',
    stepsLabel: 'Langkah Cepat:',
    exampleLabel: 'Contoh Soal:',
    practiceDrill: 'Latihan Uji Trik',
    trickMasteredTitle: 'Trik Berhasil Dikuasai!',
    trickMasteredDesc: 'Kamu siap menggunakan trik ini di mode Kilat dan Duel!',
    finishTrickButton: 'Selesai & Kembali ke Daftar Trik',
    learnButton: 'Pelajari',
    tricksTipBottom: 'Kumpulkan koin dengan bermain di mode Kilat atau selesaikan Misi Harian untuk membuka semua trik!',

    // Leaderboard
    leaderboardTitle: 'Papan Peringkat Juara',
    leaderboardSubtitle: 'Bandingkan rekor kecepatan mencongak antar profil & pemain terbaik!',
    tabThisDevice: 'Rekor HP Ini',
    tabNational: 'Peringkat Nasional',
    familyRecordInfo: 'Menampilkan rekor bermain semua profil yang terdaftar di perangkat ini.',
    noLocalRecords: 'Belum ada rekor lokal. Selesaikan minimal 1 sesi latihan untuk mencatat rekor!',
    familyBoardHeading: 'Papan Juara Anggota Keluarga di HP Ini',
    familyBoardSubheading: 'Siapa yang memiliki rekor skor mencongak tertinggi di rumah?',
    selectThisProfile: 'Pilih Profil Ini',
    yourProfileBadge: 'Profil Kamu',
    filterAll: 'Semua',
    filterSd13: 'SD Awal',
    filterSd46: 'SD Lanjut',
    filterSmpPro: 'SMP & Pro',
    youBadge: 'KAMU',

    // Shop
    shopOfficialHeader: 'TOKO RESMI PERMAINAN',
    shopTitle: 'Toko Koin & VIP Pass',
    shopSubtitle: 'Tingkatkan performa mencongak dengan item power-up & fitur VIP eksklusif!',
    vipPassTitle: 'VIP PRO MENCONGAK PASS',
    vipPassHeading: 'Akses Mencongak Penuh Selamanya',
    vipFeature1: 'Buka Bebas Seluruh Materi Trik Kilat Mencongak',
    vipFeature2: 'Ekstra 1 Nyawa di Mode Bertahan (Total 4 Nyawa)',
    vipFeature3: 'Gratis Cetak E-Sertifikat Prestasi Berstempel Emas',
    vipFeature4: 'Bonus Ganda 2x Koin & Bonus Instan +200 Koin',
    vipActiveForever: 'VIP Aktif Selamanya',
    buyVipButton: 'Beli VIP Pass',
    coinPacksTitle: 'Paket Top-Up Koin Permainan',
    packBag: 'Kantong Koin',
    packChest: 'Peti Juara',
    packVault: 'Gudang Sultan',
    certCardTitle: 'E-Sertifikat Kelulusan Resmi',
    certCardLicensed: 'Berlisensi ✓',
    certCardDescReady: 'Sertifikat siap dicetak & diunduh sebagai portofolio belajar anak',
    certCardDescBuy: 'Biaya lisensi resmi (Gratis untuk Member VIP)',
    printCertificate: 'Cetak Piagam',
    buyLicense: 'Beli Lisensi',
    powerupsHeading: 'Item Bantuan Power-Up (Pakai Koin Game)',
    powerupsSubheading: 'Gunakan di Mode Kilat & Bertahan',
    ownedLabel: 'Dimiliki:',
    originalPriceLabel: 'Harga Asli:',
    balanceLabel: 'Saldo'
  },
  en: {
    appTitle: 'Mental Math Master Pro',
    appSubtitle: 'Speed Arithmetic & Mental Math Training Game',
    navPlay: 'Play',
    navTricks: 'Fast Tricks',
    navDuel: 'AI Duel',
    navLeaderboard: 'Ranks',
    navShop: 'Shop',

    // Header & Profile
    switchPlayer: 'Switch',
    coins: 'Coins',
    level: 'Level',
    totalExercises: 'Total Solved',
    questions: 'Questions',
    changePlayer: 'Switch Player',
    activePlayer: 'Active Player',
    allProfiles: 'All Player Profiles',
    addProfile: 'Add Profile',
    enterName: 'Enter player name...',
    save: 'Save',
    cancel: 'Cancel',
    currentlyActive: 'Active Now',
    deleteProfilePrompt: 'Delete profile',
    profileSubtitleNote: 'Levels, XP, accuracy, and records are automatically saved independently for each player.',
    resetAllProgressPrompt: 'Are you sure you want to reset all scores & coins?',
    yesReset: 'Yes, Reset',
    resetAllButton: 'Reset All Progress & Scores',
    openCertFromProfile: 'Open Achievement E-Certificate',
    doneBadge: 'Done ✓',

    // Level Titles
    titleNovice: 'Junior Novice',
    titleExplorer: 'Number Explorer',
    titleKnight: 'Math Knight',
    titleExpert: 'Calculation Expert',
    titleMaster: 'Calculation Master',
    titleGrandmaster: 'Grandmaster Speed ⚡',

    // Play Screen Modes
    modeBlitz: '60s Speed Blitz',
    modeBlitzDesc: 'Answer as many questions as possible in 60 seconds to set a high score record.',
    modeSurvival: 'Survival Challenge',
    modeSurvivalDescVip: 'No time limit! Survive as long as you can with 4 bonus VIP lives.',
    modeSurvivalDescNormal: 'No time limit! Don\'t make more than 3 calculation errors.',
    modeDaily: 'Daily Mission',
    modeDailyDesc: 'Complete today\'s 5 special questions to keep your daily streak alive.',
    bonusRewardDaily: '+50 COINS 🎁',
    vipLivesBadge: '4 LIVES (VIP)',
    normalLivesBadge: '3 LIVES',
    popularBadge: 'POPULAR 🔥',

    // Difficulty labels
    difficultyLabel: 'Difficulty Level:',
    diffSd13: 'Grades 1-3',
    diffSd46: 'Grades 4-6',
    diffSmp: 'Middle School',
    diffPro: 'Master Pro 🏆',
    levelInfoButton: 'Level Info',

    // Operations
    operationsLabel: 'Math Operations:',
    opAll: 'Mixed',
    opAdd: 'Add (+)',
    opSub: 'Subtract (−)',
    opMul: 'Multiply (×)',
    opDiv: 'Divide (÷)',

    // In-Game UI
    scratchpad: 'Scratchpad',
    freezeTime: 'Freeze Time',
    hint5050: '50:50',
    doubleXp: '2x Points',
    reflexPrompt: 'Speed Arithmetic',
    streak: 'Streak',
    lives: 'Lives',
    seconds: 'Seconds',
    questionWord: 'Question',
    frozenBadge: 'FROZEN ❄️',
    outOfFreezeToast: '❄️ Out of Freeze Time! Visit the Shop to restock.',
    outOfHintToast: '🪄 Out of 50:50 Hints! Visit the Shop to restock.',
    outOfDoubleXpToast: '🚀 Out of 2x Multipliers! Visit the Shop to restock.',

    // Session Summary / Game Over
    sessionFinished: 'Math Session Complete!',
    sessionFinishedDesc: 'Great job! Your arithmetic reflexes and mental speed continue to improve.',
    totalScore: 'Total Score',
    accuracy: 'Accuracy',
    correctAnswers: 'Correct Answers',
    bestStreak: 'Highest Streak',
    bonusCoinsEarned: 'Coins Earned',
    xpEarned: 'XP Earned',
    avgTimeLabel: 'Avg Speed',
    perQuestionShort: '/ question',
    playAgain: 'Practice Again',
    viewLeaderboardButton: 'View Leaderboard',
    backToHome: 'Back to Main Menu',

    // Masterclass Banner
    masterclassBanner: 'Mental Math Masterclass Tricks',
    masterclassDesc: 'Master instant shortcuts for 5-ending squares, 11x multiplier, 100 complements, and mental Vedic math.',
    learnNow: 'Learn Tricks',

    // Duel AI
    duelHeader: '1 vs 1 Mental Math Duel Arena',
    duelTitle: 'Challenge Math AI Bots',
    duelSubtitle: 'Select math topic and bot opponent to battle calculation speed in real-time!',
    duelRounds: 'Round',
    duelWinsCount: 'Wins',
    duelTopic: 'Duel Question Topic',
    duelYou: 'You',
    duelTie: 'Exciting Tie Game!',
    duelWin: 'You Won The Duel!',
    duelLoss: 'Ahead!',
    duelWinDesc: 'Awesome! Your quick calculation reflexes defeated the AI bot!',
    duelTieDesc: 'You both calculated with the exact same lightning speed!',
    duelLossDesc: 'Keep practicing! Sharpen your speed tricks and rematch.',
    duelSuddenDeath: 'Play Sudden Death Round (1 Deciding Question)!',
    rematch: 'Rematch',
    chooseOtherBot: 'Choose Other Bot & Options',
    duelTips: 'Duel Champion Tip: Answer quickly and accurately before the bot! Use the Scratchpad tool in the top corner for tough calculations.',
    botRecalculating: 'is recalculating... Grab the point now!',
    botRecalcFinished: 'finished recalculating!',
    botMistakeSeized: 'You successfully seized the round point!',
    playerAnsweredFirst: 'You answered first (+1 Point)',
    botAnsweredFirst: 'answered first (+1 Bot Point)',
    roundWord: 'Round',

    // Tricks Screen
    tricksHeaderBadge: 'SPEED MATH MASTERCLASS',
    tricksTitle: 'Mental Math Masterclass',
    tricksSubtitle: 'Master instant calculation secrets without paper or calculators!',
    practiceTrick: 'Practice This Trick',
    unlockTrick: 'Unlock Trick',
    unlockedBadge: 'Unlocked ✓',
    stepsLabel: 'Fast Steps:',
    exampleLabel: 'Example Problem:',
    practiceDrill: 'Practice Drill',
    trickMasteredTitle: 'Trick Mastered Successfully!',
    trickMasteredDesc: 'You are now ready to use this trick in Speed Blitz & AI Duel!',
    finishTrickButton: 'Finish & Back to Tricks Catalog',
    learnButton: 'Learn',
    tricksTipBottom: 'Collect coins by playing Speed Blitz or Daily Missions to unlock all calculation tricks!',

    // Leaderboard
    leaderboardTitle: 'Champions Leaderboard',
    leaderboardSubtitle: 'Compare mental math speed records across profiles & top champions!',
    tabThisDevice: 'This Device Records',
    tabNational: 'National Leaderboard',
    familyRecordInfo: 'Showing all personal best records recorded on this device.',
    noLocalRecords: 'No local records yet. Complete at least 1 session to post your high score!',
    familyBoardHeading: 'Player Leaderboard on This Device',
    familyBoardSubheading: 'Who holds the highest mental math speed record in your family?',
    selectThisProfile: 'Select This Profile',
    yourProfileBadge: 'Your Profile',
    filterAll: 'All',
    filterSd13: 'Grades 1-3',
    filterSd46: 'Grades 4-6',
    filterSmpPro: 'Middle & Pro',
    youBadge: 'YOU',

    // Shop
    shopOfficialHeader: 'OFFICIAL GAME STORE',
    shopTitle: 'Coins & VIP Pass Shop',
    shopSubtitle: 'Boost your mental math speed with power-up items & VIP perks!',
    vipPassTitle: 'VIP PRO MASTER PASS',
    vipPassHeading: 'Full Lifetime Mental Math Access',
    vipFeature1: 'Unlimited Access to All Speed Math Masterclass Tricks',
    vipFeature2: 'Extra 1 Life in Survival Mode (Total 4 Lives)',
    vipFeature3: 'Free Printable Gold-Stamped E-Certificate of Achievement',
    vipFeature4: '2x Double Coin Multiplier & Instant +200 Coins Bonus',
    vipActiveForever: 'VIP Lifetime Active',
    buyVipButton: 'Buy VIP Pass',
    coinPacksTitle: 'Game Coin Top-Up Packs',
    packBag: 'Coin Pouch',
    packChest: 'Champion Chest',
    packVault: 'Sultan Vault',
    certCardTitle: 'Official E-Certificate',
    certCardLicensed: 'Licensed ✓',
    certCardDescReady: 'Certificate ready to print & download as learning portfolio',
    certCardDescBuy: 'Official digital certificate (Free for VIP Members)',
    printCertificate: 'Print Certificate',
    buyLicense: 'Buy License',
    powerupsHeading: 'Power-Up Boost Items (Use Game Coins)',
    powerupsSubheading: 'Use in Speed Blitz & Survival Modes',
    ownedLabel: 'Owned:',
    originalPriceLabel: 'Original:',
    balanceLabel: 'Balance'
  }
};

export function getTranslation(lang: Language = 'id') {
  return translations[lang] || translations.id;
}

// Localized Achievements Helper
export function getLocalizedAchievement(achId: string, lang: Language = 'id'): { title: string; description: string } {
  const achData: Record<string, { id: { title: string; description: string }; en: { title: string; description: string } }> = {
    first_blood: {
      id: { title: 'Langkah Pertama', description: 'Jawab soal mencongak pertamamu dengan benar' },
      en: { title: 'First Step', description: 'Solve your first mental math problem correctly' }
    },
    streak_10: {
      id: { title: 'Konsentrasi Baja', description: 'Raih combo 10 jawaban benar beruntun' },
      en: { title: 'Iron Focus', description: 'Achieve a combo of 10 consecutive correct answers' }
    },
    streak_25: {
      id: { title: 'Otak Kalkulator', description: 'Raih combo 25 jawaban benar beruntun' },
      en: { title: 'Calculator Brain', description: 'Achieve a combo of 25 consecutive correct answers' }
    },
    centurion: {
      id: { title: 'Pahlawan 100 Soal', description: 'Selesaikan total 100 soal mencongak' },
      en: { title: '100 Questions Hero', description: 'Solve a total of 100 mental math questions' }
    },
    duel_master: {
      id: { title: 'Gladiator Mencongak', description: 'Menangkan 5 duel melawan Bot AI' },
      en: { title: 'Math Gladiator', description: 'Win 5 speed calculation duels against AI bots' }
    },
    trick_scholar: {
      id: { title: 'Kolektor Trik Aritmatika', description: 'Buka dan kuasai 3 trik mencongak cepat' },
      en: { title: 'Speed Math Scholar', description: 'Unlock and master 3 speed mental math tricks' }
    }
  };

  const item = achData[achId];
  if (!item) return { title: achId, description: '' };
  return item[lang] || item.id;
}

// Localized Shop Powerup Items Helper
export function getLocalizedShopItem(itemId: string, lang: Language = 'id'): { name: string; description: string } {
  const shopData: Record<string, { id: { name: string; description: string }; en: { name: string; description: string } }> = {
    freeze_time: {
      id: {
        name: 'Beku Waktu (Freeze Time)',
        description: 'Hentikan countdown timer selama 8 detik di mode Kilat'
      },
      en: {
        name: 'Freeze Time',
        description: 'Freezes the countdown timer for 8 seconds in Speed Blitz mode'
      }
    },
    hint_5050: {
      id: {
        name: 'Pelenyap Opsi (50:50)',
        description: 'Hilangkan 2 pilihan jawaban yang salah dari layar'
      },
      en: {
        name: '50:50 Option Eliminator',
        description: 'Eliminates 2 incorrect answer options from the screen'
      }
    },
    double_xp: {
      id: {
        name: 'Pengganda Poin 2x',
        description: 'Gandakan semua perolehan skor & XP selama 1 sesi permainan'
      },
      en: {
        name: '2x Points Multiplier',
        description: 'Doubles all score points and XP earned during 1 game session'
      }
    },
    vip_pro_pass: {
      id: {
        name: 'VIP Pro Mencongak Pass',
        description: 'Buka SEMUA trik materi, tanpa iklan, mode 4 nyawa, dan lencana emas eksklusif'
      },
      en: {
        name: 'VIP Pro Master Pass',
        description: 'Unlock ALL speed tricks, extra survival lives, and printable certificate forever'
      }
    },
    cert_pro: {
      id: {
        name: 'Lisensi E-Sertifikat Prestasi',
        description: 'Hak cetak piagam kelulusan berlisensi dengan nama anak dan tanda tangan digital'
      },
      en: {
        name: 'Achievement E-Certificate License',
        description: 'Printable gold-stamped official completion certificate with player name'
      }
    },
    coin_pack_100: {
      id: {
        name: 'Kantong Koin (100 Koin)',
        description: 'Untuk membeli power-up dan membuka trik kilat'
      },
      en: {
        name: 'Coin Pouch (100 Coins)',
        description: 'For purchasing power-ups and unlocking speed tricks'
      }
    },
    coin_pack_500: {
      id: {
        name: 'Peti Koin Juara (500 + 100 Bonus)',
        description: 'Paket terfavorit pemain untuk stok power-up berlimpah'
      },
      en: {
        name: 'Champion Chest (500 + 100 Bonus)',
        description: 'Most popular pack for abundant power-up reserves'
      }
    },
    coin_pack_1500: {
      id: {
        name: 'Gudang Koin Sultan (1.500 + 500 Bonus)',
        description: 'Bonus 500 koin gratis & buka semua trik seketika'
      },
      en: {
        name: 'Sultan Vault (1,500 + 500 Bonus)',
        description: 'Bonus 500 free coins & unlock all tricks instantly'
      }
    }
  };

  const item = shopData[itemId];
  if (!item) return { name: itemId, description: '' };
  return item[lang] || item.id;
}

export function getLocalizedDiscountBadge(badge?: string, lang: Language = 'id'): string | undefined {
  if (!badge) return undefined;
  if (lang === 'id') return badge;

  if (badge.includes('DISKON 40%')) return '40% OFF';
  if (badge.includes('DISKON 35%')) return 'SAVE 35%';
  if (badge.includes('DISKON')) return badge.replace('DISKON', 'OFF');
  if (badge.includes('HEMAT')) return badge.replace('HEMAT', 'SAVE');
  if (badge.includes('PALING POPULER')) return 'MOST POPULAR';
  return badge;
}

export function getLocalizedPrice(priceIdr?: string, lang: Language = 'id'): string {
  if (!priceIdr) return '';
  if (lang === 'id') return priceIdr;

  if (priceIdr.includes('5.000')) return '$0.35 USD';
  if (priceIdr.includes('15.000')) return '$0.99 USD';
  if (priceIdr.includes('19.000')) return '$1.29 USD';
  if (priceIdr.includes('25.000')) return '$1.69 USD';
  if (priceIdr.includes('29.000')) return '$1.99 USD';
  if (priceIdr.includes('49.000')) return '$3.49 USD';
  if (priceIdr.includes('75.000')) return '$4.99 USD';

  return priceIdr;
}
