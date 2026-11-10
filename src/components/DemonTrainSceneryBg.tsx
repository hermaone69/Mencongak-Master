import React from 'react';

export const DemonTrainSceneryBg: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* DEEP ATMOSPHERIC STARRY NIGHT SKY */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060114] via-[#0d0524] to-[#040817] opacity-98" />

      {/* TWINKLING NIGHT STARS */}
      <div className="absolute top-2 left-8 text-xs text-amber-200/90 animate-pulse">✨</div>
      <div className="absolute top-9 left-1/4 text-xs text-amber-100/70 animate-pulse" style={{ animationDelay: '0.7s' }}>✨</div>
      <div className="absolute top-4 left-1/2 text-xs text-cyan-200/80 animate-pulse" style={{ animationDelay: '1.4s' }}>✨</div>
      <div className="absolute top-7 right-1/3 text-xs text-amber-200/70 animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
      <div className="absolute top-12 right-12 text-xs text-amber-100/90 animate-pulse" style={{ animationDelay: '1.1s' }}>✨</div>

      {/* GIANT GLOWING FULL MOON (Bulan Purnama Besar Bercahaya) */}
      <div className="absolute top-2 right-4 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-200 shadow-[0_0_60px_rgba(254,240,138,0.9)] flex items-center justify-center text-4xl select-none opacity-95">
        🌕
        {/* Soft Moonlight Halo */}
        <div className="absolute inset-[-12px] rounded-full border-2 border-amber-300/30 animate-pulse-ring pointer-events-none" />
      </div>

      {/* PARALLAX LAYER 1 (FAR): DISTANT NIGHT MOUNTAIN SILHOUETTE (@keyframes parallax-far) */}
      <div className="absolute top-6 inset-x-[-100%] h-24 opacity-80 flex items-end justify-around text-4xl animate-parallax-far select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
        <span>⛰️</span><span className="text-2xl opacity-60">☁️</span><span>⛰️</span><span className="text-2xl opacity-60">☁️</span><span>⛰️</span><span className="text-2xl opacity-60">☁️</span><span>⛰️</span><span className="text-2xl opacity-60">☁️</span><span>⛰️</span>
      </div>

      {/* PARALLAX LAYER 2 (MID): SPEEDING PINE FOREST SILHOUETTES (@keyframes parallax-mid) */}
      <div className="absolute top-16 inset-x-[-100%] h-20 opacity-80 flex items-end justify-around text-3xl animate-parallax-mid select-none filter drop-shadow-md">
        <span>🌲</span><span>🌲</span><span className="text-2xl">🌲</span><span>🌲</span><span>🌲</span><span className="text-2xl">🌲</span><span>🌲</span><span>🌲</span><span>🌲</span><span className="text-2xl">🌲</span><span>🌲</span><span>🌲</span>
      </div>

      {/* PARALLAX LAYER 3 (NEAR): TELEGRAPH POLES & SPEED TRACKS (@keyframes parallax-near) */}
      <div className="absolute top-28 inset-x-[-100%] h-12 opacity-85 flex items-center justify-around text-lg animate-parallax-near select-none font-mono text-cyan-400">
        <span>━━━━</span><span>⚡</span><span>━━━━</span><span>⚡</span><span>━━━━</span><span>⚡</span><span>━━━━</span><span>⚡</span><span>━━━━</span><span>⚡</span>
      </div>

      {/* MUGEN EXPRESS STEAM TRAIN ROOF PLATFORM (Atap Gerbong Kereta Besi Detail) */}
      <div className="absolute bottom-0 inset-x-0 h-32 sm:h-36 bg-gradient-to-t from-slate-950 via-[#0a1120] to-[#1e293b] border-t-4 border-cyan-400 shadow-[0_-10px_35px_rgba(6,182,212,0.35)] flex flex-col justify-between p-2 backdrop-blur-xs animate-train-chug">
        
        {/* Metal Rivets & Railing Header */}
        <div className="flex justify-between items-center px-3 text-[11px] text-cyan-300 font-mono font-black tracking-wider">
          <span>🔩 ═ ═ ═ ═ ═ 🔩</span>
          <span className="animate-pulse flex items-center gap-1.5 drop-shadow-[0_0_8px_#22d3ee]">
            <span>🚂</span> ATAP GERBONG MUGEN EXPRESS <span>🚂</span>
          </span>
          <span>🔩 ═ ═ ═ ═ ═ 🔩</span>
        </div>

        {/* Steel Plate Planks on Train Roof */}
        <div className="w-full h-1 bg-cyan-500/30 border-t border-b border-cyan-400/20" />
        <div className="w-full flex justify-around px-4">
          <div className="w-1.5 h-12 bg-slate-800 border-x border-cyan-500/40 rounded-full" />
          <div className="w-1.5 h-12 bg-slate-800 border-x border-cyan-500/40 rounded-full" />
          <div className="w-1.5 h-12 bg-slate-800 border-x border-cyan-500/40 rounded-full" />
          <div className="w-1.5 h-12 bg-slate-800 border-x border-cyan-500/40 rounded-full" />
        </div>

        {/* BILLOWING THICK STEAM SMOKE FROM TRAIN CHIMNEY (Animasi Asap Tebal Membungbung ke Belakang) */}
        <div className="absolute -top-14 left-6 text-5xl animate-steam-trail select-none opacity-90 pointer-events-none filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
          💨
        </div>
        <div className="absolute -top-16 left-24 text-6xl animate-steam-trail select-none opacity-80 pointer-events-none" style={{ animationDelay: '0.5s' }}>
          💨
        </div>
        <div className="absolute -top-18 left-48 text-5xl animate-steam-trail select-none opacity-65 pointer-events-none" style={{ animationDelay: '1.0s' }}>
          💨
        </div>
        <div className="absolute -top-20 left-72 text-6xl animate-steam-trail select-none opacity-50 pointer-events-none" style={{ animationDelay: '1.5s' }}>
          💨
        </div>

        {/* Speed Track Sparks at bottom edge */}
        <div className="flex justify-around text-xs text-cyan-400 opacity-90 animate-pulse font-mono">
          <span>⚡ ⚡ ⚡</span>
          <span className="text-[10px] text-cyan-300 tracking-widest font-bold">LINTASAN REL MUGEN</span>
          <span>⚡ ⚡ ⚡</span>
        </div>
      </div>
    </div>
  );
};
