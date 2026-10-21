import { DifficultyLevel, MathOperation, Question, Language } from '../types';

export interface LevelMaxPreset {
  value: number | null;
  label: string;
}

export interface LevelMaxConfig {
  defaultMax: number;
  hardCap: number;
  presets: LevelMaxPreset[];
  description: string;
}

export function getLevelMaxConfig(level: DifficultyLevel, lang: Language = 'id'): LevelMaxConfig {
  const isEn = lang === 'en';
  switch (level) {
    case 'sd_awal':
      return {
        defaultMax: 20,
        hardCap: 50,
        presets: [
          { value: null, label: isEn ? 'Auto (≤20)' : 'Otomatis (≤20)' },
          { value: 10, label: '≤ 10' },
          { value: 15, label: '≤ 15' },
          { value: 20, label: '≤ 20' },
          { value: 30, label: '≤ 30' },
          { value: 50, label: '≤ 50' }
        ],
        description: isEn
          ? 'Grades 1-3 appropriate range: numbers up to 50 max (no hundreds).'
          : 'Sesuai jenjang SD 1-3: angka ramah anak maks ≤ 50 (tidak ada ratusan).'
      };
    case 'sd_lanjut':
      return {
        defaultMax: 100,
        hardCap: 500,
        presets: [
          { value: null, label: isEn ? 'Auto (≤100)' : 'Otomatis (≤100)' },
          { value: 20, label: '≤ 20' },
          { value: 50, label: '≤ 50' },
          { value: 100, label: '≤ 100' },
          { value: 200, label: '≤ 200' },
          { value: 500, label: '≤ 500' }
        ],
        description: isEn
          ? 'Grades 4-6 appropriate range: up to 500.'
          : 'Sesuai jenjang SD 4-6: puluhan hingga ratusan (maks ≤ 500).'
      };
    case 'smp':
      return {
        defaultMax: 200,
        hardCap: 1000,
        presets: [
          { value: null, label: isEn ? 'Auto (≤200)' : 'Otomatis (≤200)' },
          { value: 50, label: '≤ 50' },
          { value: 100, label: '≤ 100' },
          { value: 200, label: '≤ 200' },
          { value: 500, label: '≤ 500' },
          { value: 1000, label: '≤ 1000' }
        ],
        description: isEn
          ? 'Middle school speed arithmetic: up to 1000.'
          : 'Tingkat SMP: ratusan hingga ribuan awal (maks ≤ 1000).'
      };
    case 'sma_pro':
    default:
      return {
        defaultMax: 500,
        hardCap: 5000,
        presets: [
          { value: null, label: isEn ? 'Auto (≤500)' : 'Otomatis (≤500)' },
          { value: 100, label: '≤ 100' },
          { value: 200, label: '≤ 200' },
          { value: 500, label: '≤ 500' },
          { value: 1000, label: '≤ 1000' },
          { value: 2000, label: '≤ 2000' },
          { value: 5000, label: '≤ 5000' }
        ],
        description: isEn
          ? 'Olympiad Master speed range: mental math up to 5000.'
          : 'Tingkat Olimpiade / Pro: tantangan mental math hingga ribuan (maks ≤ 5000).'
      };
  }
}

