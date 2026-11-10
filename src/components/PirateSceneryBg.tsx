import React from 'react';

export const PirateSceneryBg: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* BEAUTIFULLY GRADED SKY (Bright Tropical Sea Sky to Deep Horizon Ocean) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-600 via-blue-700 to-indigo-950 opacity-95" />

      {/* GLOWING TROPICAL SUN WITH RAYS */}
      <div className="absolute top-3 right-6 sm:right-12 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_55px_rgba(253,224,71,0.9)] flex items-center justify-center text-3xl opacity-90 animate-pulse">
        ☀️
      </div>

      {/* FLYING SEAGULLS IN SKY */}
      <div className="absolute top-5 left-10 text-sm text-white/80 animate-cloud-drift font-bold">
        🕊️ &nbsp; 🕊️
      </div>
      <div className="absolute top-11 left-1/3 text-xs text-white/70 animate-cloud-drift font-bold" style={{ animationDelay: '3s' }}>
        🕊️
      </div>

      {/* DRIFTING PUFFY SCENERY CLOUDS */}
      <div className="absolute top-2 inset-x-0 h-18 opacity-85">
        <div className="flex justify-around items-center px-4 animate-cloud-drift text-2xl filter drop-shadow-md">
          <span>☁️</span>
          <span className="text-3xl opacity-90">☁️</span>
          <span className="text-xl opacity-75">☁️</span>
          <span className="text-3xl">☁️</span>
          <span className="text-2xl opacity-80">☁️</span>
        </div>
      </div>

      {/* HORIZON DISTANT TROPICAL ISLANDS & SLOWLY SAILING PIRATE SHIPS (@keyframes parallax-far) */}
      <div className="absolute top-20 inset-x-[-50%] h-16 flex items-end justify-around px-6 opacity-85 text-2xl animate-parallax-far">
        <div className="flex items-end gap-1">
          <span>🏝️</span>
          <span className="text-base">🌴</span>
        </div>
        <div className="text-3xl filter drop-shadow-md">
          🏴‍☠️⛵
        </div>
        <div className="flex items-end gap-1">
          <span className="text-base">🌴</span>
          <span>🌋</span>
        </div>
        <div className="text-2xl filter drop-shadow-md">
          ⛵
        </div>
        <div className="flex items-end gap-1">
          <span>🏝️</span>
          <span className="text-base">🌴</span>
        </div>
      </div>

      {/* FULL-STAGE ANIMATED RAPID ROLLING OCEAN WAVES (Moving Fast to the Left!) */}
      <div className="absolute top-28 inset-x-0 bottom-0 overflow-hidden flex flex-col justify-end">
        {/* Distant Sea Water Gradient */}
        <div className="w-full h-full bg-gradient-to-b from-sky-600/40 via-blue-700/60 to-indigo-950/80 backdrop-blur-2xs" />

        {/* Dynamic Wave Layer 1 (Back rolling waves - rapid drift) */}
        <div className="absolute bottom-16 inset-x-[-100%] flex justify-around text-4xl opacity-90 animate-wave-drift filter drop-shadow-md">
          <span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span>
        </div>

        {/* Dynamic Wave Layer 2 (Front crest waves - fast rolling) */}
        <div className="absolute bottom-8 inset-x-[-100%] flex justify-around text-5xl opacity-95 animate-wave-drift-reverse filter drop-shadow-xl">
          <span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span>
        </div>

        {/* SOLID WOODEN SHIP DECK PLATFORM (Geladak Kapal Kayu Kokoh Thousand Sunny di Bagian Bawah Layar) */}
        <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-[#271206] via-[#451a03] to-[#78350f] border-t-4 border-amber-400 shadow-[0_-8px_30px_rgba(245,158,11,0.4)] flex flex-col justify-between p-2.5 backdrop-blur-xs">
          {/* Deck Railing & Compass Header */}
          <div className="flex justify-between items-center px-3 text-[11px] text-amber-300 font-mono font-black tracking-wider">
            <span>⚓ GELADAK THOUSAND SUNNY ⚓</span>
            <span className="animate-pulse flex items-center gap-1 drop-shadow-[0_0_8px_#f59e0b]">
              <span>🏴‍☠️</span> SAMUDERA GRAND LINE <span>🏴‍☠️</span>
            </span>
            <span>🧭 BARAT LAUT 🧭</span>
          </div>

          {/* Solid Wooden Planks & Nails Texture */}
          <div className="w-full h-1 bg-amber-950/80 border-t border-b border-amber-400/30" />
          <div className="w-full flex justify-around px-4">
            <div className="w-2 h-10 bg-amber-900 border-x border-amber-600/50 rounded-sm" />
            <div className="w-2 h-10 bg-amber-900 border-x border-amber-600/50 rounded-sm" />
            <div className="w-2 h-10 bg-amber-900 border-x border-amber-600/50 rounded-sm" />
            <div className="w-2 h-10 bg-amber-900 border-x border-amber-600/50 rounded-sm" />
            <div className="w-2 h-10 bg-amber-900 border-x border-amber-600/50 rounded-sm" />
          </div>

          {/* Ship Deck Mooring Ropes & Iron Cleats */}
          <div className="flex justify-between items-center px-4 text-[10px] text-amber-400/80 font-mono">
            <span>🪢 TALI JANGKAR</span>
            <span className="text-amber-200">━━━ ⚓ ━━━</span>
            <span>MERIAM DEK KANAN 💣</span>
          </div>
        </div>
      </div>
    </div>
  );
};
