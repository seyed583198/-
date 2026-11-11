import React from 'react';

interface SeyedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  animated?: boolean;
  className?: string;
}

export const SeyedLogo: React.FC<SeyedLogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = '',
}) => {
  const dimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-28 h-28',
  }[size];

  const titleSize = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-5xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Custom Athletic Shield & Muscular V-Taper Barbell Crest */}
      <div className={`relative ${dimensions} shrink-0 group`}>
        {/* Ambient Athletic Glow */}
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr from-lime-500/40 via-emerald-500/25 to-amber-500/30 blur-md transition-opacity duration-300 ${
            animated ? 'opacity-90 animate-pulse' : 'opacity-60 group-hover:opacity-100'
          }`}
        />

        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-lg"
        >
          <defs>
            <linearGradient id="seyedShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#09090b" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>

            <linearGradient id="seyedNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d9f99d" />
              <stop offset="45%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="seyedGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>

          {/* Outer Hexagonal Championship Shield */}
          <path
            d="M60 6 L106 28 L106 76 C106 96 85 110 60 115 C35 110 14 96 14 76 L14 28 Z"
            fill="url(#seyedShieldGrad)"
            stroke="url(#seyedNeonGrad)"
            strokeWidth="3.5"
          />

          {/* Inner Geometric Armor Bevel */}
          <path
            d="M60 13 L99 32 L99 74 C99 90 81 102 60 107 C39 102 21 90 21 74 L21 32 Z"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1.2"
            strokeDasharray="6 3"
          />

          {/* Championship Crown / 3-Peak Crest at Top */}
          <path
            d="M44 29 L51 20 L60 26 L69 20 L76 29 L72 34 L48 34 Z"
            fill="url(#seyedGoldGrad)"
          />

          {/* Sculpted Muscular V-Taper Torso & Double Biceps Silhouette */}
          {/* Left Lat & Pectoral Wing */}
          <path
            d="M60 42 L34 38 L28 49 L41 56 L47 76 L58 84 L58 58 Z"
            fill="url(#seyedNeonGrad)"
          />
          {/* Right Lat & Pectoral Wing */}
          <path
            d="M60 42 L86 38 L92 49 L79 56 L73 76 L62 84 L62 58 Z"
            fill="url(#seyedNeonGrad)"
          />

          {/* Abdominal Six-Pack Core Diamond */}
          <polygon points="60,60 67,72 60,94 53,72" fill="#e4e4e7" />
          <line x1="60" y1="62" x2="60" y2="92" stroke="#09090b" strokeWidth="1.8" />
          <line x1="54" y1="71" x2="66" y2="71" stroke="#09090b" strokeWidth="1.5" />
          <line x1="55" y1="79" x2="65" y2="79" stroke="#09090b" strokeWidth="1.5" />

          {/* Heavy Olympic Barbell Across Foreground */}
          <line
            x1="12"
            y1="54"
            x2="108"
            y2="54"
            stroke="#f4f4f5"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Left Olympic Bumper Plates */}
          <rect x="16" y="41" width="5.5" height="26" rx="2" fill="url(#seyedGoldGrad)" />
          <rect x="23" y="44" width="4.5" height="20" rx="1.5" fill="#a3e635" />
          {/* Right Olympic Bumper Plates */}
          <rect x="98.5" y="41" width="5.5" height="26" rx="2" fill="url(#seyedGoldGrad)" />
          <rect x="92.5" y="44" width="4.5" height="20" rx="1.5" fill="#a3e635" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`${titleSize} font-black tracking-tight text-white group-hover:text-lime-400 transition-colors whitespace-nowrap`}
            >
              سید بدنساز
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-lime-400/90 whitespace-nowrap">
            SEYED BADANSAZ
          </span>
        </div>
      )}
    </div>
  );
};
