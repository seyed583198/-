import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/generate-workout', async (req, res) => {
  try {
    const {
      gender = 'male',
      age = 25,
      weightKg = 78,
      heightCm = 178,
      targetWeightKg = 82,
      bodyFat = '۱۲ تا ۱۸٪ (متناسب)',
      somatotype = 'مزومورف',
      experienceLevel = 'متوسط',
      trainingHistory = '۱ سال سابقه تمرین پیوسته',
      goal = 'عضله‌سازی و افزایش حجم خالص',
      daysPerWeek = 4,
      sessionDuration = 60,
      location = 'gym',
      equipment = ['هالتر', 'دمبل', 'دستگاه‌ها', 'سیم‌کش'],
      weakPoints = ['بالا سینه', 'سرشانه میانی'],
      trainingStyle = 'ترکیبی قدرتی و هایپرتروفی (Powerbuilding)',
      sleepHours = '۷ تا ۸ ساعت (ایده‌آل)',
      stressLevel = 'متوسط',
      nutritionStatus = 'مازاد کالری کنترل‌شده (Lean Bulk)',
      cardioPref = 'هوازی سبک LISS دو بار در هفته',
      postureIssues = ['ندارد'],
      injuries = 'ندارد',
      preferences = 'تمرکز روی بالاتنه و سرشانه',
    } = req.body;

    // Check if a real Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    const hasRealKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5;

    if (hasRealKey) {
      try {
        const prompt = `
تو یک مربی ارشد بدنسازی (CSCS)، متخصص فیزیولوژی ورزشی و آسیب‌شناسی حرکات اصلاحی هستی.
یک برنامه تمرینی هفتگی فوق‌العاده دقیق، علمی، شخصی‌سازی‌شده و ایمن بر اساس پرونده کامل فیزیولوژیک ورزشکار زیر طراحی کن:

۱. مشخصات آنتروپومتریک و تیپ بدنی:
- جنسیت: ${gender === 'female' ? 'خانم' : 'آقا'} | سن: ${age} سال | قد: ${heightCm} سانتی‌متر | وزن فعلی: ${weightKg} کیلوگرم | وزن هدف: ${targetWeightKg} کیلوگرم
- درصد چربی تخمینی: ${bodyFat} | تیپ بدنی (Somatotype): ${somatotype}

۲. سابقه، هدف و سیستم تمرینی:
- سطح تجربه: ${experienceLevel} (${trainingHistory})
- هدف اصلی: ${goal}
- سیستم تمرینی مورد علاقه: ${trainingStyle}
- تعداد روزهای تمرین در هفته: ${daysPerWeek} روز | مدت هر جلسه: ${sessionDuration} دقیقه
- محل تمرین: ${location === 'home' ? 'خانه' : 'باشگاه'} | تجهیزات: ${Array.isArray(equipment) ? equipment.join('، ') : equipment}

۳. نقاط ضعف عضلانی، آسیب‌دیدگی و پاسچر:
- عضلات اولویت‌دار (نقاط ضعف نیازمند تمرکز ویژه): ${Array.isArray(weakPoints) ? weakPoints.join('، ') : weakPoints}
- ناهنجاری‌های وضعیتی (پاسچر): ${Array.isArray(postureIssues) ? postureIssues.join('، ') : postureIssues}
- آسیب‌دیدگی یا محدودیت مفصلی: ${injuries || 'ندارد'}
- ترجیحات شخصی: ${preferences || 'برنامه متوازن'}

۴. سبک زندگی، ریکاوری و تغذیه:
- خواب شبانه: ${sleepHours} | سطح استرس روزانه: ${stressLevel}
- استراتژی تغذیه: ${nutritionStatus} | ترجیح هوازی: ${cardioPref}

قالب خروجی حتماً باید یک آبجکت JSON معتبر به زبان فارسی با ساختار دقیق زیر باشد:
{
  "title": "عنوان تخصصی برنامه متناسب با تیپ بدنی و هدف",
  "summary": "تحلیل علمی پرونده ورزشکار و چرایی انتخاب این سیستم تمرینی و حجم ست‌ها",
  "splitType": "نوع تقسیم‌بندی عضلانی (مثلا Upper/Lower + Weak Point Specialization)",
  "periodizationNote": "استراتژی بارگذاری تدریجی در ۴ هفته آینده (هفته ۱ تا ۴)",
  "cardioProtocol": "نسخه دقیق تمرینات هوازی متناسب با تیپ بدنی و هدف",
  "postureCorrection": "حرکات اصلاحی و ملاحظات بیومکانیکی متناسب با آسیب و پاسچر",
  "nutritionPlan": {
    "calories": 2650,
    "proteinGrams": 160,
    "carbsGrams": 310,
    "fatsGrams": 75,
    "waterLiters": 3.5,
    "supplements": ["کراتین مونوهیدرات ۵ گرم روزانه", "پروتئین وی ایزوله پس از تمرین"],
    "mealTimingTip": "مصرف ۳۰٪ کربوهیدرات روزانه در وعده ۹۰ دقیقه قبل از تمرین و وعده بلافاصله پس از تمرین"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "شنبه (جلسه ۱ - نام تخصصی جلسه)",
      "targetMuscles": ["سینه", "سرشانه", "پشت بازو"],
      "focus": "تمرکز جلسه و اولویت نقاط ضعف",
      "estimatedDuration": ${sessionDuration},
      "warmup": "پروتکل دقیق گرم کردن پویا و فعال‌سازی روتاتور کاف / لگن",
      "cooldown": "پروتکل سرد کردن و کشش ایستا",
      "exercises": [
        {
          "nameFa": "نام حرکت به فارسی",
          "nameEn": "English Exercise Name",
          "targetMuscle": "عضله هدف",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90,
          "tempo": "3-1-1-0",
          "rpe": "RPE 8.5 (1-2 RIR)",
          "technique": "کنترل ۳ ثانیه‌ای بخش منفی / دراپ‌ست در ست آخر",
          "notes": "نکته تخصصی بیومکانیکی و زاویه مفاصل"
        }
      ]
    }
  ],
  "recoveryTips": [
    "توصیه تخصصی ریکاوری ۱",
    "توصیه تخصصی ریکاوری ۲"
  ]
}
تعداد روزهای آرایه "days" دقیقاً برابر ${daysPerWeek} باشد و هر روز حداقل ۵ تا ۶ حرکت هدفمند با تمپو و RPE دقیق داشته باشد.
`;

        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite exercise physiologist and certified strength & conditioning specialist (CSCS). Respond strictly in valid JSON format in Persian (Farsi) with anatomical accuracy.',
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI Generation Timeout')), 14000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const text = response?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, program: parsed, source: 'gemini' });
        }
      } catch (geminiError) {
        console.warn('Gemini generation error or timeout, switching to smart engine:', geminiError);
      }
    }

    const fallbackProgram = generateSmartFallbackPlan(req.body);
    return res.json({ success: true, program: fallbackProgram, source: 'smart-engine' });
  } catch (error: any) {
    console.error('Error generating workout:', error);
    const fallback = generateSmartFallbackPlan(req.body);
    return res.json({ success: true, program: fallback, source: 'fallback' });
  }
});

