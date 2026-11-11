import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { WorkoutProgram } from '../../types/fitness';
import { PRESET_PROGRAMS } from '../../data/presetPrograms';
import {
  Sparkles,
  Bot,
  ShieldAlert,
  Target,
  CheckCircle2,
  Printer,
  ChevronDown,
  ChevronUp,
  Zap,
  BookOpen,
  UserCheck,
  HeartPulse,
  Flame,
  Droplets,
  Utensils,
  Activity,
  Gauge,
  Clock,
  Sliders,
} from 'lucide-react';

export const AIWorkoutGenerator: React.FC<{ onProgramActivated?: () => void }> = ({
  onProgramActivated,
}) => {
  const { profile, activeProgram, setActiveProgram, saveProgram } = useWorkout();

  // Section 1: Anthropometrics & Somatotype
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender || 'male');
  const [age, setAge] = useState<number>(profile.age || 26);
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 78);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 178);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(
    profile.targetWeightKg || (profile.weightKg ? profile.weightKg + 4 : 82)
  );
  const [bodyFat, setBodyFat] = useState<string>(profile.bodyFatEstimate || '۱۲ تا ۱۸ درصد (معمولی/ورزشی)');
  const [somatotype, setSomatotype] = useState<string>(profile.somatotype || 'مزومورف (عضلانی و متناسب)');

  // Section 2: Experience, Training System & Weak Points
  const [experienceLevel, setExperienceLevel] = useState<string>(profile.experienceLevel || 'متوسط');
  const [trainingHistory, setTrainingHistory] = useState<string>('۱ تا ۲ سال تمرین پیوسته با وزنه');
  const [goal, setGoal] = useState<string>(profile.goal || 'عضله‌سازی و افزایش حجم خالص');
  const [trainingStyle, setTrainingStyle] = useState<string>(
    'ترکیبی قدرتی و هایپرتروفی (Powerbuilding)'
  );
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [sessionDuration, setSessionDuration] = useState<number>(65);
  const [location, setLocation] = useState<'gym' | 'home'>('gym');
  const [equipmentList, setEquipmentList] = useState<string[]>([
    'هالتر',
    'دمبل',
    'سیم‌کش',
    'دستگاه‌ها',
    'میز شیبدار',
  ]);
  const [weakPoints, setWeakPoints] = useState<string[]>(['بالا سینه', 'سرشانه میانی']);

  // Section 3: Lifestyle, Recovery, Nutrition & Cardio
  const [sleepHours, setSleepHours] = useState<string>('۷ تا ۸ ساعت (خواب استاندارد)');
  const [stressLevel, setStressLevel] = useState<string>('متوسط (شغل و فعالیت روزمره عادی)');
  const [nutritionStatus, setNutritionStatus] = useState<string>(
    'مازاد کالری کنترل‌شده (Lean Bulk)'
  );
  const [cardioPref, setCardioPref] = useState<string>(
    'هوازی سبک (LISS) بعد از تمرین یا روز استراحت'
  );

  // Section 4: Posture & Clinical Injury Screening
  const [postureIssues, setPostureIssues] = useState<string[]>(['ندارد']);
  const [injuries, setInjuries] = useState<string>('ندارد');
  const [preferences, setPreferences] = useState<string>(
    'تمرکز ویژه بر تقارن عضلانی، فرم V بالاتنه و کنترل فاز منفی حرکات'
  );

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProgram, setGeneratedProgram] = useState<WorkoutProgram | null>(null);
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(0);
  const [generationSource, setGenerationSource] = useState<string>('');

  const availableEquipmentOptions = [
    'هالتر',
    'دمبل',
    'سیم‌کش',
    'دستگاه‌ها',
    'میز شیبدار',
    'میله بارفیکس',
    'کش‌های تمرینی',
    'وزن بدن',
  ];

  const availableWeakPoints = [
    'بالا سینه',
    'سرشانه میانی',
    'زیربغل و پهنای پشت',
    'بازوها (جلو بازو و پشت بازو)',
    'چهارسر ران',
    'همسترینگ',
    'باسن',
    'شکم و کر (Core)',
    'ساق پا',
  ];

  const availablePostureOptions = [
    'ندارد',
    'قوز پشتی و شانه گرد (کایفوز)',
    'گودی کمر (لوردوز)',
    'عارضه سر به جلو (Forward Head)',
    'عدم تقارن شانه‌ها',
  ];

  const toggleEquipment = (item: string) => {
    setEquipmentList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleWeakPoint = (point: string) => {
    setWeakPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const togglePostureIssue = (issue: string) => {
    if (issue === 'ندارد') {
      setPostureIssues(['ندارد']);
      return;
    }
    setPostureIssues((prev) => {
      const cleaned = prev.filter((i) => i !== 'ندارد');
      const next = cleaned.includes(issue)
        ? cleaned.filter((i) => i !== issue)
        : [...cleaned, issue];
      return next.length === 0 ? ['ندارد'] : next;
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          age,
          weightKg,
          heightCm,
          targetWeightKg,
          bodyFat,
          somatotype,
          experienceLevel,
          trainingHistory,
          goal,
          daysPerWeek,
          sessionDuration,
          location,
          equipment: equipmentList,
          weakPoints,
          trainingStyle,
          sleepHours,
          stressLevel,
          nutritionStatus,
          cardioPref,
          postureIssues,
          injuries,
          preferences,
        }),
      });

      const data = await response.json();
      if (data && data.program) {
        const prog: WorkoutProgram = {
          id: `ai_prog_${Date.now()}`,
          title: data.program.title || `برنامه تخصصی ${daysPerWeek} روزه ${goal}`,
          summary: data.program.summary || 'برنامه هوشمند طراحی شده بر اساس آنالیز تخصصی فیزیولوژیک',
          splitType: data.program.splitType || 'Custom Pro Split',
          createdAt: new Date().toLocaleDateString('fa-IR'),
          author:
            data.source === 'gemini'
              ? 'هوش مصنوعی Gemini 3.8 Flash'
              : 'موتور بیومکانیک و پریودایزیشن سید بدنساز',
          periodizationNote: data.program.periodizationNote,
          cardioProtocol: data.program.cardioProtocol,
          postureCorrection: data.program.postureCorrection,
          nutritionPlan: data.program.nutritionPlan,
          recoveryTips: data.program.recoveryTips || [
            'خواب عمیق ۷ تا ۸ ساعت شبانه',
            'مصرف پروتئین کافی و هیدراتاسیون مناسب',
          ],
          days: (data.program.days || []).map((d: any, dIdx: number) => ({
            id: `d_${dIdx}_${Date.now()}`,
            dayNumber: d.dayNumber || dIdx + 1,
            dayName: d.dayName || `روز ${dIdx + 1}`,
            targetMuscles: d.targetMuscles || [],
            focus: d.focus || '',
            estimatedDuration: d.estimatedDuration || sessionDuration,
            warmup: d.warmup || '۵ دقیقه گرم کردن عمومی مفاصل و ۲ ست سبک',
            cooldown: d.cooldown || '۵ دقیقه کشش ایستا و تنفس دیافراگمی',
            exercises: (d.exercises || []).map((e: any, eIdx: number) => ({
              id: `pe_${dIdx}_${eIdx}_${Date.now()}`,
              exerciseId: e.exerciseId || `ex_${eIdx}`,
              nameFa: e.nameFa,
              nameEn: e.nameEn || '',
              targetMuscle: e.targetMuscle || '',
              sets: e.sets || 3,
              reps: e.reps || '10-12',
              tempo: e.tempo || '3-0-1-0',
              rpe: e.rpe || '8',
              technique: e.technique || 'کنترل کامل فاز منفی',
              restSeconds: e.restSeconds || 75,
              notes: e.notes || '',
            })),
          })),
        };
        setGeneratedProgram(prog);
        setGenerationSource(data.source);
        setExpandedDayIdx(0);
      }
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyProgram = (prog: WorkoutProgram) => {
    saveProgram(prog);
    setActiveProgram(prog);
    if (onProgramActivated) onProgramActivated();
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>ارزیابی تخصصی فیزیولوژیک و بیومکانیک • نسخه Pro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            طراحی برنامه فوق‌تخصصی تمرین و ماکروهای تغذیه
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            پرسشنامه ۴ مرحله‌ای زیر (شامل تیپ بدنی، نقاط ضعف عضلانی، سیستم تمرینی، سبک زندگی، وضعیت خواب و غربالگری ناهنجاری‌های پاسچر) را تکمیل کنید تا برنامه‌ای دقیق با <span className="text-lime-400 font-bold">تمپوی حرکتی (Tempo)</span>، <span className="text-lime-400 font-bold">شدت RPE</span>، <span className="text-lime-400 font-bold">حرکات اصلاحی</span> و <span className="text-lime-400 font-bold">کالری و ماکروهای روزانه</span> برایتان تدوین شود.
          </p>
        </div>
      </div>

      {/* Preset Programs Quick Switcher */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-lime-400" />
            <h2 className="text-lg font-bold text-white">برنامه‌های آماده کلاسیک</h2>
          </div>
          <span className="text-xs text-zinc-400">اعمال فوری یک‌کلیکی</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_PROGRAMS.map((preset) => {
            const isActive = activeProgram.id === preset.id;
            return (
              <div
                key={preset.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-lime-950/20 border-lime-500/60 shadow-lg shadow-lime-500/10'
                    : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[11px] font-medium text-zinc-300">
                      {preset.splitType}
                    </span>
                    {isActive && (
                      <span className="text-[11px] font-bold text-lime-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        برنامه فعال
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{preset.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {preset.summary}
                  </p>
                </div>

                <button
                  onClick={() => handleApplyProgram(preset)}
                  disabled={isActive}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-zinc-800 hover:bg-lime-500 hover:text-zinc-950 text-white'
                  }`}
                >
                  {isActive ? 'در حال استفاده' : 'انتخاب به عنوان برنامه من'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialized 4-Step Assessment Questionnaire */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-lime-400" />
            <div>
              <h2 className="text-xl font-black text-white">پرسشنامه تخصصی طراحی برنامه شخصی</h2>
              <p className="text-xs text-zinc-400">اطلاعات زیر مستقیماً در محاسبه حجم هفتگی، انتخاب حرکات و ماکروهای تغذیه شما اثر می‌گذارد</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-lime-400 font-bold">
            پروفایل: {profile.name}
          </span>
        </div>

        {/* SECTION 1: Anthropometrics & Somatotype */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2 text-lime-400 font-bold text-sm">
            <UserCheck className="w-4 h-4" />
            <span>بخش ۱: آنتروپومتری، ترکیب بدنی و تیپ ژنتیکی (Somatotype)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">جنسیت فیزیولوژیک:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    gender === 'male'
                      ? 'bg-lime-500 text-zinc-950 border-lime-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  آقا
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    gender === 'female'
                      ? 'bg-lime-500 text-zinc-950 border-lime-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  خانم
                </button>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">سن (سال):</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={14}
                max={80}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">قد (سانتی‌متر):</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                min={130}
                max={230}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>

            {/* Current Weight & Target Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">وزن فعلی (kg):</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">وزن هدف (kg):</label>
                <input
                  type="number"
                  step="0.5"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-lime-400 font-bold focus:border-lime-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Somatotype */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                تیپ بدنی غالب (Somatotype):
              </label>
              <select
                value={somatotype}
                onChange={(e) => setSomatotype(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="اکتومورف (لاغر، استخوان‌بندی ظریف، متابولیسم بالا)">
                  اکتومورف (استخوان‌بندی ظریف، سخت‌وزن‌گیر، متابولیسم سریع)
                </option>
                <option value="مزومورف (عضلانی و متناسب)">
                  مزومورف (شانه پهن، استعداد بالا در عضله‌سازی و قدرت)
                </option>
                <option value="اندومورف (درشت‌اندام، مستعد ذخیره چربی)">
                  اندومورف (استخوان‌بندی درشت، قدرت بالا، مستعد ذخیره چربی)
                </option>
                <option value="ترکیبی اکتو-مزومورف">ترکیبی اکتو-مزومورف (کشیده و عضلانی)</option>
                <option value="ترکیبی اندو-مزومورف">ترکیبی اندو-مزومورف (حجیم و قدرتمند)</option>
              </select>
            </div>

            {/* Body Fat Estimate */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                درصد چربی تخمینی بدن (Body Fat %):
              </label>
              <select
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="زیر ۱۲ درصد (کات و رگ‌دار)">زیر ۱۲٪ (بسیار خشک، تفکیک کامل شکم)</option>
                <option value="۱۲ تا ۱۸ درصد (معمولی/ورزشی)">۱۲ تا ۱۸٪ (فیت و ورزشی، نمای کلی سیکس‌پک)</option>
                <option value="۱۸ تا ۲۵ درصد (کمی اضافه‌وزن)">۱۸ تا ۲۵٪ (پوشش چربی متوسط روی شکم و پهلو)</option>
                <option value="بالای ۲۵ درصد (نیازمند چربی‌سوزی اولویت‌دار)">بالای ۲۵٪ (نیازمند اولویت کاهش چربی و متابولیک)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Experience, Training System & Weak Points */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2 text-lime-400 font-bold text-sm">
            <Sliders className="w-4 h-4" />
            <span>بخش ۲: سابقه ورزشی، متدلوژی تمرین و نقاط ضعف عضلانی</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">سطح تجربه ورزشی:</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="مبتدی">مبتدی (کمتر از ۶ ماه تمرین مستمر)</option>
                <option value="متوسط">متوسط (۶ ماه تا ۲ سال تمرین با وزنه)</option>
                <option value="پیشرفته">پیشرفته (بیش از ۲ سال تمرین حرفه‌ای)</option>
              </select>
            </div>

            {/* Main Goal */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">هدف اصلی فاز فعلی:</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="عضله‌سازی و افزایش حجم خالص">عضله‌سازی و هایپرتروفی خالص (Lean Mass)</option>
                <option value="افزایش قدرت و توان رکوردی">افزایش قدرت و رکورد وزنه (Strength & Power)</option>
                <option value="چربی‌سوزی و تفکیک عضلانی">چربی‌سوزی و کات عضلانی (Shred & Cut)</option>
                <option value="بازترکیب بدنی (عضله‌سازی همزمان با چربی‌سوزی)">بازترکیب بدنی (Body Recomposition)</option>
                <option value="تناسب اندام و استقامت عضلانی">تناسب اندام و استقامت عملکردی</option>
              </select>
            </div>

            {/* Training System / Style */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">سیستم و متد تمرینی مورد علاقه:</label>
              <select
                value={trainingStyle}
                onChange={(e) => setTrainingStyle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="ترکیبی قدرتی و هایپرتروفی (Powerbuilding)">
                  ترکیبی قدرتی و هایپرتروفی (Powerbuilding)
                </option>
                <option value="ست‌های صاف با کنترل فاز منفی (Controlled Straight Sets)">
                  ست‌های صاف با کنترل فاز منفی (Straight Sets)
                </option>
                <option value="هرمی افزایشی (Pyramid Sets)">
                  سیستم هرمی افزایشی وزنه (Pyramid)
                </option>
                <option value="سوپرست و تراکم بالا (High Density / Superset)">
                  سوپرست و تراکم تمرینی بالا (Superset)
                </option>
                <option value="دراپ‌ست و پمپ حداکثری (Drop Sets & Metabolic Pump)">
                  دراپ‌ست و پمپ عضلانی (FST-7 / Drop Set)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Days Per Week */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                تعداد جلسات در هفته ({daysPerWeek} جلسه):
              </label>
              <div className="flex gap-1.5">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDaysPerWeek(num)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      daysPerWeek === num
                        ? 'bg-lime-500 text-zinc-950 border-lime-500 shadow-md shadow-lime-500/20'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {num} روز
                  </button>
                ))}
              </div>
            </div>

            {/* Session Duration */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                مدت زمان هر جلسه ({sessionDuration} دقیقه):
              </label>
              <div className="flex gap-1.5">
                {[45, 60, 75, 90].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSessionDuration(dur)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      sessionDuration === dur
                        ? 'bg-lime-500 text-zinc-950 border-lime-500 shadow-md shadow-lime-500/20'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {dur} دقیقه
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">محل تمرین:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLocation('gym')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    location === 'gym'
                      ? 'bg-lime-500 text-zinc-950 border-lime-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  باشگاه بدنسازی
                </button>
                <button
                  type="button"
                  onClick={() => setLocation('home')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    location === 'home'
                      ? 'bg-lime-500 text-zinc-950 border-lime-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  تمرین در خانه
                </button>
              </div>
            </div>
          </div>

          {/* Weak Points Multi-select */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              نقاط ضعف عضلانی که می‌خواهید در اولویت رشد و حجم باشند (انتخاب چندگانه):
            </label>
            <div className="flex flex-wrap gap-2">
              {availableWeakPoints.map((wp) => {
                const selected = weakPoints.includes(wp);
                return (
                  <button
                    key={wp}
                    type="button"
                    onClick={() => toggleWeakPoint(wp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-lime-500/20 text-lime-400 border-lime-500/60'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {selected ? '★ ' : '+ '}
                    {wp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipment Multi-select */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              تجهیزات در دسترس شما:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableEquipmentOptions.map((eq) => {
                const selected = equipmentList.includes(eq);
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleEquipment(eq)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {eq}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 3: Lifestyle, Recovery, Nutrition & Cardio */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2 text-lime-400 font-bold text-sm">
            <HeartPulse className="w-4 h-4" />
            <span>بخش ۳: ریکاوری، خواب، استراتژی تغذیه و پروتکل هوازی</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sleep Hours */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">میانگین خواب شبانه:</label>
              <select
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="کمتر از ۶ ساعت (ریکاوری محدود)">کمتر از ۶ ساعت (کم‌خوابی)</option>
                <option value="۶ تا ۷ ساعت (متوسط)">۶ تا ۷ ساعت (متوسط)</option>
                <option value="۷ تا ۸ ساعت (خواب استاندارد)">۷ تا ۸ ساعت (استاندارد ورزشی)</option>
                <option value="بیش از ۸ ساعت (ریکاوری عالی)">بیش از ۸ ساعت (ریکاوری ایده‌آل)</option>
              </select>
            </div>

            {/* Daily Stress */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">سطح استرس شغلی و روزانه:</label>
              <select
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="پایین (آرام و کم‌تنش)">پایین (محیط آرام و کم‌تنش)</option>
                <option value="متوسط (شغل و فعالیت روزمره عادی)">متوسط (فعالیت روزمره عادی)</option>
                <option value="بالا (فشار کاری/ذهنی زیاد)">بالا (فشار کاری و ذهنی سنگین)</option>
              </select>
            </div>

            {/* Nutrition Strategy */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">استراتژی کالری و تغذیه:</label>
              <select
                value={nutritionStatus}
                onChange={(e) => setNutritionStatus(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="مازاد کالری کنترل‌شده (Lean Bulk)">مازاد کالری تمیز (Lean Bulk)</option>
                <option value="مازاد کالری بالا برای حجم (Bulk)">حجم و افزایش وزن سریع (Bulk)</option>
                <option value="نقصان کالری و کات (Calorie Deficit)">نقصان کالری و کات (Deficit)</option>
                <option value="کالری تثبیت و بازترکیب (Maintenance / Recomp)">کالری تثبیت و بازترکیب (Recomp)</option>
              </select>
            </div>

            {/* Cardio Preference */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">ترجیح تمرینات هوازی:</label>
              <select
                value={cardioPref}
                onChange={(e) => setCardioPref(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="هوازی سبک (LISS) بعد از تمرین یا روز استراحت">هوازی یکنواخت سبک (LISS)</option>
                <option value="تناوبی با شدت بالا (HIIT) دو بار در هفته">تناوبی شدید (HIIT)</option>
                <option value="ترکیب پیاده‌روی شیب‌دار و HIIT">ترکیب پیاده‌روی شیب‌دار و HIIT</option>
                <option value="حداقل هوازی (فقط گرم‌کردن قلبی)">حداقل هوازی (تمرکز صددرصد وزنه)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Posture & Clinical Injury Screening */}
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2 text-lime-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>بخش ۴: غربالگری پاسچر (وضعیت قامتی) و آسیب‌های مفصلی</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              ناهنجاری‌های قامتی (برای تجویز حرکات اصلاحی در ابتدای تمرین):
            </label>
            <div className="flex flex-wrap gap-2">
              {availablePostureOptions.map((po) => {
                const selected = postureIssues.includes(po);
                return (
                  <button
                    key={po}
                    type="button"
                    onClick={() => togglePostureIssue(po)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {selected ? '✓ ' : ''}
                    {po}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                آسیب‌دیدگی مفصلی یا محدودیت پزشکی (در صورت وجود):
              </label>
              <input
                type="text"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                placeholder="مثلاً: حساسیت تاندون شانه راست، درد خفیف زانو، یا ندارد"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                توضیحات تکمیلی و اولویت‌های شخصی شما:
              </label>
              <input
                type="text"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="مثلاً: علاقه به حرکات سیم‌کش، تأکید روی فرم V زیربغل و سرشانه"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Generate Button */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            با کلیک روی دکمه روبرو، برنامه تمرینی دقیق به همراه جدول کالری، پروتئین، تمپو و شدت RPE تولید می‌شود.
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-lime-500/20 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Zap className="w-5 h-5 animate-spin text-zinc-950" />
                <span>در حال آنالیز بیومکانیکی و تدوین برنامه تخصصی...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>تدوین برنامه فوق‌تخصصی و رژیم ماکرو</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Program Showcase */}
      {generatedProgram && (
        <div className="bg-zinc-900 border-2 border-lime-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Program Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-500/10 text-lime-400 border border-lime-500/30">
                  {generatedProgram.splitType}
                </span>
                <span className="text-xs text-zinc-400">{generatedProgram.days.length} جلسه در هفته</span>
                {generationSource && (
                  <span className="text-[11px] text-zinc-300 bg-zinc-800 px-2.5 py-0.5 rounded-md">
                    طراح: {generatedProgram.author}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white">{generatedProgram.title}</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                {generatedProgram.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="نسخه چاپی / PDF"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ / PDF</span>
              </button>

              <button
                onClick={() => handleApplyProgram(generatedProgram)}
                className="px-5 py-2.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md shadow-lime-500/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعمال به عنوان برنامه فعال من</span>
              </button>
            </div>
          </div>

          {/* Daily Nutrition & Macro Card */}
          {generatedProgram.nutritionPlan && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-lime-400" />
                  <span>پروتکل تخصصی تغذیه و درشت‌مغذی‌های روزانه (Macros)</span>
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">Mifflin-St Jeor TDEE</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center">
                  <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <span className="text-[11px] text-zinc-400 block">کالری روزانه</span>
                  <span className="text-base font-black text-white font-mono">
                    {generatedProgram.nutritionPlan.calories}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">کیلوکالری</span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center">
                  <Target className="w-4 h-4 text-lime-400 mx-auto mb-1" />
                  <span className="text-[11px] text-zinc-400 block">پروتئین</span>
                  <span className="text-base font-black text-lime-400 font-mono">
                    {generatedProgram.nutritionPlan.proteinGrams}g
                  </span>
                  <span className="text-[10px] text-zinc-500 block">سنتز عضلانی</span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center">
                  <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[11px] text-zinc-400 block">کربوهیدرات</span>
                  <span className="text-base font-black text-cyan-400 font-mono">
                    {generatedProgram.nutritionPlan.carbsGrams}g
                  </span>
                  <span className="text-[10px] text-zinc-500 block">گلیکوژن تمرین</span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center">
                  <Activity className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-[11px] text-zinc-400 block">چربی سالم</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {generatedProgram.nutritionPlan.fatsGrams}g
                  </span>
                  <span className="text-[10px] text-zinc-500 block">تعادل هورمونی</span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <Droplets className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                  <span className="text-[11px] text-zinc-400 block">آب مصرفی</span>
                  <span className="text-base font-black text-sky-400 font-mono">
                    {generatedProgram.nutritionPlan.waterLiters}L
                  </span>
                  <span className="text-[10px] text-zinc-500 block">لیتر در روز</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-zinc-900">
                <div>
                  <span className="text-lime-400 font-bold block mb-1">زمان‌بندی وعده‌ها (Meal Timing):</span>
                  <p className="text-zinc-300 leading-relaxed">
                    {generatedProgram.nutritionPlan.mealTimingTip}
                  </p>
                </div>
                {generatedProgram.nutritionPlan.supplements?.length > 0 && (
                  <div>
                    <span className="text-cyan-400 font-bold block mb-1">مکمل‌های پیشنهادی مجاز:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedProgram.nutritionPlan.supplements.map((sup, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]"
                        >
                          {sup}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Periodization, Cardio & Posture Protocols */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {generatedProgram.periodizationNote && (
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <span className="text-lime-400 font-bold block mb-1.5">
                  📈 استراتژی بارگذاری و پریودایزیشن:
                </span>
                <p className="text-zinc-300 leading-relaxed">{generatedProgram.periodizationNote}</p>
              </div>
            )}
            {generatedProgram.cardioProtocol && (
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <span className="text-cyan-400 font-bold block mb-1.5">
                  🏃 پروتکل هوازی و سلامت قلبی:
                </span>
                <p className="text-zinc-300 leading-relaxed">{generatedProgram.cardioProtocol}</p>
              </div>
            )}
            {generatedProgram.postureCorrection && (
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <span className="text-amber-400 font-bold block mb-1.5">
                  🧘 پروتکل اصلاحی و سلامت مفاصل:
                </span>
                <p className="text-zinc-300 leading-relaxed">{generatedProgram.postureCorrection}</p>
              </div>
            )}
          </div>

          {/* Recovery and science guidance */}
          {generatedProgram.recoveryTips.length > 0 && (
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
              <h4 className="text-xs font-bold text-lime-400 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                توصیه‌های ریکاوری و ایمنی شخصی‌سازی‌شده:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                {generatedProgram.recoveryTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-lime-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Days Accordion */}
          <div className="space-y-4">
            {generatedProgram.days.map((day, dIdx) => {
              const isExpanded = expandedDayIdx === dIdx;
              return (
                <div
                  key={day.id || dIdx}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden transition-all"
                >
                  {/* Day Header Trigger */}
                  <div
                    onClick={() => setExpandedDayIdx(isExpanded ? null : dIdx)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-900/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-lime-400">{day.dayName}</span>
                        <span className="text-xs text-zinc-400">• {day.estimatedDuration} دقیقه</span>
                      </div>
                      <h4 className="text-sm font-black text-white">{day.focus}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">{day.exercises.length} حرکت تخصصی</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>
                  </div>

                  {/* Day Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-zinc-900 space-y-4">
                      {/* Warmup & Cooldown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                        <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80">
                          <span className="text-lime-400 font-bold block mb-1">گرم کردن تخصصی:</span>
                          <span className="text-zinc-300">{day.warmup}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80">
                          <span className="text-cyan-400 font-bold block mb-1">سرد کردن و کشش:</span>
                          <span className="text-zinc-300">{day.cooldown}</span>
                        </div>
                      </div>

                      {/* Exercises Table */}
                      <div className="space-y-2.5">
                        {day.exercises.map((ex, exIdx) => (
                          <div
                            key={ex.id || exIdx}
                            className="bg-zinc-900/70 p-4 rounded-xl border border-zinc-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-lime-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                {exIdx + 1}
                              </span>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h5 className="text-sm font-bold text-white">{ex.nameFa}</h5>
                                  <span className="text-[11px] font-mono text-zinc-400">
                                    ({ex.nameEn})
                                  </span>
                                  {ex.technique && (
                                    <span className="px-2 py-0.5 rounded-md bg-lime-500/10 border border-lime-500/30 text-lime-400 text-[10px] font-semibold">
                                      {ex.technique}
                                    </span>
                                  )}
                                </div>
                                {ex.notes && (
                                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                    {ex.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Precision Biomechanical Metrics: SetsxReps, Tempo, RPE, Rest */}
                            <div className="flex flex-wrap items-center gap-3 text-xs shrink-0 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
                              <div>
                                <span className="text-zinc-400 block text-[10px]">ست × تکرار</span>
                                <span className="font-bold text-lime-400 font-mono">
                                  {ex.sets} × {ex.reps}
                                </span>
                              </div>
                              {ex.tempo && (
                                <>
                                  <div className="w-px h-6 bg-zinc-800"></div>
                                  <div title="تمپوی حرکتی (منفی - مکث پایین - مثبت - مکث بالا)">
                                    <span className="text-zinc-400 block text-[10px]">تمپو</span>
                                    <span className="font-mono font-bold text-cyan-400">
                                      {ex.tempo}
                                    </span>
                                  </div>
                                </>
                              )}
                              {ex.rpe && (
                                <>
                                  <div className="w-px h-6 bg-zinc-800"></div>
                                  <div title="شاخص درک فشار (از ۱۰)">
                                    <span className="text-zinc-400 block text-[10px]">شدت RPE</span>
                                    <span className="font-mono font-bold text-amber-400">
                                      {ex.rpe}/10
                                    </span>
                                  </div>
                                </>
                              )}
                              <div className="w-px h-6 bg-zinc-800"></div>
                              <div>
                                <span className="text-zinc-400 block text-[10px]">استراحت</span>
                                <span className="font-medium text-zinc-300">{ex.restSeconds} ثانیه</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
