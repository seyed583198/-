import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types/fitness';
import {
  Play,
  Pause,
  Gauge,
  Eye,
  Activity,
  Sparkles,
  Film,
  Layers,
  Columns,
  Wind,
} from 'lucide-react';

interface ExerciseAnimationPlayerProps {
  exercise: Exercise;
  compact?: boolean;
}

type MotionPattern =
  | 'bench_press'
  | 'incline_press'
  | 'pushup'
  | 'fly'
  | 'dips'
  | 'pulldown'
  | 'row'
  | 'deadlift'
  | 'overhead_press'
  | 'lateral_raise'
  | 'curl'
  | 'tricep_pushdown'
  | 'skull_crusher'
  | 'squat'
  | 'lunge'
  | 'leg_extension'
  | 'leg_curl'
  | 'hip_thrust'
  | 'calf_raise'
  | 'core_crunch'
  | 'shrug';

/**
 * Maps any Exercise in our 125+ exercise bank to its verified real human athlete
 * demonstration folder in `yuhonas/free-exercise-db` (which provides 0.jpg & 1.jpg frames).
 */
function getRealClipFolder(exercise: Exercise): string {
  const id = exercise.id.toLowerCase();
  const en = exercise.nameEn.toLowerCase();

  // Exact or specialized matches
  if (id.includes('smith') && id.includes('incline')) return 'Smith_Machine_Incline_Bench_Press';
  if (id.includes('smith') && id.includes('bench')) return 'Smith_Machine_Bench_Press';
  if (id.includes('incline') && id.includes('fly')) return 'Incline_Cable_Flye';
  if (id.includes('low_to_high') || id.includes('low_cable')) return 'Low_Cable_Crossover';
  if (id.includes('incline') && id.includes('barbell')) return 'Barbell_Incline_Bench_Press_-_Medium_Grip';
  if (id.includes('incline') && (id.includes('dumbbell') || en.includes('dumbbell'))) return 'Incline_Dumbbell_Press';
  if (id.includes('decline') && id.includes('barbell')) return 'Decline_Barbell_Bench_Press';
  if (id.includes('decline') && id.includes('dumbbell')) return 'Decline_Dumbbell_Bench_Press';
  if (id.includes('decline') && id.includes('pushup')) return 'Decline_Push-Up';
  if (id.includes('diamond') || id.includes('close_grip_pushup')) return 'Close-Grip_Push-Up_off_of_a_Dumbbell';
  if (id.includes('pushup') || en.includes('push-up')) return 'Pushups';
  if (id.includes('pec_deck') || en.includes('pec deck')) return 'Butterfly';
  if (id.includes('dumbbell_fly')) return 'Dumbbell_Flyes';
  if (id.includes('crossover') || id.includes('cable_fly')) return 'Cable_Crossover';
  if (id.includes('pullover') && id.includes('dumbbell')) return 'Bent-Arm_Dumbbell_Pullover';
  if (id.includes('bench_dip')) return 'Bench_Dips';
  if (id.includes('dip') && exercise.primaryMuscle === 'triceps') return 'Dips_-_Triceps_Version';
  if (id.includes('dip')) return 'Dips_-_Chest_Version';
  if (id.includes('close_grip_bench')) return 'Close-Grip_Barbell_Bench_Press';
  if (id.includes('bench_press') || id.includes('chest_press') || id.includes('svend') || id.includes('landmine_chest')) {
    return 'Barbell_Bench_Press_-_Medium_Grip';
  }

  // Back & Lats & Traps
  if (id.includes('chinup') || en.includes('chin-up')) return 'Chin-Up';
  if (id.includes('pullup') || en.includes('pull-up')) return 'Pullups';
  if (id.includes('close') && id.includes('pulldown')) return 'Close-Grip_Front_Lat_Pulldown';
  if (id.includes('straight_arm') || en.includes('straight-arm')) return 'Straight-Arm_Pulldown';
  if (id.includes('pulldown')) return 'Wide-Grip_Lat_Pulldown';
  if (id.includes('inverted')) return 'Inverted_Row';
  if (id.includes('t_bar') || en.includes('t-bar')) return 'T-Bar_Row_with_Handle';
  if (id.includes('chest_supported') || (id.includes('incline') && id.includes('row'))) return 'Dumbbell_Incline_Row';
  if (id.includes('seated') && id.includes('row')) return 'Seated_Cable_Rows';
  if (id.includes('single_arm_cable_row')) return 'Seated_Cable_Rows';
  if (id.includes('dumbbell_row') || en.includes('one-arm dumbbell row')) return 'One-Arm_Dumbbell_Row';
  if (id.includes('row')) return 'Bent_Over_Barbell_Row';
  if (id.includes('cable_shrug')) return 'Cable_Shrugs';
  if (id.includes('dumbbell_shrug')) return 'Dumbbell_Shrug';
  if (id.includes('shrug') || exercise.primaryMuscle === 'traps') return 'Barbell_Shrug';
  if (id.includes('good_morning')) return 'Good_Morning';
  if (id.includes('superman')) return 'Superman';
  if (id.includes('hyperextension') || id.includes('back_extension')) return 'Hyperextensions_Back_Extensions';
  if (id.includes('romanian') || id.includes('rdl')) return 'Romanian_Deadlift';
  if (id.includes('sumo')) return 'Sumo_Deadlift';
  if (id.includes('deadlift')) return 'Barbell_Deadlift';

  // Shoulders
  if (id.includes('arnold')) return 'Arnold_Dumbbell_Press';
  if (id.includes('seated_barbell_military')) return 'Seated_Barbell_Military_Press';
  if (id.includes('overhead') || id.includes('military')) return 'Standing_Military_Press';
  if (id.includes('shoulder_press')) return 'Dumbbell_Shoulder_Press';
  if (id.includes('front_raise')) return 'Front_Dumbbell_Raise';
  if (id.includes('upright_row')) return 'Upright_Barbell_Row';
  if (id.includes('cable') && id.includes('lateral')) return 'Cable_Seated_Lateral_Raise';
  if (id.includes('lateral_raise') || exercise.primaryMuscle === 'deltoid_side') return 'Side_Lateral_Raise';
  if (id.includes('face_pull')) return 'Face_Pull';
  if (id.includes('band_pull_apart')) return 'Band_Pull_Apart';
  if (id.includes('reverse_pec') || id.includes('reverse_machine')) return 'Reverse_Machine_Flyes';
  if (id.includes('cable_rear_delt')) return 'Cable_Rear_Delt_Fly';
  if (exercise.primaryMuscle === 'deltoid_rear') return 'Seated_Bent-Over_Rear_Delt_Raise';

  // Arms & Forearms
  if (id.includes('preacher')) return 'Preacher_Curl';
  if (id.includes('spider')) return 'Spider_Curl';
  if (id.includes('concentration')) return 'Concentration_Curls';
  if (id.includes('incline') && id.includes('curl')) return 'Alternate_Incline_Dumbbell_Curl';
  if (id.includes('rope') && id.includes('hammer')) return 'Cable_Hammer_Curls_-_Rope_Attachment';
  if (id.includes('cross_body_hammer')) return 'Cross_Body_Hammer_Curl';
  if (id.includes('hammer')) return 'Hammer_Curls';
  if (id.includes('zottman')) return 'Zottman_Curl';
  if (id.includes('ez_bar_curl')) return 'EZ-Bar_Curl';
  if (id.includes('dumbbell') && id.includes('curl')) return 'Dumbbell_Bicep_Curl';
  if (exercise.primaryMuscle === 'biceps') return 'Barbell_Curl';

  if (id.includes('skull')) return 'EZ-Bar_Skullcrusher';
  if (id.includes('overhead') && id.includes('tricep')) return 'Cable_Rope_Overhead_Triceps_Extension';
  if (id.includes('reverse_grip_triceps')) return 'Reverse_Grip_Triceps_Pushdown';
  if (id.includes('kickback') && exercise.primaryMuscle === 'triceps') return 'Tricep_Dumbbell_Kickback';
  if (id.includes('single_arm_cable_tricep')) return 'Cable_One_Arm_Tricep_Extension';
  if (id.includes('rope') && id.includes('pushdown')) return 'Triceps_Pushdown_-_Rope_Attachment';
  if (exercise.primaryMuscle === 'triceps') return 'Triceps_Pushdown';

  if (id.includes('farmer')) return 'Farmers_Walk';
  if (id.includes('behind_back') && id.includes('wrist')) return 'Standing_Palms-Up_Barbell_Behind_The_Back_Wrist_Curl';
  if (id.includes('reverse') && id.includes('wrist')) return 'Palms-Down_Wrist_Curl_Over_A_Bench';
  if (exercise.primaryMuscle === 'forearms') return 'Palms-Up_Barbell_Wrist_Curl_Over_A_Bench';

  // Legs & Glutes & Calves
  if (id.includes('front_squat')) return 'Front_Barbell_Squat';
  if (id.includes('goblet')) return 'Goblet_Squat';
  if (id.includes('hack_squat')) return 'Hack_Squat';
  if (id.includes('leg_press') && !id.includes('calf')) return 'Leg_Press';
  if (id.includes('leg_extension') || id.includes('sissy')) return 'Leg_Extensions';
  if (id.includes('step_up')) return 'Dumbbell_Step_Ups';
  if (id.includes('reverse_lunge')) return 'Dumbbell_Rear_Lunge';
  if (id.includes('lunge') || id.includes('split_squat')) return 'Dumbbell_Lunges';
  if (id.includes('standing_leg_curl')) return 'Standing_Leg_Curl';
  if (id.includes('seated_leg_curl')) return 'Seated_Leg_Curl';
  if (id.includes('nordic') || id.includes('glute_ham')) return 'Glute_Ham_Raise';
  if (exercise.primaryMuscle === 'hamstrings') return 'Lying_Leg_Curls';
  if (id.includes('glute_bridge')) return 'Barbell_Glute_Bridge';
  if (id.includes('kickback') || id.includes('donkey')) return 'Glute_Kickback';
  if (id.includes('abduction') || id.includes('abductor')) return 'Thigh_Abductor';
  if (exercise.primaryMuscle === 'glutes') return 'Barbell_Hip_Thrust';
  if (exercise.primaryMuscle === 'adductors') return 'Thigh_Adductor';
  if (id.includes('leg_press_calf')) return 'Calf_Press_On_The_Leg_Press_Machine';
  if (id.includes('seated_calf')) return 'Seated_Calf_Raise';
  if (exercise.primaryMuscle === 'calves') return 'Standing_Calf_Raises';
  if (exercise.primaryMuscle === 'quads') return 'Barbell_Full_Squat';

  // Core & Abs & Obliques
  if (id.includes('ab_wheel') || id.includes('rollout')) return 'Ab_Roller';
  if (id.includes('hanging')) return 'Hanging_Leg_Raise';
  if (id.includes('cable_crunch')) return 'Cable_Crunch';
  if (id.includes('machine') && id.includes('crunch')) return 'Ab_Crunch_Machine';
  if (id.includes('mountain')) return 'Mountain_Climbers';
  if (id.includes('plank') && !id.includes('side')) return 'Plank';
  if (id.includes('side_plank')) return 'Side_Bridge';
  if (id.includes('bicycle')) return 'Air_Bike';
  if (id.includes('russian')) return 'Russian_Twist';
  if (id.includes('pallof')) return 'Pallof_Press';
  if (id.includes('side_bend')) return 'Dumbbell_Side_Bend';
  if (exercise.primaryMuscle === 'abs' || exercise.primaryMuscle === 'obliques') return 'Crunches';

  return 'Barbell_Bench_Press_-_Medium_Grip';
}

