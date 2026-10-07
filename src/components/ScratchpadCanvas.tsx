import React, { useRef, useState, useEffect } from 'react';
import { Trash2, X, Check, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useGame } from '../context/GameContext';

interface ScratchpadCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadCanvas: React.FC<ScratchpadCanvasProps> = ({ isOpen, onClose }) => {
  const { language } = useGame();
  const isEn = language === 'en';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [strokeColor, setStrokeColor] = useState<string>('#38bdf8'); // Neon sky blue default
  const [strokeWidth, setStrokeWidth] = useState<number>(3.5);

  // Setup canvas resolution and context
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
  }, [isOpen]);

  // Update stroke color & width on context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

    // Capture pointer for continuous drawing even if dragged outside
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const coords = getCanvasCoordinates(e);
    lastPosRef.current = coords;

    const ctx = canvas.getContext('2d');
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

    const ctx = canvas.getContext('2d');
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

  const clearCanvas = () => {
    sounds.playTap();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-3 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-700/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[65vh] max-h-[520px] mx-auto">
        {/* Header Toolbar */}
        <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-sm">
              ✏️
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white">
                {isEn ? 'Scratchpad Canvas' : 'Papan Coretan Hitung'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isEn ? 'Draw with your finger for rough calculations' : 'Goreskan jari di layar untuk oret-oretan'}
              </p>
            </div>
          </div>

          {/* Color & Tool Controls */}
          <div className="flex items-center gap-2">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
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
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    strokeColor === c.color ? 'ring-2 ring-white scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>

            {/* Clear Button */}
            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-slate-700 cursor-pointer transition-colors shadow-sm"
              title={isEn ? 'Clear Canvas' : 'Hapus Semua Coretan'}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isEn ? 'Done' : 'Selesai'}</span>
            </button>
          </div>
        </div>

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
