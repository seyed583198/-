import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserAccount,
  WorkoutProgram,
  WorkoutSession,
  LoggedExercise,
  LoggedSet,
  ProgramDay,
  Exercise,
  PersonalRecord,
} from '../types/fitness';
import { PRESET_PROGRAMS } from '../data/presetPrograms';
import { EXERCISES } from '../data/exercisesData';
import { getCurrentJalali, formatJalaliDate, jalaliToGregorian } from '../utils/jalali';
import confetti from 'canvas-confetti';

interface LiveSessionState {
  programId?: string;
  dayId?: string;
  dayName: string;
  programTitle: string;
  startTime: number;
  exercises: LoggedExercise[];
  notes: string;
}

interface WorkoutContextType {
  // Auth & Multi-User Accounts
  currentUser: string | null;
  accounts: UserAccount[];
  login: (username: string, password: string) => { ok: boolean; error?: string };
  register: (
    username: string,
    password: string,
    initialProfile: Partial<UserProfile>
  ) => { ok: boolean; error?: string };
  logout: () => void;
  changePassword: (newPassword: string) => boolean;

  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  activeProgram: WorkoutProgram;
  setActiveProgram: (program: WorkoutProgram) => void;
  savedPrograms: WorkoutProgram[];
  saveProgram: (program: WorkoutProgram) => void;
  deleteProgram: (programId: string) => void;
  updateActiveProgramDay: (dayIndex: number, updatedDay: ProgramDay) => void;
  addExerciseToProgram: (dayIndex: number, exercise: Exercise) => void;
  removeExerciseFromProgram: (dayIndex: number, exerciseId: string) => void;
  reorderExercisesInDay: (dayIndex: number, fromIndex: number, toIndex: number) => void;

  favorites: string[];
  toggleFavorite: (exerciseId: string) => void;
  isFavorite: (exerciseId: string) => boolean;

  completedSessions: WorkoutSession[];
  liveSession: LiveSessionState | null;
  startLiveSession: (day: ProgramDay, programTitle?: string) => void;
  updateLiveSet: (exerciseIndex: number, setIndex: number, updates: Partial<LoggedSet>) => void;
  addLiveSet: (exerciseIndex: number) => void;
  removeLiveSet: (exerciseIndex: number, setIndex: number) => void;
  saveLiveSessionDraft: () => void;
  finishLiveSession: (feeling?: WorkoutSession['feeling'], notes?: string) => void;
  cancelLiveSession: () => void;

  personalRecords: PersonalRecord[];
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
  resetAllData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  username: 'sohrab',
  name: 'سهراب احمدی',
  gender: 'male',
  age: 26,
  weightKg: 78,
  heightCm: 181,
  experienceLevel: 'متوسط',
  goal: 'افزایش حجم عضلانی خالص و قدرت',
  targetWeightKg: 82,
  somatotype: 'مزومورف',
  bodyFatEstimate: '۱۲ تا ۱۵٪',
  themeAccent: 'lime',
  soundEnabled: true,
};

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    username: 'sohrab',
    passwordHash: '123456',
    createdAt: '۱۴۰۳/۰۸/۰۱',
    profile: DEFAULT_PROFILE,
  },
  {
    username: 'sara',
    passwordHash: '123456',
    createdAt: '۱۴۰۳/۰۸/۰۵',
    profile: {
      username: 'sara',
      name: 'سارا رادمنش',
      gender: 'female',
      age: 24,
      weightKg: 59,
      heightCm: 168,
      experienceLevel: 'متوسط',
      goal: 'فرم‌دهی پایین‌تنه و تناسب اندام',
      targetWeightKg: 57,
      somatotype: 'مزومورف',
      bodyFatEstimate: '۱۸ تا ۲۰٪',
      themeAccent: 'lime',
      soundEnabled: true,
    },
  },
];

