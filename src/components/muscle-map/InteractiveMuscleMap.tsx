import React, { useState } from 'react';
import { MuscleId } from '../../types/fitness';
import { MUSCLES_LIST, MuscleInfo } from '../../data/musclesData';
import { EXERCISES } from '../../data/exercisesData';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Layers,
  Flame,
  Eye,
  Dumbbell,
  Activity,
} from 'lucide-react';

interface InteractiveMuscleMapProps {
  selectedMuscle: MuscleId | null;
  onSelectMuscle: (muscleId: MuscleId | null) => void;
  onNavigateToExercises?: (muscleId: MuscleId) => void;
}

type AtlasStyle = 'anatomical_3d' | 'neon_cyber' | 'thermal_heat';

export const InteractiveMuscleMap: React.FC<InteractiveMuscleMapProps> = ({
  selectedMuscle,
  onSelectMuscle,
  onNavigateToExercises,
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [atlasStyle, setAtlasStyle] = useState<AtlasStyle>('anatomical_3d');
  const [showFibers, setShowFibers] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);

  const activeMuscleId = selectedMuscle || hoveredMuscle;

  const currentMuscleInfo: MuscleInfo | undefined = MUSCLES_LIST.find(
    (m) => m.id === activeMuscleId
  );

  // Find synergist muscles that frequently work alongside the active muscle
  const synergistMuscles = React.useMemo(() => {
    if (!activeMuscleId) return new Set<MuscleId>();
    const set = new Set<MuscleId>();
    EXERCISES.forEach((ex) => {
      if (ex.primaryMuscle === activeMuscleId) {
        ex.secondaryMuscles.forEach((sm) => set.add(sm));
      }
    });
    return set;
  }, [activeMuscleId]);

  const sampleExercisesForMuscle = React.useMemo(() => {
    if (!activeMuscleId) return [];
    return EXERCISES.filter((e) => e.primaryMuscle === activeMuscleId).slice(0, 4);
  }, [activeMuscleId]);

  const getExerciseCountForMuscle = (muscleId: MuscleId) => {
    return EXERCISES.filter(
      (e) => e.primaryMuscle === muscleId || e.secondaryMuscles.includes(muscleId)
    ).length;
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  // Dynamic 3D Anatomical Muscle Shader Style
  const getMuscleStyle = (muscleId: MuscleId): React.CSSProperties => {
    const isSelected = selectedMuscle === muscleId;
    const isHovered = hoveredMuscle === muscleId;
    const isSynergist = !isSelected && !isHovered && synergistMuscles.has(muscleId);

    if (isSelected) {
      return {
        fill: 'url(#selectedNeonGrad)',
        stroke: '#ffffff',
        strokeWidth: 2,
        filter: 'drop-shadow(0 0 12px rgba(163, 230, 53, 0.9))',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      };
    }
    if (isHovered) {
      return {
        fill: 'url(#hoveredNeonGrad)',
        stroke: '#ecfccb',
        strokeWidth: 1.8,
        filter: 'drop-shadow(0 0 8px rgba(132, 204, 22, 0.7))',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      };
    }
    if (isSynergist) {
      return {
        fill: 'url(#synergistCyanGrad)',
        stroke: '#38bdf8',
        strokeWidth: 1.3,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      };
    }

    if (atlasStyle === 'anatomical_3d') {
      return {
        fill: 'url(#anatomicalRed3D)',
        stroke: '#fca5a5',
        strokeOpacity: 0.45,
        strokeWidth: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      };
    }

    if (atlasStyle === 'thermal_heat') {
      return {
        fill: 'url(#thermalMuscleGrad)',
        stroke: '#fbbf24',
        strokeOpacity: 0.4,
        strokeWidth: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      };
    }

    // neon_cyber
    return {
      fill: 'url(#cyberCarbon3D)',
      stroke: '#52525b',
      strokeWidth: 1.1,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };
  };

  const renderSvgDefs = () => (
    <defs>
      {/* Realistic 3D Anatomical Striated Crimson Muscle Gradient */}
      <radialGradient id="anatomicalRed3D" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="35%" stopColor="#dc2626" />
        <stop offset="78%" stopColor="#991b1b" />
        <stop offset="100%" stopColor="#450a0a" />
      </radialGradient>

      {/* Cyber Carbon 3D Metallic Muscle Gradient */}
      <radialGradient id="cyberCarbon3D" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#52525b" />
        <stop offset="50%" stopColor="#27272a" />
        <stop offset="100%" stopColor="#09090b" />
      </radialGradient>

      {/* Thermal Heatmap Muscle Gradient */}
      <linearGradient id="thermalMuscleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>

      {/* Selected Target Muscle Electric Lime 3D Gradient */}
      <radialGradient id="selectedNeonGrad" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#f7fee7" />
        <stop offset="35%" stopColor="#a3e635" />
        <stop offset="80%" stopColor="#4d7c0f" />
        <stop offset="100%" stopColor="#1a2e05" />
      </radialGradient>

      {/* Hovered Muscle Gradient */}
      <radialGradient id="hoveredNeonGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ecfccb" />
        <stop offset="50%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#365314" />
      </radialGradient>

      {/* Synergist Secondary Muscle Cyan Gradient */}
      <radialGradient id="synergistCyanGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="45%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </radialGradient>

      {/* Tendon & Fascia Pearl Gradient */}
      <linearGradient id="tendonFascia" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.65" />
        <stop offset="50%" stopColor="#a1a1aa" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#52525b" stopOpacity="0.3" />
      </linearGradient>

      {/* Body Base Silhouette Gradient */}
      <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#27272a" />
        <stop offset="50%" stopColor="#18181b" />
        <stop offset="100%" stopColor="#09090b" />
      </linearGradient>
    </defs>
  );

  const bindMuscleEvents = (muscleId: MuscleId) => ({
    onMouseEnter: () => setHoveredMuscle(muscleId),
    onMouseLeave: () => setHoveredMuscle(null),
    onClick: () => onSelectMuscle(selectedMuscle === muscleId ? null : muscleId),
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left/Center: 3D Anatomical Muscle Atlas Viewport */}
      <div className="flex-1 bg-zinc-900/95 border border-zinc-800 rounded-3xl p-4 sm:p-6 relative overflow-hidden flex flex-col items-center shadow-2xl">
        {/* Background Technical Anatomy Grid & Radial Spotlight */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[480px] bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Toolbar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800 z-10">
          {/* Front / Back View Switcher */}
          <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setView('front')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                view === 'front'
                  ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              نمای قدامی (جلو بدن)
            </button>
            <button
              type="button"
              onClick={() => setView('back')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                view === 'back'
                  ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              نمای خلفی (پشت بدن)
            </button>
          </div>

          {/* Atlas Shader Mode & Zoom Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Shader Style Selector */}
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setAtlasStyle('anatomical_3d')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                  atlasStyle === 'anatomical_3d'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>آناتومی سه‌بعدی</span>
              </button>
              <button
                type="button"
                onClick={() => setAtlasStyle('neon_cyber')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                  atlasStyle === 'neon_cyber'
                    ? 'bg-zinc-800 text-lime-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>کربن نئون</span>
              </button>
              <button
                type="button"
                onClick={() => setAtlasStyle('thermal_heat')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                  atlasStyle === 'thermal_heat'
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">حرارتی</span>
              </button>
            </div>

            {/* Fiber Striation Toggle */}
            <button
              type="button"
              onClick={() => setShowFibers(!showFibers)}
              className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                showFibers
                  ? 'bg-lime-500/15 border-lime-500/40 text-lime-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
              title="نمایش خطوط الیاف و تاندون‌های عضلانی"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">الیاف عضله</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 gap-0.5 text-zinc-400">
              <button
                type="button"
                onClick={handleZoomIn}
                title="بزرگنمایی"
                className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="کوچک‌نمایی"
                className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="اندازه استاندارد"
                className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Floating Active Muscle HUD Banner */}
        <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 z-10 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-lime-400" />
            {currentMuscleInfo ? (
              <div className="flex items-center gap-2">
                <span className="font-black text-white">{currentMuscleInfo.nameFa}</span>
                <span className="text-zinc-500">·</span>
                <span className="font-mono text-lime-400">{currentMuscleInfo.nameEn}</span>
              </div>
            ) : (
              <span className="text-zinc-400">
                نشانگر ماوس را روی هر عضله ببرید یا کلیک کنید تا فیبرها و عضلات کمکی روشن شوند
              </span>
            )}
          </div>
          {currentMuscleInfo && (
            <span className="text-cyan-400 font-semibold">
              {getExerciseCountForMuscle(currentMuscleInfo.id)} حرکت تخصصی آماده
            </span>
          )}
        </div>

        {/* Interactive Sculpted SVG Anatomical Figure */}
        <div className="w-full py-4 flex items-center justify-center overflow-auto min-h-[540px] relative z-10">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="relative flex items-center justify-center"
          >
            {view === 'front' ? (
              /* ================== REALISTIC FRONT ANATOMY SVG ================== */
              <svg
                viewBox="0 0 360 620"
                className="w-[320px] sm:w-[350px] h-[560px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] select-none"
              >
                {renderSvgDefs()}

                {/* 1. Sculpted Anatomical Head, Neck, Hands, Knees & Feet Base */}
                <g fill="url(#bodyBaseGrad)" stroke="#3f3f46" strokeWidth="1.2">
                  {/* Head & Sculpted Jawline */}
                  <path d="M180 14 C162 14 152 28 153 46 C154 62 164 76 180 78 C196 76 206 62 207 46 C208 28 198 14 180 14 Z" />
                  {/* Ears */}
                  <ellipse cx="151" cy="48" rx="3" ry="7" />
                  <ellipse cx="209" cy="48" rx="3" ry="7" />
                  {/* Facial Brow & Nose Bridge Subtle Contour */}
                  <path d="M164 42 Q180 45 196 42" fill="none" stroke="#52525b" strokeWidth="1" opacity="0.5" />
                  {/* Neck & Sternocleidomastoid */}
                  <path d="M164 74 L196 74 L202 98 L158 98 Z" />
                  <line x1="166" y1="76" x2="177" y2="98" stroke="#52525b" strokeWidth="1.2" opacity="0.6" />
                  <line x1="194" y1="76" x2="183" y2="98" stroke="#52525b" strokeWidth="1.2" opacity="0.6" />

                  {/* Clavicle (Collarbone) Landmark */}
                  <path d="M132 100 Q156 105 178 101 M228 100 Q204 105 182 101" fill="none" stroke="#a1a1aa" strokeWidth="2" opacity="0.5" />

                  {/* Wrists & Clenched Athletic Fists */}
                  <path d="M88 282 L102 282 L104 304 L85 304 Z" rx="4" />
                  <path d="M272 282 L258 282 L256 304 L275 304 Z" rx="4" />

                  {/* Patella (Kneecaps) & Knee Tendons */}
                  <ellipse cx="148" cy="402" rx="13" ry="16" fill="url(#tendonFascia)" />
                  <ellipse cx="212" cy="402" rx="13" ry="16" fill="url(#tendonFascia)" />

                  {/* Ankles & Athletic Feet */}
                  <path d="M138 532 L154 532 L160 562 L128 562 Z" />
                  <path d="M222 532 L206 532 L200 562 L232 562 Z" />
                </g>

                {/* --- UPPER TRAPS (FRONT COLLAR VIEW) --- */}
                <g {...bindMuscleEvents('traps')}>
                  <path
                    d="M158 82 L128 98 L162 100 Z"
                    style={getMuscleStyle('traps')}
                  />
                  <path
                    d="M202 82 L232 98 L198 100 Z"
                    style={getMuscleStyle('traps')}
                  />
                </g>

                {/* --- UPPER CHEST (CLAVICULAR PECTORALIS) --- */}
                <g {...bindMuscleEvents('chest_upper')}>
                  <path
                    d="M132 101 C148 100 166 103 178 108 L178 125 C160 126 140 123 126 116 C127 109 129 104 132 101 Z"
                    style={getMuscleStyle('chest_upper')}
                  />
                  <path
                    d="M228 101 C212 100 194 103 182 108 L182 125 C200 126 220 123 234 116 C233 109 231 104 228 101 Z"
                    style={getMuscleStyle('chest_upper')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.28" strokeWidth="0.9" fill="none" pointerEvents="none">
                      <path d="M175 112 Q152 114 130 110" />
                      <path d="M175 119 Q150 120 128 115" />
                      <path d="M185 112 Q208 114 230 110" />
                      <path d="M185 119 Q210 120 232 115" />
                    </g>
                  )}
                </g>

                {/* --- MID & LOWER CHEST (STERNAL PECTORALIS MAJOR) --- */}
                <g {...bindMuscleEvents('chest')}>
                  <path
                    d="M126 118 C142 124 162 126 178 126 L178 158 C164 166 138 166 124 152 C120 140 122 127 126 118 Z"
                    style={getMuscleStyle('chest')}
                  />
                  <path
                    d="M234 118 C218 124 198 126 182 126 L182 158 C196 166 222 166 236 152 C240 140 238 127 234 118 Z"
                    style={getMuscleStyle('chest')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" fill="none" pointerEvents="none">
                      <path d="M176 133 Q150 136 125 128" />
                      <path d="M176 142 Q150 146 124 138" />
                      <path d="M176 151 Q152 156 128 148" />
                      <path d="M184 133 Q210 136 235 128" />
                      <path d="M184 142 Q210 146 236 138" />
                      <path d="M184 151 Q208 156 232 148" />
                    </g>
                  )}
                </g>

                {/* --- LOWER CHEST BORDER (COSTAL PECTORALIS) --- */}
                <g {...bindMuscleEvents('chest_lower')}>
                  <path
                    d="M125 153 C140 164 164 165 177 159 L175 167 C158 173 136 171 124 160 Z"
                    style={getMuscleStyle('chest_lower')}
                  />
                  <path
                    d="M235 153 C220 164 196 165 183 159 L185 167 C202 173 224 171 236 160 Z"
                    style={getMuscleStyle('chest_lower')}
                  />
                </g>

                {/* --- ANTERIOR DELTOID (FRONT SHOULDER) --- */}
                <g {...bindMuscleEvents('deltoid_front')}>
                  <path
                    d="M130 100 C116 104 106 116 104 134 C110 145 120 146 125 138 C128 124 130 112 130 100 Z"
                    style={getMuscleStyle('deltoid_front')}
                  />
                  <path
                    d="M230 100 C244 104 254 116 256 134 C250 145 240 146 235 138 C232 124 230 112 230 100 Z"
                    style={getMuscleStyle('deltoid_front')}
                  />
                </g>

                {/* --- LATERAL DELTOID (SIDE SHOULDER CAP) --- */}
                <g {...bindMuscleEvents('deltoid_side')}>
                  <path
                    d="M112 108 C96 116 90 136 94 158 C100 158 108 150 112 138 C108 126 109 116 112 108 Z"
                    style={getMuscleStyle('deltoid_side')}
                  />
                  <path
                    d="M248 108 C264 116 270 136 266 158 C260 158 252 150 248 138 C252 126 251 116 248 108 Z"
                    style={getMuscleStyle('deltoid_side')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.28" strokeWidth="0.9" fill="none" pointerEvents="none">
                      <path d="M108 115 Q96 134 98 152" />
                      <path d="M252 115 Q264 134 262 152" />
                    </g>
                  )}
                </g>

                {/* --- LATS FLARE VISIBLE FROM FRONT (V-TAPER WINGS) --- */}
                <g {...bindMuscleEvents('lats')}>
                  <path
                    d="M123 158 L134 172 L134 206 C124 196 118 178 123 158 Z"
                    style={getMuscleStyle('lats')}
                  />
                  <path
                    d="M237 158 L226 172 L226 206 C236 196 242 178 237 158 Z"
                    style={getMuscleStyle('lats')}
                  />
                </g>

                {/* --- BICEPS BRACHII & BRACHIALIS --- */}
                <g {...bindMuscleEvents('biceps')}>
                  <path
                    d="M98 156 C92 174 92 198 100 214 C110 214 118 200 118 180 C118 166 110 156 98 156 Z"
                    style={getMuscleStyle('biceps')}
                  />
                  <path
                    d="M262 156 C268 174 268 198 260 214 C250 214 242 200 242 180 C242 166 250 156 262 156 Z"
                    style={getMuscleStyle('biceps')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" fill="none" pointerEvents="none">
                      <path d="M106 160 C102 178 102 196 105 210" />
                      <path d="M254 160 C258 178 258 196 255 210" />
                    </g>
                  )}
                </g>

                {/* --- FOREARMS (BRACHIORADIALIS & FLEXORS) --- */}
                <g {...bindMuscleEvents('forearms')}>
                  <path
                    d="M96 216 C86 232 84 258 89 282 L102 282 C110 262 116 238 114 216 Z"
                    style={getMuscleStyle('forearms')}
                  />
                  <path
                    d="M264 216 C274 232 276 258 271 282 L258 282 C250 262 244 238 246 216 Z"
                    style={getMuscleStyle('forearms')}
                  />
                </g>

                {/* --- RECTUS ABDOMINIS (SCULPTED 8-PACK ABS) --- */}
                <g {...bindMuscleEvents('abs')}>
                  {/* Row 1 */}
                  <path d="M161 168 L178 166 L178 184 L159 185 Z" rx="3" style={getMuscleStyle('abs')} />
                  <path d="M199 168 L182 166 L182 184 L201 185 Z" rx="3" style={getMuscleStyle('abs')} />
                  {/* Row 2 */}
                  <path d="M158 188 L178 187 L178 206 L157 206 Z" rx="3" style={getMuscleStyle('abs')} />
                  <path d="M202 188 L182 187 L182 206 L203 206 Z" rx="3" style={getMuscleStyle('abs')} />
                  {/* Row 3 */}
                  <path d="M158 210 L178 210 L178 228 L160 228 Z" rx="3" style={getMuscleStyle('abs')} />
                  <path d="M202 210 L182 210 L182 228 L200 228 Z" rx="3" style={getMuscleStyle('abs')} />
                  {/* Lower Abs Row 4 */}
                  <path d="M161 232 L178 232 L178 258 L166 252 Z" style={getMuscleStyle('abs')} />
                  <path d="M199 232 L182 232 L182 258 L194 252 Z" style={getMuscleStyle('abs')} />
                </g>

                {/* --- SERRATUS ANTERIOR & OBLIQUES (PEHLU & V-LINE) --- */}
                <g {...bindMuscleEvents('obliques')}>
                  <path
                    d="M135 166 C146 172 154 182 155 204 L157 244 C146 248 136 238 134 218 C132 198 132 180 135 166 Z"
                    style={getMuscleStyle('obliques')}
                  />
                  <path
                    d="M225 166 C214 172 206 182 205 204 L203 244 C214 248 224 238 226 218 C228 198 228 180 225 166 Z"
                    style={getMuscleStyle('obliques')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1" fill="none" pointerEvents="none">
                      <path d="M136 178 L152 188 M136 192 L153 202 M137 206 L154 218" />
                      <path d="M224 178 L208 188 M224 192 L207 202 M223 206 L206 218" />
                    </g>
                  )}
                </g>

                {/* --- ADDUCTORS (INNER THIGH) --- */}
                <g {...bindMuscleEvents('adductors')}>
                  <path
                    d="M160 264 L176 268 L172 346 L158 326 Z"
                    style={getMuscleStyle('adductors')}
                  />
                  <path
                    d="M200 264 L184 268 L188 346 L202 326 Z"
                    style={getMuscleStyle('adductors')}
                  />
                </g>

                {/* --- QUADRICEPS (3D MULTI-HEAD THIGH SWEEP & TEARDROP) --- */}
                <g {...bindMuscleEvents('quads')}>
                  {/* Left Quad: Vastus Lateralis, Rectus Femoris & Vastus Medialis Teardrop */}
                  <path
                    d="M134 252 C118 286 116 344 130 390 C142 394 158 392 166 382 C170 350 162 296 158 258 Z"
                    style={getMuscleStyle('quads')}
                  />
                  {/* Right Quad */}
                  <path
                    d="M226 252 C242 286 244 344 230 390 C218 394 202 392 194 382 C190 350 198 296 202 258 Z"
                    style={getMuscleStyle('quads')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1" fill="none" pointerEvents="none">
                      {/* Rectus Femoris Bipennate Line & Vastus Medialis Teardrop */}
                      <path d="M146 262 L145 384" />
                      <path d="M145 300 L128 325 M145 322 L128 348 M145 342 L162 368" />
                      <path d="M214 262 L215 384" />
                      <path d="M215 300 L232 325 M215 322 L232 348 M215 342 L198 368" />
                    </g>
                  )}
                </g>

                {/* --- CALVES FRONT (GASTROCNEMIUS INNER FLARE & TIBIALIS) --- */}
                <g {...bindMuscleEvents('calves')}>
                  <path
                    d="M134 420 C122 448 124 492 136 532 L154 532 C164 494 166 452 156 420 Z"
                    style={getMuscleStyle('calves')}
                  />
                  <path
                    d="M226 420 C238 448 236 492 224 532 L206 532 C196 494 194 452 204 420 Z"
                    style={getMuscleStyle('calves')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1" fill="none" pointerEvents="none">
                      <path d="M146 424 Q154 468 148 525" />
                      <path d="M214 424 Q206 468 212 525" />
                    </g>
                  )}
                </g>
              </svg>
            ) : (
              /* ================== REALISTIC BACK ANATOMY SVG ================== */
              <svg
                viewBox="0 0 360 620"
                className="w-[320px] sm:w-[350px] h-[560px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] select-none"
              >
                {renderSvgDefs()}

                {/* 1. Sculpted Back Head, Neck, Hands & Achilles Tendon Base */}
                <g fill="url(#bodyBaseGrad)" stroke="#3f3f46" strokeWidth="1.2">
                  <path d="M180 14 C162 14 152 28 153 46 C154 62 164 76 180 78 C196 76 206 62 207 46 C208 28 198 14 180 14 Z" />
                  <ellipse cx="151" cy="48" rx="3" ry="7" />
                  <ellipse cx="209" cy="48" rx="3" ry="7" />
                  <path d="M164 72 L196 72 L200 92 L160 92 Z" />

                  {/* Wrists & Hands */}
                  <path d="M88 282 L102 282 L104 304 L85 304 Z" />
                  <path d="M272 282 L258 282 L256 304 L275 304 Z" />

                  {/* Achilles Tendons & Heels */}
                  <path d="M138 504 L154 504 L156 562 L132 562 Z" fill="url(#tendonFascia)" />
                  <path d="M222 504 L206 504 L204 562 L228 562 Z" fill="url(#tendonFascia)" />
                </g>

                {/* --- TRAPEZIUS (FULL UPPER, MIDDLE & LOWER DIAMOND) --- */}
                <g {...bindMuscleEvents('traps')}>
                  <path
                    d="M180 72 L206 92 L230 104 L180 186 L130 104 L154 92 Z"
                    style={getMuscleStyle('traps')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" fill="none" pointerEvents="none">
                      <line x1="180" y1="74" x2="180" y2="182" />
                      <path d="M180 96 L142 104 M180 116 L146 122 M180 138 L158 144" />
                      <path d="M180 96 L218 104 M180 116 L214 122 M180 138 L202 144" />
                    </g>
                  )}
                </g>

                {/* --- POSTERIOR DELTOID (REAR SHOULDER) --- */}
                <g {...bindMuscleEvents('deltoid_rear')}>
                  <path
                    d="M130 104 C112 108 98 124 96 146 C106 152 120 146 128 134 C130 122 130 112 130 104 Z"
                    style={getMuscleStyle('deltoid_rear')}
                  />
                  <path
                    d="M230 104 C248 108 262 124 264 146 C254 152 240 146 232 134 C230 122 230 112 230 104 Z"
                    style={getMuscleStyle('deltoid_rear')}
                  />
                </g>

                {/* --- UPPER BACK (TERES MAJOR, INFRASPINATUS & RHOMBOIDS) --- */}
                <g {...bindMuscleEvents('back_upper')}>
                  <path
                    d="M130 114 L156 152 L144 166 L122 148 Z"
                    style={getMuscleStyle('back_upper')}
                  />
                  <path
                    d="M230 114 L204 152 L216 166 L238 148 Z"
                    style={getMuscleStyle('back_upper')}
                  />
                </g>

                {/* --- LATISSIMUS DORSI (COBRA V-TAPER WINGS) --- */}
                <g {...bindMuscleEvents('lats')}>
                  <path
                    d="M122 152 C138 164 156 176 166 226 C148 230 134 216 122 190 C118 176 118 162 122 152 Z"
                    style={getMuscleStyle('lats')}
                  />
                  <path
                    d="M238 152 C222 164 204 176 194 226 C212 230 226 216 238 190 C242 176 242 162 238 152 Z"
                    style={getMuscleStyle('lats')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" fill="none" pointerEvents="none">
                      <path d="M124 168 Q144 184 162 212" />
                      <path d="M126 184 Q144 198 160 220" />
                      <path d="M236 168 Q216 184 198 212" />
                      <path d="M234 184 Q216 198 200 220" />
                    </g>
                  )}
                </g>

                {/* --- TRICEPS BRACHII (HORSESHOE LATERAL & LONG HEAD) --- */}
                <g {...bindMuscleEvents('triceps')}>
                  <path
                    d="M98 150 C90 170 92 198 100 214 C112 212 118 198 118 178 C118 162 110 152 98 150 Z"
                    style={getMuscleStyle('triceps')}
                  />
                  <path
                    d="M262 150 C270 170 268 198 260 214 C248 212 242 198 242 178 C242 162 250 152 262 150 Z"
                    style={getMuscleStyle('triceps')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.1" fill="none" pointerEvents="none">
                      {/* Horseshoe Triceps Tendon Arch */}
                      <path d="M100 198 Q106 174 114 198" />
                      <path d="M260 198 Q254 174 246 198" />
                    </g>
                  )}
                </g>

                {/* --- FOREARMS BACK (EXTENSORS) --- */}
                <g {...bindMuscleEvents('forearms')}>
                  <path
                    d="M96 216 C86 232 84 258 89 282 L102 282 C110 262 116 238 114 216 Z"
                    style={getMuscleStyle('forearms')}
                  />
                  <path
                    d="M264 216 C274 232 276 258 271 282 L258 282 C250 262 244 238 246 216 Z"
                    style={getMuscleStyle('forearms')}
                  />
                </g>

                {/* --- LOWER BACK (ERECTOR SPINAE & CHRISTMAS TREE) --- */}
                <g {...bindMuscleEvents('back_lower')}>
                  <path
                    d="M166 196 L180 184 L194 196 L196 252 L164 252 Z"
                    style={getMuscleStyle('back_lower')}
                  />
                  {showFibers && (
                    <line x1="180" y1="186" x2="180" y2="250" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" pointerEvents="none" />
                  )}
                </g>

                {/* --- GLUTES (GLUTEUS MEDIUS & MAXIMUS) --- */}
                <g {...bindMuscleEvents('glutes')}>
                  <path
                    d="M136 254 C152 250 176 254 178 286 C176 318 148 326 130 308 C120 292 124 268 136 254 Z"
                    style={getMuscleStyle('glutes')}
                  />
                  <path
                    d="M224 254 C208 250 184 254 182 286 C184 318 212 326 230 308 C240 292 236 268 224 254 Z"
                    style={getMuscleStyle('glutes')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" fill="none" pointerEvents="none">
                      <path d="M174 272 Q150 276 128 290" />
                      <path d="M174 288 Q152 294 132 304" />
                      <path d="M186 272 Q210 276 232 290" />
                      <path d="M186 288 Q208 294 228 304" />
                    </g>
                  )}
                </g>

                {/* --- HAMSTRINGS (BICEPS FEMORIS & SEMITENDINOSUS) --- */}
                <g {...bindMuscleEvents('hamstrings')}>
                  <path
                    d="M130 314 C146 324 166 322 170 356 C168 388 154 402 138 398 C126 380 122 346 130 314 Z"
                    style={getMuscleStyle('hamstrings')}
                  />
                  <path
                    d="M230 314 C214 324 194 322 190 356 C192 388 206 402 222 398 C234 380 238 346 230 314 Z"
                    style={getMuscleStyle('hamstrings')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" fill="none" pointerEvents="none">
                      <line x1="148" y1="322" x2="146" y2="394" />
                      <line x1="212" y1="322" x2="214" y2="394" />
                    </g>
                  )}
                </g>

                {/* --- CALVES BACK (DIAMOND GASTROCNEMIUS MEDIAL & LATERAL HEADS) --- */}
                <g {...bindMuscleEvents('calves')}>
                  <path
                    d="M132 412 C148 410 164 426 162 464 C160 492 152 512 145 512 C136 512 126 488 126 458 C126 436 128 420 132 412 Z"
                    style={getMuscleStyle('calves')}
                  />
                  <path
                    d="M228 412 C212 410 196 426 198 464 C200 492 208 512 215 512 C224 512 234 488 234 458 C234 436 232 420 228 412 Z"
                    style={getMuscleStyle('calves')}
                  />
                  {showFibers && (
                    <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.1" fill="none" pointerEvents="none">
                      {/* Classic Split Between Medial and Lateral Gastrocnemius Heads */}
                      <path d="M145 414 L145 478 M132 474 Q145 490 158 474" />
                      <path d="M215 414 L215 478 M202 474 Q215 490 228 474" />
                    </g>
                  )}
                </g>
              </svg>
            )}
          </div>
        </div>

        {/* Bottom Legend: Primary vs Synergist vs Base */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800 text-xs text-zinc-400 z-10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-lime-400 inline-block" />
              <span>عضله هدف انتخاب‌شده</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
              <span>عضلات کمکی (Synergist)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full inline-block ${
                  atlasStyle === 'anatomical_3d'
                    ? 'bg-red-600'
                    : atlasStyle === 'thermal_heat'
                    ? 'bg-amber-500'
                    : 'bg-zinc-700'
                }`}
              />
              <span>بافت عضلانی پایه</span>
            </span>
          </div>

          {selectedMuscle && (
            <button
              type="button"
              onClick={() => onSelectMuscle(null)}
              className="text-lime-400 hover:text-lime-300 font-bold underline underline-offset-4"
            >
              پاک کردن انتخاب
            </button>
          )}
        </div>
      </div>

      {/* Right Sidebar: Anatomical Inspector & Instant Exercise Preview */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        {currentMuscleInfo ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-full space-y-5">
            <div>
              {/* Header Kicker */}
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="text-lime-400 font-bold">{currentMuscleInfo.category}</span>
                <span>·</span>
                <span className="font-mono">
                  {getExerciseCountForMuscle(currentMuscleInfo.id)} حرکت تخصصی
                </span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-1">
                {currentMuscleInfo.nameFa}
              </h2>
              <p className="text-xs font-mono text-lime-400/90 tracking-wide mb-4">
                {currentMuscleInfo.nameEn}
              </p>

              {/* Anatomical Function & Biomechanics */}
              <div className="space-y-3.5 text-sm">
                <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/90">
                  <span className="block text-xs font-bold text-lime-400 mb-1">
                    عملکرد بیومکانیکی و آناتومیک:
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {currentMuscleInfo.functionFa}
                  </p>
                </div>

                {/* Sub-muscles */}
                {currentMuscleInfo.subMusclesFa.length > 0 && (
                  <div>
                    <span className="block text-xs font-bold text-zinc-300 mb-1.5">
                      سرهای عضلانی و بخش‌های تفکیکی:
                    </span>
                    <div className="text-xs text-zinc-400 leading-relaxed">
                      {currentMuscleInfo.subMusclesFa.join(' · ')}
                    </div>
                  </div>
                )}

                {/* Hypertrophy Science Tip */}
                <div className="bg-lime-950/20 border border-lime-500/30 p-3.5 rounded-2xl">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-lime-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    نکته طلایی رشد و هایپرتروفی:
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {currentMuscleInfo.tipsFa}
                  </p>
                </div>

                {/* Sample Exercises Direct Preview */}
                {sampleExercisesForMuscle.length > 0 && (
                  <div className="pt-2">
                    <span className="block text-xs font-bold text-zinc-300 mb-2">
                      برترین حرکات این عضله:
                    </span>
                    <div className="space-y-1.5">
                      {sampleExercisesForMuscle.map((ex) => (
                        <div
                          key={ex.id}
                          onClick={() =>
                            onNavigateToExercises && onNavigateToExercises(currentMuscleInfo.id)
                          }
                          className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800/90 flex items-center justify-between text-xs cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Dumbbell className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                            <span className="font-bold text-white truncate">{ex.nameFa}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400 shrink-0">{ex.equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                  <span>حجم استاندارد هفتگی:</span>
                  <span className="text-lime-400 font-bold font-mono">
                    {currentMuscleInfo.recommendedSetsWeekly}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToExercises && currentMuscleInfo) {
                    onNavigateToExercises(currentMuscleInfo.id);
                  }
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-lime-500/20 active:scale-95"
              >
                <span>مشاهده کلیپ و آموزش حرکات {currentMuscleInfo.nameFa}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          /* Quick Muscle Selector Matrix when no muscle is selected */
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center mb-4 text-lime-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                اسکنر آناتومی سه‌بعدی سید بدنساز
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                روی هر بخش از بدن در نقشه روبرو کلیک کنید یا از فهرست سریع زیر عضله مورد نظر خود را انتخاب نمایید تا آناتومی، فیبرهای عضلانی و حرکات آن نمایش داده شوند:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {MUSCLES_LIST.slice(0, 12).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (
                        ['lats', 'back_upper', 'traps', 'back_lower', 'deltoid_rear', 'triceps', 'glutes', 'hamstrings'].includes(
                          m.id
                        )
                      ) {
                        setView('back');
                      } else {
                        setView('front');
                      }
                      onSelectMuscle(m.id);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-lime-500/40 text-right transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold text-zinc-200 group-hover:text-lime-400 truncate">
                      {m.nameFa.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {getExerciseCountForMuscle(m.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
              نکته: با انتخاب هر عضله، عضلات کمکی درگیر در تمرینات آن نیز به رنگ <span className="text-sky-400 font-bold">آبی فیروزه‌ای</span> روی نقشه روشن می‌شوند.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