export function getQuestionHint(
  question: { hint?: string; hintId?: string; hintEn?: string; operation?: MathOperation; num1?: number; num2?: number } | null | undefined,
  lang: Language = 'id'
): string {
  if (!question) return '';

  const isEn = lang === 'en';

  if (isEn && question.hintEn) return question.hintEn;
  if (!isEn && question.hintId) return question.hintId;

  if (question.hint) {
    if (isEn) {
      if (question.hint.startsWith('Kurangkan ') && question.hint.includes(' dengan ')) {
        const parts = question.hint.replace('Kurangkan ', '').split(' dengan ');
        if (parts.length === 2) return `Subtract ${parts[1].trim()} from ${parts[0].trim()}`;
      }
      if (question.hint.startsWith('Jumlahkan ') && question.hint.includes(' dan ')) {
        const parts = question.hint.replace('Jumlahkan ', '').split(' dan ');
        if (parts.length === 2) return `Add ${parts[0].trim()} and ${parts[1].trim()}`;
      }
      if (question.hint.includes(' kurangi ')) {
        const parts = question.hint.split(' kurangi ');
        if (parts.length === 2) return `${parts[0].trim()} minus ${parts[1].trim()}`;
      }
      if (question.hint.startsWith('Berapa ') && question.hint.includes(' dibagi ')) {
        const parts = question.hint.replace('Berapa ', '').replace('?', '').split(' dibagi ');
        if (parts.length === 2) return `What is ${parts[0].trim()} divided by ${parts[1].trim()}?`;
      }
      if (question.hint.startsWith('Perkalian dasar: ')) {
        return question.hint.replace('Perkalian dasar: ', 'Basic multiplication: ').replace(' dikali ', ' times ');
      }
      if (question.hint.startsWith('Jumlahkan puluhan')) {
        return question.hint.replace('Jumlahkan puluhan', 'Add tens').replace('lalu satuannya', 'then units');
      }
      if (question.hint.startsWith('Trik: ') && question.hint.includes('lalu sesuaikan selisihnya')) {
        return question.hint.replace('Trik: ', 'Trick: ').replace('lalu sesuaikan selisihnya', 'then adjust difference');
      }
      if (question.hint.startsWith('Cari angka yang bila dikali ')) {
        return question.hint.replace('Cari angka yang bila dikali ', 'Find number that multiplied by ').replace(' menghasilkan ', ' gives ');
      }
    } else {
      if (question.hint.startsWith('Subtract ') && question.hint.includes(' from ')) {
        const parts = question.hint.replace('Subtract ', '').split(' from ');
        if (parts.length === 2) return `Kurangkan ${parts[1].trim()} dengan ${parts[0].trim()}`;
      }
      if (question.hint.startsWith('Add ') && question.hint.includes(' and ')) {
        const parts = question.hint.replace('Add ', '').split(' and ');
        if (parts.length === 2) return `Jumlahkan ${parts[0].trim()} dan ${parts[1].trim()}`;
      }
      if (question.hint.includes(' minus ')) {
        const parts = question.hint.split(' minus ');
        if (parts.length === 2) return `${parts[0].trim()} kurangi ${parts[1].trim()}`;
      }
    }
    return question.hint;
  }

  // Dynamic fallback
  if (question.operation === '+') {
    return isEn ? `Add ${question.num1} and ${question.num2}` : `Jumlahkan ${question.num1} dan ${question.num2}`;
  }
  if (question.operation === '-') {
    return isEn ? `Subtract ${question.num2} from ${question.num1}` : `Kurangkan ${question.num1} dengan ${question.num2}`;
  }
  if (question.operation === '×') {
    return isEn ? `Multiply ${question.num1} by ${question.num2}` : `Kalikan ${question.num1} dengan ${question.num2}`;
  }
  if (question.operation === '÷') {
    return isEn ? `Divide ${question.num1} by ${question.num2}` : `Bagi ${question.num1} dengan ${question.num2}`;
  }

  return '';
}

export function getLevelFocusPresets(level: DifficultyLevel, maxLimit?: number | null): number[] {
  const cfg = getLevelMaxConfig(level);
  const ceiling = typeof maxLimit === 'number' && maxLimit >= 5
    ? Math.min(Math.floor(maxLimit), cfg.hardCap)
    : cfg.defaultMax;

  let basePresets: number[] = [];
  switch (level) {
    case 'sd_awal':
      basePresets = [2, 3, 4, 5, 6, 7, 8, 9, 10];
      break;
    case 'sd_lanjut':
      basePresets = [3, 4, 6, 7, 8, 9, 11, 12, 15, 20];
      break;
    case 'smp':
      basePresets = [6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 25];
      break;
    case 'sma_pro':
    default:
      basePresets = [7, 11, 12, 13, 14, 15, 17, 19, 23, 25, 50];
      break;
  }
  const filtered = basePresets.filter(n => n < ceiling);
  return filtered.length > 0 ? filtered : [2, 3, 4, 5].filter(n => n < ceiling);
}