function detectMotionPattern(exercise: Exercise): MotionPattern {
  const id = exercise.id.toLowerCase();
  const en = exercise.nameEn.toLowerCase();

  if (id.includes('incline') && (id.includes('press') || en.includes('press'))) return 'incline_press';
  if (id.includes('bench_press') || id.includes('chest_press') || id.includes('floor_press') || en.includes('bench press')) return 'bench_press';
  if (id.includes('pushup') || en.includes('push-up') || en.includes('push up')) return 'pushup';
  if (id.includes('fly') || id.includes('crossover') || id.includes('pec_deck') || id.includes('pullover') || id.includes('svend')) return 'fly';
  if (id.includes('dip')) return 'dips';
  if (id.includes('pulldown') || id.includes('pullup') || id.includes('chinup') || en.includes('pull-up') || en.includes('pulldown')) return 'pulldown';
  if (id.includes('row') || id.includes('t_bar') || en.includes('row')) return 'row';
  if (id.includes('shrug') || en.includes('shrug') || exercise.primaryMuscle === 'traps') return 'shrug';
  if (id.includes('deadlift') || id.includes('good_morning') || id.includes('hyperextension') || id.includes('superman')) return 'deadlift';
  if (id.includes('overhead') || id.includes('shoulder_press') || id.includes('arnold') || id.includes('military')) return 'overhead_press';
  if (id.includes('lateral') || id.includes('raise') || id.includes('face_pull') || id.includes('upright_row') || id.includes('pull_apart')) return 'lateral_raise';
  if (id.includes('skull') || id.includes('overhead_tricep') || en.includes('skull')) return 'skull_crusher';
  if (id.includes('tricep') || id.includes('pushdown') || id.includes('kickback') || exercise.primaryMuscle === 'triceps') return 'tricep_pushdown';
  if (id.includes('curl') && (exercise.primaryMuscle === 'biceps' || exercise.primaryMuscle === 'forearms')) return 'curl';
  if (id.includes('lunge') || id.includes('split_squat') || id.includes('step_up')) return 'lunge';
  if (id.includes('leg_extension') || id.includes('sissy')) return 'leg_extension';
  if (id.includes('leg_curl') || id.includes('nordic')) return 'leg_curl';
  if (id.includes('hip_thrust') || id.includes('glute_bridge') || id.includes('kickback') || exercise.primaryMuscle === 'glutes') return 'hip_thrust';
  if (id.includes('calf') || exercise.primaryMuscle === 'calves') return 'calf_raise';
  if (id.includes('squat') || id.includes('leg_press') || id.includes('adductor') || exercise.primaryMuscle === 'quads' || exercise.primaryMuscle === 'adductors') return 'squat';
  if (exercise.primaryMuscle === 'abs' || exercise.primaryMuscle === 'obliques') return 'core_crunch';

  return 'squat';
}