function generateSmartFallbackPlan(params: any) {
  const daysCount = Math.min(Math.max(params.daysPerWeek || 3, 2), 6);
  const isGym = params.location !== 'home';

  const splits: Record<number, { title: string; splitType: string; days: any[] }> = {
    2: {
      title: `برنامه فشرده ۲ روزه فول‌بادی (${params.goal || 'تناسب اندام'})`,
      splitType: 'Full Body A/B',
      days: [
        {
          dayNumber: 1,
          dayName: 'شنبه (فول بادی A - تمرکز پرسی و چهارسر)',
          targetMuscles: ['سینه', 'چهارسر ران', 'سرشانه', 'شکم'],
          focus: 'تمرینات چندمفصلی پایه بالاتنه و پایین‌تنه',
          estimatedDuration: params.sessionDuration || 50,
          warmup: '۵ دقیقه گرم کردن عمومی مفاصل و کشش‌های پویا',
          cooldown: '۵ دقیقه کشش عضلات سینه و پا',
          exercises: isGym ? [
            { nameFa: 'پرس سینه هالتر', nameEn: 'Barbell Bench Press', targetMuscle: 'سینه', sets: 4, reps: '8-10', restSeconds: 90, notes: 'کمر چسبیده به میز، فرود با کنترل' },
            { nameFa: 'اسکوات با هالتر', nameEn: 'Barbell Squat', targetMuscle: 'چهارسر ران', sets: 4, reps: '8-10', restSeconds: 90, notes: 'زاویه زانو هم‌راستا با نوک شست پا' },
            { nameFa: 'پرس سرشانه دمبل نشسته', nameEn: 'Dumbbell Shoulder Press', targetMuscle: 'سرشانه', sets: 3, reps: '10-12', restSeconds: 60, notes: 'دامنه کامل بدون قفل کردن آرنج' },
            { nameFa: 'پلانک شکم', nameEn: 'Plank', targetMuscle: 'شکم', sets: 3, reps: '45 ثانیه', restSeconds: 45, notes: 'ثبات تنه و جلوگیری از گودی کمر' },
          ] : [
            { nameFa: 'شنا سوئدی استاندارد', nameEn: 'Push Up', targetMuscle: 'سینه', sets: 4, reps: '12-15', restSeconds: 60, notes: 'بدن در یک خط مستقیم' },
            { nameFa: 'اسکوات با وزن بدن / دمبل', nameEn: 'Air Squat', targetMuscle: 'چهارسر ران', sets: 4, reps: '15-20', restSeconds: 60, notes: 'پایین آمدن تا موازی زمین' },
            { nameFa: 'پیک پوش‌آپ / پرس سرشانه دمبل', nameEn: 'Pike Pushup', targetMuscle: 'سرشانه', sets: 3, reps: '10-12', restSeconds: 60, notes: 'فشار عمودی روی شانه' },
            { nameFa: 'پلانک ایستا', nameEn: 'Plank', targetMuscle: 'شکم', sets: 3, reps: '40 ثانیه', restSeconds: 45, notes: 'انقباض هسته مرکزی بدن' },
          ],
        },
        {
          dayNumber: 2,
          dayName: 'سه‌شنبه (فول بادی B - تمرکز کششی و زنجیره خلفی)',
          targetMuscles: ['زیربغل', 'همسترینگ', 'جلو بازو', 'پشت بازو'],
          focus: 'عضلات پشتی بدن و دست‌ها',
          estimatedDuration: params.sessionDuration || 50,
          warmup: '۵ دقیقه گرم کردن ستون فقرات و همسترینگ',
          cooldown: 'کشش عضلات لت و پشت پا',
          exercises: isGym ? [
            { nameFa: 'زیربغل قایقی سیم‌کش', nameEn: 'Seated Cable Row', targetMuscle: 'زیربغل', sets: 4, reps: '10-12', restSeconds: 75, notes: 'کشش کامل لت و جمع کردن کتف‌ها' },
            { nameFa: 'ددلیفت رومانیایی با هالتر', nameEn: 'Romanian Deadlift', targetMuscle: 'همسترینگ', sets: 4, reps: '10-12', restSeconds: 90, notes: 'خم شدن از لولا باسن با ستون فقرات صاف' },
            { nameFa: 'جلو بازو دمبل جفت', nameEn: 'Bicep Dumbbell Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'بدون تاب دادن بدن' },
            { nameFa: 'پشت بازو سیم‌کش طناب', nameEn: 'Tricep Rope Pushdown', targetMuscle: 'پشت بازو', sets: 3, reps: '12-15', restSeconds: 60, notes: 'باز کردن دست‌ها در انتهای دامنه' },
          ] : [
            { nameFa: 'بارفیکس یا زیربغل دمبل تک خم', nameEn: 'Pull-up / DB Row', targetMuscle: 'زیربغل', sets: 4, reps: '8-10', restSeconds: 75, notes: 'تمرکز بر فشردن عضلات پشت' },
            { nameFa: 'پل باسن تک پا', nameEn: 'Single Leg Glute Bridge', targetMuscle: 'همسترینگ', sets: 4, reps: '12-15', restSeconds: 60, notes: 'انقباض ۱ ثانیه در اوج' },
            { nameFa: 'جلو بازو دمبل چکشی', nameEn: 'Hammer Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '12', restSeconds: 60, notes: 'تقویت براکیالیس' },
            { nameFa: 'دیپ روی صندلی', nameEn: 'Bench Dips', targetMuscle: 'پشت بازو', sets: 3, reps: '12-15', restSeconds: 60, notes: 'نزدیک نگه داشتن باسن به صندلی' },
          ],
        },
      ],
    },
    3: {
      title: `برنامه ۳ روزه کلاسیک قدرت و هایپرتروفی (${params.goal || 'حجم و تفکیک'})`,
      splitType: 'Full Body 3 Days',
      days: [
        {
          dayNumber: 1,
          dayName: 'شنبه (فول بادی سنگین ۱)',
          targetMuscles: ['سینه', 'چهارسر ران', 'پشت بازو'],
          focus: 'پرسی بالاتنه و ران',
          estimatedDuration: params.sessionDuration || 60,
          warmup: '۵ دقیقه گرم کردن شانه و لگن',
          cooldown: 'کشش عمومی بدن',
          exercises: [
            { nameFa: 'اسکوات هالتر', nameEn: 'Barbell Back Squat', targetMuscle: 'چهارسر ران', sets: 4, reps: '8-10', restSeconds: 90, notes: 'عمق کافی با پاشنه ثابت' },
            { nameFa: 'پرس سینه هالتر', nameEn: 'Barbell Bench Press', targetMuscle: 'سینه', sets: 4, reps: '8-10', restSeconds: 90, notes: 'کنترل کامل در بخش منفی حرکت' },
            { nameFa: 'پرس سرشانه هالتر نظامی', nameEn: 'Overhead Press', targetMuscle: 'سرشانه', sets: 3, reps: '8-10', restSeconds: 75, notes: 'سفت نگه داشتن شکم و باسن' },
            { nameFa: 'پشت بازو هالتر خوابیده (فرانسوی)', nameEn: 'Skull Crushers', targetMuscle: 'پشت بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'ثبات کامل بازوها' },
          ],
        },
        {
          dayNumber: 2,
          dayName: 'دوشنبه (فول بادی کششی ۲)',
          targetMuscles: ['زیربغل', 'همسترینگ', 'جلو بازو'],
          focus: 'زنجیره خلفی و کشش',
          estimatedDuration: params.sessionDuration || 60,
          warmup: '۵ دقیقه گرم کردن عضلات پشتی و همسترینگ',
          cooldown: 'کشش آرام پشت پا و لت',
          exercises: [
            { nameFa: 'ددلیفت رومانیایی هالتر', nameEn: 'Romanian Deadlift', targetMuscle: 'همسترینگ', sets: 4, reps: '8-10', restSeconds: 90, notes: 'کشش عمیق در پشت ران بدون قوز' },
            { nameFa: 'بارفیکس دست باز یا لت سیم‌کش', nameEn: 'Lat Pulldown', targetMuscle: 'زیربغل', sets: 4, reps: '10-12', restSeconds: 75, notes: 'پایین کشیدن استخوان ترقوه' },
            { nameFa: 'زیربغل هالتر خم', nameEn: 'Barbell Bent Over Row', targetMuscle: 'زیربغل', sets: 3, reps: '8-10', restSeconds: 75, notes: 'زاویه تنه ۴۵ درجه' },
            { nameFa: 'جلو بازو هالتر EZ', nameEn: 'EZ Bar Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'تمرکز بر انقباض پیک دوسر بازویی' },
          ],
        },
        {
          dayNumber: 3,
          dayName: 'چهارشنبه (فول بادی متمرکز ۳)',
          targetMuscles: ['پا', 'سینه و سرشانه', 'شکم و هسته بدن'],
          focus: 'ترکیبی و فرم‌دهی عضلانی',
          estimatedDuration: params.sessionDuration || 60,
          warmup: 'گرم کردن مفاصل دست و پا',
          cooldown: 'کشش ایستا کل بدن',
          exercises: [
            { nameFa: 'لانج با دمبل پیاده‌روی', nameEn: 'Walking Lunge', targetMuscle: 'چهارسر ران', sets: 3, reps: '12 هر پا', restSeconds: 75, notes: 'زاویه ۹۰ درجه در هر دو زانو' },
            { nameFa: 'پرس بالا سینه دمبل', nameEn: 'Incline DB Press', targetMuscle: 'سینه', sets: 4, reps: '10-12', restSeconds: 75, notes: 'شیب نیمکت ۳۰ درجه' },
            { nameFa: 'نشر جانب دمبل', nameEn: 'Lateral Raise', targetMuscle: 'سرشانه', sets: 4, reps: '12-15', restSeconds: 60, notes: 'بلند کردن تا راستای افق شانه' },
            { nameFa: 'کرانچ سیم‌کش یا روی زمین', nameEn: 'Cable Crunch', targetMuscle: 'شکم', sets: 3, reps: '15-20', restSeconds: 45, notes: 'جمع کردن دنده‌ها به سمت لگن' },
          ],
        },
      ],
    },
    4: {
      title: `برنامه اختصاصی ۴ روزه بالاتنه / پایین‌تنه (Upper / Lower Split)`,
      splitType: 'Upper / Lower',
      days: [
        {
          dayNumber: 1,
          dayName: 'شنبه (بالاتنه ۱ - قدرت و حجم)',
          targetMuscles: ['سینه', 'زیربغل', 'سرشانه', 'دست'],
          focus: 'قدرت عضلات بالاتنه',
          estimatedDuration: params.sessionDuration || 60,
          warmup: 'گرم کردن کمربند شانه‌ای و روتاتور کاف',
          cooldown: 'کشش سینه و لت',
          exercises: [
            { nameFa: 'پرس سینه هالتر', nameEn: 'Barbell Bench Press', targetMuscle: 'سینه', sets: 4, reps: '6-8', restSeconds: 90, notes: 'دامنه کامل و لمس آرام سینه' },
            { nameFa: 'زیربغل هالتر خم دست برعکس', nameEn: 'Bent Over Row', targetMuscle: 'زیربغل', sets: 4, reps: '8-10', restSeconds: 90, notes: 'هدایت آرنج‌ها به سمت عقب' },
            { nameFa: 'پرس سرشانه دمبل نشسته', nameEn: 'Dumbbell Shoulder Press', targetMuscle: 'سرشانه', sets: 3, reps: '8-10', restSeconds: 75, notes: 'پایین آوردن تا سطح گوش' },
            { nameFa: 'پشت بازو دیپ پارالل / سیم‌کش', nameEn: 'Tricep Pushdown', targetMuscle: 'پشت بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'آرنج چسبیده به پهلو' },
            { nameFa: 'جلو بازو دمبل متناوب', nameEn: 'Alternating DB Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'سوپینیشن کامل در اوج' },
          ],
        },
        {
          dayNumber: 2,
          dayName: 'یکشنبه (پایین‌تنه ۱ - چهارسر و ساق)',
          targetMuscles: ['چهارسر ران', 'باسن', 'ساق پا', 'شکم'],
          focus: 'پایین‌تنه قدامی',
          estimatedDuration: params.sessionDuration || 60,
          warmup: 'چرخش لگن و ۵ دقیقه دوچرخه سبک',
          cooldown: 'کشش چهارسر و همسترینگ',
          exercises: [
            { nameFa: 'اسکوات با هالتر از پشت', nameEn: 'Barbell Back Squat', targetMuscle: 'چهارسر ران', sets: 4, reps: '6-8', restSeconds: 120, notes: 'تنه محکم و سینه بالا' },
            { nameFa: 'پرس پا دستگاه', nameEn: 'Leg Press', targetMuscle: 'چهارسر ران', sets: 3, reps: '10-12', restSeconds: 90, notes: 'پاها به عرض شانه در وسط صفحه' },
            { nameFa: 'جلو ران دستگاه', nameEn: 'Leg Extension', targetMuscle: 'چهارسر ران', sets: 3, reps: '12-15', restSeconds: 60, notes: 'مکث ۱ ثانیه در نقطه اوج انقباض' },
            { nameFa: 'ساق پا ایستاده دستگاه', nameEn: 'Standing Calf Raise', targetMuscle: 'ساق پا', sets: 4, reps: '15-20', restSeconds: 45, notes: 'کشش حداکثری در پایین و انقباض روی پنجه' },
            { nameFa: 'بالا آوردن پا آویزان (لگ رایز)', nameEn: 'Hanging Leg Raise', targetMuscle: 'شکم', sets: 3, reps: '12-15', restSeconds: 60, notes: 'حرکت لگن به بالا بدون تاب خوردن' },
          ],
        },
        {
          dayNumber: 3,
          dayName: 'سه‌شنبه (بالاتنه ۲ - هایپرتروفی و تفکیک)',
          targetMuscles: ['سینه', 'پشت', 'سرشانه میانی و خلفی'],
          focus: 'پمپ عضلانی و حجم',
          estimatedDuration: params.sessionDuration || 60,
          warmup: 'گرم کردن مفاصل شانه و آرنج',
          cooldown: 'کشش ملایم بالاتنه',
          exercises: [
            { nameFa: 'پرس بالا سینه دمبل', nameEn: 'Incline DB Press', targetMuscle: 'سینه', sets: 4, reps: '10-12', restSeconds: 75, notes: 'تمرکز بر بخش ترقوه‌ای سینه' },
            { nameFa: 'لت سیم‌کش دست باز از جلو', nameEn: 'Lat Pulldown', targetMuscle: 'زیربغل', sets: 4, reps: '10-12', restSeconds: 75, notes: 'کشش در اوج و تماس با بالای سینه' },
            { nameFa: 'فلای سینه با سیم‌کش یا دستگاه', nameEn: 'Cable Fly', targetMuscle: 'سینه', sets: 3, reps: '12-15', restSeconds: 60, notes: 'کشش عمیق در بازگشت' },
            { nameFa: 'نشر جانب دمبل', nameEn: 'Lateral Raise', targetMuscle: 'سرشانه', sets: 4, reps: '12-15', restSeconds: 60, notes: 'زاویه کنترل شده شانه' },
            { nameFa: 'فیس پول سیم‌کش با طناب', nameEn: 'Face Pull', targetMuscle: 'سرشانه خلفی', sets: 3, reps: '15', restSeconds: 60, notes: 'تقویت سلامت شانه و دلتوئید خلفی' },
          ],
        },
        {
          dayNumber: 4,
          dayName: 'چهارشنبه (پایین‌تنه ۲ - همسترینگ و باسن)',
          targetMuscles: ['همسترینگ', 'باسن', 'پایین کمر'],
          focus: 'زنجیره خلفی پا',
          estimatedDuration: params.sessionDuration || 60,
          warmup: 'کشش پویا و فعال‌سازی باسن',
          cooldown: 'کشش کامل پشت پا و باسن',
          exercises: [
            { nameFa: 'ددلیفت رومانیایی هالتر', nameEn: 'Romanian Deadlift', targetMuscle: 'همسترینگ', sets: 4, reps: '8-10', restSeconds: 90, notes: 'خم شدن از لگن و حفظ قوس طبیعی کمر' },
            { nameFa: 'هیپ تراست با هالتر', nameEn: 'Barbell Hip Thrust', targetMuscle: 'باسن', sets: 4, reps: '10-12', restSeconds: 90, notes: 'فشار از پاشنه و انقباض قوی سرینی' },
            { nameFa: 'پشت ران دستگاه خوابیده', nameEn: 'Lying Leg Curl', targetMuscle: 'همسترینگ', sets: 3, reps: '12-15', restSeconds: 60, notes: 'حرکت بدون پرتاب لگن' },
            { nameFa: 'ساق پا نشسته با دستگاه', nameEn: 'Seated Calf Raise', targetMuscle: 'ساق پا', sets: 3, reps: '15-20', restSeconds: 45, notes: 'تقویت عضله نعلی' },
            { nameFa: 'پلانک با چرخش پهلو', nameEn: 'Side Plank', targetMuscle: 'پهلو', sets: 3, reps: '30 ثانیه هر سمت', restSeconds: 45, notes: 'ثبات کامل ستون فقرات' },
          ],
        },
      ],
    },
    5: {
      title: `برنامه ۵ روزه پیشرفته پوش / پول / لگز (Push / Pull / Legs)`,
      splitType: 'PPL + Upper/Lower',
      days: [
        {
          dayNumber: 1,
          dayName: 'شنبه (Push - سینه، سرشانه و پشت بازو)',
          targetMuscles: ['سینه', 'سرشانه', 'پشت بازو'],
          focus: 'عضلات هل‌دادنی بالاتنه',
          estimatedDuration: 60,
          warmup: 'گرم کردن مفاصل شانه و سینه',
          cooldown: 'کشش سینه و پشت بازو',
          exercises: [
            { nameFa: 'پرس سینه هالتر', nameEn: 'Barbell Bench Press', targetMuscle: 'سینه', sets: 4, reps: '8-10', restSeconds: 90, notes: 'تمرکز بر بارگذاری تدریجی' },
            { nameFa: 'پرس بالا سینه دمبل', nameEn: 'Incline DB Press', targetMuscle: 'سینه', sets: 3, reps: '10-12', restSeconds: 75, notes: 'کشش عالی عضلات بالای سینه' },
            { nameFa: 'پرس سرشانه هالتر نشسته', nameEn: 'Military Press', targetMuscle: 'سرشانه', sets: 3, reps: '8-10', restSeconds: 75, notes: 'فرم ایمن برای کمربند شانه' },
            { nameFa: 'نشر جانب دمبل', nameEn: 'Lateral Raise', targetMuscle: 'سرشانه', sets: 4, reps: '12-15', restSeconds: 60, notes: 'پرتاب نکردن بالاتنه' },
            { nameFa: 'پشت بازو سیم‌کش طناب', nameEn: 'Tricep Rope Pushdown', targetMuscle: 'پشت بازو', sets: 3, reps: '12-15', restSeconds: 60, notes: 'انقباض در انتهای باز شدن آرنج' },
          ],
        },
        {
          dayNumber: 2,
          dayName: 'یکشنبه (Pull - پشت، زیربغل، جلو بازو و دلتوئید خلفی)',
          targetMuscles: ['زیربغل', 'پشت', 'جلو بازو', 'سرشانه خلفی'],
          focus: 'عضلات کششی بالاتنه',
          estimatedDuration: 60,
          warmup: 'گرم کردن کتف و پشت',
          cooldown: 'کشش لت و جلو بازو',
          exercises: [
            { nameFa: 'بارفیکس دست باز یا لت سیم‌کش', nameEn: 'Lat Pulldown', targetMuscle: 'زیربغل', sets: 4, reps: '8-10', restSeconds: 90, notes: 'کشش عمیق زیربغل در بالای حرکت' },
            { nameFa: 'زیربغل دمبل تک خم', nameEn: 'Single Arm DB Row', targetMuscle: 'زیربغل', sets: 3, reps: '10-12', restSeconds: 75, notes: 'بالا کشیدن دمبل به سمت پهلو' },
            { nameFa: 'فیس پول با سیم‌کش', nameEn: 'Face Pull', targetMuscle: 'سرشانه خلفی', sets: 3, reps: '15', restSeconds: 60, notes: 'چرخش خارجی بازوها' },
            { nameFa: 'جلو بازو هالتر ایستاده', nameEn: 'Barbell Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'ثبات آرنج‌ها کنار بدن' },
            { nameFa: 'جلو بازو چکشی دمبل', nameEn: 'Hammer Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '12', restSeconds: 60, notes: 'تقویت براکیورادیالیس ساعد و بازو' },
          ],
        },
        {
          dayNumber: 3,
          dayName: 'دوشنبه (Legs - چهارسر، همسترینگ، باسن و ساق)',
          targetMuscles: ['چهارسر ران', 'همسترینگ', 'باسن', 'ساق پا'],
          focus: 'پایین‌تنه جامع',
          estimatedDuration: 65,
          warmup: 'گرم کردن مفاصل زانو و مچ پا',
          cooldown: 'کشش کل عضلات پا',
          exercises: [
            { nameFa: 'اسکوات هالتر', nameEn: 'Barbell Squat', targetMuscle: 'چهارسر ران', sets: 4, reps: '8-10', restSeconds: 120, notes: 'توزیع وزن روی کل کف پا' },
            { nameFa: 'ددلیفت رومانیایی دمبل', nameEn: 'DB Romanian Deadlift', targetMuscle: 'همسترینگ', sets: 4, reps: '10-12', restSeconds: 90, notes: 'کشش عمیق پشت ران' },
            { nameFa: 'لانج پیاده‌روی دمبل', nameEn: 'Walking Lunge', targetMuscle: 'باسن', sets: 3, reps: '12 هر پا', restSeconds: 75, notes: 'گام‌های استوار و کنترل‌شده' },
            { nameFa: 'جلو ران دستگاه', nameEn: 'Leg Extension', targetMuscle: 'چهارسر ران', sets: 3, reps: '12-15', restSeconds: 60, notes: 'هایپرتروفی اختصاصی چهارسر' },
            { nameFa: 'ساق پا ایستاده', nameEn: 'Standing Calf Raise', targetMuscle: 'ساق پا', sets: 4, reps: '15-20', restSeconds: 45, notes: 'مکث ۲ ثانیه‌ای در انتهای بالا' },
          ],
        },
        {
          dayNumber: 4,
          dayName: 'چهارشنبه (Upper Focus - سینه و پشت ترکیبی)',
          targetMuscles: ['سینه', 'زیربغل', 'سرشانه'],
          focus: 'حجم و جزئیات بالاتنه',
          estimatedDuration: 55,
          warmup: 'گرم کردن شانه و ستون فقرات',
          cooldown: 'کشش بالاتنه',
          exercises: [
            { nameFa: 'پرس بالا سینه هالتر', nameEn: 'Incline Barbell Press', targetMuscle: 'سینه', sets: 4, reps: '8-10', restSeconds: 90, notes: 'زاویه کنترل شده ۳۰ درجه' },
            { nameFa: 'زیربغل قایقی سیم‌کش', nameEn: 'Seated Cable Row', targetMuscle: 'زیربغل', sets: 4, reps: '10-12', restSeconds: 75, notes: 'فشردن کتف‌ها به هم' },
            { nameFa: 'دیپ پارالل برای سینه', nameEn: 'Chest Dips', targetMuscle: 'سینه', sets: 3, reps: '10-12', restSeconds: 75, notes: 'کمی متمایل به جلو' },
            { nameFa: 'نشر جانب سیم‌کش', nameEn: 'Cable Lateral Raise', targetMuscle: 'سرشانه', sets: 3, reps: '12-15', restSeconds: 60, notes: 'فشار یکنواخت در تمام طول حرکت' },
          ],
        },
        {
          dayNumber: 5,
          dayName: 'پنج‌شنبه (Arms & Abs - بازوها، ساعد و شکم)',
          targetMuscles: ['جلو بازو', 'پشت بازو', 'ساعد', 'شکم'],
          focus: 'سوپرست بازو و استحکام کر',
          estimatedDuration: 50,
          warmup: 'گرم کردن مچ و آرنج',
          cooldown: 'کشش بازوها و شکم',
          exercises: [
            { nameFa: 'جلو بازو لاری هالتر EZ', nameEn: 'Preacher Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'انزوای کامل عضله دوسر' },
            { nameFa: 'پشت بازو فرانسوی دمبل نشسته', nameEn: 'Seated Overhead DB Extension', targetMuscle: 'پشت بازو', sets: 3, reps: '10-12', restSeconds: 60, notes: 'کشش سر بلند پشت بازو' },
            { nameFa: 'جلو بازو سیم‌کش فیگوری', nameEn: 'High Cable Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '12-15', restSeconds: 45, notes: 'پیک انقباض بازو' },
            { nameFa: 'پشت بازو سیم‌کش تک دست معکوس', nameEn: 'Reverse Cable Pushdown', targetMuscle: 'پشت بازو', sets: 3, reps: '12-15', restSeconds: 45, notes: 'تفکیک سر خارجی پشت بازو' },
            { nameFa: 'کرانچ شکم روی توپ یا میز شیبدار', nameEn: 'Incline Crunch', targetMuscle: 'شکم', sets: 3, reps: '15-20', restSeconds: 45, notes: 'انقباض عضلات راست شکمی' },
          ],
        },
      ],
    },
    6: {
      title: `برنامه حرفه‌ای ۶ روزه PPL دوبل (Push / Pull / Legs x 2)`,
      splitType: 'PPL x 2',
      days: [
        { dayNumber: 1, dayName: 'شنبه (Push A - قدرت)', targetMuscles: ['سینه', 'سرشانه', 'پشت بازو'], focus: 'سنگین', estimatedDuration: 60, warmup: 'گرم کردن ۵ دقیقه', cooldown: 'کشش', exercises: [
          { nameFa: 'پرس سینه هالتر', nameEn: 'Barbell Bench Press', targetMuscle: 'سینه', sets: 4, reps: '6-8', restSeconds: 90, notes: 'قدرت پایه' },
          { nameFa: 'پرس سرشانه هالتر', nameEn: 'Overhead Press', targetMuscle: 'سرشانه', sets: 3, reps: '6-8', restSeconds: 90, notes: 'ثبات تنه' },
          { nameFa: 'پشت بازو دیپ وزنه‌ای', nameEn: 'Weighted Dips', targetMuscle: 'پشت بازو', sets: 3, reps: '8-10', restSeconds: 75, notes: 'دامنه کامل' },
        ]},
        { dayNumber: 2, dayName: 'یکشنبه (Pull A - قدرت)', targetMuscles: ['زیربغل', 'پشت', 'جلو بازو'], focus: 'کشش سنگین', estimatedDuration: 60, warmup: 'گرم کردن', cooldown: 'کشش', exercises: [
          { nameFa: 'ددلیفت هالتر سنتی', nameEn: 'Conventional Deadlift', targetMuscle: 'پایین کمر و لت', sets: 4, reps: '5', restSeconds: 120, notes: 'تکنیک بدون نقص' },
          { nameFa: 'بارفیکس با وزنه', nameEn: 'Weighted Pull-Up', targetMuscle: 'زیربغل', sets: 3, reps: '6-8', restSeconds: 90, notes: 'کشش کامل' },
          { nameFa: 'جلو بازو هالتر سنگین', nameEn: 'Barbell Curl', targetMuscle: 'جلو بازو', sets: 3, reps: '8-10', restSeconds: 75, notes: 'انقباض دقیق' },
        ]},
        { dayNumber: 3, dayName: 'دوشنبه (Legs A - قدرت چهارسر)', targetMuscles: ['چهارسر ران', 'باسن', 'ساق'], focus: 'پایین‌تنه سنگین', estimatedDuration: 60, warmup: 'گرم کردن', cooldown: 'کشش', exercises: [
          { nameFa: 'اسکوات هالتر سنگین', nameEn: 'Barbell Squat', targetMuscle: 'چهارسر ران', sets: 4, reps: '6-8', restSeconds: 120, notes: 'عمق قانونی' },
          { nameFa: 'پرس پا سنگین', nameEn: 'Leg Press', targetMuscle: 'چهارسر ران', sets: 3, reps: '8-10', restSeconds: 90, notes: 'کف پا ثابت' },
          { nameFa: 'ساق پا ایستاده سنگین', nameEn: 'Calf Raise', targetMuscle: 'ساق پا', sets: 4, reps: '12', restSeconds: 60, notes: 'انقباض بالا' },
        ]},
        { dayNumber: 4, dayName: 'سه‌شنبه (Push B - هایپرتروفی)', targetMuscles: ['سینه', 'سرشانه', 'پشت بازو'], focus: 'حجم و پمپ', estimatedDuration: 60, warmup: 'گرم کردن', cooldown: 'کشش', exercises: [
          { nameFa: 'پرس بالا سینه دمبل', nameEn: 'Incline DB Press', targetMuscle: 'سینه', sets: 4, reps: '10-12', restSeconds: 75, notes: 'پمپ عضلانی' },
          { nameFa: 'نشر جانب دمبل دراپ‌ست', nameEn: 'Lateral Raise Drop Set', targetMuscle: 'سرشانه', sets: 4, reps: '12-15', restSeconds: 60, notes: 'سوزش دلتوئید جانبی' },
          { nameFa: 'پشت بازو سیم‌کش طناب', nameEn: 'Tricep Rope Pushdown', targetMuscle: 'پشت بازو', sets: 4, reps: '12-15', restSeconds: 45, notes: 'انقباض پایانی' },
        ]},
        { dayNumber: 5, dayName: 'چهارشنبه (Pull B - هایپرتروفی)', targetMuscles: ['زیربغل', 'جلو بازو', 'سرشانه خلفی'], focus: 'حجم و تفکیک پشت', estimatedDuration: 60, warmup: 'گرم کردن', cooldown: 'کشش', exercises: [
          { nameFa: 'زیربغل قایقی دست جمع', nameEn: 'Close Grip Cable Row', targetMuscle: 'زیربغل', sets: 4, reps: '10-12', restSeconds: 60, notes: 'کشش لت' },
          { nameFa: 'فیس پول سیم‌کش', nameEn: 'Face Pull', targetMuscle: 'سرشانه خلفی', sets: 4, reps: '15', restSeconds: 45, notes: 'سلامت شانه' },
          { nameFa: 'جلو بازو چکشی دمبل', nameEn: 'Hammer Curl', targetMuscle: 'جلو بازو', sets: 4, reps: '12', restSeconds: 60, notes: 'ضخامت بازو' },
        ]},
        { dayNumber: 6, dayName: 'پنج‌شنبه (Legs B - هایپرتروفی خلفی)', targetMuscles: ['همسترینگ', 'باسن', 'ساق و شکم'], focus: 'زنجیره خلفی و کر', estimatedDuration: 60, warmup: 'گرم کردن', cooldown: 'کشش', exercises: [
          { nameFa: 'ددلیفت رومانیایی دمبل', nameEn: 'DB RDL', targetMuscle: 'همسترینگ', sets: 4, reps: '10-12', restSeconds: 75, notes: 'کشش عمیق' },
          { nameFa: 'هیپ تراست با هالتر', nameEn: 'Barbell Hip Thrust', targetMuscle: 'باسن', sets: 4, reps: '12', restSeconds: 75, notes: 'فشردن باسن' },
          { nameFa: 'پلانک و رول‌اوت شکم', nameEn: 'Ab Wheel / Plank', targetMuscle: 'شکم', sets: 3, reps: '15', restSeconds: 45, notes: 'قدرت شکم' },
        ]},
      ],
    },
  };

  const selected = splits[daysCount] || splits[4];

  // Calculate personalized Mifflin-St Jeor BMR & Macros
  const w = Number(params.weightKg) || 78;
  const h = Number(params.heightCm) || 178;
  const a = Number(params.age) || 26;
  const isFemale = params.gender === 'female';
  const bmr = isFemale ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5;
  const activityFactor = 1.35 + daysCount * 0.05;
  let tdee = Math.round(bmr * activityFactor);

  const goalStr = params.goal || 'عضله‌سازی';
  if (goalStr.includes('حجم') || goalStr.includes('عضله')) {
    tdee += params.somatotype === 'اکتومورف' ? 400 : 250;
  } else if (goalStr.includes('چربی') || goalStr.includes('کات')) {
    tdee -= 450;
  }

  const proteinGrams = Math.round(w * 2.0);
  const fatsGrams = Math.round(w * 0.9);
  const carbsGrams = Math.max(100, Math.round((tdee - (proteinGrams * 4 + fatsGrams * 9)) / 4));
  const waterLiters = Number((w * 0.042).toFixed(1));

  const weakPointsArr: string[] = Array.isArray(params.weakPoints)
    ? params.weakPoints
    : params.weakPoints
    ? [params.weakPoints]
    : ['بالا سینه', 'سرشانه میانی'];

  // Enrich every exercise with Tempo, RPE, and Technique + Weak-Point bonus exercise
  const enrichedDays = selected.days.map((day, idx) => {
    const enrichedExercises = day.exercises.map((ex: any, exIdx: number) => ({
      ...ex,
      tempo: exIdx === 0 ? '3-1-1-0' : '2-0-1-1',
      rpe: exIdx === 0 ? 'RPE 8.5 (1-2 RIR)' : 'RPE 8 (2 RIR)',
      technique:
        exIdx === day.exercises.length - 1
          ? 'دراپ‌ست ۲۰٪ در ست آخر یا مکث ایزومتریک ۲ ثانیه‌ای در اوج انقباض'
          : 'بارگذاری تدریجی استاندارد با فرم کامل',
    }));

    // Inject weak-point specialization exercise on first two days
    if (weakPointsArr.length > 0 && idx < weakPointsArr.length) {
      const wp = weakPointsArr[idx];
      enrichedExercises.push({
        nameFa: `حرکت تخصصی تقویت نقطه ضعف (${wp})`,
        nameEn: `Specialization Set: ${wp}`,
        targetMuscle: wp,
        sets: 3,
        reps: '12-15',
        restSeconds: 60,
        tempo: '3-1-1-1',
        rpe: 'RPE 9 (تا ۱ تکرار مانده به ناتوانی)',
        technique: 'سوپرست تمرکزی / پمپ عضلانی هدفمند',
        notes: `اضافه شده بر اساس انتخاب نقطه ضعف «${wp}» در پرسشنامه تخصصی شما`,
      });
    }

    return {
      ...day,
      exercises: enrichedExercises,
    };
  });

  const postureStr = Array.isArray(params.postureIssues)
    ? params.postureIssues.join('، ')
    : params.postureIssues || 'ندارد';

  return {
    ...selected,
    days: enrichedDays,
    summary: `برنامه تخصصی کالیبره‌شده برای تیپ بدنی ${params.somatotype || 'مزومورف'}، با هدف «${params.goal || 'هایپرتروفی و افزایش قدرت'}»، سیستم تمرینی «${params.trainingStyle || 'استاندارد علمی'}» و تمرکز ویژه روی نقاط ضعف (${weakPointsArr.join('، ')}).`,
    periodizationNote:
      'هفته ۱: آشنایی با تمپو و RPE 7.5 | هفته ۲: افزایش ۲.۵ کیلوگرم وزنه یا ۱ تکرار (RPE 8) | هفته ۳: اوج فشار تمرینی و اجرای تکنیک ست آخر (RPE 9) | هفته ۴: کاهش ۲۰٪ حجم ست‌ها جهت ریکاوری مفاصل (Deload).',
    cardioProtocol:
      params.somatotype === 'اندومورف' || goalStr.includes('چربی')
        ? '۳ جلسه در هفته، ۲۰ دقیقه هوازی LISS (پیاده‌روی تند روی تردمیل با شیب ۶ و ضربان قلب ۱۳۰) بلافاصله پس از تمرین وزنه.'
        : '۲ جلسه در هفته، ۱۵ دقیقه هوازی ملایم جهت سلامت قلبی-عروقی و بهبود گردش خون مویرگی بدون تداخل با هایپرتروفی.',
    postureCorrection:
      postureStr !== 'ندارد' || (params.injuries && params.injuries !== 'ندارد')
        ? `ملاحظات اصلاحی (${postureStr} / ${params.injuries}): قبل از هر جلسه بالاتنه ۲ ست ۲۰ تایی چرخش خارجی شانه با کش و فیس‌پول سبک و قبل از جلسات پا پلانک شکم و فعال‌سازی سرینی اجرا شود.`
        : 'پاسچر نرمال: اجرای ۵ دقیقه کشش پویا (Dynamic Stretching) پیش از تمرین و کشش ایستا پس از تمرین.',
    nutritionPlan: {
      calories: tdee,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      waterLiters,
      supplements: [
        'کراتین مونوهیدرات: ۵ گرم روزانه با آب فراوان',
        'پروتئین وی یا سفیده تخم‌مرغ پس از تمرین جهت سنتز پروتئین عضلانی',
        'کافئین (قهوه اسپرسو) ۳۰ دقیقه قبل از تمرین برای افزایش تمرکز عصبی',
        'مولتی‌ویتامین، منیزیم و امگا ۳ همراه با وعده شام جهت بهبود کیفیت خواب',
      ],
      mealTimingTip: `با توجه به وزن ${w} کیلوگرم و استراتژی «${params.nutritionStatus || 'تغذیه ورزشی'}»، پروتئین را در ۴ تا ۵ وعده مساوی (هر وعده حدود ${Math.round(proteinGrams / 4)} گرم) تقسیم کنید.`,
    },
    recoveryTips: [
      `خواب شبانه شما (${params.sleepHours || '۷ تا ۸ ساعت'}): ترشح هورمون رشد (GH) و ترمیم میوفیبریل‌ها در فاز خواب عمیق رخ می‌دهد.`,
      `مصرف روزانه ${proteinGrams} گرم پروتئین و ${waterLiters} لیتر آب برای هیدراتاسیون سلولی الزامی است.`,
      'رعایت دقیق تمپوی نوشته‌شده (کنترل ۲ تا ۳ ثانیه‌ای بخش منفی حرکت) کلید اصلی تحریک مکانیکی رشد عضله است.',
      'ثبت وزنه‌ها در بخش «ثبت تمرین» اپلیکیشن جهت پایش اصل اضافه بار تدریجی در هر هفته.',
    ],
  };
}

// Start Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Workout App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
