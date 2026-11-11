import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { SeyedLogo } from '../brand/SeyedLogo';
import {
  Lock,
  User,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  PlayCircle,
  Trophy,
  Dumbbell,
} from 'lucide-react';

export const AuthScreen: React.FC<{ onReplaySplash?: () => void }> = ({
  onReplaySplash,
}) => {
  const { login, register, accounts } = useWorkout();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration additional fields
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(176);
  const [experienceLevel, setExperienceLevel] = useState<'مبتدی' | 'متوسط' | 'پیشرفته'>('متوسط');
  const [goal, setGoal] = useState('عضله‌سازی و افزایش حجم خالص');

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const res = login(username, password);
      if (!res.ok) {
        setErrorMsg(res.error || 'خطا در ورود به حساب کاربری');
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg('لطفاً نام و نام خانوادگی خود را وارد کنید.');
        return;
      }
      const res = register(username, password, {
        name: fullName.trim(),
        gender,
        age,
        weightKg,
        heightCm,
        experienceLevel,
        goal,
      });
      if (!res.ok) {
        setErrorMsg(res.error || 'خطا در ثبت‌نام حساب کاربری');
      }
    }
  };

  const handleQuickDemoLogin = (demoUser: string, demoPass: string) => {
    setErrorMsg('');
    login(demoUser, demoPass);
  };

  return (
    <div className="min-h-screen bg-athletic-mesh text-zinc-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-zinc-900/95 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10 athletic-card-glow">
        {/* Right Column: Branding & Personal Profile Promise */}
        <div className="lg:col-span-5 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 sm:p-8 border-b lg:border-b-0 lg:border-l border-zinc-800/90 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-56 h-56 bg-lime-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-6">
              <SeyedLogo size="md" showSubtitle={true} />
              {onReplaySplash && (
                <button
                  type="button"
                  onClick={onReplaySplash}
                  className="p-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 hover:bg-zinc-800 transition-all text-xs flex items-center gap-1 cursor-pointer"
                  title="پخش موشن لوگو سید بدنساز"
                >
                  <PlayCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>باشگاه هوشمند سید بدنساز | SEYED BADANSAZ</span>
            </div>

            <h2 className="text-xl font-black text-white leading-snug mb-3">
              پروفایل و برنامه تمرینی کاملاً اختصاصی برای هر قهرمان
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              با نام کاربری و رمز عبور شخصی خود وارد شوید تا برنامه‌های تمرینی، رکوردها، تاریخچه تقویم شمسی و آنالیز پیشرفت بدنی شما به صورت کاملاً مجزا و خصوصی در سید بدنساز ذخیره شوند.
            </p>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2.5 bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800/80">
                <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
                <span>جداسازی کامل اطلاعات، رکوردها و برنامه‌های هر ورزشکار</span>
              </div>
              <div className="flex items-center gap-2.5 bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800/80">
                <Dumbbell className="w-4 h-4 text-amber-400 shrink-0" />
                <span>اطلس سه‌بعدی عضلات + بانک ۱۲۰ حرکت با کلیپ واقعی</span>
              </div>
              <div className="flex items-center gap-2.5 bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800/80">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>پرسشنامه تخصصی فیزیولوژی، تیپ بدنی، خواب و آسیب‌شناسی</span>
              </div>
            </div>
          </div>

          {/* Quick Switch / Saved Accounts */}
          <div className="mt-8 pt-5 border-t border-zinc-800/80">
            <span className="text-[11px] font-bold text-zinc-400 block mb-2.5">
              ورود سریع به حساب‌های نمونه آماده سید بدنساز:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {accounts.slice(0, 4).map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc.username, acc.passwordHash)}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-lime-500/40 text-right transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-lime-500/15 border border-lime-500/30 text-lime-400 font-black text-xs flex items-center justify-center shrink-0">
                    {acc.profile.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate group-hover:text-lime-400">
                      {acc.profile.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 block truncate">
                      @{acc.username}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Left Column: Login / Register Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          {/* Mode Switch Tabs */}
          <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-lime-500 to-emerald-400 text-zinc-950 font-black shadow-md shadow-lime-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>ورود به حساب شخصی</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-lime-500 to-emerald-400 text-zinc-950 font-black shadow-md shadow-lime-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>ساخت حساب کاربری جدید</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    نام و نام خانوادگی ورزشکار:
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثلاً: سید علی رضایی"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:border-lime-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    جنسیت:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        gender === 'male'
                          ? 'bg-lime-500/20 text-lime-400 border-lime-500'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      آقا
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        gender === 'female'
                          ? 'bg-lime-500/20 text-lime-400 border-lime-500'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      خانم
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Username & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  نام کاربری شخصی (انگلیسی):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pr-10 pl-4 py-2.5 text-sm text-white font-mono focus:border-lime-500 outline-none text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  رمز عبور شخصی:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pr-10 pl-10 py-2.5 text-sm text-white font-mono focus:border-lime-500 outline-none text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      سن:
                    </label>
                    <input
                      type="number"
                      min={12}
                      max={85}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-3 py-2 text-sm text-white focus:border-lime-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      وزن (kg):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-3 py-2 text-sm text-white focus:border-lime-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      قد (cm):
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-3 py-2 text-sm text-white focus:border-lime-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      سطح تجربه ورزشی:
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-3 py-2 text-xs sm:text-sm text-white focus:border-lime-500 outline-none"
                    >
                      <option value="مبتدی">مبتدی</option>
                      <option value="متوسط">متوسط</option>
                      <option value="پیشرفته">پیشرفته</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      هدف اصلی:
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-3 py-2 text-xs sm:text-sm text-white focus:border-lime-500 outline-none"
                    >
                      <option value="عضله‌سازی و افزایش حجم خالص">عضله‌سازی و افزایش حجم خالص</option>
                      <option value="چربی‌سوزی و تفکیک عضلانی">چربی‌سوزی و تفکیک عضلانی</option>
                      <option value="افزایش قدرت و توان رکوردی">افزایش قدرت و توان رکوردی</option>
                      <option value="فرم‌دهی پایین‌تنه و تناسب اندام">فرم‌دهی پایین‌تنه و تناسب اندام</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-400 hover:from-lime-400 hover:to-emerald-300 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-lime-500/20 active:scale-95 mt-2 cursor-pointer"
            >
              <span>
                {mode === 'login'
                  ? 'ورود به باشگاه سید بدنساز'
                  : 'ثبت‌نام و ورود به پروفایل اختصاصی'}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-[11px] text-zinc-500 mt-4 text-center">
              راهنما: برای تست سریع می‌توانید با نام کاربری <span className="font-mono text-zinc-300">sohrab</span> و رمز <span className="font-mono text-zinc-300">123456</span> وارد شوید یا حساب شخصی خودتان را بسازید.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