export const ExerciseAnimationPlayer: React.FC<ExerciseAnimationPlayerProps> = ({
  exercise,
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<'real_clip' | 'anatomy_3d'>('real_clip');
  const [splitCompare, setSplitCompare] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);
  const [showMuscleGlow, setShowMuscleGlow] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100 continuous cycle
  const [imgError, setImgError] = useState(false);

  const pattern = detectMotionPattern(exercise);
  const clipFolder = getRealClipFolder(exercise);
  const frame0Url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${clipFolder}/0.jpg`;
  const frame1Url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${clipFolder}/1.jpg`;

  useEffect(() => {
    setImgError(false);
  }, [exercise.id]);

  useEffect(() => {
    if (!isPlaying) return;
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      // 1 full rep takes ~3.2 seconds at 1x speed
      setProgress((prev) => (prev + dt * 32 * speed) % 100);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, speed]);

  // Calculate normalized contraction factor `t` between 0 (stretched/start) and 1 (peak contraction)
  let t = 0;
  let phaseName = 'شروع حرکت (وضعیت پایه)';
  let breathCue = 'دم عمیق';
  let phaseColor = 'text-zinc-400';

  if (progress < 42) {
    const raw = progress / 42;
    t = 0.5 - 0.5 * Math.cos(Math.PI * raw);
    phaseName = 'فاز مثبت (انقباض و اعمال نیرو)';
    breathCue = 'بازدم قدرتمند';
    phaseColor = 'text-lime-400';
  } else if (progress < 58) {
    t = 1;
    phaseName = 'ایزومتریک (مکث در اوج انقباض)';
    breathCue = 'حفظ انقباض';
    phaseColor = 'text-amber-400';
  } else if (progress < 94) {
    const raw = (progress - 58) / 36;
    t = 0.5 + 0.5 * Math.cos(Math.PI * raw);
    phaseName = 'فاز منفی (کنترل وزنه و کشش)';
    breathCue = 'دم کنترل‌شده';
    phaseColor = 'text-cyan-400';
  } else {
    t = 0;
    phaseName = 'نقطه کشش کامل عضله';
    breathCue = 'دم';
    phaseColor = 'text-zinc-400';
  }

  // Real clip active frame (0 = start/eccentric, 1 = peak contraction)
  const isPeakFrame = t > 0.52;
  const jointAngleDeg = Math.round(165 - t * 82);

  // Reusable SVG Definitions for 3D Sculpted Anatomy & Gym Chrome
  const renderSvgDefs = () => (
    <defs>
      {/* 3D Sculpted Skin/Muscle Base Gradient */}
      <linearGradient id="muscleSkin3D" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e4e4e7" />
        <stop offset="45%" stopColor="#a1a1aa" />
        <stop offset="100%" stopColor="#3f3f46" />
      </linearGradient>

      {/* Active Target Muscle 3D Thermal/Neon Gradient */}
      <radialGradient id="activeMuscle3D" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#d9f99d" />
        <stop offset="45%" stopColor="#84cc16" />
        <stop offset="85%" stopColor="#4d7c0f" />
        <stop offset="100%" stopColor="#1a2e05" />
      </radialGradient>

      {/* Secondary Muscle Synergist 3D Gradient */}
      <radialGradient id="synergistMuscle3D" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#082f49" />
      </radialGradient>

      {/* Chrome Barbell Metallic Gradient */}
      <linearGradient id="chromeSteel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f4f4f5" />
        <stop offset="50%" stopColor="#71717a" />
        <stop offset="100%" stopColor="#27272a" />
      </linearGradient>

      {/* Neon Glow Filter */}
      <filter id="emgGlow" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation={1.5 + t * 2.5} result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );

  const renderBiomechanicalFigure = () => {
    const targetFill = showMuscleGlow ? 'url(#activeMuscle3D)' : 'url(#muscleSkin3D)';
    const synergistFill = showMuscleGlow ? 'url(#synergistMuscle3D)' : 'url(#muscleSkin3D)';

    switch (pattern) {
      case 'bench_press':
      case 'skull_crusher': {
        const isSkull = pattern === 'skull_crusher';
        const barY = isSkull ? 112 - t * 36 : 116 - t * 48;
        const barX = isSkull ? 114 + (1 - t) * 18 : 138;
        const elbowY = isSkull ? 102 : 134 - t * 24;
        const pecSwelling = t * 6;
        return (
          <g>
            {/* Upholstered Gym Bench with Stitching & Steel Frame */}
            <rect x="66" y="141" width="166" height="10" rx="5" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
            <rect x="86" y="151" width="12" height="36" rx="2" fill="url(#chromeSteel)" />
            <rect x="198" y="151" width="12" height="36" rx="2" fill="url(#chromeSteel)" />
            <rect x="74" y="68" width="7" height="75" rx="2" fill="url(#chromeSteel)" />

            {/* Sculpted Head & Jawline */}
            <ellipse cx="102" cy="127" rx="12" ry="10.5" fill="url(#muscleSkin3D)" />
            <path d="M92 122 Q102 114 112 122" fill="#27272a" />

            {/* Sculpted Ribcage & Pectoralis Major Belly (Swells with Contraction) */}
            <path
              d={`M116 126 Q142 ${114 - pecSwelling} 168 124 L196 131 L194 141 L116 141 Z`}
              fill={!isSkull ? targetFill : 'url(#muscleSkin3D)'}
              filter={!isSkull && showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeOpacity={!isSkull && showMuscleGlow ? 0.8 : 0.2}
              strokeWidth="1.5"
            />
            {/* Striated Pec Fibers */}
            {!isSkull && showMuscleGlow && (
              <g stroke="#ecfccb" strokeOpacity={0.25 + t * 0.55} strokeWidth="1">
                <path d={`M124 134 Q142 ${120 - pecSwelling} 160 132`} fill="none" />
                <path d={`M128 138 Q144 ${126 - pecSwelling} 162 136`} fill="none" />
              </g>
            )}

            {/* Sculpted Quad & Calf on Bench */}
            <path d="M192 132 Q216 126 238 135 L236 144 Q214 144 192 141 Z" fill="url(#muscleSkin3D)" />
            <path d="M234 136 Q246 158 242 182 L233 182 Q232 158 228 140 Z" fill="url(#muscleSkin3D)" />
            <rect x="231" y="180" width="18" height="7" rx="3" fill="#a3e635" />

            {/* Sculpted Deltoid Cap */}
            <circle cx="136" cy="128" r="10" fill={synergistFill} />

            {/* Sculpted Upper Arm (Triceps Horseshoe & Biceps) */}
            <path
              d={`M130 128 Q${124 - t * 4} ${(128 + elbowY) / 2} 131 ${elbowY} L143 ${elbowY} Q${148 + t * 5} ${(128 + elbowY) / 2} 142 128 Z`}
              fill={isSkull ? targetFill : synergistFill}
              filter={isSkull && showMuscleGlow ? 'url(#emgGlow)' : undefined}
            />
            {/* Forearm */}
            <line
              x1="137"
              y1={elbowY}
              x2={barX}
              y2={barY}
              stroke="url(#muscleSkin3D)"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Biomechanical Force Vector Guide */}
            <line x1={barX} y1="64" x2={barX} y2="122" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

            {/* Olympic Barbell Plate with Weight Stamp */}
            <circle cx={barX} cy={barY} r="19" fill="#18181b" stroke="#a3e635" strokeWidth="3" />
            <circle cx={barX} cy={barY} r="13" fill="none" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx={barX} cy={barY} r="5" fill="url(#chromeSteel)" />
          </g>
        );
      }

      case 'incline_press': {
        const barX = 148 + t * 12;
        const barY = 106 - t * 46;
        const elbowX = 142;
        const elbowY = 128 - t * 18;
        const clavicularSwell = t * 5;
        return (
          <g>
            {/* 30-Degree Incline Bench */}
            <line x1="92" y1="92" x2="175" y2="152" stroke="#27272a" strokeWidth="11" strokeLinecap="round" />
            <line x1="92" y1="92" x2="175" y2="152" stroke="#52525b" strokeWidth="8" strokeLinecap="round" />
            <line x1="175" y1="152" x2="212" y2="144" stroke="#3f3f46" strokeWidth="10" strokeLinecap="round" />
            <line x1="115" y1="112" x2="115" y2="185" stroke="url(#chromeSteel)" strokeWidth="8" />
            <line x1="185" y1="152" x2="185" y2="185" stroke="url(#chromeSteel)" strokeWidth="8" />

            <circle cx="114" cy="84" r="11.5" fill="url(#muscleSkin3D)" />
            {/* Sculpted Upper Chest & Torso */}
            <path
              d={`M122 96 Q${148 + clavicularSwell} ${102 - clavicularSwell} 176 138 L168 148 Q140 128 118 104 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            {/* Legs */}
            <line x1="174" y1="142" x2="218" y2="140" stroke="url(#muscleSkin3D)" strokeWidth="13" strokeLinecap="round" />
            <line x1="218" y1="140" x2="228" y2="182" stroke="url(#muscleSkin3D)" strokeWidth="10" strokeLinecap="round" />

            {/* Deltoid & Arm */}
            <circle cx="136" cy="106" r="9.5" fill={synergistFill} />
            <line x1="136" y1="106" x2={elbowX} y2={elbowY} stroke={synergistFill} strokeWidth="10" strokeLinecap="round" />
            <line x1={elbowX} y1={elbowY} x2={barX} y2={barY} stroke="url(#muscleSkin3D)" strokeWidth="8.5" strokeLinecap="round" />

            {/* Olympic Dumbbell / Barbell */}
            <circle cx={barX} cy={barY} r="15" fill="#18181b" stroke="#a3e635" strokeWidth="3" />
            <circle cx={barX} cy={barY} r="4.5" fill="url(#chromeSteel)" />
          </g>
        );
      }

      case 'pushup': {
        const shoulderY = 108 + (1 - t) * 34;
        const hipY = 134 + (1 - t) * 20;
        const elbowX = 112 - (1 - t) * 14;
        const elbowY = 140 + (1 - t) * 14;
        return (
          <g>
            <line x1="48" y1="178" x2="272" y2="178" stroke="#3f3f46" strokeWidth="4" />
            {/* Athletic Shoes */}
            <path d="M232 164 L244 176 L230 177 Z" fill="#a3e635" />
            {/* Sculpted Legs & Core */}
            <line x1="235" y1="168" x2="175" y2={hipY} stroke="url(#muscleSkin3D)" strokeWidth="12" strokeLinecap="round" />
            {/* Sculpted Torso with Pectoral Bulge */}
            <path
              d={`M175 ${hipY - 6} L116 ${shoulderY - 7} L118 ${shoulderY + 9 + t * 4} L175 ${hipY + 6} Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
            />
            <circle cx="99" cy={shoulderY - 5} r="11" fill="url(#muscleSkin3D)" />
            <circle cx="118" cy={shoulderY} r="9" fill={synergistFill} />
            <line x1="118" y1={shoulderY} x2={elbowX} y2={elbowY} stroke={synergistFill} strokeWidth="10" strokeLinecap="round" />
            <line x1={elbowX} y1={elbowY} x2="118" y2="174" stroke="url(#muscleSkin3D)" strokeWidth="8.5" strokeLinecap="round" />
          </g>
        );
      }

      case 'fly': {
        const armSpan = 68 - t * 52;
        const handY = 98 + t * 18;
        const pecSqueeze = t * 5;
        return (
          <g>
            {/* Dual Cable Crossover Towers */}
            <rect x="48" y="38" width="8" height="148" rx="3" fill="url(#chromeSteel)" />
            <rect x="264" y="38" width="8" height="148" rx="3" fill="url(#chromeSteel)" />
            <line x1="54" y1="58" x2={160 - armSpan} y2={handY} stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="266" y1="58" x2={160 + armSpan} y2={handY} stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Sculpted Bodybuilder Front Torso */}
            <circle cx="160" cy="58" r="12" fill="url(#muscleSkin3D)" />
            <path d="M134 76 L186 76 L176 142 L144 142 Z" fill="url(#muscleSkin3D)" />

            {/* Sculpted Striated Pectorals */}
            <path
              d={`M136 80 Q159 ${84 - pecSqueeze} 159 109 Q142 ${112 + pecSqueeze} 136 96 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.2"
            />
            <path
              d={`M184 80 Q161 ${84 - pecSqueeze} 161 109 Q178 ${112 + pecSqueeze} 184 96 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.2"
            />
            {/* Six-pack Abs Detail */}
            <g fill="#27272a" opacity="0.55">
              <rect x="151" y="112" width="7" height="6" rx="1.5" />
              <rect x="162" y="112" width="7" height="6" rx="1.5" />
              <rect x="151" y="121" width="7" height="6" rx="1.5" />
              <rect x="162" y="121" width="7" height="6" rx="1.5" />
            </g>

            {/* Quads */}
            <path d="M144 142 Q138 164 144 185 L155 185 L156 142 Z" fill="url(#muscleSkin3D)" />
            <path d="M176 142 Q182 164 176 185 L165 185 L164 142 Z" fill="url(#muscleSkin3D)" />

            {/* Deltoid Caps & Hugging Arms */}
            <circle cx="134" cy="84" r="9" fill={synergistFill} />
            <circle cx="186" cy="84" r="9" fill={synergistFill} />
            <path
              d={`M134 84 Q${122 - armSpan * 0.4} 92 ${160 - armSpan} ${handY}`}
              fill="none"
              stroke="url(#muscleSkin3D)"
              strokeWidth="9.5"
              strokeLinecap="round"
            />
            <path
              d={`M186 84 Q${198 + armSpan * 0.4} 92 ${160 + armSpan} ${handY}`}
              fill="none"
              stroke="url(#muscleSkin3D)"
              strokeWidth="9.5"
              strokeLinecap="round"
            />
            <circle cx={160 - armSpan} cy={handY} r="6.5" fill="#a3e635" />
            <circle cx={160 + armSpan} cy={handY} r="6.5" fill="#a3e635" />
          </g>
        );
      }

      case 'dips': {
        const bodyDrop = (1 - t) * 32;
        return (
          <g>
            <line x1="108" y1="115" x2="212" y2="115" stroke="url(#chromeSteel)" strokeWidth="7" strokeLinecap="round" />
            <line x1="125" y1="115" x2="125" y2="185" stroke="#27272a" strokeWidth="9" />
            <line x1="195" y1="115" x2="195" y2="185" stroke="#27272a" strokeWidth="9" />

            <circle cx="148" cy={56 + bodyDrop} r="11.5" fill="url(#muscleSkin3D)" />
            <path
              d={`M144 ${70 + bodyDrop} L162 ${70 + bodyDrop} L176 ${125 + bodyDrop} L158 ${125 + bodyDrop} Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
            />
            <line x1="168" y1={125 + bodyDrop} x2="162" y2={158 + bodyDrop} stroke="url(#muscleSkin3D)" strokeWidth="12" strokeLinecap="round" />
            <line x1="162" y1={158 + bodyDrop} x2="182" y2={164 + bodyDrop} stroke="url(#muscleSkin3D)" strokeWidth="9.5" strokeLinecap="round" />

            {/* Sculpted Triceps & Forearm */}
            <line
              x1="154"
              y1={76 + bodyDrop}
              x2={174 + (1 - t) * 10}
              y2={92 + bodyDrop * 0.6}
              stroke={targetFill}
              strokeWidth="11"
              strokeLinecap="round"
            />
            <line
              x1={174 + (1 - t) * 10}
              y1={92 + bodyDrop * 0.6}
              x2="160"
              y2="115"
              stroke="url(#muscleSkin3D)"
              strokeWidth="8.5"
              strokeLinecap="round"
            />
          </g>
        );
      }

      case 'pulldown': {
        const barY = 44 + t * 48;
        const elbowY = 60 + t * 50;
        const elbowSpread = 28 + t * 14;
        const latFlare = t * 7;
        return (
          <g>
            {/* Cable Pulley */}
            <line x1="160" y1="16" x2="160" y2={barY} stroke="#a3e635" strokeWidth="2.5" />
            <rect x="126" y="12" width="68" height="7" rx="3.5" fill="url(#chromeSteel)" />

            <circle cx="160" cy="76" r="11.5" fill="url(#muscleSkin3D)" />
            {/* Sculpted V-Taper Latissimus Dorsi */}
            <path
              d={`M${132 - latFlare} 92 L${188 + latFlare} 92 Q${182 + latFlare * 0.6} 122 172 148 L148 148 Q${138 - latFlare * 0.6} 122 ${132 - latFlare} 92 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            {/* Spine Erector Groove */}
            <line x1="160" y1="92" x2="160" y2="146" stroke="#18181b" strokeWidth="2" opacity="0.5" />

            <rect x="130" y="148" width="60" height="9" rx="4" fill="#27272a" />
            <line x1="160" y1="157" x2="160" y2="188" stroke="url(#chromeSteel)" strokeWidth="10" />

            {/* Sculpted Arms & Biceps Pulling */}
            <line x1="134" y1="95" x2={160 - elbowSpread} y2={elbowY} stroke={synergistFill} strokeWidth="10" strokeLinecap="round" />
            <line x1={160 - elbowSpread} y1={elbowY} x2="116" y2={barY} stroke="url(#muscleSkin3D)" strokeWidth="8" strokeLinecap="round" />

            <line x1="186" y1="95" x2={160 + elbowSpread} y2={elbowY} stroke={synergistFill} strokeWidth="10" strokeLinecap="round" />
            <line x1={160 + elbowSpread} y1={elbowY} x2="204" y2={barY} stroke="url(#muscleSkin3D)" strokeWidth="8" strokeLinecap="round" />

            {/* Cambered Wide Lat Bar */}
            <path
              d={`M102 ${barY + 7} L116 ${barY} L204 ${barY} L218 ${barY + 7}`}
              fill="none"
              stroke="url(#chromeSteel)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </g>
        );
      }

      case 'row': {
        const weightX = 128 + t * 28;
        const weightY = 148 - t * 34;
        const elbowX = 142 + t * 30;
        const elbowY = 114 - t * 24;
        return (
          <g>
            <line x1="68" y1="182" x2="252" y2="182" stroke="#3f3f46" strokeWidth="4" />
            <line x1="175" y1="180" x2="164" y2="142" stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />
            <line x1="164" y1="142" x2="194" y2="112" stroke="url(#muscleSkin3D)" strokeWidth="14" strokeLinecap="round" />

            {/* Sculpted Thick Back & Lats */}
            <path
              d={`M194 104 L134 74 L140 92 L188 120 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            <circle cx="121" cy="70" r="11.5" fill="url(#muscleSkin3D)" />

            <line x1="142" y1="84" x2={elbowX} y2={elbowY} stroke={synergistFill} strokeWidth="10.5" strokeLinecap="round" />
            <line x1={elbowX} y1={elbowY} x2={weightX} y2={weightY} stroke="url(#muscleSkin3D)" strokeWidth="8.5" strokeLinecap="round" />

            <circle cx={weightX} cy={weightY} r="16" fill="#18181b" stroke="#a3e635" strokeWidth="3.5" />
            <circle cx={weightX} cy={weightY} r="5" fill="url(#chromeSteel)" />
          </g>
        );
      }

      case 'shrug': {
        const shrugLift = t * 15;
        return (
          <g>
            <circle cx="160" cy="52" r="12" fill="url(#muscleSkin3D)" />
            {/* Sculpted Diamond Trapezius */}
            <polygon
              points={`160,60 ${195},${82 - shrugLift} 160,116 ${125},${82 - shrugLift}`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="2"
            />
            <path d="M135 88 L185 88 L176 146 L144 146 Z" fill="url(#muscleSkin3D)" />
            <line x1="148" y1="146" x2="146" y2="185" stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />
            <line x1="172" y1="146" x2="174" y2="185" stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />

            <line x1="129" y1={84 - shrugLift} x2="127" y2={142 - shrugLift} stroke="url(#muscleSkin3D)" strokeWidth="9" strokeLinecap="round" />
            <line x1="191" y1={84 - shrugLift} x2="193" y2={142 - shrugLift} stroke="url(#muscleSkin3D)" strokeWidth="9" strokeLinecap="round" />

            <line x1="102" y1={142 - shrugLift} x2="218" y2={142 - shrugLift} stroke="url(#chromeSteel)" strokeWidth="4.5" />
            <rect x="94" y={128 - shrugLift} width="12" height="28" rx="3" fill="#18181b" stroke="#a3e635" strokeWidth="2.5" />
            <rect x="214" y={128 - shrugLift} width="12" height="28" rx="3" fill="#18181b" stroke="#a3e635" strokeWidth="2.5" />
          </g>
        );
      }

      case 'deadlift': {
        const hipX = 188 - t * 24;
        const hipY = 122 - t * 8;
        const shoulderX = 132 + t * 28;
        const shoulderY = 98 - t * 32;
        const barY = 156 - t * 36;
        return (
          <g>
            <line x1="68" y1="182" x2="252" y2="182" stroke="#3f3f46" strokeWidth="4" />
            <line x1="162" y1="180" x2={156 + t * 6} y2="144" stroke="url(#muscleSkin3D)" strokeWidth="10.5" strokeLinecap="round" />
            {/* Sculpted Hamstrings & Glutes */}
            <line
              x1={156 + t * 6}
              y1="144"
              x2={hipX}
              y2={hipY}
              stroke={targetFill}
              strokeWidth="15"
              strokeLinecap="round"
            />
            <circle cx={hipX} cy={hipY} r="10.5" fill={targetFill} />
            {/* Erector Spinae & Back */}
            <line
              x1={hipX}
              y1={hipY}
              x2={shoulderX}
              y2={shoulderY}
              stroke={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <circle cx={shoulderX - (1 - t) * 12} cy={shoulderY - 14} r="11.5" fill="url(#muscleSkin3D)" />
            <line x1={shoulderX} y1={shoulderY + 4} x2="152" y2={barY} stroke="url(#muscleSkin3D)" strokeWidth="9" strokeLinecap="round" />
            <circle cx="152" cy={barY} r="20" fill="#18181b" stroke="#a3e635" strokeWidth="3.5" />
            <circle cx="152" cy={barY} r="6" fill="url(#chromeSteel)" />
          </g>
        );
      }

      case 'overhead_press': {
        const barY = 82 - t * 50;
        const elbowY = 104 - t * 44;
        const elbowSpread = 32 - t * 8;
        return (
          <g>
            <circle cx="160" cy="66" r="11.5" fill="url(#muscleSkin3D)" />
            <path d="M136 82 L184 82 L175 148 L145 148 Z" fill="url(#muscleSkin3D)" />
            {/* 3D Cannonball Deltoids */}
            <circle cx="133" cy="85" r={10 + t * 2.5} fill={targetFill} filter={showMuscleGlow ? 'url(#emgGlow)' : undefined} />
            <circle cx="187" cy="85" r={10 + t * 2.5} fill={targetFill} filter={showMuscleGlow ? 'url(#emgGlow)' : undefined} />

            <line x1="148" y1="148" x2="146" y2="185" stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />
            <line x1="172" y1="148" x2="174" y2="185" stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />

            <line x1="133" y1="85" x2={160 - elbowSpread} y2={elbowY} stroke={synergistFill} strokeWidth="9.5" strokeLinecap="round" />
            <line x1={160 - elbowSpread} y1={elbowY} x2="126" y2={barY} stroke="url(#muscleSkin3D)" strokeWidth="8" strokeLinecap="round" />

            <line x1="187" y1="85" x2={160 + elbowSpread} y2={elbowY} stroke={synergistFill} strokeWidth="9.5" strokeLinecap="round" />
            <line x1={160 + elbowSpread} y1={elbowY} x2="194" y2={barY} stroke="url(#muscleSkin3D)" strokeWidth="8" strokeLinecap="round" />

            <line x1="96" y1={barY} x2="224" y2={barY} stroke="url(#chromeSteel)" strokeWidth="4.5" />
            <rect x="102" y={barY - 13} width="9" height="26" rx="2.5" fill="#18181b" stroke="#a3e635" strokeWidth="2" />
            <rect x="209" y={barY - 13} width="9" height="26" rx="2.5" fill="#18181b" stroke="#a3e635" strokeWidth="2" />
          </g>
        );
      }

      case 'lateral_raise': {
        const angleRad = ((15 + t * 75) * Math.PI) / 180;
        const armLen = 48;
        const leftHandX = 134 - Math.sin(angleRad) * armLen;
        const leftHandY = 84 + Math.cos(angleRad) * armLen;
        const rightHandX = 186 + Math.sin(angleRad) * armLen;
        const rightHandY = 84 + Math.cos(angleRad) * armLen;

        return (
          <g>
            <circle cx="160" cy="60" r="11.5" fill="url(#muscleSkin3D)" />
            <path d="M136 78 L184 78 L174 144 L146 144 Z" fill="url(#muscleSkin3D)" />
            {/* Lateral Deltoid Caps */}
            <circle cx="133" cy="84" r={10.5 + t * 3} fill={targetFill} filter={showMuscleGlow ? 'url(#emgGlow)' : undefined} />
            <circle cx="187" cy="84" r={10.5 + t * 3} fill={targetFill} filter={showMuscleGlow ? 'url(#emgGlow)' : undefined} />

            <line x1="150" y1="144" x2="146" y2="185" stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />
            <line x1="170" y1="144" x2="174" y2="185" stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />

            <line x1="133" y1="84" x2={leftHandX} y2={leftHandY} stroke="url(#muscleSkin3D)" strokeWidth="9" strokeLinecap="round" />
            <line x1="187" y1="84" x2={rightHandX} y2={rightHandY} stroke="url(#muscleSkin3D)" strokeWidth="9" strokeLinecap="round" />

            <rect x={leftHandX - 7} y={leftHandY - 5} width="14" height="10" rx="3" fill="#18181b" stroke="#a3e635" strokeWidth="2" />
            <rect x={rightHandX - 7} y={rightHandY - 5} width="14" height="10" rx="3" fill="#18181b" stroke="#a3e635" strokeWidth="2" />
          </g>
        );
      }

      case 'curl': {
        const angleRad = ((20 + t * 115) * Math.PI) / 180;
        const elbowX = 158;
        const elbowY = 114;
        const handX = elbowX - Math.sin(angleRad) * 38;
        const handY = elbowY + Math.cos(angleRad) * 38;
        const bicepPeak = t * 9;

        return (
          <g>
            <circle cx="160" cy="52" r="12" fill="url(#muscleSkin3D)" />
            <path d="M148 68 L174 68 L172 138 L150 138 Z" fill="url(#muscleSkin3D)" />
            <line x1="162" y1="138" x2="162" y2="184" stroke="url(#muscleSkin3D)" strokeWidth="13" strokeLinecap="round" />

            {/* Sculpted Biceps Brachii Belly that Inflates at Peak Contraction */}
            <path
              d={`M156 76 Q${142 - bicepPeak} 95 154 ${elbowY} L164 ${elbowY} Q166 95 162 76 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            {/* Forearm & Brachioradialis */}
            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke={synergistFill} strokeWidth="9.5" strokeLinecap="round" />

            {/* Motion Arc */}
            <path d="M132 145 A 40 40 0 0 1 130 85" fill="none" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

            <circle cx={handX} cy={handY} r="12" fill="#18181b" stroke="#a3e635" strokeWidth="3" />
            <circle cx={handX} cy={handY} r="4" fill="url(#chromeSteel)" />
          </g>
        );
      }

      case 'tricep_pushdown': {
        const angleRad = ((105 - t * 90) * Math.PI) / 180;
        const elbowX = 166;
        const elbowY = 110;
        const handX = elbowX - Math.sin(angleRad) * 36;
        const handY = elbowY + Math.cos(angleRad) * 36;
        const tricepBulge = t * 7;

        return (
          <g>
            <rect x="100" y="22" width="9" height="164" rx="3" fill="url(#chromeSteel)" />
            <line x1="106" y1="28" x2={handX} y2={handY} stroke="#a3e635" strokeWidth="2.5" />

            <circle cx="164" cy="52" r="11.5" fill="url(#muscleSkin3D)" />
            <path d="M154 66 L178 66 L180 136 L158 136 Z" fill="url(#muscleSkin3D)" />
            <line x1="172" y1="136" x2="172" y2="184" stroke="url(#muscleSkin3D)" strokeWidth="13" strokeLinecap="round" />

            {/* Sculpted Triceps Horseshoe Belly */}
            <path
              d={`M162 72 L162 ${elbowY} L171 ${elbowY} Q${178 + tricepBulge} 90 170 72 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="url(#muscleSkin3D)" strokeWidth="9" strokeLinecap="round" />
            <circle cx={handX} cy={handY} r="6.5" fill="#a3e635" />
          </g>
        );
      }

      case 'squat': {
        const squatDepth = t * 38;
        const hipX = 164 + t * 24;
        const hipY = 114 + squatDepth;
        const kneeX = 156 - t * 22;
        const kneeY = 148 + t * 6;
        const shoulderX = 158 - t * 6;
        const shoulderY = 66 + squatDepth * 0.9;
        const quadSweep = t * 6;

        return (
          <g>
            <line x1="72" y1="184" x2="248" y2="184" stroke="#3f3f46" strokeWidth="4" />
            <line x1="160" y1="180" x2={kneeX} y2={kneeY} stroke="url(#muscleSkin3D)" strokeWidth="11" strokeLinecap="round" />
            {/* Sculpted Quadriceps Sweep */}
            <path
              d={`M${kneeX - 4} ${kneeY - 4} Q${(kneeX + hipX) / 2 - 8 - quadSweep} ${(kneeY + hipY) / 2 - 8} ${hipX - 4} ${hipY - 6} L${hipX + 6} ${hipY + 6} L${kneeX + 5} ${kneeY + 5} Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            {/* Sculpted Gluteus Maximus */}
            <circle cx={hipX + 2} cy={hipY} r="11" fill={synergistFill} />
            <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} stroke="url(#muscleSkin3D)" strokeWidth="16" strokeLinecap="round" />
            <circle cx={shoulderX - 4} cy={shoulderY - 14} r="11.5" fill="url(#muscleSkin3D)" />

            <circle cx={shoulderX + 2} cy={shoulderY + 2} r="18" fill="#18181b" stroke="#a3e635" strokeWidth="3.5" />
            <circle cx={shoulderX + 2} cy={shoulderY + 2} r="5.5" fill="url(#chromeSteel)" />
          </g>
        );
      }

      case 'lunge': {
        const drop = t * 30;
        return (
          <g>
            <line x1="65" y1="184" x2="255" y2="184" stroke="#3f3f46" strokeWidth="4" />
            <line x1="125" y1="180" x2="122" y2={144 + drop * 0.3} stroke="url(#muscleSkin3D)" strokeWidth="10" strokeLinecap="round" />
            <line
              x1="122"
              y1={144 + drop * 0.3}
              x2="160"
              y2={116 + drop}
              stroke={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              strokeWidth="15"
              strokeLinecap="round"
            />
            <circle cx="162" cy={116 + drop} r="10" fill={synergistFill} />
            <line x1="160" y1={116 + drop} x2="188" y2={146 + drop * 0.85} stroke="url(#muscleSkin3D)" strokeWidth="12" strokeLinecap="round" />
            <line x1="188" y1={146 + drop * 0.85} x2="220" y2="180" stroke="url(#muscleSkin3D)" strokeWidth="9.5" strokeLinecap="round" />

            <line x1="160" y1={116 + drop} x2="160" y2={66 + drop} stroke="url(#muscleSkin3D)" strokeWidth="16" strokeLinecap="round" />
            <circle cx="160" cy={50 + drop} r="11.5" fill="url(#muscleSkin3D)" />
            <line x1="160" y1={74 + drop} x2="160" y2={122 + drop} stroke="url(#muscleSkin3D)" strokeWidth="8" strokeLinecap="round" />
            <rect x="150" y={118 + drop} width="20" height="11" rx="3" fill="#18181b" stroke="#a3e635" strokeWidth="2.5" />
          </g>
        );
      }

      case 'leg_extension': {
        const angleRad = ((15 + t * 72) * Math.PI) / 180;
        const kneeX = 135;
        const kneeY = 128;
        const ankleX = kneeX - Math.sin(angleRad) * 44;
        const ankleY = kneeY + Math.cos(angleRad) * 44;

        return (
          <g>
            <line x1="132" y1="136" x2="185" y2="136" stroke="#27272a" strokeWidth="10" strokeLinecap="round" />
            <line x1="185" y1="136" x2="195" y2="75" stroke="#27272a" strokeWidth="10" strokeLinecap="round" />
            <line x1="160" y1="136" x2="160" y2="184" stroke="url(#chromeSteel)" strokeWidth="10" />

            <circle cx="176" cy="62" r="11.5" fill="url(#muscleSkin3D)" />
            <line x1="178" y1="76" x2="176" y2="128" stroke="url(#muscleSkin3D)" strokeWidth="16" strokeLinecap="round" />

            {/* Sculpted Quadriceps Belly */}
            <path
              d={`M176 122 Q156 ${114 - t * 6} ${kneeX} 122 L${kneeX} 134 L176 134 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            <line x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} stroke="url(#muscleSkin3D)" strokeWidth="10.5" strokeLinecap="round" />
            <circle cx={ankleX} cy={ankleY} r="8.5" fill="#a3e635" />
          </g>
        );
      }

      case 'leg_curl': {
        const angleRad = ((15 + t * 85) * Math.PI) / 180;
        const kneeX = 198;
        const kneeY = 138;
        const ankleX = kneeX + Math.cos(angleRad) * 42;
        const ankleY = kneeY - Math.sin(angleRad) * 42;

        return (
          <g>
            <line x1="85" y1="146" x2="205" y2="146" stroke="#27272a" strokeWidth="10" strokeLinecap="round" />
            <line x1="110" y1="146" x2="110" y2="184" stroke="url(#chromeSteel)" strokeWidth="8" />
            <line x1="185" y1="146" x2="185" y2="184" stroke="url(#chromeSteel)" strokeWidth="8" />

            <circle cx="95" cy="126" r="11" fill="url(#muscleSkin3D)" />
            <line x1="108" y1="134" x2="156" y2="136" stroke="url(#muscleSkin3D)" strokeWidth="15" strokeLinecap="round" />
            {/* Sculpted Hamstring Belly */}
            <path
              d={`M156 130 Q178 ${122 - t * 6} ${kneeX} 132 L${kneeX} 143 L156 142 Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            <line x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} stroke="url(#muscleSkin3D)" strokeWidth="10" strokeLinecap="round" />
            <circle cx={ankleX} cy={ankleY} r="8.5" fill="#a3e635" />
          </g>
        );
      }

      case 'hip_thrust': {
        const hipY = 154 - t * 38;
        return (
          <g>
            <line x1="65" y1="182" x2="255" y2="182" stroke="#3f3f46" strokeWidth="4" />
            <rect x="74" y="114" width="44" height="66" rx="6" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />

            <circle cx="98" cy="94" r="11" fill="url(#muscleSkin3D)" />
            <line x1="108" y1="112" x2="158" y2={hipY} stroke="url(#muscleSkin3D)" strokeWidth="15" strokeLinecap="round" />

            {/* Sculpted Gluteus Maximus */}
            <circle
              cx="158"
              cy={hipY + 3}
              r={12 + t * 3}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
            />

            <line x1="158" y1={hipY} x2="204" y2="118" stroke={synergistFill} strokeWidth="14" strokeLinecap="round" />
            <line x1="204" y1="118" x2="208" y2="178" stroke="url(#muscleSkin3D)" strokeWidth="10.5" strokeLinecap="round" />

            <circle cx="158" cy={hipY - 9} r="16" fill="#18181b" stroke="#a3e635" strokeWidth="3.5" />
            <circle cx="158" cy={hipY - 9} r="5" fill="url(#chromeSteel)" />
          </g>
        );
      }

      case 'calf_raise': {
        const lift = t * 22;
        return (
          <g>
            <rect x="118" y="168" width="84" height="16" rx="4" fill="#27272a" stroke="#52525b" />
            <line x1="160" y1="48" x2="160" y2="114" stroke="url(#muscleSkin3D)" strokeWidth="17" strokeLinecap="round" />
            {/* Sculpted Diamond Gastrocnemius Calf */}
            <path
              d={`M150 ${114 - lift} Q${136 - t * 4} ${134 - lift} 155 ${158 - lift} L165 ${158 - lift} Q${182 + t * 4} ${134 - lift} 170 ${114 - lift} Z`}
              fill={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              stroke="#a3e635"
              strokeWidth="1.5"
            />
            <line
              x1="146"
              y1="166"
              x2="174"
              y2={172 - lift}
              stroke="url(#muscleSkin3D)"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>
        );
      }

      case 'core_crunch':
      default: {
        const headX = 102 + t * 26;
        const headY = 148 - t * 32;
        return (
          <g>
            <line x1="65" y1="176" x2="255" y2="176" stroke="#3f3f46" strokeWidth="4" />
            <line x1="168" y1="166" x2="202" y2="128" stroke="url(#muscleSkin3D)" strokeWidth="13" strokeLinecap="round" />
            <line x1="202" y1="128" x2="232" y2="172" stroke="url(#muscleSkin3D)" strokeWidth="10.5" strokeLinecap="round" />

            <line
              x1="168"
              y1="166"
              x2={headX + 12}
              y2={headY + 12}
              stroke={targetFill}
              filter={showMuscleGlow ? 'url(#emgGlow)' : undefined}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <circle cx={headX} cy={headY} r="11.5" fill="url(#muscleSkin3D)" />
            {showMuscleGlow && (
              <circle
                cx="152"
                cy="152"
                r={10 + t * 14}
                fill="none"
                stroke="#a3e635"
                strokeWidth="2"
                opacity={0.75 - t * 0.4}
              />
            )}
          </g>
        );
      }
    }
  };

  // COMPACT MODE (Used on Exercise Cards in Library Grid)
  if (compact) {
    return (
      <div className="w-full h-40 bg-zinc-950 rounded-2xl border border-zinc-800/80 relative overflow-hidden flex items-center justify-center group-hover:border-lime-500/40 transition-colors">
        {!imgError ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Frame 0: Start Position */}
            <img
              src={frame0Url}
              alt={`${exercise.nameFa} - شروع`}
              onError={() => setImgError(true)}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isPeakFrame ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Frame 1: Peak Contraction Position */}
            <img
              src={frame1Url}
              alt={`${exercise.nameFa} - انقباض`}
              onError={() => setImgError(true)}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isPeakFrame ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Dark Gradient Vignette for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          </div>
        ) : (
          <svg viewBox="40 15 240 180" className="w-full h-full">
            {renderSvgDefs()}
            {renderBiomechanicalFigure()}
          </svg>
        )}

        {/* Top-left Frame Step Indicator */}
        <div className="absolute top-2 left-2 bg-zinc-950/85 backdrop-blur-sm px-2 py-0.5 rounded-md border border-zinc-800 text-[10px] font-mono text-zinc-300">
          {isPeakFrame ? '۲/۲ اوج انقباض' : '۱/۲ شروع حرکت'}
        </div>

        {/* Bottom-right Live Clip Badge */}
        <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-lime-500/30 text-[10px] text-lime-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
          <span>کلیپ واقعی + آناتومی</span>
        </div>
      </div>
    );
  }

  // FULL INTERACTIVE PLAYER (Used in ExerciseDetailModal)
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 space-y-4">
      {/* Top Mode Switcher & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
        {/* Mode Tabs: Real Clip vs 3D Anatomy */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setViewMode('real_clip')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'real_clip'
                ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>کلیپ واقعی ورزشکار</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('anatomy_3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'anatomy_3d'
                ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>شبیه‌ساز آناتومیک سه‌بعدی</span>
          </button>
        </div>

        {/* Interactive Player Controls */}
        <div className="flex items-center gap-1.5">
          {viewMode === 'real_clip' && !imgError && (
            <button
              type="button"
              onClick={() => setSplitCompare(!splitCompare)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                splitCompare
                  ? 'bg-lime-500/15 text-lime-400 border-lime-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
              title="مقایسه همزمان شروع و پایان حرکت"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مقایسه دو فریم</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1 border border-zinc-800 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-lime-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-lime-400" />
            )}
            <span>{isPlaying ? 'توقف' : 'پخش'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSpeed(speed === 1 ? 0.5 : speed === 0.5 ? 1.5 : 1)}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-800 transition-colors flex items-center gap-1"
            title="سرعت نمایش"
          >
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>{speed}x</span>
          </button>

          {viewMode === 'anatomy_3d' && (
            <button
              type="button"
              onClick={() => setShowMuscleGlow(!showMuscleGlow)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                showMuscleGlow
                  ? 'bg-lime-500/15 text-lime-400 border-lime-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
              title="نمایش حرارتی درگیری عضله هدف"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">اسکن EMG</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Canvas */}
      <div className="relative h-64 sm:h-72 w-full bg-zinc-900/60 rounded-2xl border border-zinc-800/70 overflow-hidden flex items-center justify-center">
        {viewMode === 'real_clip' && !imgError ? (
          splitCompare ? (
            /* Side-by-side Start vs Peak Comparison */
            <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
              <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                <img
                  src={frame0Url}
                  alt="وضعیت شروع حرکت"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-950/85 border border-zinc-700 text-[10px] font-bold text-cyan-400">
                  ۱. وضعیت شروع و کشش (دم)
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-lime-500/40">
                <img
                  src={frame1Url}
                  alt="وضعیت انقباض نهایی"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-950/85 border border-lime-500/40 text-[10px] font-bold text-lime-400">
                  ۲. نقطه اوج انقباض (بازدم)
                </span>
              </div>
            </div>
          ) : (
            /* Animated Real Athlete Motion Loop + Corner PiP 3D Anatomy */
            <div className="relative w-full h-full">
              <img
                src={frame0Url}
                alt="شروع حرکت"
                onError={() => setImgError(true)}
                className={`absolute inset-0 w-full h-full object-contain sm:object-cover transition-opacity duration-300 ${
                  isPeakFrame ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <img
                src={frame1Url}
                alt="اوج انقباض"
                onError={() => setImgError(true)}
                className={`absolute inset-0 w-full h-full object-contain sm:object-cover transition-opacity duration-300 ${
                  isPeakFrame ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-zinc-950/30 pointer-events-none" />

              {/* Picture-in-Picture Live 3D Muscle EMG Scanner in Top-Left Corner */}
              <div
                onClick={() => setViewMode('anatomy_3d')}
                title="کلیک برای بزرگنمایی شبیه‌ساز سه‌بعدی آناتومی"
                className="absolute top-3 left-3 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-lime-500/40 shadow-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              >
                <svg viewBox="40 15 240 180" className="w-full h-full">
                  {renderSvgDefs()}
                  {renderBiomechanicalFigure()}
                </svg>
                <span className="absolute bottom-1 inset-x-1 text-center text-[9px] font-bold text-lime-400 bg-zinc-950/80 rounded">
                  EMG سه‌بعدی
                </span>
              </div>
            </div>
          )
        ) : (
          /* Full-Screen 3D Sculpted Anatomical Bodybuilder View */
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#52525b 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <svg viewBox="40 15 240 180" className="w-full h-full max-w-md">
              {renderSvgDefs()}
              {renderBiomechanicalFigure()}
            </svg>
          </div>
        )}

        {/* Top-Right Telemetry Badges: Phase & Breathing & Joint Angle */}
        {!splitCompare && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
            <span className="px-2.5 py-1 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-[11px] font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-lime-400" />
              <span className={phaseColor}>{phaseName}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-zinc-950/85 border border-zinc-800 text-[10px] text-cyan-300 flex items-center gap-1">
                <Wind className="w-3 h-3" />
                تنفس: {breathCue}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-zinc-950/85 border border-zinc-800 text-[10px] font-mono text-amber-300">
                زاویه مفصل: {jointAngleDeg}°
              </span>
            </div>
          </div>
        )}

        {/* Bottom Live EMG Muscle Tension Meter Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 bg-zinc-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800/80 text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-zinc-300 font-medium">درگیری عضله ({exercise.muscleFa.split(' ')[0]}):</span>
          </div>
          <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-l from-lime-400 via-emerald-400 to-cyan-500 h-full transition-all duration-75"
              style={{ width: `${Math.round(22 + t * 78)}%` }}
            />
          </div>
          <span className="font-mono font-bold text-lime-400 w-9 text-left">
            {Math.round(22 + t * 78)}%
          </span>
        </div>
      </div>
    </div>
  );
};
