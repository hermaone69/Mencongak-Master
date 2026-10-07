import { DifficultyLevel, MathOperation, Question, Language } from '../types';

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
  let hint = '';

  switch (level) {
    case 'sd_awal': // Kelas 1-3 SD (1 to 20 range)
      if (op === '+') {
        num1 = Math.floor(Math.random() * 15) + 3;
        num2 = Math.floor(Math.random() * 12) + 2;
        correctAnswer = num1 + num2;
        hint = isEn ? `Add ${num1} and ${num2}` : `Jumlahkan ${num1} dan ${num2}`;
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 18) + 6;
        num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
        correctAnswer = num1 - num2;
        hint = isEn ? `${num1} minus ${num2}` : `${num1} kurangi ${num2}`;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * 5) + 2;
        correctAnswer = num1 * num2;
        hint = isEn ? `Basic multiplication: ${num1} times ${num2}` : `Perkalian dasar: ${num1} dikali ${num2}`;
      } else {
        // Division
        const divisor = Math.floor(Math.random() * 5) + 2;
        const quotient = Math.floor(Math.random() * 5) + 2;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
        hint = isEn ? `What is ${num1} divided by ${num2}?` : `Berapa ${num1} dibagi ${num2}?`;
      }
      break;

    case 'sd_lanjut': // Kelas 4-6 SD
      if (op === '+') {
        num1 = Math.floor(Math.random() * 70) + 15;
        num2 = Math.floor(Math.random() * 60) + 15;
        correctAnswer = num1 + num2;
        hint = isEn 
          ? `Add tens (${Math.floor(num1/10)*10} + ${Math.floor(num2/10)*10}) then units`
          : `Jumlahkan puluhan (${Math.floor(num1/10)*10} + ${Math.floor(num2/10)*10}) lalu satuannya`;
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 80) + 25;
        num2 = Math.floor(Math.random() * (num1 - 10)) + 10;
        correctAnswer = num1 - num2;
        hint = isEn ? `Subtract ${num2} from ${num1}` : `Kurangkan ${num1} dengan ${num2}`;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 14) + 6;
        num2 = Math.floor(Math.random() * 11) + 3;
        correctAnswer = num1 * num2;
        hint = isEn 
          ? `Trick: ${num1} × 10 = ${num1*10}, then adjust difference`
          : `Trik: ${num1} × 10 = ${num1*10}, lalu sesuaikan selisihnya`;
      } else {
        const divisor = Math.floor(Math.random() * 9) + 3;
        const quotient = Math.floor(Math.random() * 12) + 3;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
        hint = isEn 
          ? `Find number that multiplied by ${num2} gives ${num1}`
          : `Cari angka yang bila dikali ${num2} menghasilkan ${num1}`;
      }
      break;

    case 'smp': // SMP
      if (Math.random() > 0.8 || op === 'powers') {
        const base = Math.floor(Math.random() * 20) + 6;
        num1 = base;
        num2 = 2;
        correctAnswer = base * base;
        hint = isEn ? `Square of ${base}² = ${base} × ${base}` : `Kuadrat ${base}² = ${base} × ${base}`;
        return {
          id: 'q_' + Math.random().toString(36).substring(2, 9),
          questionText: `${base}² = ?`,
          operation: 'powers',
          num1: base,
          num2: 2,
          correctAnswer,
          options: generateOptions(correctAnswer),
          hint
        };
      }

      if (op === '+') {
        num1 = Math.floor(Math.random() * 450) + 120;
        num2 = Math.floor(Math.random() * 450) + 80;
        correctAnswer = num1 + num2;
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 600) + 250;
        num2 = Math.floor(Math.random() * (num1 - 50)) + 80;
        correctAnswer = num1 - num2;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 25) + 11;
        num2 = Math.floor(Math.random() * 15) + 8;
        correctAnswer = num1 * num2;
      } else {
        const divisor = Math.floor(Math.random() * 15) + 4;
        const quotient = Math.floor(Math.random() * 25) + 5;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
      }
      break;

    case 'sma_pro': // Master Level
      if (Math.random() > 0.6) {
        const trickType = Math.floor(Math.random() * 3);
        if (trickType === 0) {
          const tens = Math.floor(Math.random() * 8) + 1;
          const val = tens * 10 + 5;
          correctAnswer = val * val;
          return {
            id: 'q_' + Math.random().toString(36).substring(2, 9),
            questionText: `${val} × ${val} = ?`,
            operation: 'powers',
            num1: val,
            num2: val,
            correctAnswer,
            options: generateOptions(correctAnswer),
            hint: isEn 
              ? `5-ending square trick: ${tens} × ${tens+1} = ${tens*(tens+1)}, attach 25 at the end!`
              : `Trik kuadrat akhiran 5: ${tens} × ${tens+1} = ${tens*(tens+1)}, lalu tempel 25 di belakang!`,
            trickExplanation: isEn
              ? `Formula: [n × (n+1)] [25] -> ${tens} × ${tens+1} = ${tens*(tens+1)} | 25 -> ${correctAnswer}`
              : `Rumus: [n × (n+1)] [25] -> ${tens} × ${tens+1} = ${tens*(tens+1)} | 25 -> ${correctAnswer}`
          };
        } else if (trickType === 1) {
          const multiplier = Math.floor(Math.random() * 80) + 14;
          correctAnswer = 11 * multiplier;
          return {
            id: 'q_' + Math.random().toString(36).substring(2, 9),
            questionText: `11 × ${multiplier} = ?`,
            operation: '×',
            num1: 11,
            num2: multiplier,
            correctAnswer,
            options: generateOptions(correctAnswer),
            hint: isEn 
              ? `11s trick: Insert digit sum in the middle of ${multiplier}`
              : `Trik 11: Selipkan jumlah digit di tengah angka ${multiplier}`,
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
      } else if (op === '-') {
        num1 = Math.floor(Math.random() * 2000) + 800;
        num2 = Math.floor(Math.random() * 1200) + 200;
        correctAnswer = num1 - num2;
      } else if (op === '×') {
        num1 = Math.floor(Math.random() * 45) + 15;
        num2 = Math.floor(Math.random() * 25) + 12;
        correctAnswer = num1 * num2;
      } else {
        const divisor = Math.floor(Math.random() * 25) + 6;
        const quotient = Math.floor(Math.random() * 40) + 12;
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
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
    hint
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
