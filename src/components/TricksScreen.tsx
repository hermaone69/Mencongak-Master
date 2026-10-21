import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Lock, CheckCircle2, ChevronRight, ArrowLeft, BookOpen, Coins } from 'lucide-react';
import { getMentalTricks } from '../utils/mentalTricks';
import { MentalTrick, Question } from '../types';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { getTranslation } from '../utils/translations';

export const TricksScreen: React.FC = () => {
  const { unlockedTricks, unlockTrickWithCoins, coins, isVip, addXP, language, themeMode } = useGame();
  const t = getTranslation(language);
  const currentTricksList = getMentalTricks(language);
  const isLight = themeMode === 'light';
  const isNeon = themeMode === 'neon';

  const [selectedTrickId, setSelectedTrickId] = useState<string | null>(null);
  const [activePracticeIndex, setActivePracticeIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);

  const selectedTrick = selectedTrickId 
    ? currentTricksList.find(t => t.id === selectedTrickId) || null 
    : null;

  const openTrick = (trick: MentalTrick) => {
    sounds.playTap();
    setSelectedTrickId(trick.id);
    setActivePracticeIndex(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setPracticeCompleted(false);
  };

  const handleUnlock = (trick: MentalTrick) => {
    sounds.playTap();
    const cost = trick.costToUnlock || 50;
    if (unlockTrickWithCoins(trick.id, cost)) {
      openTrick(trick);
    }
  };

  const handlePracticeAnswer = (option: number, question: Question) => {
    if (isAnswerCorrect !== null) return;

    setSelectedOption(option);
    const correct = option === question.correctAnswer;
    setIsAnswerCorrect(correct);

    if (correct) {
      sounds.playCorrect();
      addXP(15);

      setTimeout(() => {
        if (selectedTrick && activePracticeIndex < selectedTrick.practiceQuestions.length - 1) {
          setActivePracticeIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsAnswerCorrect(null);
        } else {
          setPracticeCompleted(true);
          sounds.playVictory();
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch {
            // safe fallback
          }
        }
      }, 1000);
    } else {
      sounds.playWrong();
      setTimeout(() => {
        setSelectedOption(null);
        setIsAnswerCorrect(null);
      }, 1200);
    }
  };

  // Detailed Trick Lesson View
  if (selectedTrick) {
    const currentPracticeQ = selectedTrick.practiceQuestions[activePracticeIndex];

    return (
      <div className={`flex-1 flex flex-col justify-between p-3.5 ${
        isLight ? 'bg-slate-50 text-slate-900' : isNeon ? 'bg-[#021411] text-emerald-100' : 'bg-slate-950 text-slate-100'
      } select-none overflow-y-auto transition-colors duration-200`}>
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                sounds.playTap();
                setSelectedTrickId(null);
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-700 hover:text-slate-950 shadow-xs'
                  : isNeon
                  ? 'bg-[#04241d] border-emerald-500/40 text-emerald-300 hover:text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className={`text-[11px] font-bold ${
              isLight
                ? 'bg-white border-2 border-amber-300 text-amber-950 shadow-xs'
                : isNeon
                ? 'bg-[#04241d] border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border border-slate-800 text-amber-400'
            } px-3 py-1 rounded-full`}>
              {selectedTrick.category}
            </span>
            <div className="w-8" />
          </div>

          <h2 className={`text-xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>
            {selectedTrick.title}
          </h2>
          <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : isNeon ? 'text-emerald-300/80' : 'text-slate-400'}`}>
            {selectedTrick.shortDesc}
          </p>

          {/* Example Box */}
          <div className={`my-3 p-3 rounded-2xl flex items-center justify-between border ${
            isLight
              ? 'bg-amber-100/70 border-2 border-amber-300 text-slate-900 shadow-sm'
              : isNeon
              ? 'bg-[#04241d] border border-emerald-500/40 text-emerald-100'
              : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30'
          }`}>
            <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : isNeon ? 'text-emerald-300' : 'text-slate-300'}`}>
              {t.exampleLabel}
            </span>
            <span className={`font-mono-math font-extrabold text-base ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
              {selectedTrick.exampleProblem}
            </span>
          </div>

          {/* Step-by-Step Breakdown Cards */}
          <div className="space-y-2.5 my-3">
            <div className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'} flex items-center gap-1`}>
              <span>{t.stepsLabel}</span>
            </div>
            {selectedTrick.steps.map(step => (
              <div
                key={step.stepNumber}
                className={`${
                  isLight ? 'bg-white border-2 border-slate-200 text-slate-900 shadow-xs' : 'bg-slate-900/90 border border-slate-800 text-slate-100'
                } rounded-2xl p-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    {step.stepNumber}
                  </div>
                  <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {step.title}
                  </h4>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'} pl-7 leading-relaxed`}>
                  {step.explanation}
                </p>
                {step.formula && (
                  <div className={`mt-2 ml-7 px-2.5 py-1 ${
                    isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold' : 'bg-slate-950 border border-slate-800 text-emerald-400 font-bold'
                  } rounded-lg font-mono-math text-xs inline-block`}>
                    {step.formula}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Practice Drill Area */}
          <div className={`my-4 ${
            isLight ? 'bg-white border-2 border-amber-300 shadow-md' : 'bg-slate-900 border border-slate-800'
          } rounded-2xl p-3.5`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'} flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t.practiceDrill} ({activePracticeIndex + 1}/{selectedTrick.practiceQuestions.length})
              </span>
            </div>

            {practiceCompleted ? (
              <div className="text-center py-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-2xl mb-2 font-black">
                  ✓
                </div>
                <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t.trickMasteredTitle}
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-0.5`}>
                  {t.trickMasteredDesc}
                </p>
              </div>
            ) : (
              currentPracticeQ && (
                <div>
                  <div className="text-center py-2">
                    <div className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'} font-mono-math`}>
                      {currentPracticeQ.questionText}
                    </div>
                    {currentPracticeQ.hint && (
                      <p className={`text-[11px] ${isLight ? 'text-amber-800 font-medium' : 'text-slate-400'} mt-1`}>
                        💡 {currentPracticeQ.hint}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {currentPracticeQ.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      return (
                        <button
                          key={idx}
                          disabled={isAnswerCorrect !== null}
                          onClick={() => handlePracticeAnswer(opt, currentPracticeQ)}
                          className={`h-12 rounded-xl font-mono-math font-bold text-lg flex items-center justify-center transition-all cursor-pointer ${
                            isSelected && isAnswerCorrect === true
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                              : isSelected && isAnswerCorrect === false
                              ? 'bg-rose-500 text-white font-black'
                              : isLight
                              ? 'bg-slate-50 hover:bg-amber-100 border-2 border-slate-200 text-slate-900 hover:border-amber-400'
                              : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <button
          onClick={() => setSelectedTrickId(null)}
          className={`w-full h-11 rounded-xl ${
            isLight ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          } text-xs cursor-pointer mt-2`}
        >
          {t.finishTrickButton}
        </button>
      </div>
    );
  }

  // Tricks Catalog View
  return (
    <div className={`flex-1 flex flex-col justify-between p-3.5 ${
      isLight ? 'bg-slate-50 text-slate-900' : isNeon ? 'bg-[#021411] text-emerald-100' : 'bg-slate-950 text-slate-100'
    } select-none overflow-y-auto transition-colors duration-200`}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-black tracking-wide ${
            isLight ? 'text-amber-800' : isNeon ? 'text-emerald-400' : 'text-amber-500'
          }`}>
            {t.tricksHeaderBadge}
          </span>
          <span className={`text-[10px] font-bold ${
            isLight ? 'text-slate-700' : isNeon ? 'text-emerald-300' : 'text-slate-400'
          }`}>
            {unlockedTricks.length} / {currentTricksList.length} {language === 'id' ? 'Terbuka' : 'Unlocked'}
          </span>
        </div>
        <h1 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'} font-display`}>
          {t.tricksTitle}
        </h1>
        <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : isNeon ? 'text-emerald-300/80 font-medium' : 'text-slate-400'} mt-0.5`}>
          {t.tricksSubtitle}
        </p>
      </div>

      <div className="space-y-2.5 my-3">
        {currentTricksList.map(trick => {
          const isUnlocked = unlockedTricks.includes(trick.id) || isVip;
          const cost = trick.costToUnlock || 50;
          const canAfford = coins >= cost;

          return (
            <div
              key={trick.id}
              className={`rounded-2xl border p-3.5 transition-all ${
                isUnlocked
                  ? isLight
                    ? 'bg-white border-2 border-slate-200 shadow-sm hover:border-amber-400 cursor-pointer text-slate-900'
                    : isNeon
                    ? 'bg-[#04241d] border border-emerald-500/40 hover:border-emerald-400 shadow-md cursor-pointer text-emerald-100'
                    : 'bg-slate-900/90 border-slate-800 hover:border-amber-400/50 cursor-pointer text-slate-100'
                  : isLight
                  ? 'bg-slate-100/90 border-2 border-slate-200 text-slate-700 opacity-90'
                  : isNeon
                  ? 'bg-[#021411]/80 border border-emerald-500/20 text-emerald-400/60 opacity-85'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black ${
                      isLight
                        ? 'text-amber-950 bg-amber-100 border border-amber-300'
                        : isNeon
                        ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-400/50'
                        : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                    } px-2 py-0.5 rounded`}>
                      {trick.category}
                    </span>
                    {isUnlocked && (
                      <span className={`text-[10px] ${isLight ? 'text-emerald-700' : 'text-emerald-400'} flex items-center gap-0.5 font-black`}>
                        <CheckCircle2 className="w-3 h-3" /> {t.unlockedBadge}
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} mt-1`}>
                    {trick.title}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : isNeon ? 'text-emerald-300/80 font-medium' : 'text-slate-400'} mt-0.5 line-clamp-2`}>
                    {trick.shortDesc}
                  </p>
                  <div className={`mt-2 text-[11px] font-mono-math ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t.exampleLabel} <span className={`${isLight ? 'text-amber-800 font-black' : isNeon ? 'text-emerald-300 font-black' : 'text-amber-300 font-bold'}`}>{trick.exampleProblem}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isUnlocked ? (
                    <button
                      onClick={() => openTrick(trick)}
                      className={`px-3 py-2 rounded-xl ${
                        isLight
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-300 font-black'
                          : isNeon
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold'
                      } text-xs flex items-center gap-1 cursor-pointer shadow-xs`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t.learnButton}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlock(trick)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-extrabold'
                          : isLight
                          ? 'bg-slate-200 text-slate-600 border border-slate-300'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{cost} {t.coins}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`border rounded-2xl p-3 text-center ${
        isLight
          ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
          : isNeon
          ? 'bg-[#04241d]/80 border-emerald-500/30 text-emerald-300'
          : 'bg-slate-900/60 border-slate-800 text-slate-400'
      }`}>
        <p className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          🪙 {t.tricksTipBottom}
        </p>
      </div>
    </div>
  );
};
