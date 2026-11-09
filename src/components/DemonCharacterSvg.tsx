import React from 'react';

interface DemonCharacterSvgProps {
  avatarType: 'shadow' | 'dream' | 'spider' | 'flame' | 'upper_moon';
  className?: string;
  isAttacking?: boolean;
  isHit?: boolean;
}

export const DemonCharacterSvg: React.FC<DemonCharacterSvgProps> = ({
  avatarType,
  className = '',
  isAttacking = false,
  isHit = false
}) => {
  switch (avatarType) {
    case 'shadow':
      // Iblis Bayangan Rel (Shadow Demon): Dark purple-black body, glowing sharp red horns, yellow slit eyes, razor claws
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dark Red/Purple Aura Filter */}
            <radialGradient id="shadowBodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="60%" stopColor="#170326" />
              <stop offset="100%" stopColor="#090114" />
            </radialGradient>
            <linearGradient id="redHornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            <linearGradient id="eyeGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="shadowClawGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#881337" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ef4444" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Dark Shadow Smoke Wisps Behind Demon */}
          <path d="M40 130 C30 100, 20 80, 35 60 C45 45, 55 55, 50 75 C45 95, 60 120, 50 140 Z" fill="#4c1d95" opacity="0.4" />
          <path d="M120 130 C130 95, 140 70, 125 50 C115 35, 105 45, 110 65 C115 85, 100 120, 110 140 Z" fill="#831843" opacity="0.4" />

          {/* Torso & Shoulders (Half Body Standing Stance facing Left) */}
          <path
            d="M38 155 C38 128, 48 108, 65 102 C72 100, 88 100, 95 102 C112 108, 122 128, 122 155 Z"
            fill="url(#shadowBodyGrad)"
            stroke="#581c87"
            strokeWidth="2.5"
          />

          {/* Chest Markings / Demonic Ribs (Glowing Purple-Red) */}
          <path d="M68 118 Q80 123 92 118" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <path d="M71 128 Q80 132 89 128" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          <path d="M74 138 Q80 141 86 138" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.65" />

          {/* Head Shape */}
          <path
            d="M56 64 C56 46, 68 38, 80 38 C92 38, 104 46, 104 64 C104 82, 94 95, 80 95 C66 95, 56 82, 56 64 Z"
            fill="url(#shadowBodyGrad)"
            stroke="#7e22ce"
            strokeWidth="2"
          />

          {/* Glowing Red Horns (Sharp & Menacing) */}
          {/* Left Horn */}
          <path
            d="M62 48 C50 36, 40 18, 44 8 C48 18, 58 30, 68 40 Z"
            fill="url(#redHornGrad)"
            filter="url(#shadowGlow)"
          />
          {/* Right Horn */}
          <path
            d="M98 48 C110 36, 120 18, 116 8 C112 18, 102 30, 92 40 Z"
            fill="url(#redHornGrad)"
            filter="url(#shadowGlow)"
          />
          {/* Small Center Crown Spikes */}
          <path d="M76 38 L80 26 L84 38 Z" fill="#ef4444" />

          {/* Menacing Eyes (Piercing Yellow Slits angled aggressively) */}
          {/* Left Eye */}
          <path d="M63 60 Q72 63 75 58 Q72 68 63 60 Z" fill="url(#eyeGlowGrad)" filter="url(#shadowGlow)" />
          <circle cx="70" cy="62" r="1.5" fill="#450a0a" />
          {/* Right Eye */}
          <path d="M85 58 Q88 63 97 60 Q88 68 85 58 Z" fill="url(#eyeGlowGrad)" filter="url(#shadowGlow)" />
          <circle cx="90" cy="62" r="1.5" fill="#450a0a" />

          {/* Demonic Face Veins / Markings */}
          <path d="M60 70 L66 74 L62 78" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M100 70 L94 74 L98 78" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />

          {/* Wicked Fanged Maw */}
          <path d="M70 78 Q80 84 90 78 Q80 88 70 78 Z" fill="#450a0a" stroke="#dc2626" strokeWidth="1" />
          <polygon points="73,78 75,82 77,78" fill="#ffffff" />
          <polygon points="83,78 85,82 87,78" fill="#ffffff" />
          <polygon points="78,85 80,81 82,85" fill="#ffffff" />

          {/* LEFT CLAWED ARM: Extended Forward (Facing Player on Left!) */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path
              d="M50 106 C40 108, 25 110, 16 118 C22 112, 34 116, 44 118 Z"
              fill="url(#shadowBodyGrad)"
              stroke="#581c87"
              strokeWidth="2"
            />
            {/* Razor Sharp Claws Extended Left */}
            <path d="M16 118 L4 112 L12 120" stroke="url(#shadowClawGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 121 L2 122 L12 125" stroke="url(#shadowClawGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 124 L5 130 L15 129" stroke="url(#shadowClawGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="116" r="3" fill="#f43f5e" filter="url(#shadowGlow)" opacity="0.6" />
          </g>

          {/* RIGHT CLAWED ARM: Raised Ready to Strike */}
          <g>
            <path
              d="M110 106 C124 105, 138 98, 148 90 C140 100, 128 112, 115 118 Z"
              fill="url(#shadowBodyGrad)"
              stroke="#581c87"
              strokeWidth="2"
            />
            {/* Claws Poised */}
            <path d="M148 90 L158 82 L148 93" stroke="url(#shadowClawGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M149 94 L159 92 L147 98" stroke="url(#shadowClawGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M146 98 L155 104 L144 102" stroke="url(#shadowClawGrad)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'flame':
      // Iblis Api Merah / Tungku Batubara: Blazing crimson magma demon, massive fiery horns, burning claws
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="flameBodyGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="50%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#450a0a" />
            </radialGradient>
            <linearGradient id="magmaHornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="40%" stopColor="#ea580c" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="fireClawGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f97316" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Fire Embers Rising from shoulders */}
          <circle cx="36" cy="65" r="2.5" fill="#fde047" opacity="0.8" />
          <circle cx="48" cy="45" r="2" fill="#ea580c" opacity="0.9" />
          <circle cx="122" cy="55" r="3" fill="#fde047" opacity="0.8" />
          <circle cx="114" cy="38" r="2" fill="#ef4444" opacity="0.9" />

          {/* Demon Torso (Broad Charcoal & Magma Body) */}
          <path
            d="M34 155 C34 125, 46 104, 64 98 C72 96, 88 96, 96 98 C114 104, 126 125, 126 155 Z"
            fill="url(#flameBodyGrad)"
            stroke="#ea580c"
            strokeWidth="2.5"
          />

          {/* Fissured Magma Core on Chest */}
          <path d="M80 108 L74 120 L84 126 L76 138 L82 148" stroke="#fde047" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#flameGlow)" />
          <path d="M68 116 L74 120" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M92 122 L84 126" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M66 130 L76 138" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />

          {/* Armored Charcoal Shoulder Plates */}
          <path d="M32 118 L46 102 L58 112 L44 126 Z" fill="#292524" stroke="#f97316" strokeWidth="1.5" />
          <path d="M128 118 L114 102 L102 112 L116 126 Z" fill="#292524" stroke="#f97316" strokeWidth="1.5" />

          {/* Demon Head */}
          <path
            d="M54 62 C54 44, 66 36, 80 36 C94 36, 106 44, 106 62 C106 82, 94 94, 80 94 C66 94, 54 82, 54 62 Z"
            fill="url(#flameBodyGrad)"
            stroke="#b91c1c"
            strokeWidth="2"
          />

          {/* Giant Curving Magma Horns (Curving upward and glowing fiercely) */}
          <path
            d="M60 46 C44 32, 30 12, 38 4 C44 14, 56 26, 68 38 Z"
            fill="url(#magmaHornGrad)"
            filter="url(#flameGlow)"
          />
          <path
            d="M100 46 C116 32, 130 12, 122 4 C116 14, 104 26, 92 38 Z"
            fill="url(#magmaHornGrad)"
            filter="url(#flameGlow)"
          />
          {/* Horn Magma Rings */}
          <path d="M48 24 Q54 28 58 22" stroke="#450a0a" strokeWidth="2" />
          <path d="M112 24 Q106 28 102 22" stroke="#450a0a" strokeWidth="2" />

          {/* Blazing Eyes (Pure White-Yellow Heat) */}
          <path d="M62 58 Q72 61 74 56 Q71 66 62 58 Z" fill="#ffffff" filter="url(#flameGlow)" />
          <circle cx="69" cy="60" r="2" fill="#f59e0b" />
          <path d="M86 56 Q88 61 98 58 Q89 66 86 56 Z" fill="#ffffff" filter="url(#flameGlow)" />
          <circle cx="91" cy="60" r="2" fill="#f59e0b" />

          {/* Burning Maw / Sharp Demon Teeth */}
          <path d="M68 76 Q80 84 92 76 Q80 88 68 76 Z" fill="#1c1917" stroke="#f97316" strokeWidth="1.5" />
          <polygon points="72,76 74,81 77,76" fill="#fde047" />
          <polygon points="80,76 82,82 85,76" fill="#fde047" />
          <polygon points="87,76 89,81 91,76" fill="#fde047" />

          {/* LEFT CLAW: Extended Striking Stance (Facing Left Player) */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path d="M44 104 C30 108, 18 114, 12 122 C20 116, 32 118, 42 120 Z" fill="#7f1d1d" stroke="#f97316" strokeWidth="2" />
            <path d="M12 122 L0 114 L10 125" stroke="url(#fireClawGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 126 L-2 126 L8 130" stroke="url(#fireClawGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 130 L1 136 L12 134" stroke="url(#fireClawGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Fire droplet */}
            <circle cx="2" cy="120" r="3" fill="#fbbf24" filter="url(#flameGlow)" />
          </g>

          {/* RIGHT CLAW: Guarding with Flaming Talons */}
          <g>
            <path d="M116 104 C128 106, 142 98, 150 92 C142 102, 130 112, 118 116 Z" fill="#7f1d1d" stroke="#f97316" strokeWidth="2" />
            <path d="M150 92 L160 84 L150 95" stroke="url(#fireClawGrad)" strokeWidth="3" strokeLinecap="round" />
            <path d="M151 96 L161 94 L149 100" stroke="url(#fireClawGrad)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'spider':
      // Iblis Baja Cerobong / Monster Tengkorak: Armored skull demon, jagged horns, steel spikes, cyan-red eyes
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skullBoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="ironArmorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="steelHornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="skullGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#06b6d4" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Heavy Armored Body with Rivets */}
          <path
            d="M34 155 C34 122, 46 102, 64 96 C72 94, 88 94, 96 96 C114 102, 126 122, 126 155 Z"
            fill="url(#ironArmorGrad)"
            stroke="#06b6d4"
            strokeWidth="2.5"
          />

          {/* Steel Spikes on Shoulders */}
          <polygon points="28,114 18,102 32,108" fill="#94a3b8" stroke="#06b6d4" strokeWidth="1.5" />
          <polygon points="34,104 26,92 40,98" fill="#94a3b8" stroke="#06b6d4" strokeWidth="1.5" />
          <polygon points="132,114 142,102 128,108" fill="#94a3b8" stroke="#06b6d4" strokeWidth="1.5" />
          <polygon points="126,104 134,92 120,98" fill="#94a3b8" stroke="#06b6d4" strokeWidth="1.5" />

          {/* Chimney Steam Exhaust Pipes on Back */}
          <rect x="42" y="74" width="8" height="24" rx="2" fill="#334155" stroke="#64748b" />
          <rect x="110" y="74" width="8" height="24" rx="2" fill="#334155" stroke="#64748b" />
          <path d="M44 72 Q46 64 42 58" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M114 72 Q112 64 116 58" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          {/* Horned Demonic Skull Head */}
          <path
            d="M54 58 C54 40, 66 32, 80 32 C94 32, 106 40, 106 58 C106 72, 98 80, 94 88 C90 92, 70 92, 66 88 C62 80, 54 72, 54 58 Z"
            fill="url(#skullBoneGrad)"
            stroke="#0f172a"
            strokeWidth="2.5"
          />

          {/* Jagged Crimson Horns with Iron Rings */}
          <path d="M58 44 C42 34, 30 16, 36 6 C42 16, 54 26, 64 36 Z" fill="url(#steelHornGrad)" stroke="#475569" strokeWidth="1.5" />
          <path d="M102 44 C118 34, 130 16, 124 6 C118 16, 106 26, 96 36 Z" fill="url(#steelHornGrad)" stroke="#475569" strokeWidth="1.5" />

          {/* Deep Sunken Eye Sockets with Glowing Cyan/Blood Pupils */}
          <path d="M62 56 Q71 58 73 53 Q70 65 62 56 Z" fill="#020617" />
          <circle cx="68" cy="58" r="2.5" fill="#22d3ee" filter="url(#skullGlow)" />
          <circle cx="68" cy="58" r="1" fill="#ffffff" />

          <path d="M87 53 Q89 58 98 56 Q90 65 87 53 Z" fill="#020617" />
          <circle cx="92" cy="58" r="2.5" fill="#22d3ee" filter="url(#skullGlow)" />
          <circle cx="92" cy="58" r="1" fill="#ffffff" />

          {/* Skull Nose Cavity */}
          <polygon points="80,66 77,72 83,72" fill="#020617" />

          {/* Jagged Skeletal Teeth & Iron Jaw */}
          <rect x="68" y="78" width="24" height="12" rx="2" fill="#1e293b" stroke="#64748b" />
          <line x1="72" y1="78" x2="72" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="76" y1="78" x2="76" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="80" y1="78" x2="80" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="84" y1="78" x2="84" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="88" y1="78" x2="88" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Armored Left Gauntlet Extending Left with Spikes */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path d="M46 102 C32 106, 18 112, 12 120 C20 114, 34 116, 44 118 Z" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
            <path d="M12 120 L-2 112 L8 122" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 124 L-4 124 L6 128" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 128 L0 134 L10 132" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Right Gauntlet */}
          <g>
            <path d="M114 102 C128 104, 142 98, 150 90 C140 100, 128 110, 116 114 Z" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
            <path d="M150 90 L160 82 L150 93" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'dream':
      // Iblis Ilusi Kereta: Eerie pale violet skin, multiple eyes, webbed collar, weaving crimson illusion threads
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="dreamBodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#3b0764" />
              <stop offset="60%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#090a16" />
            </radialGradient>
            <linearGradient id="dreamSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="60%" stopColor="#d8b4fe" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <filter id="dreamGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#a855f7" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* High Webbed Demonic Haori / Robe Collar */}
          <path
            d="M36 155 C36 126, 48 106, 65 100 C72 98, 88 98, 95 100 C112 106, 124 126, 124 155 Z"
            fill="url(#dreamBodyGrad)"
            stroke="#a855f7"
            strokeWidth="2.5"
          />
          {/* Spiderweb markings on robe */}
          <path d="M80 100 L56 145" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M80 100 L80 155" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M80 100 L104 145" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M68 120 Q80 126 92 120" stroke="#c084fc" strokeWidth="1.5" />
          <path d="M60 138 Q80 146 100 138" stroke="#c084fc" strokeWidth="1.5" />

          {/* Head & Pale Demonic Visage */}
          <path
            d="M56 64 C56 46, 68 38, 80 38 C92 38, 104 46, 104 64 C104 82, 94 94, 80 94 C66 94, 56 82, 56 64 Z"
            fill="url(#dreamSkinGrad)"
            stroke="#7e22ce"
            strokeWidth="2"
          />

          {/* Sleek Curved Obsidian Horns */}
          <path d="M62 46 C52 32, 44 14, 48 6 C52 16, 60 28, 70 38 Z" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
          <path d="M98 46 C108 32, 116 14, 112 6 C108 16, 100 28, 90 38 Z" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />

          {/* Hypnotic Red Eyes with Blood Slits */}
          {/* Main Eyes */}
          <path d="M63 60 Q72 63 74 58 Q71 67 63 60 Z" fill="#ef4444" filter="url(#dreamGlow)" />
          <line x1="68" y1="58" x2="68" y2="64" stroke="#450a0a" strokeWidth="1.5" />
          <path d="M86 58 Q88 63 97 60 Q89 67 86 58 Z" fill="#ef4444" filter="url(#dreamGlow)" />
          <line x1="92" y1="58" x2="92" y2="64" stroke="#450a0a" strokeWidth="1.5" />

          {/* Forehead Third Eye (Dream Illusion Eye) */}
          <path d="M75 48 Q80 43 85 48 Q80 53 75 48 Z" fill="#f43f5e" filter="url(#dreamGlow)" />
          <circle cx="80" cy="48" r="1.5" fill="#fde047" />

          {/* Spider Silk Veins under eyes */}
          <path d="M64 68 L60 76 L66 80" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M96 68 L100 76 L94 80" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" />

          {/* Eerie Smile */}
          <path d="M72 78 Q80 84 88 78" stroke="#581c87" strokeWidth="2" strokeLinecap="round" />

          {/* Left Hand: Weaving Crimson Threads towards Player */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path d="M48 106 C36 108, 22 112, 14 118 C22 114, 34 116, 42 118 Z" fill="#d8b4fe" stroke="#7e22ce" strokeWidth="1.5" />
            <path d="M14 118 L4 114" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 121 L2 121" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 124 L4 128" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            {/* Glowing Illusion Strings extending Left */}
            <path d="M4 114 Q-12 108 -25 120" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />
            <path d="M2 121 Q-15 128 -28 124" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />
          </g>

          {/* Right Hand */}
          <g>
            <path d="M112 106 C124 105, 138 98, 146 90 C138 98, 126 108, 114 114 Z" fill="#d8b4fe" stroke="#7e22ce" strokeWidth="1.5" />
            <path d="M146 90 L156 84" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'upper_moon':
    default:
      // Iblis Bulan Atas Mugen: Upper Moon Demon Warlord with 6 glowing eyes, grand crimson crown horns, samurai demon mantle
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="upperBodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="60%" stopColor="#18050e" />
              <stop offset="100%" stopColor="#050103" />
            </radialGradient>
            <linearGradient id="upperHornCrown" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="40%" stopColor="#dc2626" />
              <stop offset="80%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fecdd3" />
            </linearGradient>
            <filter id="upperMoonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Billowing Demon Mantle / Cape with Blood Edge */}
          <path
            d="M26 155 C22 120, 36 94, 60 92 C68 90, 92 90, 100 92 C124 94, 138 120, 134 155 Z"
            fill="#09050d"
            stroke="#ef4444"
            strokeWidth="2.5"
          />

          {/* Demonic Armor Plates & Robe Pattern */}
          <path
            d="M40 155 C40 128, 50 106, 66 102 C74 100, 86 100, 94 102 C110 106, 120 128, 120 155 Z"
            fill="url(#upperBodyGrad)"
            stroke="#991b1b"
            strokeWidth="2"
          />
          {/* Upper Moon Crest on Chest */}
          <circle cx="80" cy="120" r="10" stroke="#f59e0b" strokeWidth="2" fill="#7f1d1d" filter="url(#upperMoonGlow)" />
          <path d="M80 114 L80 126 M74 120 L86 120" stroke="#fef08a" strokeWidth="2" />

          {/* Head Shape */}
          <path
            d="M56 64 C56 46, 68 38, 80 38 C92 38, 104 46, 104 64 C104 82, 94 95, 80 95 C66 95, 56 82, 56 64 Z"
            fill="#1c0b14"
            stroke="#b91c1c"
            strokeWidth="2"
          />

          {/* Grand Crown of Demon Horns (4 Sweeping Crimson Horns) */}
          {/* Main Left Horn */}
          <path d="M60 44 C44 28, 32 8, 38 0 C44 12, 56 24, 68 36 Z" fill="url(#upperHornCrown)" filter="url(#upperMoonGlow)" />
          {/* Inner Left Horn */}
          <path d="M68 40 C60 28, 54 16, 58 10 C62 16, 70 26, 76 36 Z" fill="url(#upperHornCrown)" />
          {/* Inner Right Horn */}
          <path d="M92 40 C100 28, 106 16, 102 10 C98 16, 90 26, 84 36 Z" fill="url(#upperHornCrown)" />
          {/* Main Right Horn */}
          <path d="M100 44 C116 28, 128 8, 122 0 C116 12, 104 24, 92 36 Z" fill="url(#upperHornCrown)" filter="url(#upperMoonGlow)" />

          {/* SIX GLOWING DEMONIC EYES (Upper Moon Kokushibo Style) */}
          {/* Top Pair */}
          <path d="M65 52 Q72 54 74 50 Q71 58 65 52 Z" fill="#fde047" filter="url(#upperMoonGlow)" />
          <circle cx="70" cy="52" r="1.2" fill="#7f1d1d" />
          <path d="M86 50 Q88 54 95 52 Q89 58 86 50 Z" fill="#fde047" filter="url(#upperMoonGlow)" />
          <circle cx="90" cy="52" r="1.2" fill="#7f1d1d" />

          {/* Middle Pair (Main Eyes) */}
          <path d="M63 64 Q72 67 75 62 Q72 72 63 64 Z" fill="#ef4444" filter="url(#upperMoonGlow)" />
          <line x1="69" y1="62" x2="69" y2="67" stroke="#450a0a" strokeWidth="2" />
          <path d="M85 62 Q88 67 97 64 Q88 72 85 62 Z" fill="#ef4444" filter="url(#upperMoonGlow)" />
          <line x1="91" y1="62" x2="91" y2="67" stroke="#450a0a" strokeWidth="2" />

          {/* Bottom Pair */}
          <path d="M67 74 Q73 76 75 72 Q72 80 67 74 Z" fill="#fde047" filter="url(#upperMoonGlow)" />
          <circle cx="71" cy="74" r="1.2" fill="#7f1d1d" />
          <path d="M85 72 Q87 76 93 74 Q88 80 85 72 Z" fill="#fde047" filter="url(#upperMoonGlow)" />
          <circle cx="89" cy="74" r="1.2" fill="#7f1d1d" />

          {/* Crimson Flame Demon Markings on Forehead & Cheeks */}
          <path d="M78 40 L80 34 L82 40" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          <path d="M58 76 L54 84 L60 86" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M102 76 L106 84 L100 86" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />

          {/* Grim Mouth */}
          <path d="M72 86 Q80 90 88 86" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />

          {/* LEFT CLAW: Extended Dominant Stance (Facing Player on Left) */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path d="M46 104 C32 108, 18 114, 10 122 C18 116, 32 118, 42 120 Z" fill="#450a0a" stroke="#dc2626" strokeWidth="2" />
            <path d="M10 122 L-4 114 L6 125" stroke="url(#upperHornCrown)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 126 L-6 126 L4 130" stroke="url(#upperHornCrown)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 130 L-2 138 L8 134" stroke="url(#upperHornCrown)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dark Lightning Arc */}
            <path d="M-2 116 L4 122 L-6 126" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" filter="url(#upperMoonGlow)" />
          </g>

          {/* RIGHT CLAW: Resting on Katana / Clenched */}
          <g>
            <path d="M114 104 C128 106, 142 98, 150 90 C140 100, 128 112, 116 116 Z" fill="#450a0a" stroke="#dc2626" strokeWidth="2" />
            <path d="M150 90 L162 82 L150 93" stroke="url(#upperHornCrown)" strokeWidth="3" strokeLinecap="round" />
            <path d="M151 95 L163 92 L149 100" stroke="url(#upperHornCrown)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );
  }
};
