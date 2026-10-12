import React, { useRef, useState, useEffect } from 'react';
import { Trash2, X, Check, RotateCcw, PenTool } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useGame } from '../context/GameContext';

interface ScratchpadCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  questionText?: string;
}

export const ScratchpadCanvas: React.FC<ScratchpadCanvasProps> = ({ 
  isOpen, 
  onClose,
  questionText
}) => {
  const { language } = useGame();
  const isEn = language === 'en';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const historyRef = useRef<ImageData[]>([]);

  const [strokeColor, setStrokeColor] = useState<string>('#38bdf8'); // Neon sky blue default
  const [strokeWidth, setStrokeWidth] = useState<number>(3.5);
  const [canUndo, setCanUndo] = useState<boolean>(false);

  // Setup canvas resolution and context
  useEffect(() => {
    if (!isOpen) return;

    let frameId: number;
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        frameId = requestAnimationFrame(initCanvas);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      // Save initial blank state
      const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current = [initialSnapshot];
      setCanUndo(false);
    };

    frameId = requestAnimationFrame(initCanvas);
    return () => cancelAnimationFrame(frameId);
  }, [isOpen]);

  // Update stroke color & width on context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
    }
  }, [strokeColor, strokeWidth]);

  if (!isOpen) return null;

  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      // Save snapshot before drawing
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (historyRef.current.length >= 10) {
        historyRef.current.shift();
      }
      historyRef.current.push(snapshot);
      setCanUndo(true);
    }

    // Capture pointer for continuous drawing even if dragged outside
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const coords = getCanvasCoordinates(e);
    lastPosRef.current = coords;

    if (ctx) {
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, strokeWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    lastPosRef.current = coords;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      const canvas = canvasRef.current;
      if (canvas) {
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {}
      }
    }
  };

  const handleUndo = () => {
    sounds.playTap();
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const previousState = historyRef.current.pop();
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    }
    setCanUndo(historyRef.current.length > 1);
  };

  const clearCanvas = () => {
    sounds.playTap();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    historyRef.current = [];
    setCanUndo(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start sm:items-center justify-center p-2.5 sm:p-4 pt-2.5 sm:pt-6 pb-safe select-none animate-in fade-in duration-150">
      {/* Centered Ergonomic Modal Container */}
      <div className="w-full max-w-md sm:max-w-lg bg-slate-900 border-2 border-slate-700/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[88dvh] sm:h-[82dvh] max-h-[720px] mx-auto animate-in zoom-in-95 duration-150">
        {/* Header Toolbar */}
        <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-sm shrink-0">
              ✏️
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                {isEn ? 'Scratchpad Canvas' : 'Papan Coretan Hitung'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isEn ? 'Rough calculation area' : 'Area oret-oretan hitung'}
              </p>
            </div>
          </div>

          {/* Color & Tool Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Color Palette */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[
                { color: '#38bdf8', label: isEn ? 'Neon Blue' : 'Biru Neon' },
                { color: '#fbbf24', label: isEn ? 'Gold' : 'Emas' },
                { color: '#4ade80', label: isEn ? 'Green' : 'Hijau' },
                { color: '#ffffff', label: isEn ? 'White' : 'Putih' }
              ].map(c => (
                <button
                  key={c.color}
                  onClick={() => {
                    sounds.playTap();
                    setStrokeColor(c.color);
                  }}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-all cursor-pointer ${
                    strokeColor === c.color ? 'ring-2 ring-white scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>

            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors shadow-sm ${
                canUndo 
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 cursor-pointer' 
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-40'
              }`}
              title={isEn ? 'Undo stroke' : 'Urungkan coretan'}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Clear Button */}
            <button
              onClick={clearCanvas}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-slate-700 cursor-pointer transition-colors shadow-sm"
              title={isEn ? 'Clear Canvas' : 'Hapus Semua Coretan'}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Close / Done Button */}
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md ml-0.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isEn ? 'Done' : 'Selesai'}</span>
            </button>
          </div>
        </div>

        {/* Active Question Display */}
        {questionText && (
          <div className="bg-slate-950 border-b border-slate-800/80 px-3.5 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isEn ? 'Question:' : 'Soal:'}
              </span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-mono-math tracking-wide">
                {questionText}
              </span>
            </div>
            <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20 font-semibold">
              {isEn ? 'Draw to calculate' : 'Coret-coret hitung'}
            </span>
          </div>
        )}

        {/* Interactive Drawing Canvas */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden cursor-crosshair touch-none">
          {/* Subtle Grid Pattern for Math Alignment */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
      </div>
    </div>
  );
};
