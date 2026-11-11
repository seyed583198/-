export type MuscleId =
  | 'chest' // سینه
  | 'chest_upper' // بالا سینه
  | 'chest_lower' // زیر سینه
  | 'lats' // زیربغل (لت)
  | 'traps' // کول و ذوزنقه‌ای
  | 'back_upper' // عضلات رومبوئید و بالای پشت
  | 'back_lower' // پایین کمر (فیله)
  | 'deltoid_front' // سرشانه قدامی
  | 'deltoid_side' // سرشانه میانی (جانبی)
  | 'deltoid_rear' // سرشانه خلفی
  | 'biceps' // جلو بازو
  | 'triceps' // پشت بازو
  | 'forearms' // ساعد
  | 'abs' // عضلات شکم (راست شکمی)
  | 'obliques' // پهلو (مورب شکمی)
  | 'quads' // چهارسر ران
  | 'hamstrings' // همسترینگ (پشت ران)
  | 'glutes' // باسن (سرینی)
  | 'calves' // ساق پا
  | 'adductors'; // داخل ران

export type Difficulty = 'مبتدی' | 'متوسط' | 'پیشرفته';

export type Equipment =
  | 'هالتر'
  | 'دمبل'
  | 'دستگاه'
  | 'سیم‌کش'
  | 'وزن بدن'
  | 'کش تمرینی'
  | 'توپ یا تراباند'
  | 'میز و پارالل';

export interface Exercise {
  id: string;
  nameFa: string;
  nameEn: string;
  primaryMuscle: MuscleId;
  secondaryMuscles: MuscleId[];
  muscleFa: string;
  muscleEn: string;
  secondaryMusclesFa: string[];
  difficulty: Difficulty;
  equipment: Equipment;
  location: 'gym' | 'home' | 'both';
  type: 'strength' | 'hypertrophy' | 'endurance' | 'mobility';
  steps: string[];
  tips: string[];
  mistakes: string[];
  warnings: string;
  defaultSets: number;
  defaultReps: string;
  defaultRestSec: number;
}

export interface ProgramExercise {
  id: string;
  exerciseId: string;
  nameFa: string;
  nameEn: string;
  targetMuscle: string;
  targetMuscleId?: MuscleId;
  sets: number;
  reps: string;
  restSeconds: number;
  tempo?: string; // e.g. "3-1-1-0"
  rpe?: string; // e.g. "RPE 8 (2 RIR)"
  technique?: string; // e.g. "دراپ‌ست در ست آخر"
  notes?: string;
}

export interface ProgramDay {
  id: string;
  dayNumber: number;
  dayName: string; // e.g. "شنبه (بالاتنه الف)"
  targetMuscles: string[];
  targetMuscleIds?: MuscleId[];
  focus: string;
  estimatedDuration: number;
  warmup: string;
  cooldown: string;
  exercises: ProgramExercise[];
}

export interface NutritionMacroPlan {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterLiters: number;
  supplements: string[];
  mealTimingTip: string;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  summary: string;
  splitType: string;
  createdAt: string;
  days: ProgramDay[];
  recoveryTips: string[];
  author?: string;
  nutritionPlan?: NutritionMacroPlan;
  cardioProtocol?: string;
  postureCorrection?: string;
  periodizationNote?: string;
}

export interface LoggedSet {
  setNumber: number;
  weight: number; // in kg
  reps: number;
  completed: boolean;
  rpe?: number; // 1-10
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseNameFa: string;
  exerciseNameEn: string;
  muscleId: MuscleId;
  sets: LoggedSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD (ISO)
  jalaliDate: string; // e.g. "۱۴۰۳/۰۸/۲۱"
  programTitle: string;
  dayName: string;
  durationMinutes: number;
  completedExercisesCount: number;
  totalVolumeKg: number;
  notes?: string;
  feeling: 'عالی' | 'خوب' | 'معمولی' | 'خسته';
  exercises: LoggedExercise[];
}

export interface UserProfile {
  username?: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  weightKg: number;
  heightCm: number;
  experienceLevel: 'مبتدی' | 'متوسط' | 'پیشرفته';
  goal: string;
  targetWeightKg?: number;
  somatotype?: 'اکتومورف' | 'مزومورف' | 'اندومورف' | 'ترکیبی';
  bodyFatEstimate?: string;
  themeAccent: 'lime' | 'orange' | 'cyan' | 'red';
  soundEnabled: boolean;
}

export interface UserAccount {
  username: string;
  passwordHash: string;
  createdAt: string;
  profile: UserProfile;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  repsAtMax: number;
  estimated1RM: number;
  date: string;
}
