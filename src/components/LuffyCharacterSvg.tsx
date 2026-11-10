import React from 'react';

interface LuffyCharacterSvgProps {
  isPunching?: boolean;
  isHit?: boolean;
  className?: string;
}

export const LuffyCharacterSvg: React.FC<LuffyCharacterSvgProps> = ({
  isPunching = false,
  isHit = false,
  className = ''
}) => {
  return (
    <svg
      viewBox="0 0 160 160"
      className={`w-full h-full select-none overflow-visible ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="luffySkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="60%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>

        <linearGradient id="luffyHatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        <linearGradient id="luffyVestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="40%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        <linearGradient id="luffyShortsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        <linearGradient id="rubberArmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="70%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>

        <filter id="punchGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f59e0b" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Trailing Wind / Speed Lines Behind Luffy */}
      <path d="M10 114 L24 114" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M6 126 L20 126" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M12 98 L28 98" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* LEGS & BLUE DENIM SHORTS & SANDALS (Firm fight stance on ship deck) */}
      <g>
        {/* Left Leg (Slightly back) */}
        <rect x="52" y="124" width="10" height="15" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        {/* White Fur Trim on Hem */}
        <ellipse cx="57" cy="138" rx="6.5" ry="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        {/* Bare Calf */}
        <rect x="53" y="139" width="8" height="13" rx="2" fill="url(#luffySkinGrad)" />
        {/* Straw Sandal */}
        <ellipse cx="57" cy="154" rx="7" ry="2.8" fill="#ca8a04" stroke="#713f12" strokeWidth="1.2" />
        <path d="M53 152 L57 154 L61 152" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Leg (Forward lunging stance) */}
        <rect x="73" y="122" width="11" height="16" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        {/* White Fur Trim */}
        <ellipse cx="78.5" cy="137" rx="7" ry="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        {/* Bare Calf */}
        <rect x="74" y="138" width="9" height="14" rx="2" fill="url(#luffySkinGrad)" />
        {/* Straw Sandal */}
        <ellipse cx="79" cy="154" rx="8" ry="3" fill="#ca8a04" stroke="#713f12" strokeWidth="1.2" />
        <path d="M74 152 L79 154 L84 152" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* YELLOW SASH SASH-BELT */}
      <path d="M48 120 Q65 125 86 120 L87 125 Q65 130 47 125 Z" fill="#facc15" stroke="#b45309" strokeWidth="1.2" />
      {/* Sash hanging knot */}
      <path d="M49 123 L44 136 L50 137 L53 124 Z" fill="#facc15" stroke="#b45309" strokeWidth="1.2" />

      {/* OPEN RED VEST & BARE CHEST WITH X-SCAR */}
      <g>
        {/* Red Vest Back */}
        <path
          d="M48 90 C48 84, 58 82, 68 82 C78 82, 88 84, 88 90 L88 122 C88 124, 48 124, 48 122 Z"
          fill="url(#luffyVestGrad)"
          stroke="#7f1d1d"
          strokeWidth="2"
        />

        {/* Bare Toned Chest Showing in Open Vest */}
        <path
          d="M58 84 Q68 86 78 84 L76 120 Q68 122 60 120 Z"
          fill="url(#luffySkinGrad)"
        />

        {/* Chest X-Scar (Signature Grand Line Scar) */}
        <path d="M62 96 L74 110" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M74 96 L62 110" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M62 96 L74 110" stroke="#991b1b" strokeWidth="1" strokeLinecap="round" />

        {/* Vest Left Flap (Trimmed with Gold Buttons) */}
        <path d="M46 86 C46 84, 56 82, 59 84 L56 122 L45 119 Z" fill="url(#luffyVestGrad)" stroke="#7f1d1d" strokeWidth="1.5" />
        <circle cx="56" cy="98" r="1.5" fill="#fde047" stroke="#854d0e" strokeWidth="0.8" />
        <circle cx="55" cy="108" r="1.5" fill="#fde047" stroke="#854d0e" strokeWidth="0.8" />

        {/* Vest Right Flap */}
        <path d="M76 84 C80 82, 90 84, 90 86 L91 119 L80 122 Z" fill="url(#luffyVestGrad)" stroke="#7f1d1d" strokeWidth="1.5" />
        <circle cx="80" cy="98" r="1.5" fill="#fde047" stroke="#854d0e" strokeWidth="0.8" />
        <circle cx="81" cy="108" r="1.5" fill="#fde047" stroke="#854d0e" strokeWidth="0.8" />
      </g>

      {/* LEFT ARM: CLENCHED FIST IN FRONT OF CHEST (Defensive Combat Ready Stance) */}
      <g>
        {/* Left Shoulder & Bicep */}
        <path d="M48 88 C40 92, 38 102, 46 108 L58 106 C52 100, 52 92, 48 88 Z" fill="url(#luffySkinGrad)" stroke="#b45309" strokeWidth="1.2" />
        {/* Forearm angled across chest */}
        <path d="M48 106 L62 104" stroke="url(#luffySkinGrad)" strokeWidth="6.5" strokeLinecap="round" />
        {/* Clenched Fist */}
        <circle cx="64" cy="104" r="5" fill="url(#luffySkinGrad)" stroke="#9a3412" strokeWidth="1.5" />
        <path d="M62 101 Q65 104 62 107" stroke="#9a3412" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* HEAD, ANIME HAIR & STRAW HAT */}
      <g>
        {/* Head Base */}
        <path
          d="M50 54 C50 38, 62 30, 74 30 C86 30, 98 38, 98 54 C98 72, 88 82, 74 82 C60 82, 50 72, 50 54 Z"
          fill="url(#luffySkinGrad)"
          stroke="#ea580c"
          strokeWidth="1.5"
        />

        {/* Ears */}
        <ellipse cx="49" cy="56" rx="3.5" ry="5.5" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
        <ellipse cx="99" cy="56" rx="3.5" ry="5.5" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />

        {/* MESSY JET-BLACK ANIME HAIR */}
        <path
          d="M47 46 C42 36, 46 24, 54 18 C62 14, 70 12, 78 14 C86 12, 94 16, 100 24 C106 32, 104 42, 99 48
             C97 44, 94 38, 90 36 C86 32, 80 32, 75 34 C70 32, 62 32, 58 36 C53 40, 51 44, 47 46 Z"
          fill="#0f172a"
        />
        {/* Hair Bangs Spikes on Forehead */}
        <polygon points="52,38 48,28 58,34" fill="#0f172a" />
        <polygon points="60,34 63,22 68,32" fill="#0f172a" />
        <polygon points="72,32 76,20 81,32" fill="#0f172a" />
        <polygon points="84,32 90,24 90,36" fill="#0f172a" />
        <polygon points="94,36 102,28 97,42" fill="#0f172a" />

        {/* THE ICONIC STRAW HAT (MUGIWARA) */}
        {/* Crown of the hat */}
        <path
          d="M52 30 C52 14, 60 10, 74 10 C88 10, 96 14, 96 30 Z"
          fill="url(#luffyHatGrad)"
          stroke="#854d0e"
          strokeWidth="2"
        />
        {/* Red Ribbon on Hat */}
        <path
          d="M52 24 C60 22, 88 22, 96 24 L96 30 C88 28, 60 28, 52 30 Z"
          fill="#dc2626"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Wide Brim of the Hat */}
        <ellipse cx="74" cy="30" rx="34" ry="7.5" fill="url(#luffyHatGrad)" stroke="#854d0e" strokeWidth="2.5" />
        {/* Straw Woven Texture Arcs */}
        <path d="M46 30 Q74 34 102 30" stroke="#ca8a04" strokeWidth="1.5" fill="none" />

        {/* EYES (Big Round Determined Anime Eyes) */}
        {/* Left Eyebrow & Eye */}
        <path d="M57 45 Q64 42 68 46" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
        <ellipse cx="63" cy="52" rx="4.5" ry="5.5" fill="#0f172a" />
        <circle cx="61.5" cy="50" r="1.8" fill="#ffffff" />
        <circle cx="64.5" cy="54" r="0.8" fill="#ffffff" />

        {/* Right Eyebrow & Eye */}
        <path d="M78 46 Q82 42 89 45" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
        <ellipse cx="83" cy="52" rx="4.5" ry="5.5" fill="#0f172a" />
        <circle cx="81.5" cy="50" r="1.8" fill="#ffffff" />
        <circle cx="84.5" cy="54" r="0.8" fill="#ffffff" />

        {/* SIGNATURE EYE SCAR (Luka Jahitan Kecil di Bawah Mata Kiri) */}
        <path d="M59 59 L67 59" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M61 57 L61 61" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M65 57 L65 61" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />

        {/* Small Nose */}
        <path d="M73 57 L72 60 L75 60" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" />

        {/* HUGE TOOTHY DETERMINED GRIN (Signature Luffy Smile!) */}
        <path
          d="M62 65 Q73 63 84 65 Q73 78 62 65 Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="2"
        />
        {/* Teeth divisions */}
        <line x1="68" y1="65" x2="68" y2="73" stroke="#0f172a" strokeWidth="1.2" />
        <line x1="73" y1="64" x2="73" y2="74" stroke="#0f172a" strokeWidth="1.2" />
        <line x1="78" y1="65" x2="78" y2="73" stroke="#0f172a" strokeWidth="1.2" />
      </g>

      {/* RIGHT ARM & GOMU-GOMU PUNCH (Attacking to the Right!) */}
      <g>
        {isPunching ? (
          /* RUBBER STRETCH PUNCH ANIMATION: Arm stretches across the screen to the right with huge impact fist! */
          <g className="animate-punch-stretch origin-left">
            {/* Stretching Rubber Arm Shaft */}
            <path
              d="M86 92 C106 90, 126 88, 150 86"
              stroke="url(#rubberArmGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#punchGlow)"
            />
            {/* Muscle highlight */}
            <path
              d="M88 90 C106 88, 126 86, 148 84"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Massive Clenched Fist at Tip */}
            <g transform="translate(142, 72)">
              <circle cx="12" cy="14" r="13" fill="url(#luffySkinGrad)" stroke="#9a3412" strokeWidth="2.5" filter="url(#punchGlow)" />
              {/* Clenched Knuckles */}
              <circle cx="21" cy="8" r="5" fill="#fed7aa" stroke="#9a3412" strokeWidth="1.5" />
              <circle cx="23" cy="14" r="5" fill="#fed7aa" stroke="#9a3412" strokeWidth="1.5" />
              <circle cx="21" cy="20" r="5" fill="#fed7aa" stroke="#9a3412" strokeWidth="1.5" />
              {/* Impact Wind Rings */}
              <circle cx="14" cy="14" r="18" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" opacity="0.85" />
            </g>
          </g>
        ) : (
          /* Normal Combat Idle Pose: Right Arm Cocked Back Ready to Strike */
          <g>
            {/* Right Shoulder & Cocked Bicep */}
            <path d="M86 90 C96 92, 106 96, 110 102 C108 108, 98 106, 90 100 Z" fill="url(#luffySkinGrad)" stroke="#b45309" strokeWidth="1.5" />
            {/* Forearm Cocked Back */}
            <path d="M106 100 L116 94" stroke="url(#luffySkinGrad)" strokeWidth="7" strokeLinecap="round" />
            {/* Clenched Fist */}
            <circle cx="118" cy="93" r="6" fill="url(#luffySkinGrad)" stroke="#9a3412" strokeWidth="1.8" />
            <path d="M115 90 Q119 93 115 96" stroke="#9a3412" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
};

export const LuffyAvatarSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg viewBox="0 0 40 40" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle badge */}
      <circle cx="20" cy="20" r="19" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="2" />
      {/* Chibi Head */}
      <ellipse cx="20" cy="22" rx="10.5" ry="9.5" fill="#fed7aa" />
      {/* Straw Hat */}
      <path d="M11 16 C11 9, 15 7, 20 7 C25 7, 29 9, 29 16 Z" fill="#facc15" stroke="#854d0e" strokeWidth="1.2" />
      <path d="M11 14 C15 13, 25 13, 29 14 L29 16 C25 15, 15 15, 11 16 Z" fill="#dc2626" />
      <ellipse cx="20" cy="16" rx="15" ry="3.5" fill="#facc15" stroke="#854d0e" strokeWidth="1.2" />
      {/* Eye Scar */}
      <line x1="14" y1="24" x2="17" y2="24" stroke="#dc2626" strokeWidth="1" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="16" cy="21" r="2" fill="#0f172a" />
      <circle cx="15.5" cy="20.5" r="0.7" fill="#ffffff" />
      <circle cx="24" cy="21" r="2" fill="#0f172a" />
      <circle cx="23.5" cy="20.5" r="0.7" fill="#ffffff" />
      {/* Big Grin */}
      <path d="M16 26 Q20 30 24 26 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
    </svg>
  );
};
