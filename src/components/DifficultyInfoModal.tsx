import React from 'react';
import { X, HelpCircle, GraduationCap, Zap, Award, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';

interface DifficultyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DifficultyInfoModal: React.FC<DifficultyInfoModalProps> = ({ isOpen, onClose }) => {
  const { language } = useGame();

  if (!isOpen) return null;

  const isEn = language === 'en';

  const levels = [
    {
      id: 'sd_awal',
      name: isEn ? 'Grades 1–3' : 'SD Kelas 1–3',
      badge: isEn ? 'Beginner' : 'Pemula Dasar',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: '🌱',
      range: isEn ? 'Single & double digits (1–20)' : 'Angka Satuan & Belasan (1–20)',
      operations: isEn ? 'Basic addition & subtraction, 1–8 tables, basic division' : 'Tambah & kurang sederhana, perkalian tabel 1–8, pembagian bulat dasar',
      examples: ['8 + 7 = 15', '16 − 9 = 7', '6 × 4 = 24', '18 ÷ 3 = 6'],
      target: isEn ? 'Builds counting foundations, mental fluency, and confidence for young learners.' : 'Membangun pondasi berhitung, kelancaran berpikir cepat, dan rasa percaya diri anak usia dini.'
    },
    {
      id: 'sd_lanjut',
      name: isEn ? 'Grades 4–6' : 'SD Kelas 4–6',
      badge: isEn ? 'Intermediate' : 'Menengah',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: '🚀',
      range: isEn ? 'Tens & Hundreds (15–150)' : 'Puluhan s/d Ratusan (15–150)',
      operations: isEn ? '2-digit addition, teens multiplication, 2-digit integer division' : 'Penjumlahan 2 digit, perkalian belasan, pembagian 2 digit dengan hasil bulat',
      examples: ['58 + 47 = 105', '92 − 38 = 54', '14 × 8 = 112', '84 ÷ 7 = 12'],
      target: isEn ? 'Trains number decomposition (separating tens and units mentally).' : 'Melatih dekomposisi angka (memisahkan puluhan dan satuan di otak) sebelum masuk jenjang SMP.'
    },
    {
      id: 'smp',
      name: isEn ? 'Middle School' : 'SMP',
      badge: isEn ? 'Advanced' : 'Mahir',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: '⚡',
      range: isEn ? 'Hundreds (100–999) & Powers' : 'Ratusan (100–999) & Pangkat Dua',
      operations: isEn ? '3-digit operations, 2-digit × 2-digit, fast squares (6² to 25²)' : 'Operasi 3 digit, perkalian 2 digit × 2 digit, dan hitung cepat kuadrat (6² s/d 25²)',
      examples: ['340 + 280 = 620', '24 × 15 = 360', '16² = 256', '144 ÷ 12 = 12'],
      target: isEn ? 'Sharpens quick mental algebra calculation speed for academic exams.' : 'Mengasah ketajaman kalkulasi cepat aljabar dan persiapan ujian akademik sekolah.'
    },
    {
      id: 'sma_pro',
      name: isEn ? 'Pro 🏆 (High School & Olympiad)' : 'Pro 🏆 (SMA & Olimpiade)',
      badge: isEn ? 'Grandmaster' : 'Grandmaster',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: '👑',
      range: isEn ? 'Thousands + Vedic Math' : 'Ribuan + Trik Vedic Matematika',
      operations: isEn ? '4-digit calculations, instant 5-ending squares, Vedic tricks' : 'Kalkulasi 4 digit, kuadrat kilat akhiran 5, trik angka 11, dan perkalian 2 digit besar',
      examples: ['1450 + 1280 = 2730', '75 × 75 = 5625', '11 × 84 = 924', '38 × 25 = 950'],
      target: isEn ? 'Achieves sub-2-second mental calculation speed matching international competition standards.' : 'Mencapai kemampuan mental arithmetic kilat (< 2 detik) setara standar kompetisi sempoa & olimpiade internasional.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-base font-black">
              ℹ️
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {isEn ? 'Difficulty Levels Guide' : 'Panduan Tingkat Kesulitan'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isEn ? 'Select the level best suited for the player\'s skill' : 'Pilih jenjang yang paling sesuai dengan kemampuan anak'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lvl.icon}</span>
                  <h4 className="font-black text-sm text-white">{lvl.name}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvl.badgeColor}`}>
                  {lvl.badge}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <span className="font-semibold text-amber-400">{isEn ? 'Scope: ' : 'Cakupan: '}</span>
                {lvl.range} · {lvl.operations}
              </div>

              {/* Real Examples Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {lvl.examples.map((ex, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-900 text-slate-300 font-mono-math font-semibold px-2 py-0.5 rounded-md border border-slate-800"
                  >
                    {ex}
                  </span>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 italic pt-0.5">
                💡 {lvl.target}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {isEn ? 'Difficulty level can be adjusted anytime on the main menu.' : 'Tingkat kesulitan dapat diubah kapan saja di menu utama.'}
          </span>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer"
          >
            {isEn ? 'Got it ✓' : 'Mengerti ✓'}
          </button>
        </div>
      </div>
    </div>
  );
};