function getInitialSampleSessions(): WorkoutSession[] {
  const currentJ = getCurrentJalali();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const s1DateJ = { ...currentJ, jd: Math.max(1, currentJ.jd - 4) };
  const s2DateJ = { ...currentJ, jd: Math.max(1, currentJ.jd - 2) };

  const toGStr = (j: { jy: number; jm: number; jd: number }) => {
    const g = jalaliToGregorian(j.jy, j.jm, j.jd);
    return `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`;
  };

  return [
    {
      id: 'session_demo_1',
      date: toGStr(s1DateJ),
      jalaliDate: formatJalaliDate(s1DateJ),
      programTitle: 'برنامه علمی ۴ روزه بالاتنه / پایین‌تنه',
      dayName: 'شنبه: بالاتنه قدرتی (Upper A)',
      durationMinutes: 58,
      completedExercisesCount: 5,
      totalVolumeKg: 6420,
      feeling: 'عالی',
      notes: 'رکورد جدید در پرس سینه هالتر؛ پمپ فوق‌العاده و تمرکز ذهنی بالا.',
      exercises: [
        {
          exerciseId: 'barbell_bench_press',
          exerciseNameFa: 'پرس سینه با هالتر روی میز تخت',
          exerciseNameEn: 'Barbell Flat Bench Press',
          muscleId: 'chest',
          sets: [
            { setNumber: 1, weight: 70, reps: 10, completed: true },
            { setNumber: 2, weight: 80, reps: 8, completed: true },
            { setNumber: 3, weight: 85, reps: 8, completed: true },
            { setNumber: 4, weight: 90, reps: 6, completed: true },
          ],
        },
        {
          exerciseId: 'barbell_bent_over_row',
          exerciseNameFa: 'زیربغل هالتر خم',
          exerciseNameEn: 'Bent Over Barbell Row',
          muscleId: 'lats',
          sets: [
            { setNumber: 1, weight: 60, reps: 10, completed: true },
            { setNumber: 2, weight: 70, reps: 8, completed: true },
            { setNumber: 3, weight: 75, reps: 8, completed: true },
          ],
        },
      ],
    },
    {
      id: 'session_demo_2',
      date: toGStr(s2DateJ),
      jalaliDate: formatJalaliDate(s2DateJ),
      programTitle: 'برنامه علمی ۴ روزه بالاتنه / پایین‌تنه',
      dayName: 'یکشنبه: پایین‌تنه قدرتی (Lower A)',
      durationMinutes: 65,
      completedExercisesCount: 4,
      totalVolumeKg: 8900,
      feeling: 'خوب',
      notes: 'اسکوات عمیق عالی با رعایت زاویه زانو.',
      exercises: [
        {
          exerciseId: 'barbell_back_squat',
          exerciseNameFa: 'اسکوات با هالتر از پشت',
          exerciseNameEn: 'Barbell Back Squat',
          muscleId: 'quads',
          sets: [
            { setNumber: 1, weight: 90, reps: 8, completed: true },
            { setNumber: 2, weight: 100, reps: 8, completed: true },
            { setNumber: 3, weight: 110, reps: 6, completed: true },
            { setNumber: 4, weight: 115, reps: 6, completed: true },
          ],
        },
        {
          exerciseId: 'leg_press_machine',
          exerciseNameFa: 'پرس پا با دستگاه',
          exerciseNameEn: 'Leg Press 45 Degree',
          muscleId: 'quads',
          sets: [
            { setNumber: 1, weight: 160, reps: 12, completed: true },
            { setNumber: 2, weight: 180, reps: 10, completed: true },
          ],
        },
      ],
    },
  ];
}

const DEFAULT_PRS: PersonalRecord[] = [
  { exerciseId: 'barbell_bench_press', exerciseName: 'پرس سینه هالتر', maxWeight: 90, repsAtMax: 6, estimated1RM: 105, date: '۱۴۰۳/۰۸/۱۸' },
  { exerciseId: 'barbell_back_squat', exerciseName: 'اسکوات هالتر', maxWeight: 115, repsAtMax: 6, estimated1RM: 134, date: '۱۴۰۳/۰۸/۲۰' },
  { exerciseId: 'conventional_deadlift', exerciseName: 'ددلیفت هالتر', maxWeight: 140, repsAtMax: 5, estimated1RM: 160, date: '۱۴۰۳/۰۸/۱۵' },
];

const WorkoutContext = createContext<WorkoutContextType | null>(null);

