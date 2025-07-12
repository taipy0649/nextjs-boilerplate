// ストレス管理アプリの型定義

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: number; // 1-5の範囲
  stress_level: number; // 1-10の範囲
  memo?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  prompt: string;
  content: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  record_frequency: "once" | "multiple";
  reminder_enabled: boolean;
  reminder_time?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalPrompt {
  code: string;
  prompt: string;
}

// UI関連の型
export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type StressLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
  color: string;
}

export interface ChartData {
  date: string;
  stress_level: number;
  mood_level: number;
}

export type ViewPeriod = "day" | "week" | "month";
