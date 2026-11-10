import React from 'react';

export type PirateMonsterType = 'kurotako' | 'arlong' | 'skeleton' | 'golem' | 'leviathan';

interface PirateMonsterSvgProps {
  monsterType: PirateMonsterType;
  className?: string;
  isAttacking?: boolean;
  isHit?: boolean;
}

export const PirateMonsterSvg: React.FC<PirateMonsterSvgProps> = ({
  monsterType,
  className = '',
  isAttacking = false,
  isHit = false
}) => {
  switch (monsterType) {
    case 'kurotako':
      // Wave 1: Gurita Kurotako - Giant reddish-purple kraken octopus with angry yellow eyes, 4 large waving tentacles
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none overflow-visible ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="takoBodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#c026d3" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#3b0764" />
            </radialGradient>
            <linearGradient id="takoTentacleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
            <filter id="takoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#c026d3" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* BACK TENTACLES WAVING IN THE AIR */}
          {/* Back Left High Tentacle */}
          <path
            d="M48 90 C30 70, 10 50, 16 30 C22 15, 38 28, 42 46 C44 56, 42 70, 52 86 Z"
            fill="url(#takoTentacleGrad)"
            stroke="#3b0764"
            strokeWidth="2"
          />
          {/* Suction Cups on Back Left */}
          <circle cx="20" cy="38" r="3" fill="#fbcfe8" stroke="#86198f" strokeWidth="1" />
          <circle cx="28" cy="50" r="3.5" fill="#fbcfe8" stroke="#86198f" strokeWidth="1" />
          <circle cx="36" cy="65" r="4" fill="#fbcfe8" stroke="#86198f" strokeWidth="1" />

          {/* Back Right High Tentacle */}
          <path
            d="M112 90 C130 70, 150 50, 144 30 C138 15, 122 28, 118 46 C116 56, 118 70, 108 86 Z"
            fill="url(#takoTentacleGrad)"
            stroke="#3b0764"
            strokeWidth="2"
          />
          {/* Suction Cups on Back Right */}
          <circle cx="140" cy="38" r="3" fill="#fbcfe8" stroke="#86198f" strokeWidth="1" />
          <circle cx="132" cy="50" r="3.5" fill="#fbcfe8" stroke="#86198f" strokeWidth="1" />
          <circle cx="124" cy="65" r="4" fill="#fbcfe8" stroke="#86198f" strokeWidth="1" />

          {/* Water Splash & Foam around base */}
          <ellipse cx="80" cy="148" rx="55" ry="10" fill="#0284c7" opacity="0.6" />
          <path d="M30 148 Q40 140 55 148 Q70 142 85 148 Q100 141 115 148 Q130 142 140 148" stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round" />

          {/* MAIN ROUND BULBOUS HEAD / MANTLE */}
          <path
            d="M44 95 C38 65, 50 34, 80 34 C110 34, 122 65, 116 95 C114 116, 98 126, 80 126 C62 126, 46 116, 44 95 Z"
            fill="url(#takoBodyGrad)"
            stroke="#2e1065"
            strokeWidth="2.5"
            filter="url(#takoGlow)"
          />

          {/* Mottled Spots on Head */}
          <circle cx="68" cy="48" r="4" fill="#fae8ff" opacity="0.4" />
          <circle cx="88" cy="46" r="5" fill="#fae8ff" opacity="0.4" />
          <circle cx="98" cy="58" r="3.5" fill="#fae8ff" opacity="0.4" />
          <circle cx="60" cy="60" r="3" fill="#fae8ff" opacity="0.4" />

          {/* ANGRY INTENSE YELLOW EYES WITH BLACK RECTANGLE PUPILS */}
          {/* Left Eye */}
          <path d="M54 78 Q64 72 73 78 Q68 90 56 86 Z" fill="#fef08a" stroke="#1e1b4b" strokeWidth="2" />
          <ellipse cx="64" cy="80" rx="2" ry="4" fill="#020617" transform="rotate(-10 64 80)" />
          <circle cx="62" cy="77" r="1.2" fill="#ffffff" />
          <path d="M52 74 L74 80" stroke="#3b0764" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Eye */}
          <path d="M87 78 Q96 72 106 78 Q104 86 92 90 Z" fill="#fef08a" stroke="#1e1b4b" strokeWidth="2" />
          <ellipse cx="96" cy="80" rx="2" ry="4" fill="#020617" transform="rotate(10 96 80)" />
          <circle cx="94" cy="77" r="1.2" fill="#ffffff" />
          <path d="M86 80 L108 74" stroke="#3b0764" strokeWidth="2.5" strokeLinecap="round" />

          {/* Octopus Siphon / Snout (Ready to squirt ink) */}
          <ellipse cx="80" cy="98" rx="8" ry="6" fill="#701a75" stroke="#3b0764" strokeWidth="1.8" />
          <ellipse cx="80" cy="99" rx="4" ry="2.5" fill="#0f172a" />

          {/* FRONT STRIKING TENTACLES */}
          {/* Front Left Tentacle (Reaching directly at Luffy on the Left!) */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path
              d="M58 114 C40 114, 20 120, 10 110 C4 102, 12 94, 22 98 C36 102, 50 106, 62 118 Z"
              fill="url(#takoTentacleGrad)"
              stroke="#2e1065"
              strokeWidth="2.2"
            />
            {/* Big Suction Cups on Front Left */}
            <circle cx="16" cy="106" r="3.5" fill="#fbcfe8" stroke="#86198f" strokeWidth="1.2" />
            <circle cx="28" cy="105" r="4" fill="#fbcfe8" stroke="#86198f" strokeWidth="1.2" />
            <circle cx="42" cy="110" r="4.5" fill="#fbcfe8" stroke="#86198f" strokeWidth="1.2" />
          </g>

          {/* Front Right Tentacle (Coiling on deck) */}
          <path
            d="M102 114 C120 114, 140 120, 150 110 C156 102, 148 94, 138 98 C124 102, 110 106, 98 118 Z"
            fill="url(#takoTentacleGrad)"
            stroke="#2e1065"
            strokeWidth="2.2"
          />
          <circle cx="144" cy="106" r="3.5" fill="#fbcfe8" stroke="#86198f" strokeWidth="1.2" />
          <circle cx="132" cy="105" r="4" fill="#fbcfe8" stroke="#86198f" strokeWidth="1.2" />
          <circle cx="118" cy="110" r="4.5" fill="#fbcfe8" stroke="#86198f" strokeWidth="1.2" />

          {/* Ink Drops Splashing */}
          <circle cx="68" cy="110" r="2.5" fill="#1e1b4b" />
          <circle cx="74" cy="118" r="3" fill="#1e1b4b" />
        </svg>
      );

    case 'arlong':
      // Wave 2: Manusia Hiu Gergaji (Arlong) - Pale blue sawshark fishman standing tall, sharp dorsal fin, saw-tooth nose, serrated teeth, holding ship anchor
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none overflow-visible ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sharkSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="sharkUnderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="anchorIronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="60%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <filter id="sharkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#0284c7" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* MASSIVE SHARP DORSAL FIN ON BACK */}
          <path
            d="M106 70 C125 50, 142 35, 150 20 C146 45, 136 75, 116 88 Z"
            fill="url(#sharkSkinGrad)"
            stroke="#0369a1"
            strokeWidth="2.5"
          />

          {/* STRONG LEGS & FISHMAN BERMUDA SHORTS */}
          {/* Bermuda Shorts */}
          <path d="M52 118 L100 118 L104 136 L84 136 L80 126 L74 136 L50 136 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <path d="M54 122 L98 122" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />

          {/* Webbed Shark Feet Standing firmly on deck */}
          <rect x="54" y="136" width="12" height="15" rx="3" fill="url(#sharkSkinGrad)" />
          <path d="M50 152 L68 152 L72 155 L48 155 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.2" />

          <rect x="84" y="136" width="12" height="15" rx="3" fill="url(#sharkSkinGrad)" />
          <path d="M80 152 L98 152 L102 155 L78 155 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.2" />

          {/* FISHMAN MUSCULAR TORSO WITH GILLS & SUN PIRATES TATOO */}
          <path
            d="M48 80 C48 72, 60 70, 76 70 C92 70, 104 72, 104 80 L102 120 L50 120 Z"
            fill="url(#sharkSkinGrad)"
            stroke="#0369a1"
            strokeWidth="2.5"
          />
          {/* Pale Underbelly */}
          <path d="M60 74 Q76 76 92 74 L90 118 Q76 122 62 118 Z" fill="url(#sharkUnderGrad)" />

          {/* Shark Gills on Neck & Chest */}
          <path d="M52 86 C55 88, 55 94, 52 96" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 98 C53 100, 53 106, 50 108" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 86 C97 88, 97 94, 100 96" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />

          {/* Sun Pirates Crimson Crest on Chest */}
          <circle cx="76" cy="94" r="7" fill="#dc2626" />
          <circle cx="76" cy="94" r="4.5" fill="#f8fafc" />
          <path d="M76 83 L76 105 M65 94 L87 94" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />

          {/* SHARK HEAD & JAGGED SAWTOOTH NOSE (Signature Arlong) */}
          <g>
            {/* Head Base */}
            <path
              d="M52 48 C52 30, 64 22, 78 22 C92 22, 104 30, 104 48 C104 66, 92 74, 78 74 C64 74, 52 66, 52 48 Z"
              fill="url(#sharkSkinGrad)"
              stroke="#0369a1"
              strokeWidth="2.5"
            />

            {/* Black Fishman Cap with Sun Badge */}
            <path d="M52 30 C56 16, 96 16, 102 30 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="78" cy="24" r="3.5" fill="#f59e0b" />

            {/* Sawshark Serrated Long Nose Extending to the Left! */}
            <path
              d="M56 46 L20 42 L25 46 L18 48 L26 51 L21 54 L56 54 Z"
              fill="url(#sharkSkinGrad)"
              stroke="#0369a1"
              strokeWidth="2"
            />

            {/* Piercing Cold Shark Eyes */}
            <ellipse cx="64" cy="40" rx="4.5" ry="5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.5" />
            <ellipse cx="63" cy="40" rx="1.8" ry="3.5" fill="#0f172a" />
            <path d="M56 36 L70 38" stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" />

            {/* WIDE MOUTH FILLED WITH SERRATED RAZOR TEETH */}
            <path
              d="M54 58 Q76 66 98 58 Q76 74 54 58 Z"
              fill="#881337"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Serrated Triangle Teeth (Top & Bottom) */}
            <polygon points="56,58 60,63 64,58" fill="#ffffff" />
            <polygon points="64,58 68,64 72,58" fill="#ffffff" />
            <polygon points="72,58 76,64 80,58" fill="#ffffff" />
            <polygon points="80,58 84,64 88,58" fill="#ffffff" />
            <polygon points="88,58 92,63 96,58" fill="#ffffff" />
            <polygon points="62,68 66,63 70,68" fill="#ffffff" />
            <polygon points="74,69 78,63 82,69" fill="#ffffff" />
            <polygon points="84,68 88,63 92,68" fill="#ffffff" />
          </g>

          {/* ARMS & HEAVY SHIP ANCHOR WEAPON */}
          {/* Left Arm: Thrusting Anchor toward Luffy */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path d="M50 82 C38 86, 26 94, 28 106 L38 104 C36 96, 44 90, 52 88 Z" fill="url(#sharkSkinGrad)" stroke="#0369a1" strokeWidth="2" />
            {/* Clenched Claw Hand */}
            <circle cx="28" cy="106" r="6" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />

            {/* HEAVY SHIP ANCHOR (Besi Jangkar Kapal) */}
            <g transform="translate(10, 80) rotate(-25 15 25)">
              {/* Anchor Shaft */}
              <rect x="14" y="0" width="6" height="50" rx="2" fill="url(#anchorIronGrad)" stroke="#0f172a" strokeWidth="1.5" />
              {/* Anchor Ring at Top */}
              <circle cx="17" cy="-4" r="6" stroke="url(#anchorIronGrad)" strokeWidth="3" fill="none" />
              {/* Crossbar */}
              <rect x="2" y="10" width="30" height="4" rx="1.5" fill="url(#anchorIronGrad)" stroke="#0f172a" strokeWidth="1" />
              {/* Curved Flukes with Sharp Points */}
              <path d="M2 42 C6 56, 28 56, 32 42" stroke="url(#anchorIronGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <polygon points="0,42 4,36 6,44" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
              <polygon points="34,42 30,36 28,44" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
            </g>
          </g>

          {/* Right Arm */}
          <path d="M102 82 C114 86, 124 94, 122 106 L112 108 C112 98, 106 90, 100 88 Z" fill="url(#sharkSkinGrad)" stroke="#0369a1" strokeWidth="2" />
        </svg>
      );

    case 'skeleton':
      // Wave 3: Bajak Laut Hantu (Skeleton Pirate) - Living skeletal pirate captain in moss-green & gray ragged coat, glowing neon green eyes, curved cutlass
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none overflow-visible ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skelBoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="ghostCoatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3f6212" />
              <stop offset="60%" stopColor="#14532d" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="cutlassBladeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <filter id="ghostGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22c55e" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Eerie Ghostly Green Mist around Skeleton */}
          <path d="M30 145 Q45 130 65 145 Q85 132 105 145 Q125 135 140 145" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" opacity="0.4" filter="url(#ghostGlow)" />

          {/* BONE LEGS & WOODEN PEG LEG */}
          {/* Left Bone Leg */}
          <rect x="56" y="124" width="6" height="26" rx="2" fill="url(#skelBoneGrad)" stroke="#334155" strokeWidth="1.2" />
          {/* Boot on bone leg */}
          <path d="M52 142 L64 142 L66 154 L48 154 Z" fill="#451a03" stroke="#1f2937" strokeWidth="1.2" />

          {/* Right Wooden Peg Leg (Kaki Kayu Bajak Laut Khas) */}
          <path d="M86 124 L94 124 L92 154 L88 154 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <circle cx="90" cy="126" r="4" fill="#d97706" />

          {/* RAGGED TORN PIRATE CAPTAIN COAT (Compang-camping Hijau Lumut) */}
          <path
            d="M42 80 C42 74, 56 70, 75 70 C94 70, 108 74, 108 80 L112 134 L98 126 L88 132 L75 124 L62 132 L52 126 L38 134 Z"
            fill="url(#ghostCoatGrad)"
            stroke="#052e16"
            strokeWidth="2.5"
          />
          {/* Gold Tattered Epaulets */}
          <path d="M38 78 Q48 76 54 84 L40 88 Z" fill="#eab308" stroke="#713f12" strokeWidth="1" />
          <path d="M112 78 Q102 76 96 84 L110 88 Z" fill="#eab308" stroke="#713f12" strokeWidth="1" />

          {/* SKELETAL RIBCAGE SHOWING THROUGH COAT */}
          <g>
            <rect x="73" y="74" width="4" height="42" fill="url(#skelBoneGrad)" />
            {/* Ribs */}
            <path d="M60 84 Q75 90 90 84" stroke="url(#skelBoneGrad)" strokeWidth="2.5" fill="none" />
            <path d="M58 92 Q75 98 92 92" stroke="url(#skelBoneGrad)" strokeWidth="2.5" fill="none" />
            <path d="M60 100 Q75 106 90 100" stroke="url(#skelBoneGrad)" strokeWidth="2.5" fill="none" />
            <path d="M64 108 Q75 114 86 108" stroke="url(#skelBoneGrad)" strokeWidth="2" fill="none" />
          </g>

          {/* PIRATE SKULL HEAD & TRICORNE HAT */}
          <g>
            {/* Skull Base */}
            <path
              d="M54 44 C54 28, 64 22, 75 22 C86 22, 96 28, 96 44 C96 56, 90 62, 86 68 C82 72, 68 72, 64 68 C60 62, 54 56, 54 44 Z"
              fill="url(#skelBoneGrad)"
              stroke="#0f172a"
              strokeWidth="2.5"
            />

            {/* PIRATE CAPTAIN TRICORNE HAT */}
            <path
              d="M34 26 C44 8, 106 8, 116 26 C120 32, 104 30, 75 32 C46 30, 30 32, 34 26 Z"
              fill="#0f172a"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            {/* Skull & Crossbones on Hat */}
            <circle cx="75" cy="22" r="3.5" fill="#ffffff" />
            <line x1="69" y1="18" x2="81" y2="26" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="69" y1="26" x2="81" y2="18" stroke="#ffffff" strokeWidth="1.2" />

            {/* PIERCING NEON GREEN GLOWING GHOST EYES */}
            {/* Left Eye Socket */}
            <ellipse cx="64" cy="46" rx="5" ry="6" fill="#020617" />
            <circle cx="64" cy="46" r="3" fill="#22c55e" filter="url(#ghostGlow)" />
            <circle cx="64" cy="46" r="1.2" fill="#ffffff" />

            {/* Right Eye Socket (with Skull Eyepatch Strap) */}
            <ellipse cx="86" cy="46" rx="5" ry="6" fill="#020617" />
            <circle cx="86" cy="46" r="3" fill="#22c55e" filter="url(#ghostGlow)" />
            <circle cx="86" cy="46" r="1.2" fill="#ffffff" />

            {/* Inverted Heart Nose Cavity */}
            <path d="M75 54 L72 58 L78 58 Z" fill="#020617" />

            {/* Skeletal Teeth / Grinning Jaw */}
            <rect x="65" y="62" width="20" height="9" rx="1.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="69" y1="62" x2="69" y2="71" stroke="#0f172a" strokeWidth="1.2" />
            <line x1="73" y1="62" x2="73" y2="71" stroke="#0f172a" strokeWidth="1.2" />
            <line x1="77" y1="62" x2="77" y2="71" stroke="#0f172a" strokeWidth="1.2" />
            <line x1="81" y1="62" x2="81" y2="71" stroke="#0f172a" strokeWidth="1.2" />
          </g>

          {/* ARMS & CURVED PIRATE CUTLASS SWORD */}
          {/* Left Bone Arm: Brandishing Cutlass toward Luffy! */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path d="M48 84 L26 94" stroke="url(#skelBoneGrad)" strokeWidth="5" strokeLinecap="round" />
            {/* Skeletal Hand */}
            <circle cx="24" cy="95" r="4.5" fill="url(#skelBoneGrad)" stroke="#334155" strokeWidth="1" />

            {/* CURVED PIRATE CUTLASS (Pedang Bengkok) */}
            <g transform="translate(18, 55)">
              {/* Cutlass Guard & Hilt */}
              <circle cx="6" cy="40" r="5" fill="#eab308" stroke="#713f12" strokeWidth="1.5" />
              <rect x="5" y="40" width="3" height="12" rx="1" fill="#78350f" stroke="#451a03" />
              {/* Curved Steel Blade */}
              <path
                d="M6 38 C4 20, -4 6, -14 -4 C-8 8, 2 24, 7 38 Z"
                fill="url(#cutlassBladeGrad)"
                stroke="#1e293b"
                strokeWidth="1.8"
                filter="url(#ghostGlow)"
              />
              <path d="M6 38 C4 20, -4 6, -14 -4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </g>

          {/* Right Arm */}
          <path d="M104 84 L122 96" stroke="url(#skelBoneGrad)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="124" cy="98" r="4.5" fill="url(#skelBoneGrad)" stroke="#334155" strokeWidth="1" />
        </svg>
      );

    case 'golem':
      // Wave 4: Golem Karang Laut (Coral Reef Golem) - Huge stone titan covered in colorful sea corals, starfishes, seaweeds, glowing ocean blue eyes
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none overflow-visible ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="coralRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="coralOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="coralGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* GIANT STONE COLUMN LEGS */}
          <rect x="46" y="122" width="22" height="32" rx="4" fill="url(#rockGrad)" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="88" y="122" width="22" height="32" rx="4" fill="url(#rockGrad)" stroke="#0f172a" strokeWidth="2.5" />
          {/* Rock fissures */}
          <path d="M54 130 L60 138 L56 148" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          <path d="M96 132 L102 140 L98 150" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

          {/* MASSIVE BOULDER TORSO WITH JAGGED CORAL CRUST */}
          <path
            d="M34 76 C34 68, 52 64, 78 64 C104 64, 122 68, 122 76 L126 124 C126 128, 30 128, 30 124 Z"
            fill="url(#rockGrad)"
            stroke="#0f172a"
            strokeWidth="3"
          />

          {/* Seaweed Tendrils Hanging */}
          <path d="M42 96 C40 108, 44 116, 38 126" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <path d="M46 100 C44 112, 48 118, 44 128" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          <path d="M110 98 C114 110, 110 118, 116 128" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />

          {/* Colorful Sea Corals Sprouting from Shoulders */}
          {/* Left Shoulder Coral Branches */}
          <path d="M28 72 C22 56, 16 46, 20 38 C24 44, 28 50, 34 62 Z" fill="url(#coralRed)" stroke="#881337" strokeWidth="1.5" />
          <path d="M36 68 C34 52, 38 42, 42 34 C44 42, 42 52, 44 64 Z" fill="url(#coralOrange)" stroke="#9a3412" strokeWidth="1.5" />
          <circle cx="20" cy="38" r="3" fill="#f43f5e" />
          <circle cx="42" cy="34" r="3" fill="#fb923c" />

          {/* Right Shoulder Coral Branches */}
          <path d="M124 72 C130 56, 136 46, 132 38 C128 44, 124 50, 118 62 Z" fill="url(#coralRed)" stroke="#881337" strokeWidth="1.5" />
          <path d="M116 68 C118 52, 114 42, 110 34 C108 42, 110 52, 108 64 Z" fill="url(#coralOrange)" stroke="#9a3412" strokeWidth="1.5" />
          <circle cx="132" cy="38" r="3" fill="#f43f5e" />
          <circle cx="110" cy="34" r="3" fill="#fb923c" />

          {/* Bright Yellow Starfish Attached to Chest */}
          <g transform="translate(68, 86) scale(0.9)">
            <polygon points="12,0 15,9 24,9 17,14 20,23 12,18 4,23 7,14 0,9 9,9" fill="#facc15" stroke="#b45309" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="1.5" fill="#ca8a04" />
          </g>

          {/* MONOLITH STONE GOLEM HEAD */}
          <path
            d="M50 42 C50 24, 62 18, 78 18 C94 18, 106 24, 106 42 C106 62, 96 68, 78 68 C60 68, 50 62, 50 42 Z"
            fill="url(#rockGrad)"
            stroke="#0f172a"
            strokeWidth="3"
          />

          {/* Head Rock Plate Fissures */}
          <path d="M78 18 L76 30 L82 36 L78 46" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

          {/* GLOWING OCEAN-BLUE CRACK EYES */}
          <rect x="58" y="38" width="12" height="7" rx="2" fill="#38bdf8" filter="url(#coralGlow)" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="59" y1="41.5" x2="69" y2="41.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

          <rect x="86" y="38" width="12" height="7" rx="2" fill="#38bdf8" filter="url(#coralGlow)" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="87" y1="41.5" x2="97" y2="41.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

          {/* Heavy Stone Jaw / Teeth */}
          <rect x="66" y="52" width="24" height="8" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="72" y1="52" x2="72" y2="60" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="78" y1="52" x2="78" y2="60" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="84" y1="52" x2="84" y2="60" stroke="#0f172a" strokeWidth="1.5" />

          {/* MASSIVE ROCK CRAG ARMS */}
          {/* Left Fist: Lunging forward to smash */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <rect x="18" y="80" width="22" height="38" rx="6" fill="url(#rockGrad)" stroke="#0f172a" strokeWidth="2.5" />
            {/* Massive Stone Knuckles */}
            <circle cx="28" cy="116" r="12" fill="#475569" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M22 110 L34 110 M20 116 L36 116 M22 122 L34 122" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            {/* Small Barnacles on Fist */}
            <circle cx="24" cy="100" r="3" fill="#cbd5e1" stroke="#475569" />
            <circle cx="32" cy="104" r="2.5" fill="#cbd5e1" stroke="#475569" />
          </g>

          {/* Right Arm */}
          <rect x="116" y="80" width="22" height="38" rx="6" fill="url(#rockGrad)" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="128" cy="116" r="11" fill="#475569" stroke="#0f172a" strokeWidth="2.5" />
        </svg>
      );

    case 'leviathan':
    default:
      // Wave 5 (BOSS): Naga Laut Leviathan - Colossal deep blue & gold sea dragon, wide fanged roar, grand dragon horns & whisker whiskers
      return (
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full select-none overflow-visible ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="dragonScaleGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <linearGradient id="dragonGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="dragonFinGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <filter id="bossGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#f59e0b" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* SWIRLING OCEAN STORMS & TSUNAMI BASE */}
          <ellipse cx="80" cy="148" rx="65" ry="12" fill="#0369a1" opacity="0.7" />
          <path d="M15 146 Q35 136 60 146 Q85 138 110 146 Q135 137 150 146" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <path d="M25 152 Q50 144 80 152 Q110 145 135 152" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />

          {/* MASSIVE COILING SERPENTINE DRAGON BODY */}
          {/* Back Body Coil */}
          <path
            d="M100 145 C125 140, 148 120, 142 95 C136 75, 115 85, 105 105 Z"
            fill="url(#dragonScaleGrad)"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />
          {/* Golden Spines along back coil */}
          <polygon points="135,115 148,110 140,125" fill="url(#dragonGoldGrad)" />
          <polygon points="142,95 155,90 144,105" fill="url(#dragonGoldGrad)" />
          <polygon points="134,80 146,72 135,88" fill="url(#dragonGoldGrad)" />

          {/* Main Upright Chest & Neck (Towering over the battle!) */}
          <path
            d="M48 145 C42 110, 52 80, 68 70 C88 68, 108 72, 114 85 C120 110, 118 145, 114 148 Z"
            fill="url(#dragonScaleGrad)"
            stroke="#1d4ed8"
            strokeWidth="3"
          />

          {/* Golden Dragon Scale Belly Plates */}
          <path d="M66 84 Q88 88 106 84 L104 96 Q88 100 68 96 Z" fill="url(#dragonGoldGrad)" stroke="#78350f" strokeWidth="1.2" />
          <path d="M68 98 Q88 102 104 98 L102 110 Q88 114 70 110 Z" fill="url(#dragonGoldGrad)" stroke="#78350f" strokeWidth="1.2" />
          <path d="M70 112 Q88 116 102 112 L100 124 Q88 128 72 124 Z" fill="url(#dragonGoldGrad)" stroke="#78350f" strokeWidth="1.2" />
          <path d="M72 126 Q88 130 100 126 L98 138 Q88 142 74 138 Z" fill="url(#dragonGoldGrad)" stroke="#78350f" strokeWidth="1.2" />

          {/* IMPERIAL SEA DRAGON HEAD & JAW */}
          <g>
            {/* Dragon Head Base */}
            <path
              d="M44 48 C44 26, 62 16, 84 16 C106 16, 122 26, 122 48 C122 68, 112 78, 84 78 C56 78, 44 68, 44 48 Z"
              fill="url(#dragonScaleGrad)"
              stroke="#1d4ed8"
              strokeWidth="3"
            />

            {/* GRAND ANTLER-LIKE GOLDEN HORNS (Sepasang Tanduk Emas Megah) */}
            {/* Left Horn */}
            <path
              d="M58 26 C44 14, 30 2, 26 -4 C36 4, 46 16, 52 24 Z"
              fill="url(#dragonGoldGrad)"
              stroke="#78350f"
              strokeWidth="1.5"
              filter="url(#bossGlow)"
            />
            <path d="M40 10 L32 2 L42 8" stroke="url(#dragonGoldGrad)" strokeWidth="3" strokeLinecap="round" />

            {/* Right Horn */}
            <path
              d="M106 26 C120 14, 134 2, 138 -4 C128 4, 118 16, 112 24 Z"
              fill="url(#dragonGoldGrad)"
              stroke="#78350f"
              strokeWidth="1.5"
              filter="url(#bossGlow)"
            />
            <path d="M124 10 L132 2 L122 8" stroke="url(#dragonGoldGrad)" strokeWidth="3" strokeLinecap="round" />

            {/* Crown Fin crest between horns */}
            <polygon points="76,16 84,4 92,16" fill="url(#dragonFinGrad)" stroke="#0284c7" strokeWidth="1.5" />

            {/* FIERCE GOLDEN DRAGON EYES (Mata Emas Mengintimidasi) */}
            <ellipse cx="64" cy="40" rx="6" ry="7" fill="#fef08a" stroke="#0f172a" strokeWidth="2" filter="url(#bossGlow)" />
            <polygon points="63,33 65,47 62,47" fill="#dc2626" />
            <circle cx="62" cy="38" r="1.5" fill="#ffffff" />

            <ellipse cx="102" cy="40" rx="6" ry="7" fill="#fef08a" stroke="#0f172a" strokeWidth="2" filter="url(#bossGlow)" />
            <polygon points="103,33 105,47 102,47" fill="#dc2626" />
            <circle cx="104" cy="38" r="1.5" fill="#ffffff" />

            {/* Dragon Snout Ridge */}
            <path d="M72 38 Q84 32 94 38 L92 48 Q84 46 74 48 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Nostrils */}
            <circle cx="76" cy="45" r="2" fill="#020617" />
            <circle cx="90" cy="45" r="2" fill="#020617" />

            {/* LONG FLOWING ORIENTAL DRAGON WHISKERS (Kumis Panjang Naga Timur Mengombak ke Kiri Menghadap Luffy) */}
            <path
              d="M72 46 C50 44, 15 52, 2 64 C12 60, 35 55, 68 52"
              stroke="url(#dragonGoldGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              filter="url(#bossGlow)"
            />
            <path
              d="M94 46 C116 44, 145 52, 158 64 C148 60, 125 55, 98 52"
              stroke="url(#dragonGoldGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              filter="url(#bossGlow)"
            />

            {/* ROARING OPEN DRAGON MAW WITH SHARP FANGS */}
            <path
              d="M56 56 Q84 48 110 56 Q84 76 56 56 Z"
              fill="#450a0a"
              stroke="#1e3a8a"
              strokeWidth="2.5"
            />
            {/* Top Razor Fangs */}
            <polygon points="62,56 66,66 70,56" fill="#ffffff" stroke="#991b1b" strokeWidth="0.8" />
            <polygon points="74,56 78,64 82,56" fill="#ffffff" stroke="#991b1b" strokeWidth="0.8" />
            <polygon points="84,56 88,64 92,56" fill="#ffffff" stroke="#991b1b" strokeWidth="0.8" />
            <polygon points="96,56 100,66 104,56" fill="#ffffff" stroke="#991b1b" strokeWidth="0.8" />
            {/* Bottom Fangs */}
            <polygon points="68,70 72,62 76,70" fill="#ffffff" stroke="#991b1b" strokeWidth="0.8" />
            <polygon points="90,70 94,62 98,70" fill="#ffffff" stroke="#991b1b" strokeWidth="0.8" />
            {/* Dragon Fire/Water Blast Glow from Throat */}
            <circle cx="84" cy="62" r="6" fill="#38bdf8" filter="url(#bossGlow)" opacity="0.8" />
          </g>

          {/* DRAGON CLAWS READY TO CRUSH (Facing Luffy on the Left!) */}
          <g className={isAttacking ? 'animate-pulse' : ''}>
            <path d="M52 108 C36 108, 18 114, 10 124 C18 118, 36 120, 48 122 Z" fill="#0f172a" stroke="#1d4ed8" strokeWidth="2.5" />
            {/* 3 Razor Sharp Golden Dragon Talons */}
            <polygon points="10,124 -4,116 8,126" fill="url(#dragonGoldGrad)" stroke="#78350f" strokeWidth="1.2" />
            <polygon points="8,128 -6,128 6,132" fill="url(#dragonGoldGrad)" stroke="#78350f" strokeWidth="1.2" />
            <polygon points="10,132 0,138 10,136" fill="url(#dragonGoldGrad)" stroke="#78350f" strokeWidth="1.2" />
            {/* Golden Pearl held in palm */}
            <circle cx="4" cy="122" r="4.5" fill="#fde047" filter="url(#bossGlow)" />
          </g>

          {/* Right Fin */}
          <path d="M116 108 C132 108, 148 114, 154 122 C146 118, 130 118, 118 120 Z" fill="#0f172a" stroke="#1d4ed8" strokeWidth="2.5" />
        </svg>
      );
  }
};