// Module-level history to prevent identical back-to-back questions
// Exact match is suppressed (e.g. 1 x 7 then 1 x 7 is avoided),
// but commutative pairs (e.g. 1 x 7 then 7 x 1) remain allowed as requested!
let recentQuestionKeys: string[] = [];
const MAX_RECENT_HISTORY = 8;
let lastFocusFactor: number | null = null;

export function clearQuestionHistory(): void {
  recentQuestionKeys = [];
  lastFocusFactor = null;
}

export function generateQuestion(
  level: DifficultyLevel = 'sd_lanjut',
  forcedOperation?: string | MathOperation | MathOperation[],
  lang: Language = 'id',
  maxNumber?: number | null,
  focusNumber?: number | null
): Question {
  let attempts = 0;
  let chosenCandidate: Question | null = null;

  while (attempts < 15) {
    const candidate = generateRawQuestion(level, forcedOperation, lang, maxNumber, focusNumber);
    const key = candidate.operation === 'powers' 
      ? `${candidate.num1}²` 
      : `${candidate.num1} ${candidate.operation} ${candidate.num2}`;

    // If not in recent history, accept it!
    if (!recentQuestionKeys.includes(key)) {
      recentQuestionKeys.push(key);
      if (recentQuestionKeys.length > MAX_RECENT_HISTORY) {
        recentQuestionKeys.shift();
      }
      return candidate;
    }

    chosenCandidate = candidate;
    attempts++;
  }

  // Graceful fallback if pool is too tight (e.g. extreme low limits)
  const fallback = chosenCandidate || generateRawQuestion(level, forcedOperation, lang, maxNumber, focusNumber);
  const fallbackKey = fallback.operation === 'powers' 
    ? `${fallback.num1}²` 
    : `${fallback.num1} ${fallback.operation} ${fallback.num2}`;
  recentQuestionKeys.push(fallbackKey);
  if (recentQuestionKeys.length > MAX_RECENT_HISTORY) {
    recentQuestionKeys.shift();
  }
  return fallback;
}

