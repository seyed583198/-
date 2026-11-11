/**
 * Accurate Gregorian to Jalali (Solar Hijri / Shamsi) Calendar converter
 */

export const JALALI_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const JALALI_WEEK_DAYS = [
  'ش', // شنبه
  'ی', // یکشنبه
  'د', // دوشنبه
  'س', // سه‌شنبه
  'چ', // چهارشنبه
  'پ', // پنج‌شنبه
  'ج', // جمعه
];

export const JALALI_WEEK_DAYS_FULL = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];

  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return { jy, jm, jd };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  let sal_a = [0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336];
  let jy2 = jy + 1595;
  let days = -355668 + 365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let gd_m = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 13 && days >= gd_m[gm]) {
    days -= gd_m[gm];
    gm++;
  }

  return { gy, gm, gd: days + 1 };
}

export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let jp = breaks[0];
  let jm: number;
  let jump: number;
  let n: number;

  if (jy < jp || jy >= breaks[breaks.length - 1]) return false;

  for (let i = 1; i < breaks.length; i++) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) {
      n = jy - jp;
      break;
    }
    jp = jm;
  }
  return ((n! + 1) % 33) % 4 === 1;
}

export function getDaysInJalaliMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

export function getCurrentJalali(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function formatJalaliDate(jDate: JalaliDate): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${jDate.jy}/${pad(jDate.jm)}/${pad(jDate.jd)}`;
}

export function formatJalaliLong(jDate: JalaliDate): string {
  return `${jDate.jd} ${JALALI_MONTH_NAMES[jDate.jm - 1]} ${jDate.jy}`;
}

export function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/[0-9]/g, (w) => farsiDigits[+w]);
}

/**
 * Returns Gregorian weekday of the 1st of a given Jalali month.
 * Persian week starts on Saturday (شنبه = index 0).
 */
export function getJalaliMonthFirstDayOfWeek(jy: number, jm: number): number {
  const { gy, gm, gd } = jalaliToGregorian(jy, jm, 1);
  const gDate = new Date(gy, gm - 1, gd);
  const gDay = gDate.getDay(); // 0 is Sunday, 6 is Saturday
  // Saturday in Persian is 0:
  // Saturday(6) -> 0
  // Sunday(0) -> 1
  // Monday(1) -> 2
  // Tuesday(2) -> 3
  // Wednesday(3) -> 4
  // Thursday(4) -> 5
  // Friday(5) -> 6
  return (gDay + 1) % 7;
}
