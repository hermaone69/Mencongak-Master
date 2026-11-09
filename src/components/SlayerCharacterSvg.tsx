import React from 'react';

interface SlayerCharacterSvgProps {
  isSlashing?: boolean;
  isHit?: boolean;
  slashElementType?: 'water' | 'flame';
  className?: string;
}

export const SlayerCharacterSvg: React.FC<SlayerCharacterSvgProps> = ({
  isSlashing = false,
  isHit = false,
  slashElementType = 'water',
  className = ''
}) => {
  return (
    <svg
      viewBox="0 0 160 160"
      className={`w-full h-full select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for Slayer Character */}
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0a16" />
          <stop offset="60%" stopColor="#3b0f23" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="60%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>

        <linearGradient id="katanaBladeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Water Breathing Slash Aura Gradient */}
        <linearGradient id="waterSlashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Flame Breathing Slash Aura Gradient */}
        <linearGradient id="flameSlashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#fb923c" />
          <stop offset="80%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        <filter id="slayerGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.8" />
        </filter>
        <filter id="flameBladeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f43f5e" floodOpacity="0.85" />
        </filter>
      </defs>

      {/* Trailing Wind Steam Speed Lines behind Player */}
      <path d="M12 110 L28 110" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M6 122 L24 122" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M14 96 L32 96" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* LEGS & SANDALS (Standing firmly on the carriage roof) */}
      <g>
        {/* Left Leg */}
        <rect x="52" y="132" width="10" height="20" rx="3" fill="#0f172a" />
        <rect x="52" y="142" width="10" height="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        <ellipse cx="57" cy="153" rx="7" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        {/* Right Leg (Forward Combat Stance) */}
        <rect x="74" y="130" width="11" height="22" rx="3" fill="#0f172a" />
        <rect x="74" y="141" width="11" height="9" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        <ellipse cx="80" cy="153" rx="8" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
      </g>

      {/* BILLOWING CHECKERED HAORI (Jubah Hijau-Hitam Khas) */}
      {/* Back haori fold fluttering in the wind */}
      <path d="M42 98 C32 112, 30 134, 46 138 C54 138, 56 120, 58 106 Z" fill="#059669" stroke="#064e3b" strokeWidth="1.5" />
      {/* Checkered pattern on back fold */}
      <rect x="36" y="112" width="8" height="8" fill="#0f172a" transform="rotate(-10 36 112)" />
      <rect x="44" y="120" width="8" height="8" fill="#0f172a" transform="rotate(-10 44 120)" />

      {/* Slayer Corps Dark Uniform Torso */}
      <path
        d="M50 94 C50 86, 60 84, 69 84 C78 84, 88 86, 88 94 L86 132 C86 134, 52 134, 52 132 Z"
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth="2"
      />
      {/* White Belt & Gold Buckle */}
      <rect x="52" y="122" width="34" height="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="66" y="121" width="6" height="7" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
      {/* Uniform White Collar & Gold Buttons */}
      <path d="M63 84 L69 94 L75 84" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="69" cy="98" r="1.5" fill="#f59e0b" />
      <circle cx="69" cy="107" r="1.5" fill="#f59e0b" />
      <circle cx="69" cy="116" r="1.5" fill="#f59e0b" />

      {/* HAORI SLEEVES & CHEST OVERLAY (Green/Black Checkered Blocks) */}
      <g>
        {/* Left Shoulder & Haori Lapel */}
        <path d="M44 88 C44 86, 56 84, 62 86 L56 128 L40 120 Z" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
        <rect x="42" y="92" width="7" height="7" fill="#020617" />
        <rect x="49" y="99" width="7" height="7" fill="#020617" />
        <rect x="42" y="106" width="7" height="7" fill="#020617" />
        <rect x="49" y="113" width="7" height="7" fill="#020617" />

        {/* Right Shoulder (Swinging forward with katana) */}
        <path d="M76 86 C82 84, 94 86, 94 88 L98 120 L82 128 Z" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
        <rect x="85" y="92" width="7" height="7" fill="#020617" />
        <rect x="78" y="99" width="7" height="7" fill="#020617" />
        <rect x="85" y="106" width="7" height="7" fill="#020617" />
        <rect x="78" y="113" width="7" height="7" fill="#020617" />
      </g>

      {/* HEAD & FACE (Chibi Anime Swordsman Boy) */}
      <g>
        {/* Head Base */}
        <path
          d="M50 56 C50 38, 62 30, 74 30 C86 30, 98 38, 98 56 C98 72, 88 84, 74 84 C60 84, 50 72, 50 56 Z"
          fill="url(#skinGrad)"
          stroke="#f43f5e"
          strokeWidth="1.2"
        />

        {/* Ears */}
        <path d="M48 54 C46 50, 46 62, 50 62 Z" fill="#fecdd3" stroke="#e11d48" strokeWidth="1" />
        <path d="M98 54 C100 50, 100 62, 96 62 Z" fill="#fecdd3" stroke="#e11d48" strokeWidth="1" />

        {/* HANAFUDA EARRING (Signature white card with crimson sun & lines) */}
        <g transform="translate(45, 58)">
          <rect x="0" y="0" width="5.5" height="11" rx="0.8" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
          <circle cx="2.75" cy="4" r="2" fill="#dc2626" />
          <line x1="1" y1="8" x2="4.5" y2="8" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="1.5" y1="10" x2="4" y2="10" stroke="#0f172a" strokeWidth="0.8" />
        </g>

        {/* FOREHEAD SCAR (Flame Mark Tanjiro Style) */}
        <path
          d="M58 38 Q61 34 64 36 Q63 42 67 43 Q62 46 60 48 Q58 44 58 38 Z"
          fill="#991b1b"
          stroke="#ef4444"
          strokeWidth="0.6"
        />

        {/* SPIKY BURGUNDY-BLACK ANIME HAIR */}
        {/* Back and Top Hair Spikes */}
        <path
          d="M48 48 C42 36, 46 22, 56 16 C62 12, 70 10, 78 12 C88 10, 96 16, 102 24 C106 32, 104 44, 98 50
             C96 46, 94 40, 90 38 C88 34, 82 32, 76 34 C70 32, 62 34, 58 38 C54 42, 52 46, 48 48 Z"
          fill="url(#hairGrad)"
        />
        {/* Spiky Forehead Tufts / Bangs */}
        <path d="M52 28 L46 20 L56 24 Z" fill="url(#hairGrad)" />
        <path d="M60 22 L62 12 L68 20 Z" fill="url(#hairGrad)" />
        <path d="M72 18 L76 8 L82 18 Z" fill="url(#hairGrad)" />
        <path d="M84 18 L92 10 L92 22 Z" fill="url(#hairGrad)" />
        <path d="M94 24 L104 18 L98 30 Z" fill="url(#hairGrad)" />
        {/* Sideburn Tufts */}
        <path d="M48 46 L44 54 L52 50 Z" fill="url(#hairGrad)" />
        <path d="M96 46 L102 54 L94 50 Z" fill="url(#hairGrad)" />

        {/* EYES (Determined Sharp Anime Eyes with Ruby Shine) */}
        {/* Left Eyebrow & Eye */}
        <path d="M56 46 Q64 43 68 47" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M57 51 Q63 48 68 53" stroke="#0f172a" strokeWidth="1.8" fill="none" />
        <ellipse cx="63" cy="54" rx="4" ry="4.5" fill="#881337" />
        <ellipse cx="63" cy="54" rx="2.5" ry="3" fill="#4c0519" />
        <circle cx="61.5" cy="52.5" r="1.5" fill="#ffffff" />
        <circle cx="64.5" cy="56" r="0.8" fill="#fda4af" />

        {/* Right Eyebrow & Eye (Facing Enemy) */}
        <path d="M76 47 Q80 43 88 46" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M76 53 Q81 48 87 51" stroke="#0f172a" strokeWidth="1.8" fill="none" />
        <ellipse cx="81" cy="54" rx="4" ry="4.5" fill="#881337" />
        <ellipse cx="81" cy="54" rx="2.5" ry="3" fill="#4c0519" />
        <circle cx="79.5" cy="52.5" r="1.5" fill="#ffffff" />
        <circle cx="82.5" cy="56" r="0.8" fill="#fda4af" />

        {/* Nose */}
        <path d="M72 58 L71 61 L73 61" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />

        {/* SHOUTING DETERMINED MOUTH (Battle Cry!) */}
        <path
          d="M66 66 Q72 63 78 66 Q72 74 66 66 Z"
          fill="#881337"
          stroke="#4c0519"
          strokeWidth="1.2"
        />
        {/* Teeth */}
        <polygon points="67,66 69,68 71,66" fill="#ffffff" />
        <polygon points="73,66 75,68 77,66" fill="#ffffff" />
        {/* Tongue */}
        <ellipse cx="72" cy="71" rx="3.5" ry="1.5" fill="#fb7185" />
      </g>

      {/* ARMS & DUAL-HANDED NICHIRIN KATANA STRIKE POSE */}
      <g className={isSlashing ? 'animate-pulse' : ''}>
        {/* Left Arm grasping katana hilt */}
        <path d="M60 98 C64 104, 76 108, 86 104 L90 100" stroke="#fecdd3" strokeWidth="5" strokeLinecap="round" />

        {/* Right Arm swinging forward */}
        <path d="M84 94 C94 96, 104 98, 108 92" stroke="#fecdd3" strokeWidth="5.5" strokeLinecap="round" />

        {/* Katana Tsuba (Flame/Circular Guard) */}
        <circle cx="106" cy="94" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
        {/* Katana Tsuka (Hilt with wrap) */}
        <path d="M96 102 L106 94" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M96 102 L106 94" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />

        {/* NICHIRIN KATANA BLADE (Thrusting towards the right demon!) */}
        <path
          d="M106 94 L142 66"
          stroke="url(#katanaBladeGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter={slashElementType === 'water' ? 'url(#slayerGlow)' : 'url(#flameBladeGlow)'}
        />
        {/* Sharp Blade Edge Line */}
        <path d="M107 93 L142 65" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />

        {/* LUMINOUS SLASHING AURA AT BLADE TIP */}
        <g>
          {slashElementType === 'water' ? (
            /* Water Breathing Luminous Wave Arc */
            <g>
              <path
                d="M136 72 C146 58, 154 44, 158 28 C148 40, 138 52, 126 62 Z"
                fill="url(#waterSlashGrad)"
                filter="url(#slayerGlow)"
                opacity="0.95"
              />
              <path
                d="M138 68 Q150 48 156 30"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Water Splash Droplets */}
              <circle cx="152" cy="42" r="2.5" fill="#bae6fd" filter="url(#slayerGlow)" />
              <circle cx="158" cy="24" r="2" fill="#ffffff" />
              <circle cx="144" cy="52" r="1.5" fill="#38bdf8" />
            </g>
          ) : (
            /* Flame Breathing Luminous Inferno Arc */
            <g>
              <path
                d="M136 72 C148 58, 156 42, 158 24 C146 38, 136 52, 124 64 Z"
                fill="url(#flameSlashGrad)"
                filter="url(#flameBladeGlow)"
                opacity="0.95"
              />
              <path
                d="M138 68 Q150 46 156 26"
                stroke="#fef08a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Flame Sparks */}
              <circle cx="150" cy="38" r="3" fill="#fde047" filter="url(#flameBladeGlow)" />
              <circle cx="158" cy="20" r="2" fill="#f43f5e" />
              <circle cx="142" cy="50" r="1.8" fill="#fb923c" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

interface SlayerAvatarSvgProps {
  className?: string;
}

/**
 * Compact high-fidelity anime swordsman face icon for HP bar and HUD
 */
export const SlayerAvatarSvg: React.FC<SlayerAvatarSvgProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg viewBox="0 0 40 40" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="avatarHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0a16" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
      </defs>
      {/* Background circle badge */}
      <circle cx="20" cy="20" r="19" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
      {/* Chibi Head */}
      <ellipse cx="20" cy="21" rx="11" ry="10" fill="#fecdd3" />
      {/* Scar */}
      <path d="M14 16 Q16 13 18 15" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
      {/* Anime Hair */}
      <path
        d="M9 19 C8 12, 12 6, 20 6 C28 6, 32 12, 31 19 C29 17, 27 15, 24 15 C22 13, 18 13, 16 15 C13 15, 11 17, 9 19 Z"
        fill="url(#avatarHairGrad)"
      />
      {/* Hair spikes */}
      <polygon points="12,12 10,7 16,10" fill="url(#avatarHairGrad)" />
      <polygon points="17,8 20,4 23,8" fill="url(#avatarHairGrad)" />
      <polygon points="24,10 28,7 27,12" fill="url(#avatarHairGrad)" />
      {/* Hanafuda earring */}
      <rect x="7.5" y="21" width="3" height="6" rx="0.5" fill="#ffffff" stroke="#0f172a" strokeWidth="0.5" />
      <circle cx="9" cy="23.5" r="1" fill="#dc2626" />
      {/* Eyes */}
      <circle cx="16" cy="21" r="2" fill="#881337" />
      <circle cx="15.5" cy="20.5" r="0.7" fill="#ffffff" />
      <circle cx="24" cy="21" r="2" fill="#881337" />
      <circle cx="23.5" cy="20.5" r="0.7" fill="#ffffff" />
      {/* Confident Smile */}
      <path d="M18 25 Q20 27 22 25" stroke="#881337" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};
