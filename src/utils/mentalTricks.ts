import { Language, MentalTrick } from '../types';

export const MENTAL_TRICKS_ID: MentalTrick[] = [
  {
    id: 'trick_11',
    title: 'Trik Kilat Perkalian 11',
    category: 'Perkalian Cepat',
    shortDesc: 'Hitung perkalian 2 digit dengan 11 hanya dalam 1 detik tanpa coret-coret kertas!',
    exampleProblem: '45 × 11 = 495',
    unlocked: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Pisahkan Angka Depan & Belakang',
        explanation: 'Untuk angka 45, pisahkan menjadi angka [4] di depan dan [5] di belakang.',
        formula: '4 _ 5'
      },
      {
        stepNumber: 2,
        title: 'Jumlahkan Kedua Angka',
        explanation: 'Tambahkan digit depan dan digit belakang: 4 + 5 = 9.',
        formula: '4 + 5 = 9'
      },
      {
        stepNumber: 3,
        title: 'Sisipkan Hasil di Tengah',
        explanation: 'Letakkan angka 9 di antara 4 dan 5. Hasil akhirnya adalah 495!',
        formula: '4 [9] 5 = 495'
      },
      {
        stepNumber: 4,
        title: 'Bagaimana Jika Ada Simpanan (Carry)?',
        explanation: 'Jika penjumlahan menghasilkan >= 10 (misal 78 × 11: 7+8=15), simpan 1 ke angka depan. Depan: 7+1=8, Tengah: 5, Belakang: 8 -> Hasil = 858!',
        formula: '78 × 11 = (7+1)[5][8] = 858'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_1',
        questionText: '34 × 11 = ?',
        operation: '×',
        num1: 34,
        num2: 11,
        correctAnswer: 374,
        options: [374, 384, 364, 474],
        hint: 'Pisahkan 3 dan 4, tengahnya 3+4=7.'
      },
      {
        id: 'pt_2',
        questionText: '62 × 11 = ?',
        operation: '×',
        num1: 62,
        num2: 11,
        correctAnswer: 682,
        options: [682, 692, 672, 782],
        hint: 'Pisahkan 6 dan 2, tengahnya 6+2=8.'
      },
      {
        id: 'pt_3',
        questionText: '57 × 11 = ?',
        operation: '×',
        num1: 57,
        num2: 11,
        correctAnswer: 627,
        options: [627, 5127, 617, 527],
        hint: '5+7 = 12. Simpan 1 ke depan: (5+1)[2][7] = 627.'
      }
    ]
  },
  {
    id: 'trick_ends5',
    title: 'Kuadrat Angka Berakhiran 5',
    category: 'Pangkat & Kuadrat',
    shortDesc: 'Menghitung 25², 35², 75², 95² dalam sekejap mata dengan rumus n × (n+1) | 25.',
    exampleProblem: '65² = 4225',
    unlocked: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Identifikasi Angka Puluhan (n)',
        explanation: 'Pada 65², angka puluhannya adalah 6 (n = 6).',
        formula: 'n = 6'
      },
      {
        stepNumber: 2,
        title: 'Kalikan Puluhan dengan Kakaknya (n + 1)',
        explanation: 'Kalikan angka puluhan dengan bilangan setelahnya: 6 × 7 = 42.',
        formula: '6 × (6 + 1) = 42'
      },
      {
        stepNumber: 3,
        title: 'Tempelkan 25 di Belakangnya',
        explanation: 'Semua kuadrat angka berakhiran 5 selalu berakhir dengan 25. Gabungkan: 42 dan 25 -> 4225!',
        formula: '42 | 25 = 4225'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_e1',
        questionText: '25 × 25 (25²) = ?',
        operation: 'powers',
        num1: 25,
        num2: 25,
        correctAnswer: 625,
        options: [625, 525, 615, 650],
        hint: '2 × 3 = 6, tempel 25 -> 625'
      },
      {
        id: 'pt_e2',
        questionText: '45 × 45 (45²) = ?',
        operation: 'powers',
        num1: 45,
        num2: 45,
        correctAnswer: 2025,
        options: [2025, 2425, 1825, 2035],
        hint: '4 × 5 = 20, tempel 25 -> 2025'
      },
      {
        id: 'pt_e3',
        questionText: '85 × 85 (85²) = ?',
        operation: 'powers',
        num1: 85,
        num2: 85,
        correctAnswer: 7225,
        options: [7225, 7125, 7325, 6425],
        hint: '8 × 9 = 72, tempel 25 -> 7225'
      }
    ]
  },
  {
    id: 'trick_mult5',
    title: 'Perkalian Angka dengan 5',
    category: 'Perkalian Cepat',
    shortDesc: 'Mengalikan angka berapa pun dengan 5 cukup bagi dua lalu kalikan 10.',
    exampleProblem: '48 × 5 = 240',
    unlocked: false,
    costToUnlock: 50,
    steps: [
      {
        stepNumber: 1,
        title: 'Bagi Angka Tersebut dengan 2',
        explanation: 'Karena 5 sama dengan 10 / 2, kita bisa membagi angka dengan 2 terlebih dahulu. Contoh 48 ÷ 2 = 24.',
        formula: '48 ÷ 2 = 24'
      },
      {
        stepNumber: 2,
        title: 'Kalikan dengan 10 (Tambah Nol)',
        explanation: 'Tambahkan angka 0 di belakang hasil bagi tadi: 24 -> 240. Cepat & tanpa susun panjang!',
        formula: '24 × 10 = 240'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_m1',
        questionText: '64 × 5 = ?',
        operation: '×',
        num1: 64,
        num2: 5,
        correctAnswer: 320,
        options: [320, 310, 340, 360],
        hint: 'Setengah dari 64 adalah 32, tambah nol -> 320'
      },
      {
        id: 'pt_m2',
        questionText: '86 × 5 = ?',
        operation: '×',
        num1: 86,
        num2: 5,
        correctAnswer: 430,
        options: [430, 420, 440, 450],
        hint: '86 ÷ 2 = 43, tambah nol -> 430'
      }
    ]
  },
  {
    id: 'trick_mult25',
    title: 'Perkalian Kilat dengan 25',
    category: 'Perkalian Cepat',
    shortDesc: 'Mengalikan angka dengan 25 cukup dibagi 4 lalu tambahkan dua nol (00).',
    exampleProblem: '48 × 25 = 1200',
    unlocked: false,
    costToUnlock: 60,
    steps: [
      {
        stepNumber: 1,
        title: 'Bagi Angka Tersebut dengan 4',
        explanation: 'Karena 25 = 100 / 4, kita bagi angka dengan 4. Contoh: 48 ÷ 4 = 12.',
        formula: '48 ÷ 4 = 12'
      },
      {
        stepNumber: 2,
        title: 'Tempelkan Dua Nol (00) di Belakang',
        explanation: 'Kalikan 100 dengan menempelkan dua nol: 12 -> 1200!',
        formula: '12 × 100 = 1200'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_25_1',
        questionText: '36 × 25 = ?',
        operation: '×',
        num1: 36,
        num2: 25,
        correctAnswer: 900,
        options: [900, 850, 950, 1000],
        hint: '36 ÷ 4 = 9, tambah 00 -> 900'
      },
      {
        id: 'pt_25_2',
        questionText: '64 × 25 = ?',
        operation: '×',
        num1: 64,
        num2: 25,
        correctAnswer: 1600,
        options: [1600, 1500, 1700, 1800],
        hint: '64 ÷ 4 = 16, tambah 00 -> 1600'
      }
    ]
  },
  {
    id: 'trick_same_tens',
    title: 'Perkalian Puluhan Sama & Satuan Jumlah 10',
    category: 'Vedic Math Olimpiade',
    shortDesc: 'Trik kilat mengalikan angka seperti 74 × 76 atau 32 × 38 hanya dalam 1 detik.',
    exampleProblem: '74 × 76 = 5624',
    unlocked: false,
    costToUnlock: 80,
    steps: [
      {
        stepNumber: 1,
        title: 'Cek Syarat: Puluhan Sama & Satuan Jumlah 10',
        explanation: 'Contoh 74 × 76: Puluhannya sama-sama 7. Satuannya: 4 + 6 = 10. Syarat terpenuhi!',
        formula: 'Puluhan: 7 | Satuan: 4 + 6 = 10'
      },
      {
        stepNumber: 2,
        title: 'Bagian Depan: Puluhan × (Puluhan + 1)',
        explanation: 'Kalikan angka puluhan dengan kakaknya: 7 × 8 = 56.',
        formula: '7 × (7 + 1) = 56'
      },
      {
        stepNumber: 3,
        title: 'Bagian Belakang: Kalikan Antar Satuan',
        explanation: 'Kalikan kedua satuan: 4 × 6 = 24. Gabungkan 56 dan 24 -> 5624!',
        formula: '56 | 24 = 5624'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_st_1',
        questionText: '32 × 38 = ?',
        operation: '×',
        num1: 32,
        num2: 38,
        correctAnswer: 1216,
        options: [1216, 1224, 1116, 1316],
        hint: 'Depan: 3×4=12. Belakang: 2×8=16 -> 1216'
      },
      {
        id: 'pt_st_2',
        questionText: '83 × 87 = ?',
        operation: '×',
        num1: 83,
        num2: 87,
        correctAnswer: 7221,
        options: [7221, 7121, 7321, 6421],
        hint: 'Depan: 8×9=72. Belakang: 3×7=21 -> 7221'
      }
    ]
  },
  {
    id: 'trick_square50',
    title: 'Kuadrat Cepat Angka Dekat 50 (41–59)',
    category: 'Pangkat & Kuadrat',
    shortDesc: 'Menghitung 53², 56², 47² dalam hitungan detik dengan patokan angka ajaib 25.',
    exampleProblem: '53² = 2809',
    unlocked: false,
    costToUnlock: 90,
    steps: [
      {
        stepNumber: 1,
        title: 'Hitung Selisih dari 50',
        explanation: 'Untuk 53, selisihnya adalah +3 (lebih 3 dari 50).',
        formula: '53 - 50 = +3'
      },
      {
        stepNumber: 2,
        title: 'Bagian Depan: 25 + Selisih',
        explanation: 'Tambahkan selisih ke angka dasar 25: 25 + 3 = 28.',
        formula: '25 + 3 = 28'
      },
      {
        stepNumber: 3,
        title: 'Bagian Belakang: Kuadratkan Selisih',
        explanation: 'Kuadratkan selisih (harus 2 digit): 3² = 09. Gabungkan: 28 dan 09 -> 2809!',
        formula: '28 | 09 = 2809'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_sq_1',
        questionText: '54 × 54 (54²) = ?',
        operation: 'powers',
        num1: 54,
        num2: 54,
        correctAnswer: 2916,
        options: [2916, 2816, 2926, 3016],
        hint: '25 + 4 = 29. 4² = 16 -> 2916'
      },
      {
        id: 'pt_sq_2',
        questionText: '47 × 47 (47²) = ?',
        operation: 'powers',
        num1: 47,
        num2: 47,
        correctAnswer: 2209,
        options: [2209, 2309, 2109, 2409],
        hint: 'Kurang 3 dari 50. Depan: 25 - 3 = 22. Belakang: 3² = 09 -> 2209'
      }
    ]
  },
  {
    id: 'trick_complement',
    title: 'Penjumlahan Cepat Menuju 100 & 1000',
    category: 'Penjumlahan & Pengurangan',
    shortDesc: 'Trik komplementer melengkapi angka puluhan untuk mencongak kembalian belanja dalam 1 detik.',
    exampleProblem: '100 - 67 = 33',
    unlocked: false,
    costToUnlock: 75,
    steps: [
      {
        stepNumber: 1,
        title: 'Gunakan Kaidah "Semua dari 9, Terakhir dari 10"',
        explanation: 'Untuk menghitung 100 - 67: kurangi angka puluhan (6) dari 9, dan angka satuan (7) dari 10.',
        formula: '9 - 6 = 3 | 10 - 7 = 3'
      },
      {
        stepNumber: 2,
        title: 'Satukan Digitnya',
        explanation: 'Hasil puluhan adalah 3 dan hasil satuan adalah 3. Hasil akhirnya 33!',
        formula: '100 - 67 = 33'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_c1',
        questionText: '100 - 43 = ?',
        operation: '-',
        num1: 100,
        num2: 43,
        correctAnswer: 57,
        options: [57, 67, 47, 53],
        hint: '9 - 4 = 5, 10 - 3 = 7 -> 57'
      },
      {
        id: 'pt_c2',
        questionText: '1000 - 348 = ?',
        operation: '-',
        num1: 1000,
        num2: 348,
        correctAnswer: 652,
        options: [652, 662, 752, 642],
        hint: '9-3=6, 9-4=5, 10-8=2 -> 652'
      }
    ]
  },
  {
    id: 'trick_near100',
    title: 'Perkalian Dua Angka Mendekati 100 (Vedic Math)',
    category: 'Vedic Math Olimpiade',
    shortDesc: 'Trik rahasia mengalikan 96 × 97 atau 94 × 98 tanpa kalkulator!',
    exampleProblem: '96 × 97 = 9312',
    unlocked: false,
    costToUnlock: 120,
    steps: [
      {
        stepNumber: 1,
        title: 'Cari Selisih dari 100',
        explanation: '96 kurang 4 dari 100 (-4). 97 kurang 3 dari 100 (-3).',
        formula: 'Selisih: (-4) dan (-3)'
      },
      {
        stepNumber: 2,
        title: 'Kurangkan Silang untuk Angka Depan',
        explanation: '96 - 3 = 93 (atau 97 - 4 = 93). Angka depannya adalah 93.',
        formula: '96 - 3 = 93'
      },
      {
        stepNumber: 3,
        title: 'Kalikan Kedua Selisih untuk Angka Belakang',
        explanation: 'Kalikan (-4) × (-3) = 12. Gabungkan 93 dan 12 -> 9312!',
        formula: '93 | 12 = 9312'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_n1',
        questionText: '95 × 96 = ?',
        operation: '×',
        num1: 95,
        num2: 96,
        correctAnswer: 9120,
        options: [9120, 9110, 9220, 9020],
        hint: 'Selisih -5 dan -4. Depan: 95-4=91. Belakang: 5×4=20 -> 9120'
      }
    ]
  },
  {
    id: 'trick_div5',
    title: 'Pembagian Cepat dengan Angka 5',
    category: 'Pembagian Kilat',
    shortDesc: 'Membagi angka berapa pun dengan 5 cukup kalikan 2 lalu geser koma 1 digit.',
    exampleProblem: '145 ÷ 5 = 29',
    unlocked: false,
    costToUnlock: 55,
    steps: [
      {
        stepNumber: 1,
        title: 'Kalikan Angka Tersebut dengan 2',
        explanation: 'Karena dibagi 5 sama dengan dikali 2/10, kita gandakan angka tersebut. Contoh: 145 × 2 = 290.',
        formula: '145 × 2 = 290'
      },
      {
        stepNumber: 2,
        title: 'Bagi 10 (Geser Koma 1 Langkah ke Kiri)',
        explanation: 'Hilangkan nol atau geser koma: 290 ÷ 10 = 29. Sangat praktis!',
        formula: '290 ÷ 10 = 29'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_d1',
        questionText: '235 ÷ 5 = ?',
        operation: '÷',
        num1: 235,
        num2: 5,
        correctAnswer: 47,
        options: [47, 45, 49, 53],
        hint: '235 × 2 = 470, hilangkan 0 -> 47'
      }
    ]
  }
];

