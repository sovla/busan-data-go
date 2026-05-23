export type UserProfile = {
  version: 1;
  isPregnant: boolean;
  pregnancyWeek?: number;
  estimatedBirthDate?: string;
  district?: string;
  childrenCount?: number;
  updatedAt: string;
};

const STORAGE_KEY = "whabatna_user_profile";

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Partial<UserProfile>): void {
  if (typeof window === "undefined") return;
  const existing = loadProfile();
  const next: UserProfile = {
    version: 1,
    isPregnant: false,
    updatedAt: new Date().toISOString(),
    ...existing,
    ...profile,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function calcDDay(estimatedBirthDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = new Date(estimatedBirthDate);
  birth.setHours(0, 0, 0, 0);
  return Math.round((birth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function calcEstimatedBirthDate(pregnancyWeek: number): string {
  const totalDays = (40 - pregnancyWeek) * 7;
  const date = new Date();
  date.setDate(date.getDate() + totalDays);
  return date.toISOString().split("T")[0];
}
