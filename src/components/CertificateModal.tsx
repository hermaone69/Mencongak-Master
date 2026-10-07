import React, { useRef, useState } from 'react';
import { X, Award, Printer, Download, CheckCircle, Sparkles, Image } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose }) => {
  const { playerName, playerLevel, playerTitle, stats, isVip, language } = useGame();
  const certRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certNumber = `MMI/ACH/${new Date().getFullYear()}/${(stats.totalQuestionsAnswered + 1000).toString()}`;

  const handlePrint = () => {
    sounds.playTap();
    window.print();
  };

  // Generate and download as image PNG
  const handleDownloadImage = () => {
    sounds.playTap();
    setIsGeneratingImage(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
      bgGrad.addColorStop(0, '#fffbeb');
      bgGrad.addColorStop(0.5, '#ffffff');
      bgGrad.addColorStop(1, '#fef3c7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 850);

      // Gold Borders
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 1140, 790);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(45, 45, 1110, 760);

      // Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(
        language === 'id' ? 'PIAGAM PENGHARGAAN ARITMATIKA MENTAL' : 'CERTIFICATE OF ARITHMETIC ACHIEVEMENT',
        600,
        120
      );

      ctx.fillStyle = '#1e293b';
      ctx.font = '900 44px sans-serif';
      ctx.fillText(
        language === 'id' ? 'MENCONGAK MASTER INDONESIA' : 'MENTAL MATH MASTER GLOBAL',
        600,
        175
      );

      // Gold Divider Line
      ctx.fillStyle = '#b45309';
      ctx.fillRect(450, 195, 300, 4);

      // Subtitle
      ctx.font = 'italic 20px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(
        language === 'id' ? 'Piagam Penghargaan Prestasi Diberikan Kepada:' : 'This Certificate of Excellence is Presented To:',
        600,
        260
      );

      // Recipient Name
      ctx.font = '900 52px sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.fillText(playerName, 600, 340);

      // Name underline
      ctx.fillStyle = '#d97706';
      ctx.fillRect(350, 360, 500, 2);

      // Description Paragraph
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(
        language === 'id'
          ? `Atas dedikasi, ketangkasan berpikir, dan pencapaian kompetensi mencongak:`
          : `For exceptional speed, mental agility, and calculation competence:`,
        600,
        430
      );

      ctx.font = 'bold 30px sans-serif';
      ctx.fillStyle = '#92400e';
      ctx.fillText(
        `${playerTitle} · Level ${playerLevel}`,
        600,
        480
      );

      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(
        language === 'id'
          ? `dengan rekor ${stats.totalQuestionsAnswered} soal diselesaikan dan akurasi ${Math.round((stats.totalCorrect / (stats.totalQuestionsAnswered || 1)) * 100)}%`
          : `with a record of ${stats.totalQuestionsAnswered} solved questions and ${Math.round((stats.totalCorrect / (stats.totalQuestionsAnswered || 1)) * 100)}% accuracy`,
        600,
        530
      );

      // Footer - Left: Date
      ctx.textAlign = 'left';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'id' ? 'TANGGAL TERBIT' : 'ISSUE DATE', 100, 690);
      ctx.fillStyle = '#1e293b';
      ctx.fillText(issueDate, 100, 715);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(certNumber, 100, 740);

      // Footer - Center: Gold Seal Emblem
      ctx.beginPath();
      ctx.arc(600, 700, 48, 0, 2 * Math.PI);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('★', 600, 710);

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(language === 'id' ? 'RESMI' : 'VERIFIED', 600, 730);

      // Footer - Right: Signature / Evaluation Team
      ctx.textAlign = 'right';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'id' ? 'TIM EVALUATOR' : 'EVALUATION BOARD', 1100, 690);
      ctx.font = 'italic bold 22px Georgia';
      ctx.fillStyle = '#1e293b';
      ctx.fillText('Mental Math Master Team', 1100, 715);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(language === 'id' ? 'Dokumen Prestasi Digital Resmi' : 'Official Digital Achievement Record', 1100, 740);

      // Download triggered
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Certificate_${playerName.replace(/\s+/g, '_')}_MathMaster.png`;
      link.href = imageUri;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none print:p-0 print:bg-white">
      {/* Print Specific CSS to isolate Certificate Frame */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cert, #printable-cert * {
            visibility: visible;
          }
          #printable-cert {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border-width: 6px;
            background: white !important;
          }
        }
      `}</style>

      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:border-0 print:bg-transparent">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              {language === 'id' ? 'E-Sertifikat Prestasi Mencongak' : 'Mental Math Achievement E-Certificate'}
            </h3>
            {isVip && (
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                VIP GOLD PRO
              </span>
            )}
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center print:p-0">
          <div
            id="printable-cert"
            ref={certRef}
            className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-100/70 text-slate-900 p-6 sm:p-8 rounded-2xl border-4 border-amber-600/50 shadow-2xl relative flex flex-col items-center text-center font-serif"
          >
            {/* Elegant Corner Ornaments */}
            <div className="absolute top-2.5 left-3 text-amber-600 text-sm font-sans">✦</div>
            <div className="absolute top-2.5 right-3 text-amber-600 text-sm font-sans">✦</div>
            <div className="absolute bottom-2.5 left-3 text-amber-600 text-sm font-sans">✦</div>
            <div className="absolute bottom-2.5 right-3 text-amber-600 text-sm font-sans">✦</div>

            {/* Title */}
            <div className="text-[10px] sm:text-xs font-sans uppercase tracking-widest font-black text-amber-800 mb-1">
              {language === 'id' ? 'PIAGAM PENGHARGAAN ARITMATIKA MENTAL' : 'CERTIFICATE OF ARITHMETIC ACHIEVEMENT'}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
              {language === 'id' ? 'MENCONGAK MASTER INDONESIA' : 'MENTAL MATH MASTER GLOBAL'}
            </h2>
            <div className="w-20 h-0.5 bg-amber-600 my-2" />

            <p className="text-xs text-slate-600 italic mt-1 font-sans">
              {language === 'id' ? 'Piagam Penghargaan Prestasi Diberikan Kepada:' : 'This Certificate of Excellence is Presented To:'}
            </p>

            {/* Recipient Name */}
            <div className="text-xl sm:text-3xl font-black text-amber-950 my-2 border-b-2 border-amber-800/40 pb-1 px-8 font-display">
              {playerName}
            </div>

            <p className="text-xs text-slate-700 max-w-md font-sans leading-relaxed mt-1">
              {language === 'id' 
                ? `Atas dedikasi, ketangkasan berpikir, dan pencapaian kompetensi mencongak tingkat `
                : `For dedication, rapid calculation agility, and arithmetic competence rank `}
              <strong className="text-amber-900 font-bold">{playerTitle} (Level {playerLevel})</strong>
              {language === 'id' 
                ? ` dengan total ` 
                : ` with a total of `}
              <strong className="font-bold text-amber-950">{stats.totalQuestionsAnswered}</strong>
              {language === 'id' ? ` soal aritmatika diselesaikan.` : ` arithmetic questions completed.`}
            </p>

            {/* Seal & Signature Info */}
            <div className="w-full grid grid-cols-3 gap-2 items-center mt-6 pt-4 border-t border-amber-900/20 font-sans text-left">
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-bold">{language === 'id' ? 'Tanggal Terbit' : 'Issue Date'}</div>
                <div className="text-xs font-bold text-slate-800">{issueDate}</div>
                <div className="text-[8px] text-slate-400 font-mono-math mt-0.5">{certNumber}</div>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 border-2 border-amber-700 flex items-center justify-center shadow-md text-xl text-slate-950 font-black">
                  ★
                </div>
                <span className="text-[8px] font-bold text-amber-900 mt-0.5 uppercase tracking-wider">
                  {language === 'id' ? 'TERVERIFIKASI SISTEM' : 'SYSTEM VERIFIED'}
                </span>
              </div>

              <div className="text-right">
                <div className="text-[9px] text-slate-500 uppercase font-bold">{language === 'id' ? 'Tim Evaluasi' : 'Evaluation Board'}</div>
                <div className="text-xs font-bold text-slate-800 font-serif italic">Mental Math Master</div>
                <div className="text-[8px] text-slate-400">{language === 'id' ? 'Dokumen Prestasi Digital' : 'Official Digital Record'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2.5 print:hidden">
          <span className="text-[11px] text-slate-400 text-center sm:text-left">
            {language === 'id' ? 'Piagam penghargaan prestasi belajar anak.' : 'Official Certificate of Achievement.'}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct PNG Image Download */}
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
              title="Save PNG"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'id' ? 'Simpan Gambar (PNG)' : 'Save Image (PNG)'}</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Cetak / PDF' : 'Print / PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