function generateRawQuestion(
  level: DifficultyLevel = 'sd_lanjut',
  forcedOperation?: string | MathOperation | MathOperation[],
  lang: Language = 'id',
  maxNumber?: number | null,
  focusNumber?: number | null
): Question {
  const isEn = lang === 'en';

  // Normalize allowed operations
  let allowedOps: MathOperation[] = [];

  if (Array.isArray(forcedOperation)) {
    for (const item of forcedOperation) {
      if (item === '+' || item === '-' || item === '×' || item === '÷' || item === 'powers') {
        allowedOps.push(item);
      }
    }
  } else if (typeof forcedOperation === 'string') {
    if (forcedOperation === 'multiplication' || forcedOperation === 'times' || forcedOperation === '×' || forcedOperation === '*') {
      allowedOps = ['×'];
    } else if (forcedOperation === 'division' || forcedOperation === 'divide' || forcedOperation === '÷' || forcedOperation === '/' || forcedOperation === ':') {
      allowedOps = ['÷'];
    } else if (forcedOperation === 'addition' || forcedOperation === 'plus' || forcedOperation === '+') {
      allowedOps = ['+'];
    } else if (forcedOperation === 'subtraction' || forcedOperation === 'minus' || forcedOperation === '-') {
      allowedOps = ['-'];
    } else if (forcedOperation === 'powers') {
      allowedOps = ['powers'];
    }
  }

  if (allowedOps.length === 0) {
    allowedOps = ['+', '-', '×', '÷'];
  }

  // Powers only allowed for SMP and SMA_PRO; for SD fallback to elementary operations
  if (level === 'sd_awal' || level === 'sd_lanjut') {
    allowedOps = allowedOps.filter(o => o !== 'powers');
    if (allowedOps.length === 0) allowedOps = ['+', '-', '×', '÷'];
  }

  const op: MathOperation = allowedOps[Math.floor(Math.random() * allowedOps.length)];

  let num1 = 1;
  let num2 = 1;
  let correctAnswer = 0;
  let hintId = '';
  let hintEn = '';

  const levelConfig = getLevelMaxConfig(level, lang);

  const ceiling = typeof maxNumber === 'number' && maxNumber >= 5
    ? Math.min(Math.floor(maxNumber), levelConfig.hardCap)
    : levelConfig.defaultMax;

  // Maximum number that options can ever show (hard ceiling for options)
  const optionMaxLimit = level === 'sd_awal' ? Math.min(ceiling, 50) : ceiling;

  // 1. IF FOCUS NUMBER IS SPECIFIED (Focus on learning a specific number like 7s, 9s, etc.)
  if (typeof focusNumber === 'number' && focusNumber >= 1) {
    const rawFocus = Math.floor(focusNumber);
    // fn is the chosen focus number (e.g. 7)
    const fn = Math.max(1, rawFocus);

    if (op === '+') {
      let minOther = 1;
      let maxOther = 15;
      if (level === 'sd_awal') {
        minOther = 1;
        maxOther = 15;
      } else if (level === 'sd_lanjut') {
        minOther = 3;
        maxOther = 50;
      } else if (level === 'smp') {
        minOther = 5;
        maxOther = 100;
      } else {
        minOther = 10;
        maxOther = 250;
      }

      let other = Math.floor(Math.random() * (maxOther - minOther + 1)) + minOther;
      if (other === lastFocusFactor && maxOther > minOther) {
        other = ((other - minOther + 1) % (maxOther - minOther + 1)) + minOther;
      }
      lastFocusFactor = other;

      if (Math.random() > 0.5) {
        num1 = fn;
        num2 = other;
      } else {
        num1 = other;
        num2 = fn;
      }
      correctAnswer = num1 + num2;
      hintId = `Jumlahkan ${num1} dan ${num2}`;
      hintEn = `Add ${num1} and ${num2}`;
    } else if (op === '-') {
      let minOther = 1;
      let maxOther = 15;
      if (level === 'sd_awal') {
        minOther = 1;
        maxOther = 15;
      } else if (level === 'sd_lanjut') {
        minOther = 3;
        maxOther = 50;
      } else if (level === 'smp') {
        minOther = 5;
        maxOther = 100;
      } else {
        minOther = 10;
        maxOther = 250;
      }

      let other = Math.floor(Math.random() * (maxOther - minOther + 1)) + minOther;
      if (other === lastFocusFactor && maxOther > minOther) {
        other = ((other - minOther + 1) % (maxOther - minOther + 1)) + minOther;
      }
      lastFocusFactor = other;

      if (Math.random() > 0.25 || fn < 4) {
        num1 = fn + other;
        num2 = fn;
        correctAnswer = other;
      } else {
        const smaller = Math.floor(Math.random() * (fn - 1)) + 1;
        num1 = fn;
        num2 = smaller;
        correctAnswer = fn - smaller;
      }
      hintId = `Kurangkan ${num1} dengan ${num2}`;
      hintEn = `Subtract ${num2} from ${num1}`;
    } else if (op === '×') {
      // Multiplication table for fn:
      // For sd_awal: rich factors 1 to 10 (products 1x7 up to 10x7 = 70; no hundreds)
      // For sd_lanjut: factors 1 to 12
      // For smp: factors 2 to 20
      // For sma_pro: factors 2 to 25
      let minFactor = 1;
      let maxFactor = 10;
      if (level === 'sd_awal') {
        minFactor = 1;
        maxFactor = 10;
      } else if (level === 'sd_lanjut') {
        minFactor = 1;
        maxFactor = 12;
      } else if (level === 'smp') {
        minFactor = 2;
        maxFactor = 20;
      } else {
        minFactor = 2;
        maxFactor = 25;
      }

      if (typeof maxNumber === 'number' && maxNumber > 50) {
        maxFactor = Math.max(maxFactor, Math.min(30, Math.floor(maxNumber / fn)));
      }

      let factor = Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;
      if (factor === lastFocusFactor && maxFactor > minFactor) {
        factor = ((factor - minFactor + 1) % (maxFactor - minFactor + 1)) + minFactor;
      }
      lastFocusFactor = factor;

      if (Math.random() > 0.5) {
        num1 = fn;
        num2 = factor;
      } else {
        num1 = factor;
        num2 = fn;
      }
      correctAnswer = num1 * num2;
      hintId = `Tabel perkalian ${fn}: ${num1} dikali ${num2} = ${correctAnswer}`;
      hintEn = `Multiplication table for ${fn}: ${num1} times ${num2} = ${correctAnswer}`;
    } else if (op === '÷') {
      let minFactor = 1;
      let maxFactor = 10;
      if (level === 'sd_awal') {
        minFactor = 1;
        maxFactor = 10;
      } else if (level === 'sd_lanjut') {
        minFactor = 1;
        maxFactor = 12;
      } else if (level === 'smp') {
        minFactor = 2;
        maxFactor = 20;
      } else {
        minFactor = 2;
        maxFactor = 25;
      }

      let factor = Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;
      if (factor === lastFocusFactor && maxFactor > minFactor) {
        factor = ((factor - minFactor + 1) % (maxFactor - minFactor + 1)) + minFactor;
      }
      lastFocusFactor = factor;

      num1 = fn * factor;
      if (Math.random() > 0.3 || factor === fn) {
        num2 = fn;
        correctAnswer = factor;
      } else {
        num2 = factor;
        correctAnswer = fn;
      }
      hintId = `Berapa ${num1} dibagi ${num2}? Karena ${num2} × ${correctAnswer} = ${num1}`;
      hintEn = `What is ${num1} divided by ${num2}? Because ${num2} × ${correctAnswer} = ${num1}`;
    } else {
      num1 = fn;
      num2 = 2;
      correctAnswer = fn * fn;
      hintId = `Kuadrat ${fn}² = ${fn} × ${fn} = ${correctAnswer}`;
      hintEn = `Square of ${fn}² = ${fn} × ${fn} = ${correctAnswer}`;
    }

    const questionText = op === 'powers' ? `${num1}² = ?` : `${num1} ${op} ${num2} = ?`;
    const effectiveOptionLimit = level === 'sd_awal'
      ? Math.max(100, correctAnswer + 15)
      : Math.max(ceiling, correctAnswer + 25);
    const options = generateOptions(correctAnswer, effectiveOptionLimit);

    return {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      questionText,
      operation: op,
      num1,
      num2,
      correctAnswer,
      options,
      hint: isEn ? hintEn : hintId,
      hintId,
      hintEn
    };
  }

  // 2. STANDARD LEVEL & CEILING-CONSTRAINED QUESTION GENERATION
  if (op === '+') {
    num1 = Math.floor(Math.random() * (ceiling - 2)) + 1;
    const maxNum2 = Math.max(1, ceiling - num1);
    num2 = Math.floor(Math.random() * maxNum2) + 1;
    correctAnswer = num1 + num2;
    hintId = `Jumlahkan ${num1} dan ${num2}`;
    hintEn = `Add ${num1} and ${num2}`;
  } else if (op === '-') {
    num1 = Math.floor(Math.random() * (ceiling - 1)) + 2;
    num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    correctAnswer = num1 - num2;
    hintId = `Kurangkan ${num1} dengan ${num2}`;
    hintEn = `Subtract ${num2} from ${num1}`;
  } else if (op === '×') {
    if (level === 'sd_awal') {
      // SD 1-3: Perkalian dasar tabel 2 s/d 9 (hasil maks 81, tidak ada ratusan)
      num1 = Math.floor(Math.random() * 8) + 2;
      num2 = Math.floor(Math.random() * 8) + 2;
    } else if (ceiling <= 15) {
      num1 = Math.floor(Math.random() * 3) + 2;
      const maxNum2 = Math.max(1, Math.floor(ceiling / num1));
      num2 = Math.floor(Math.random() * maxNum2) + 1;
    } else {
      const maxFactor1 = Math.max(2, Math.floor(Math.sqrt(ceiling) * 1.5));
      num1 = Math.floor(Math.random() * (maxFactor1 - 1)) + 2;
      const maxFactor2 = Math.max(1, Math.floor(ceiling / num1));
      num2 = Math.floor(Math.random() * (maxFactor2 - 1)) + 2;
    }
    correctAnswer = num1 * num2;
    hintId = `Perkalian: ${num1} dikali ${num2}`;
    hintEn = `Multiplication: ${num1} times ${num2}`;
  } else if (op === '÷') {
    if (level === 'sd_awal') {
      // SD 1-3: Pembagian dasar ramah anak tanpa sisa (pembagi 2-9, hasil 2-9, hasil bagi tanpa ratusan)
      const divisor = Math.floor(Math.random() * 8) + 2;
      const quotient = Math.floor(Math.random() * 8) + 2;
      num1 = divisor * quotient;
      num2 = divisor;
      correctAnswer = quotient;
    } else {
      const maxDivisor = Math.min(15, Math.max(2, Math.floor(Math.sqrt(ceiling) * 1.4)));
      const divisor = Math.floor(Math.random() * (maxDivisor - 1)) + 2;
      const maxQuotient = Math.max(2, Math.floor(ceiling / divisor));
      const quotient = Math.floor(Math.random() * (maxQuotient - 1)) + 2;
      num1 = divisor * quotient;
      num2 = divisor;
      correctAnswer = quotient;
    }
    hintId = `Berapa ${num1} dibagi ${num2}?`;
    hintEn = `What is ${num1} divided by ${num2}?`;
  } else {
    // powers (SMP and SMA Pro)
    const maxBase = Math.max(2, Math.floor(Math.sqrt(ceiling)));
    num1 = Math.floor(Math.random() * (maxBase - 1)) + 2;
    num2 = 2;
    correctAnswer = num1 * num1;
    hintId = `Kuadrat ${num1}² = ${num1} × ${num1}`;
    hintEn = `Square of ${num1}² = ${num1} × ${num1}`;
    return {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      questionText: `${num1}² = ?`,
      operation: 'powers',
      num1,
      num2,
      correctAnswer,
      options: generateOptions(correctAnswer, optionMaxLimit),
      hint: isEn ? hintEn : hintId,
      hintId,
      hintEn
    };
  }

  const questionText = `${num1} ${op} ${num2} = ?`;
  const options = generateOptions(correctAnswer, optionMaxLimit);

  return {
    id: 'q_' + Math.random().toString(36).substring(2, 9),
    questionText,
    operation: op,
    num1,
    num2,
    correctAnswer,
    options,
    hint: isEn ? hintEn : hintId,
    hintId,
    hintEn
  };
}