export const MENTAL_TRICKS_EN: MentalTrick[] = [
  {
    id: 'trick_11',
    title: 'Instant 11x Multiplier Trick',
    category: 'Fast Multiplication',
    shortDesc: 'Multiply any 2-digit number by 11 in 1 second without scratch paper!',
    exampleProblem: '45 × 11 = 495',
    unlocked: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Separate Front and Back Digits',
        explanation: 'For the number 45, place [4] in the front and [5] in the back.',
        formula: '4 _ 5'
      },
      {
        stepNumber: 2,
        title: 'Add Both Digits Together',
        explanation: 'Add the first digit and the second digit: 4 + 5 = 9.',
        formula: '4 + 5 = 9'
      },
      {
        stepNumber: 3,
        title: 'Insert Result in the Middle',
        explanation: 'Place the number 9 between 4 and 5. The final answer is 495!',
        formula: '4 [9] 5 = 495'
      },
      {
        stepNumber: 4,
        title: 'What if there is a carry over?',
        explanation: 'If the sum is >= 10 (e.g. 78 × 11: 7+8=15), add 1 to the front digit. Front: 7+1=8, Middle: 5, Back: 8 -> Result = 858!',
        formula: '78 × 11 = (7+1)[5][8] = 858'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_1',
        questionText: '34 × 11 = ?',
        operation: '×',
        num1: 34,
        num2: 11,
        correctAnswer: 374,
        options: [374, 384, 364, 474],
        hint: 'Split 3 and 4, middle is 3+4=7.'
      },
      {
        id: 'pt_2',
        questionText: '62 × 11 = ?',
        operation: '×',
        num1: 62,
        num2: 11,
        correctAnswer: 682,
        options: [682, 692, 672, 782],
        hint: 'Split 6 and 2, middle is 6+2=8.'
      },
      {
        id: 'pt_3',
        questionText: '57 × 11 = ?',
        operation: '×',
        num1: 57,
        num2: 11,
        correctAnswer: 627,
        options: [627, 5127, 617, 527],
        hint: '5+7 = 12. Carry 1 to front: (5+1)[2][7] = 627.'
      }
    ]
  },
  {
    id: 'trick_ends5',
    title: 'Squaring Numbers Ending in 5',
    category: 'Powers & Squares',
    shortDesc: 'Calculate 25², 35², 75², 95² in a blink with formula n × (n+1) | 25.',
    exampleProblem: '65² = 4225',
    unlocked: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Tens Digit (n)',
        explanation: 'For 65², the tens digit is 6 (n = 6).',
        formula: 'n = 6'
      },
      {
        stepNumber: 2,
        title: 'Multiply Tens by (n + 1)',
        explanation: 'Multiply tens digit by next number: 6 × 7 = 42.',
        formula: '6 × (6 + 1) = 42'
      },
      {
        stepNumber: 3,
        title: 'Attach 25 at the End',
        explanation: 'All squares of numbers ending in 5 end in 25. Combine: 42 and 25 -> 4225!',
        formula: '42 | 25 = 4225'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_e1',
        questionText: '25 × 25 (25²) = ?',
        operation: 'powers',
        num1: 25,
        num2: 25,
        correctAnswer: 625,
        options: [625, 525, 615, 650],
        hint: '2 × 3 = 6, attach 25 -> 625'
      },
      {
        id: 'pt_e2',
        questionText: '45 × 45 (45²) = ?',
        operation: 'powers',
        num1: 45,
        num2: 45,
        correctAnswer: 2025,
        options: [2025, 2425, 1825, 2035],
        hint: '4 × 5 = 20, attach 25 -> 2025'
      },
      {
        id: 'pt_e3',
        questionText: '85 × 85 (85²) = ?',
        operation: 'powers',
        num1: 85,
        num2: 85,
        correctAnswer: 7225,
        options: [7225, 7125, 7325, 6425],
        hint: '8 × 9 = 72, attach 25 -> 7225'
      }
    ]
  },
  {
    id: 'trick_mult5',
    title: 'Fast Multiplication by 5',
    category: 'Fast Multiplication',
    shortDesc: 'To multiply any number by 5, just divide by 2 then multiply by 10.',
    exampleProblem: '48 × 5 = 240',
    unlocked: false,
    costToUnlock: 50,
    steps: [
      {
        stepNumber: 1,
        title: 'Divide the Number by 2',
        explanation: 'Since 5 equals 10 / 2, halve the number first. Example: 48 ÷ 2 = 24.',
        formula: '48 ÷ 2 = 24'
      },
      {
        stepNumber: 2,
        title: 'Multiply by 10 (Add Zero)',
        explanation: 'Add 0 to the result: 24 -> 240. Super quick & mental!',
        formula: '24 × 10 = 240'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_m1',
        questionText: '64 × 5 = ?',
        operation: '×',
        num1: 64,
        num2: 5,
        correctAnswer: 320,
        options: [320, 310, 340, 360],
        hint: 'Half of 64 is 32, add zero -> 320'
      },
      {
        id: 'pt_m2',
        questionText: '86 × 5 = ?',
        operation: '×',
        num1: 86,
        num2: 5,
        correctAnswer: 430,
        options: [430, 420, 440, 450],
        hint: '86 ÷ 2 = 43, add zero -> 430'
      }
    ]
  },
  {
    id: 'trick_mult25',
    title: 'Lightning Multiplication by 25',
    category: 'Fast Multiplication',
    shortDesc: 'To multiply any number by 25, divide by 4 then attach two zeros (00).',
    exampleProblem: '48 × 25 = 1200',
    unlocked: false,
    costToUnlock: 60,
    steps: [
      {
        stepNumber: 1,
        title: 'Divide the Number by 4',
        explanation: 'Since 25 = 100 / 4, divide by 4. Example: 48 ÷ 4 = 12.',
        formula: '48 ÷ 4 = 12'
      },
      {
        stepNumber: 2,
        title: 'Attach Two Zeros (00)',
        explanation: 'Multiply by 100 by attaching two zeros: 12 -> 1200!',
        formula: '12 × 100 = 1200'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_25_1',
        questionText: '36 × 25 = ?',
        operation: '×',
        num1: 36,
        num2: 25,
        correctAnswer: 900,
        options: [900, 850, 950, 1000],
        hint: '36 ÷ 4 = 9, add 00 -> 900'
      },
      {
        id: 'pt_25_2',
        questionText: '64 × 25 = ?',
        operation: '×',
        num1: 64,
        num2: 25,
        correctAnswer: 1600,
        options: [1600, 1500, 1700, 1800],
        hint: '64 ÷ 4 = 16, add 00 -> 1600'
      }
    ]
  },
  {
    id: 'trick_same_tens',
    title: 'Same Tens & Units Sum to 10',
    category: 'Olympiad Vedic Math',
    shortDesc: 'Multiply pairs like 74 × 76 or 32 × 38 in 1 second using ancient Vedic math.',
    exampleProblem: '74 × 76 = 5624',
    unlocked: false,
    costToUnlock: 80,
    steps: [
      {
        stepNumber: 1,
        title: 'Check Condition: Same Tens & Units Sum to 10',
        explanation: 'For 74 × 76: Tens are both 7. Units: 4 + 6 = 10. Condition met!',
        formula: 'Tens: 7 | Units: 4 + 6 = 10'
      },
      {
        stepNumber: 2,
        title: 'Front Part: Tens × (Tens + 1)',
        explanation: 'Multiply tens digit by its next integer: 7 × 8 = 56.',
        formula: '7 × (7 + 1) = 56'
      },
      {
        stepNumber: 3,
        title: 'Back Part: Multiply Units Together',
        explanation: 'Multiply unit digits: 4 × 6 = 24. Combine 56 and 24 -> 5624!',
        formula: '56 | 24 = 5624'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_st_1',
        questionText: '32 × 38 = ?',
        operation: '×',
        num1: 32,
        num2: 38,
        correctAnswer: 1216,
        options: [1216, 1224, 1116, 1316],
        hint: 'Front: 3×4=12. Back: 2×8=16 -> 1216'
      },
      {
        id: 'pt_st_2',
        questionText: '83 × 87 = ?',
        operation: '×',
        num1: 83,
        num2: 87,
        correctAnswer: 7221,
        options: [7221, 7121, 7321, 6421],
        hint: 'Front: 8×9=72. Back: 3×7=21 -> 7221'
      }
    ]
  },
  {
    id: 'trick_square50',
    title: 'Fast Squares Near 50 (41–59)',
    category: 'Powers & Squares',
    shortDesc: 'Calculate 53², 56², 47² in seconds using the magic anchor number 25.',
    exampleProblem: '53² = 2809',
    unlocked: false,
    costToUnlock: 90,
    steps: [
      {
        stepNumber: 1,
        title: 'Find Difference from 50',
        explanation: 'For 53, difference is +3 (3 more than 50).',
        formula: '53 - 50 = +3'
      },
      {
        stepNumber: 2,
        title: 'Front Part: 25 + Difference',
        explanation: 'Add difference to base 25: 25 + 3 = 28.',
        formula: '25 + 3 = 28'
      },
      {
        stepNumber: 3,
        title: 'Back Part: Square the Difference',
        explanation: 'Square the difference (must be 2 digits): 3² = 09. Combine: 28 and 09 -> 2809!',
        formula: '28 | 09 = 2809'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_sq_1',
        questionText: '54 × 54 (54²) = ?',
        operation: 'powers',
        num1: 54,
        num2: 54,
        correctAnswer: 2916,
        options: [2916, 2816, 2926, 3016],
        hint: '25 + 4 = 29. 4² = 16 -> 2916'
      },
      {
        id: 'pt_sq_2',
        questionText: '47 × 47 (47²) = ?',
        operation: 'powers',
        num1: 47,
        num2: 47,
        correctAnswer: 2209,
        options: [2209, 2309, 2109, 2409],
        hint: '3 less than 50. Front: 25 - 3 = 22. Back: 3² = 09 -> 2209'
      }
    ]
  },
  {
    id: 'trick_complement',
    title: 'Speed Complements to 100 & 1000',
    category: 'Addition & Subtraction',
    shortDesc: 'Complement trick to calculate change and subtractions mentally in 1 second.',
    exampleProblem: '100 - 67 = 33',
    unlocked: false,
    costToUnlock: 75,
    steps: [
      {
        stepNumber: 1,
        title: 'Apply "All from 9 and the Last from 10"',
        explanation: 'To compute 100 - 67: subtract tens digit (6) from 9, and units digit (7) from 10.',
        formula: '9 - 6 = 3 | 10 - 7 = 3'
      },
      {
        stepNumber: 2,
        title: 'Combine the Digits',
        explanation: 'Tens digit is 3 and units digit is 3. Final answer is 33!',
        formula: '100 - 67 = 33'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_c1',
        questionText: '100 - 43 = ?',
        operation: '-',
        num1: 100,
        num2: 43,
        correctAnswer: 57,
        options: [57, 67, 47, 53],
        hint: '9 - 4 = 5, 10 - 3 = 7 -> 57'
      },
      {
        id: 'pt_c2',
        questionText: '1000 - 348 = ?',
        operation: '-',
        num1: 1000,
        num2: 348,
        correctAnswer: 652,
        options: [652, 662, 752, 642],
        hint: '9-3=6, 9-4=5, 10-8=2 -> 652'
      }
    ]
  },
  {
    id: 'trick_near100',
    title: 'Multiplying Numbers Near 100',
    category: 'Olympiad Vedic Math',
    shortDesc: 'Secret Vedic shortcut to multiply 96 × 97 or 94 × 98 without a calculator!',
    exampleProblem: '96 × 97 = 9312',
    unlocked: false,
    costToUnlock: 120,
    steps: [
      {
        stepNumber: 1,
        title: 'Find Difference from 100',
        explanation: '96 is 4 below 100 (-4). 97 is 3 below 100 (-3).',
        formula: 'Differences: (-4) and (-3)'
      },
      {
        stepNumber: 2,
        title: 'Cross-Subtract for Front Digits',
        explanation: '96 - 3 = 93 (or 97 - 4 = 93). Front part is 93.',
        formula: '96 - 3 = 93'
      },
      {
        stepNumber: 3,
        title: 'Multiply Differences for Back Digits',
        explanation: 'Multiply (-4) × (-3) = 12. Combine 93 and 12 -> 9312!',
        formula: '93 | 12 = 9312'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_n1',
        questionText: '95 × 96 = ?',
        operation: '×',
        num1: 95,
        num2: 96,
        correctAnswer: 9120,
        options: [9120, 9110, 9220, 9020],
        hint: 'Diffs -5 & -4. Front: 95-4=91. Back: 5×4=20 -> 9120'
      }
    ]
  },
  {
    id: 'trick_div5',
    title: 'Lightning Division by 5',
    category: 'Fast Division',
    shortDesc: 'To divide any number by 5, double the number and shift decimal left 1 place.',
    exampleProblem: '145 ÷ 5 = 29',
    unlocked: false,
    costToUnlock: 55,
    steps: [
      {
        stepNumber: 1,
        title: 'Double the Number (Multiply by 2)',
        explanation: 'Since dividing by 5 is equal to multiplying by 2/10, double the number: 145 × 2 = 290.',
        formula: '145 × 2 = 290'
      },
      {
        stepNumber: 2,
        title: 'Divide by 10 (Shift Decimal Left 1 Place)',
        explanation: 'Drop the trailing zero or shift decimal: 290 ÷ 10 = 29. Super fast!',
        formula: '290 ÷ 10 = 29'
      }
    ],
    practiceQuestions: [
      {
        id: 'pt_d1',
        questionText: '235 ÷ 5 = ?',
        operation: '÷',
        num1: 235,
        num2: 5,
        correctAnswer: 47,
        options: [47, 45, 49, 53],
        hint: '235 × 2 = 470, drop 0 -> 47'
      }
    ]
  }
];

export const MENTAL_TRICKS = MENTAL_TRICKS_ID;

export function getMentalTricks(lang: Language = 'id'): MentalTrick[] {
  return lang === 'en' ? MENTAL_TRICKS_EN : MENTAL_TRICKS_ID;
}
