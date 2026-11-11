import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import {
  Download,
  Upload,
  Volume2,
  VolumeX,
  Check,
  AlertTriangle,
  Scale,
  Ruler,
  LogOut,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const {
    currentUser,
    profile,
    updateProfile,
    logout,
    changePassword,
    exportDataJson,
    importDataJson,
    resetAllData,
  } = useWorkout();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [weight, setWeight] = useState(profile.weightKg);
  const [targetWeight, setTargetWeight] = useState(profile.targetWeightKg || profile.weightKg + 4);
  const [height, setHeight] = useState(profile.heightCm);
  const [goal, setGoal] = useState(profile.goal);
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel);
  const [somatotype, setSomatotype] = useState<'اکتومورف' | 'مزومورف' | 'اندومورف' | 'ترکیبی'>(
    profile.somatotype || 'مزومورف'
  );
  const [bodyFatEstimate, setBodyFatEstimate] = useState(
    profile.bodyFatEstimate || '۱۲ تا ۱۸ درصد (معمولی/ورزشی)'
  );
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      age,
      weightKg: weight,
      targetWeightKg: targetWeight,
      heightCm: height,
      goal,
      experienceLevel,
      somatotype,
      bodyFatEstimate,
      soundEnabled,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setPasswordMsg({ text: 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد.', ok: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد.', ok: false });
      return;
    }
    const ok = changePassword(newPassword);
    setPasswordMsg({
      text: ok ? 'رمز عبور با موفقیت تغییر یافت.' : 'خطا در تغییر رمز عبور.',
      ok,
    });
    if (ok) {
      setNewPassword('');
      setConfirmPassword('');
    }
    setTimeout(() => setPasswordMsg(null), 3500);
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tansaz_${currentUser || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJson(content);
        if (ok) {
          setImportStatus('اطلاعات با موفقیت بازیابی شد!');
        } else {
          setImportStatus('خطا در خواندن فایل پشتیبان.');
        }
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  // BMI Calculation
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : '---';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Overview Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
            <div className="w-20 h-20 rounded-3xl bg-lime-500/10 border-2 border-lime-500/30 text-lime-400 flex items-center justify-center text-3xl font-black shrink-0 shadow-lg shadow-lime-500/10">
              {profile.name.charAt(0) || 'ت'}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-white">{profile.name}</h2>
                {currentUser && (
                  <span
                    className="px-2.5 py-0.5 rounded-lg bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-mono"
                    dir="ltr"
                  >
                    @{currentUser}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                سطح ورزشی: {profile.experienceLevel} • هدف: {profile.goal}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs">
                <span className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300">
                  <Scale className="w-3.5 h-3.5 text-lime-400" />
                  وزن: {profile.weightKg} کیلوگرم
                </span>
                <span className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300">
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  قد: {profile.heightCm} سانتی‌متر
                </span>
                <span className="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300 font-mono">
                  BMI: {bmi}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب کاربری</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-2">نام و نام خانوادگی:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-2">سن:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-2">وزن فعلی (کیلوگرم):</label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-2">وزن هدف (کیلوگرم):</label>
              <input
                type="number"
                step="0.5"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-lime-400 font-bold focus:border-lime-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-2">قد (سانتی‌متر):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-2">سطح تجربه:</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="مبتدی">مبتدی</option>
                <option value="متوسط">متوسط</option>
                <option value="پیشرفته">پیشرفته</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-2">تیپ بدنی (Somatotype):</label>
              <select
                value={somatotype}
                onChange={(e) => setSomatotype(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="اکتومورف">اکتومورف (لاغر و متابولیسم بالا)</option>
                <option value="مزومورف">مزومورف (عضلانی و متناسب)</option>
                <option value="اندومورف">اندومورف (درشت‌اندام)</option>
                <option value="ترکیبی">ترکیبی (اکتو-مزو / اندو-مزو)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-2">درصد چربی تخمینی:</label>
              <select
                value={bodyFatEstimate}
                onChange={(e) => setBodyFatEstimate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
              >
                <option value="زیر ۱۲ درصد (کات و رگ‌دار)">زیر ۱۲ درصد</option>
                <option value="۱۲ تا ۱۸ درصد (معمولی/ورزشی)">۱۲ تا ۱۸ درصد</option>
                <option value="۱۸ تا ۲۵ درصد (کمی اضافه‌وزن)">۱۸ تا ۲۵ درصد</option>
                <option value="بالای ۲۵ درصد (نیازمند چربی‌سوزی اولویت‌دار)">بالای ۲۵ درصد</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">هدف بدنسازی:</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
            />
          </div>

          {/* Sound Toggle */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-lime-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-zinc-500" />
              )}
              <div>
                <span className="text-sm font-bold text-white block">صدا و زنگ تایمر استراحت</span>
                <span className="text-xs text-zinc-400">پخش زنگ صوتی با اتمام ثانیه‌شمار استراحت</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-lime-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                  soundEnabled ? 'left-1' : 'right-1'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-lime-500/20 active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تغییرات ذخیره شد!</span>
                </>
              ) : (
                <span>ذخیره تغییرات پروفایل شخصی</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Change */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-5 h-5 text-lime-400" />
          <div>
            <h3 className="text-lg font-bold text-white">امنیت حساب و تغییر رمز عبور شخصی</h3>
            <p className="text-xs text-zinc-400">
              رمز عبور حساب کاربری <span className="text-lime-400 font-mono" dir="ltr">@{currentUser}</span> را می‌توانید در این بخش تغییر دهید.
            </p>
          </div>
        </div>

        {passwordMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold border ${
              passwordMsg.ok
                ? 'bg-lime-500/10 border-lime-500/30 text-lime-400'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">رمز عبور جدید:</label>
            <input
              type="password"
              dir="ltr"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="حداقل ۴ کاراکتر"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">تکرار رمز عبور جدید:</label>
            <input
              type="password"
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="تکرار رمز عبور"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-5 rounded-2xl bg-zinc-800 hover:bg-lime-500 hover:text-zinc-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all h-[42px]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>بروزرسانی رمز عبور</span>
          </button>
        </form>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">پشتیبان‌گیری اختصاصی حساب شما</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            تمامی جلسات تمرینی، رکوردهای شخصی و برنامه‌های حساب <span className="text-lime-400 font-mono" dir="ltr">@{currentUser}</span> به صورت مجزا ذخیره می‌شوند.
          </p>
        </div>

        {importStatus && (
          <div className="p-3.5 rounded-2xl bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-semibold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500 hover:bg-zinc-900 text-right transition-all flex items-center gap-4 group"
          >
            <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">دریافت فایل پشتیبان (Export JSON)</span>
              <span className="text-xs text-zinc-400">دانلود فایل اختصاصی این پروفایل</span>
            </div>
          </button>

          <label className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500 hover:bg-zinc-900 text-right transition-all flex items-center gap-4 group cursor-pointer">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">بازیابی اطلاعات (Import JSON)</span>
              <span className="text-xs text-zinc-400">بارگذاری فایل پشتیبان قبلی</span>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Warning */}
        <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>بازنشانی داده‌های این حساب کاربری به وضعیت اولیه</span>
          </div>
          <button
            onClick={() => {
              resetAllData();
            }}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-xs font-semibold transition-colors"
          >
            بازنشانی داده‌ها
          </button>
        </div>
      </div>
    </div>
  );
};