function generateOptions(correct: number, maxLimit?: number | null): number[] {
  const optionsSet = new Set<number>([correct]);

  let spread = Math.max(2, Math.floor(Math.abs(correct) * 0.15));

  let attempts = 0;
  while (optionsSet.size < 4 && attempts < 50) {
    attempts++;
    const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1) * Math.max(1, Math.floor(spread / 2));
    const fake = correct + delta;
    if (fake >= 0 && fake !== correct) {
      if (!maxLimit || fake <= maxLimit) {
        optionsSet.add(fake);
      }
    }
  }

  let fallbackDelta = 1;
  while (optionsSet.size < 4 && fallbackDelta < 50) {
    if (correct - fallbackDelta >= 0) optionsSet.add(correct - fallbackDelta);
    if (optionsSet.size < 4) {
      const candidate = correct + fallbackDelta;
      if (!maxLimit || candidate <= maxLimit) {
        optionsSet.add(candidate);
      } else if (correct - fallbackDelta * 2 >= 0) {
        optionsSet.add(correct - fallbackDelta * 2);
      }
    }
    fallbackDelta++;
  }

  let filler = 0;
  while (optionsSet.size < 4) {
    filler++;
    if (!optionsSet.has(filler)) {
      if (!maxLimit || filler <= maxLimit) {
        optionsSet.add(filler);
      }
    }
  }

  const optionsArr = Array.from(optionsSet);
  return optionsArr.sort(() => Math.random() - 0.5);
}