function userKey(username: string | null, key: string): string {
  const u = (username || 'guest').toLowerCase();
  return `tansaz_u_${u}_${key}`;
}

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts list
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('tansaz_accounts_v2');
      return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  });

  // Current Logged-In Username (null = show login screen)
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('tansaz_current_user');
      return saved ? saved : null;
    } catch {
      return null;
    }
  });

  // Per-User States
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeProgram, setActiveProgramState] = useState<WorkoutProgram>(PRESET_PROGRAMS[0]);
  const [savedPrograms, setSavedPrograms] = useState<WorkoutProgram[]>(PRESET_PROGRAMS);
  const [favorites, setFavorites] = useState<string[]>([
    'barbell_bench_press',
    'barbell_back_squat',
    'lat_pulldown_wide',
  ]);
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>(
    getInitialSampleSessions()
  );
  const [liveSession, setLiveSession] = useState<LiveSessionState | null>(null);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(DEFAULT_PRS);

  // Load user-specific data whenever `currentUser` changes
  useEffect(() => {
    if (!currentUser) return;
    const matchedAccount = accounts.find(
      (a) => a.username.toLowerCase() === currentUser.toLowerCase()
    );

    try {
      const savedProf = localStorage.getItem(userKey(currentUser, 'profile'));
      setProfile(
        savedProf
          ? JSON.parse(savedProf)
          : matchedAccount?.profile || { ...DEFAULT_PROFILE, username: currentUser }
      );
    } catch {
      setProfile(matchedAccount?.profile || DEFAULT_PROFILE);
    }

    try {
      const savedProg = localStorage.getItem(userKey(currentUser, 'active_program'));
      setActiveProgramState(savedProg ? JSON.parse(savedProg) : PRESET_PROGRAMS[0]);
    } catch {
      setActiveProgramState(PRESET_PROGRAMS[0]);
    }

    try {
      const savedProgs = localStorage.getItem(userKey(currentUser, 'saved_programs'));
      setSavedPrograms(savedProgs ? JSON.parse(savedProgs) : PRESET_PROGRAMS);
    } catch {
      setSavedPrograms(PRESET_PROGRAMS);
    }

    try {
      const savedFavs = localStorage.getItem(userKey(currentUser, 'favorites'));
      setFavorites(
        savedFavs
          ? JSON.parse(savedFavs)
          : ['barbell_bench_press', 'barbell_back_squat', 'lat_pulldown_wide']
      );
    } catch {
      setFavorites(['barbell_bench_press', 'barbell_back_squat', 'lat_pulldown_wide']);
    }

    try {
      const savedSessions = localStorage.getItem(userKey(currentUser, 'completed_sessions'));
      const isDefaultUser = currentUser.toLowerCase() === 'sohrab';
      setCompletedSessions(
        savedSessions ? JSON.parse(savedSessions) : isDefaultUser ? getInitialSampleSessions() : []
      );
    } catch {
      setCompletedSessions([]);
    }

    try {
      const savedLive = localStorage.getItem(userKey(currentUser, 'live_session'));
      setLiveSession(savedLive ? JSON.parse(savedLive) : null);
    } catch {
      setLiveSession(null);
    }

    try {
      const savedPRs = localStorage.getItem(userKey(currentUser, 'personal_records'));
      const isDefaultUser = currentUser.toLowerCase() === 'sohrab';
      setPersonalRecords(savedPRs ? JSON.parse(savedPRs) : isDefaultUser ? DEFAULT_PRS : []);
    } catch {
      setPersonalRecords([]);
    }
  }, [currentUser]);

  // Save accounts list
  useEffect(() => {
    localStorage.setItem('tansaz_accounts_v2', JSON.stringify(accounts));
  }, [accounts]);

  // Save currentUser pointer
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tansaz_current_user', currentUser);
    } else {
      localStorage.removeItem('tansaz_current_user');
    }
  }, [currentUser]);

  // Sync per-user data to LocalStorage when logged in
  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(userKey(currentUser, 'profile'), JSON.stringify(profile));
  }, [profile, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(userKey(currentUser, 'active_program'), JSON.stringify(activeProgram));
  }, [activeProgram, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(userKey(currentUser, 'saved_programs'), JSON.stringify(savedPrograms));
  }, [savedPrograms, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(userKey(currentUser, 'favorites'), JSON.stringify(favorites));
  }, [favorites, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(
      userKey(currentUser, 'completed_sessions'),
      JSON.stringify(completedSessions)
    );
  }, [completedSessions, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (liveSession) {
      localStorage.setItem(userKey(currentUser, 'live_session'), JSON.stringify(liveSession));
    } else {
      localStorage.removeItem(userKey(currentUser, 'live_session'));
    }
  }, [liveSession, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(userKey(currentUser, 'personal_records'), JSON.stringify(personalRecords));
  }, [personalRecords, currentUser]);

  // Auth Actions
  const login = (usernameInput: string, passwordInput: string) => {
    const cleanUser = usernameInput.trim().toLowerCase();
    if (!cleanUser || !passwordInput) {
      return { ok: false, error: 'لطفاً نام کاربری و رمز عبور را وارد کنید.' };
    }
    const found = accounts.find((a) => a.username.toLowerCase() === cleanUser);
    if (!found) {
      return { ok: false, error: 'حساب کاربری با این نام کاربری یافت نشد. ابتدا ثبت‌نام کنید.' };
    }
    if (found.passwordHash !== passwordInput) {
      return { ok: false, error: 'رمز عبور وارد شده اشتباه است.' };
    }
    setCurrentUser(found.username);
    return { ok: true };
  };

  const register = (
    usernameInput: string,
    passwordInput: string,
    initialProfile: Partial<UserProfile>
  ) => {
    const cleanUser = usernameInput.trim().toLowerCase();
    if (cleanUser.length < 3) {
      return { ok: false, error: 'نام کاربری باید حداقل ۳ کاراکتر باشد.' };
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUser)) {
      return {
        ok: false,
        error: 'نام کاربری فقط باید شامل حروف انگلیسی، اعداد یا خط زیر (_) باشد.',
      };
    }
    if (passwordInput.length < 4) {
      return { ok: false, error: 'رمز عبور باید حداقل ۴ کاراکتر باشد.' };
    }
    if (accounts.some((a) => a.username.toLowerCase() === cleanUser)) {
      return { ok: false, error: 'این نام کاربری قبلاً ثبت شده است. نام دیگری انتخاب کنید.' };
    }

    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      ...initialProfile,
      username: cleanUser,
      name: initialProfile.name?.trim() || cleanUser,
    };

    const jNow = getCurrentJalali();
    const newAccount: UserAccount = {
      username: cleanUser,
      passwordHash: passwordInput,
      createdAt: formatJalaliDate(jNow),
      profile: newProfile,
    };

    setAccounts((prev) => [...prev, newAccount]);
    localStorage.setItem(userKey(cleanUser, 'profile'), JSON.stringify(newProfile));
    localStorage.setItem(userKey(cleanUser, 'completed_sessions'), JSON.stringify([]));
    localStorage.setItem(userKey(cleanUser, 'personal_records'), JSON.stringify([]));
    setCurrentUser(cleanUser);
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const changePassword = (newPassword: string) => {
    if (!currentUser || newPassword.trim().length < 4) return false;
    setAccounts((prev) =>
      prev.map((a) =>
        a.username.toLowerCase() === currentUser.toLowerCase()
          ? { ...a, passwordHash: newPassword.trim() }
          : a
      )
    );
    return true;
  };

  // Profile actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      if (currentUser) {
        setAccounts((accs) =>
          accs.map((a) =>
            a.username.toLowerCase() === currentUser.toLowerCase() ? { ...a, profile: next } : a
          )
        );
      }
      return next;
    });
  };

  // Program actions
  const setActiveProgram = (prog: WorkoutProgram) => {
    setActiveProgramState(prog);
  };

  const saveProgram = (prog: WorkoutProgram) => {
    setSavedPrograms((prev) => {
      const idx = prev.findIndex((p) => p.id === prog.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = prog;
        return next;
      }
      return [prog, ...prev];
    });
  };

  const deleteProgram = (progId: string) => {
    setSavedPrograms((prev) => prev.filter((p) => p.id !== progId));
  };

  const updateActiveProgramDay = (dayIndex: number, updatedDay: ProgramDay) => {
    setActiveProgramState((prev) => {
      const nextDays = [...prev.days];
      nextDays[dayIndex] = updatedDay;
      const updated = { ...prev, days: nextDays };
      saveProgram(updated);
      return updated;
    });
  };

  const addExerciseToProgram = (dayIndex: number, exercise: Exercise) => {
    setActiveProgramState((prev) => {
      const day = prev.days[dayIndex];
      if (!day) return prev;
      const newEx = {
        id: `pe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        exerciseId: exercise.id,
        nameFa: exercise.nameFa,
        nameEn: exercise.nameEn,
        targetMuscle: exercise.muscleFa,
        targetMuscleId: exercise.primaryMuscle,
        sets: exercise.defaultSets || 3,
        reps: exercise.defaultReps || '10-12',
        restSeconds: exercise.defaultRestSec || 60,
      };
      const updatedDay: ProgramDay = {
        ...day,
        exercises: [...day.exercises, newEx],
      };
      const nextDays = [...prev.days];
      nextDays[dayIndex] = updatedDay;
      const updated = { ...prev, days: nextDays };
      saveProgram(updated);
      return updated;
    });
  };

  const removeExerciseFromProgram = (dayIndex: number, exerciseId: string) => {
    setActiveProgramState((prev) => {
      const day = prev.days[dayIndex];
      if (!day) return prev;
      const updatedDay: ProgramDay = {
        ...day,
        exercises: day.exercises.filter((e) => e.id !== exerciseId && e.exerciseId !== exerciseId),
      };
      const nextDays = [...prev.days];
      nextDays[dayIndex] = updatedDay;
      const updated = { ...prev, days: nextDays };
      saveProgram(updated);
      return updated;
    });
  };

  const reorderExercisesInDay = (dayIndex: number, fromIndex: number, toIndex: number) => {
    setActiveProgramState((prev) => {
      const day = prev.days[dayIndex];
      if (!day) return prev;
      const exercises = [...day.exercises];
      const [moved] = exercises.splice(fromIndex, 1);
      exercises.splice(toIndex, 0, moved);
      const updatedDay = { ...day, exercises };
      const nextDays = [...prev.days];
      nextDays[dayIndex] = updatedDay;
      const updated = { ...prev, days: nextDays };
      saveProgram(updated);
      return updated;
    });
  };

  // Favorites
  const toggleFavorite = (exerciseId: string) => {
    setFavorites((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const isFavorite = (exerciseId: string) => favorites.includes(exerciseId);

  // Live Session Tracker
  const startLiveSession = (day: ProgramDay, programTitle = activeProgram.title) => {
    const exercises: LoggedExercise[] = day.exercises.map((ex) => {
      const fullEx = EXERCISES.find((e) => e.id === ex.exerciseId);
      const setsCount = ex.sets || 3;
      const parsedReps = parseInt(ex.reps) || 10;
      const sets: LoggedSet[] = Array.from({ length: setsCount }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        reps: parsedReps,
        completed: false,
      }));

      return {
        exerciseId: ex.exerciseId,
        exerciseNameFa: ex.nameFa,
        exerciseNameEn: ex.nameEn,
        muscleId: fullEx?.primaryMuscle || 'chest',
        sets,
        notes: ex.notes || '',
      };
    });

    const newLive: LiveSessionState = {
      programId: activeProgram.id,
      dayId: day.id,
      dayName: day.dayName,
      programTitle,
      startTime: Date.now(),
      exercises,
      notes: '',
    };
    setLiveSession(newLive);
  };

  const updateLiveSet = (exerciseIndex: number, setIndex: number, updates: Partial<LoggedSet>) => {
    setLiveSession((prev) => {
      if (!prev) return null;
      const exercises = [...prev.exercises];
      const ex = { ...exercises[exerciseIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = { ...sets[setIndex], ...updates };
      ex.sets = sets;
      exercises[exerciseIndex] = ex;
      return { ...prev, exercises };
    });
  };

  const addLiveSet = (exerciseIndex: number) => {
    setLiveSession((prev) => {
      if (!prev) return null;
      const exercises = [...prev.exercises];
      const ex = { ...exercises[exerciseIndex] };
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: LoggedSet = {
        setNumber: ex.sets.length + 1,
        weight: lastSet ? lastSet.weight : 0,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
      };
      ex.sets = [...ex.sets, newSet];
      exercises[exerciseIndex] = ex;
      return { ...prev, exercises };
    });
  };

  const removeLiveSet = (exerciseIndex: number, setIndex: number) => {
    setLiveSession((prev) => {
      if (!prev) return null;
      const exercises = [...prev.exercises];
      const ex = { ...exercises[exerciseIndex] };
      if (ex.sets.length <= 1) return prev;
      ex.sets = ex.sets
        .filter((_, idx) => idx !== setIndex)
        .map((s, i) => ({ ...s, setNumber: i + 1 }));
      exercises[exerciseIndex] = ex;
      return { ...prev, exercises };
    });
  };

  const saveLiveSessionDraft = () => {};

  const finishLiveSession = (feeling: WorkoutSession['feeling'] = 'عالی', sessionNotes = '') => {
    if (!liveSession) return;

    const durationMinutes = Math.max(1, Math.round((Date.now() - liveSession.startTime) / (1000 * 60)));

    let totalVolume = 0;
    let completedExCount = 0;

    liveSession.exercises.forEach((ex) => {
      let exHasCompleted = false;
      ex.sets.forEach((set) => {
        if (set.completed) {
          exHasCompleted = true;
          totalVolume += (set.weight || 0) * (set.reps || 0);
        }
      });
      if (exHasCompleted) completedExCount++;
    });

    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const jDate = getCurrentJalali();

    const finishedSession: WorkoutSession = {
      id: `session_${Date.now()}`,
      date: dateStr,
      jalaliDate: formatJalaliDate(jDate),
      programTitle: liveSession.programTitle,
      dayName: liveSession.dayName,
      durationMinutes,
      completedExercisesCount: completedExCount,
      totalVolumeKg: totalVolume,
      feeling,
      notes: sessionNotes || liveSession.notes,
      exercises: liveSession.exercises,
    };

    const updatedPRs = [...personalRecords];
    liveSession.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed && set.weight > 0) {
          const est1RM = Math.round(set.weight * (1 + (set.reps || 1) / 30));
          const existingPrIdx = updatedPRs.findIndex((p) => p.exerciseId === ex.exerciseId);
          if (existingPrIdx >= 0) {
            if (est1RM > updatedPRs[existingPrIdx].estimated1RM) {
              updatedPRs[existingPrIdx] = {
                exerciseId: ex.exerciseId,
                exerciseName: ex.exerciseNameFa,
                maxWeight: set.weight,
                repsAtMax: set.reps,
                estimated1RM: est1RM,
                date: formatJalaliDate(jDate),
              };
            }
          } else {
            updatedPRs.push({
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseNameFa,
              maxWeight: set.weight,
              repsAtMax: set.reps,
              estimated1RM: est1RM,
              date: formatJalaliDate(jDate),
            });
          }
        }
      });
    });

    setPersonalRecords(updatedPRs);
    setCompletedSessions((prev) => [finishedSession, ...prev]);
    setLiveSession(null);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a3e635', '#22c55e', '#38bdf8', '#fbbf24'],
      });
    } catch (e) {
      console.debug(e);
    }
  };

  const cancelLiveSession = () => {
    setLiveSession(null);
  };

  const exportDataJson = () => {
    const data = {
      username: currentUser,
      profile,
      activeProgram,
      savedPrograms,
      completedSessions,
      favorites,
      personalRecords,
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.activeProgram) setActiveProgramState(parsed.activeProgram);
      if (parsed.savedPrograms) setSavedPrograms(parsed.savedPrograms);
      if (parsed.completedSessions) setCompletedSessions(parsed.completedSessions);
      if (parsed.favorites) setFavorites(parsed.favorites);
      if (parsed.personalRecords) setPersonalRecords(parsed.personalRecords);
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  const resetAllData = () => {
    if (!currentUser) return;
    setActiveProgramState(PRESET_PROGRAMS[0]);
    setSavedPrograms(PRESET_PROGRAMS);
    setFavorites(['barbell_bench_press', 'barbell_back_squat', 'lat_pulldown_wide']);
    setCompletedSessions([]);
    setPersonalRecords([]);
    setLiveSession(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        currentUser,
        accounts,
        login,
        register,
        logout,
        changePassword,
        profile,
        updateProfile,
        activeProgram,
        setActiveProgram,
        savedPrograms,
        saveProgram,
        deleteProgram,
        updateActiveProgramDay,
        addExerciseToProgram,
        removeExerciseFromProgram,
        reorderExercisesInDay,
        favorites,
        toggleFavorite,
        isFavorite,
        completedSessions,
        liveSession,
        startLiveSession,
        updateLiveSet,
        addLiveSet,
        removeLiveSet,
        saveLiveSessionDraft,
        finishLiveSession,
        cancelLiveSession,
        personalRecords,
        exportDataJson,
        importDataJson,
        resetAllData,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
