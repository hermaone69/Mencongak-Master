import { DifficultyLevel, MathOperation, Question, Language } from '../types';

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

export function generateQuestion(
  level: DifficultyLevel = 'sd_lanjut',
  forcedOperation?: string,
  lang: Language = 'id'
): Question {
  const isEn = lang === 'en';

  // Normalize operation symbols
  let requestedOp: MathOperation | undefined;
  if (forcedOperation) {
    if (forcedOperation === 'multiplication' || forcedOperation === 'times' || forcedOperation === '×' || forcedOperation === '*') {
      requestedOp = '×';
    } else if (forcedOperation === 'division' || forcedOperation === 'divide' || forcedOperation === '÷' || forcedOperation === '/' || forcedOperation === ':') {
      requestedOp = '÷';
    } else if (forcedOperation === 'addition' || forcedOperation === 'plus' || forcedOperation === '+') {
      requestedOp = '+';
    } else if (forcedOperation === 'subtraction' || forcedOperation === 'minus' || forcedOperation === '-') {
      requestedOp = '-';
    } else if (forcedOperation === 'powers') {
      requestedOp = 'powers';
    }
  }

  const operations: MathOperation[] = ['+', '-', '×', '÷'];
  const op: MathOperation = requestedOp || operations[Math.floor(Math.random() * operations.length)];

  let num1 = 1;
  let num2 = 1;
  let correctAnswer = 0;
  let hintId = '';
  let hintEn = '';

  switch (level) {
    case 'sd_awal': // Kelas 1-3 SD (1 to 20 range)
      if (op === '+') {
        num1 = Math.floor(Math.random() * 15) + 3;
        num2 = Math.floor(Math.random() * 12) + 2;
        correctAnswer = num1 + num2;
        hintId = `Jumlahkan ${num1} dan ${num2}`;
        hintEn = `Add ${num1} and ${num2}`;
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 18) + 6;
        num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
        correctAnswer = num1 - num2;
        hintId = `${num1} kurangi ${num2}`;
        hintEn = `${num1} minus ${num2}`;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * 5) + 2;
        correctAnswer = num1 * num2;
        hintId = `Perkalian dasar: ${num1} dikali ${num2}`;
        hintEn = `Basic multiplication: ${num1} times ${num2}`;
      } else {
        // Division
        const divisor = Math.floor(Math.random() * 5) + 2;
        const quotient = Math.floor(Math.random() * 5) + 2;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
        hintId = `Berapa ${num1} dibagi ${num2}?`;
        hintEn = `What is ${num1} divided by ${num2}?`;
      }
      break;

    case 'sd_lanjut': // Kelas 4-6 SD
      if (op === '+') {
        num1 = Math.floor(Math.random() * 70) + 15;
        num2 = Math.floor(Math.random() * 60) + 15;
        correctAnswer = num1 + num2;
        hintId = `Jumlahkan puluhan (${Math.floor(num1/10)*10} + ${Math.floor(num2/10)*10}) lalu satuannya`;
        hintEn = `Add tens (${Math.floor(num1/10)*10} + ${Math.floor(num2/10)*10}) then units`;
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 80) + 25;
        num2 = Math.floor(Math.random() * (num1 - 10)) + 10;
        correctAnswer = num1 - num2;
        hintId = `Kurangkan ${num1} dengan ${num2}`;
        hintEn = `Subtract ${num2} from ${num1}`;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 14) + 6;
        num2 = Math.floor(Math.random() * 11) + 3;
        correctAnswer = num1 * num2;
        hintId = `Trik: ${num1} × 10 = ${num1*10}, lalu sesuaikan selisihnya`;
        hintEn = `Trick: ${num1} × 10 = ${num1*10}, then adjust difference`;
      } else {
        const divisor = Math.floor(Math.random() * 9) + 3;
        const quotient = Math.floor(Math.random() * 12) + 3;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
        hintId = `Cari angka yang bila dikali ${num2} menghasilkan ${num1}`;
        hintEn = `Find number that multiplied by ${num2} gives ${num1}`;
      }
      break;

    case 'smp': // SMP
      if (Math.random() > 0.8 || op === 'powers') {
        const base = Math.floor(Math.random() * 20) + 6;
        num1 = base;
        num2 = 2;
        correctAnswer = base * base;
        hintId = `Kuadrat ${base}² = ${base} × ${base}`;
        hintEn = `Square of ${base}² = ${base} × ${base}`;
        return {
          id: 'q_' + Math.random().toString(36).substring(2, 9),
          questionText: `${base}² = ?`,
          operation: 'powers',
          num1: base,
          num2: 2,
          correctAnswer,
          options: generateOptions(correctAnswer),
          hint: isEn ? hintEn : hintId,
          hintId,
          hintEn
        };
      }

      if (op === '+') {
        num1 = Math.floor(Math.random() * 450) + 120;
        num2 = Math.floor(Math.random() * 450) + 80;
        correctAnswer = num1 + num2;
        hintId = `Jumlahkan ${num1} dan ${num2}`;
        hintEn = `Add ${num1} and ${num2}`;
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 600) + 250;
        num2 = Math.floor(Math.random() * (num1 - 50)) + 80;
        correctAnswer = num1 - num2;
        hintId = `Kurangkan ${num1} dengan ${num2}`;
        hintEn = `Subtract ${num2} from ${num1}`;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 25) + 11;
        num2 = Math.floor(Math.random() * 15) + 8;
        correctAnswer = num1 * num2;
        hintId = `Kalikan ${num1} dengan ${num2}`;
        hintEn = `Multiply ${num1} by ${num2}`;
      } else {
        const divisor = Math.floor(Math.random() * 15) + 4;
        const quotient = Math.floor(Math.random() * 25) + 5;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
        hintId = `Bagi ${num1} dengan ${num2}`;
        hintEn = `Divide ${num1} by ${num2}`;
      }
      break;

    case 'sma_pro': // Master Level
      if (Math.random() > 0.6) {
        const trickType = Math.floor(Math.random() * 3);
        if (trickType === 0) {
          const tens = Math.floor(Math.random() * 8) + 1;
          const val = tens * 10 + 5;
          correctAnswer = val * val;
          hintId = `Trik kuadrat akhiran 5: ${tens} × ${tens+1} = ${tens*(tens+1)}, lalu tempel 25 di belakang!`;
          hintEn = `5-ending square trick: ${tens} × ${tens+1} = ${tens*(tens+1)}, attach 25 at the end!`;
          return {
            id: 'q_' + Math.random().toString(36).substring(2, 9),
            questionText: `${val} × ${val} = ?`,
            operation: 'powers',
            num1: val,
            num2: val,
            correctAnswer,
            options: generateOptions(correctAnswer),
            hint: isEn ? hintEn : hintId,
            hintId,
            hintEn,
            trickExplanation: isEn
              ? `Formula: [n × (n+1)] [25] -> ${tens} × ${tens+1} = ${tens*(tens+1)} | 25 -> ${correctAnswer}`
              : `Rumus: [n × (n+1)] [25] -> ${tens} × ${tens+1} = ${tens*(tens+1)} | 25 -> ${correctAnswer}`
          };
        } else if (trickType === 1) {
          const multiplier = Math.floor(Math.random() * 80) + 14;
          correctAnswer = 11 * multiplier;
          hintId = `Trik 11: Selipkan jumlah digit di tengah angka ${multiplier}`;
          hintEn = `11s trick: Insert digit sum in the middle of ${multiplier}`;
          return {
            id: 'q_' + Math.random().toString(36).substring(2, 9),
            questionText: `11 × ${multiplier} = ?`,
            operation: '×',
            num1: 11,
            num2: multiplier,
            correctAnswer,
            options: generateOptions(correctAnswer),
            hint: isEn ? hintEn : hintId,
            hintId,
            hintEn,
            trickExplanation: isEn
              ? `11s trick: Front & back digits separated, middle is sum of digits.`
              : `Trik 11: Digit depan dan belakang dipisah, tengahnya adalah penjumlahan digit.`
          };
        }
      }

      if (op === '+') {
        num1 = Math.floor(Math.random() * 1500) + 400;
        num2 = Math.floor(Math.random() * 1200) + 300;
        correctAnswer = num1 + num2;
        hintId = `Jumlahkan ${num1} dan ${num2}`;
        hintEn = `Add ${num1} and ${num2}`;
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 2000) + 800;
        num2 = Math.floor(Math.random() * 1200) + 200;
        correctAnswer = num1 - num2;
        hintId = `Kurangkan ${num1} dengan ${num2}`;
        hintEn = `Subtract ${num2} from ${num1}`;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 45) + 15;
        num2 = Math.floor(Math.random() * 25) + 12;
        correctAnswer = num1 * num2;
        hintId = `Kalikan ${num1} dengan ${num2}`;
        hintEn = `Multiply ${num1} by ${num2}`;
      } else {
        const divisor = Math.floor(Math.random() * 25) + 6;
        const quotient = Math.floor(Math.random() * 40) + 12;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
        hintId = `Bagi ${num1} dengan ${num2}`;
        hintEn = `Divide ${num1} by ${num2}`;
      }
      break;
  }

  const questionText = `${num1} ${op} ${num2} = ?`;
  const options = generateOptions(correctAnswer);

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

function generateOptions(correct: number): number[] {
  const optionsSet = new Set<number>([correct]);

  let spread = Math.max(2, Math.floor(Math.abs(correct) * 0.15));

  while (optionsSet.size < 4) {
    const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1) * Math.max(1, Math.floor(spread / 2));
    const fake = correct + delta;
    if (fake >= 0 && fake !== correct) {
      optionsSet.add(fake);
    }
  }

  const optionsArr = Array.from(optionsSet);
  // Shuffle options
  return optionsArr.sort(() => Math.random() - 0.5);
}

