import { supabase } from "./supabaseClient";
import type { MoodEntry, JournalEntry, UserSettings } from "./types";

// 気分記録の作成
export const createMoodEntry = async (
  mood_level: number,
  stress_level: number,
  memo?: string
): Promise<{ data: MoodEntry | null; error: any }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  const { data, error } = await supabase
    .from("mood_entries")
    .insert({
      user_id: user.id,
      mood_level,
      stress_level,
      memo,
    })
    .select()
    .single();

  return { data, error };
};

// 気分記録の取得
export const getMoodEntries = async (
  startDate?: Date,
  endDate?: Date
): Promise<{ data: MoodEntry[] | null; error: any }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  let query = supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (startDate) {
    query = query.gte("created_at", startDate.toISOString());
  }

  if (endDate) {
    query = query.lte("created_at", endDate.toISOString());
  }

  const { data, error } = await query;
  return { data, error };
};

// 最新の気分記録を取得
export const getLatestMoodEntry = async (): Promise<{
  data: MoodEntry | null;
  error: any;
}> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

// 今日の気分記録を取得
export const getTodayMoodEntries = async (): Promise<{
  data: MoodEntry[] | null;
  error: any;
}> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", startOfDay.toISOString())
    .lt("created_at", endOfDay.toISOString())
    .order("created_at", { ascending: false });

  return { data, error };
};

// ジャーナル記録の作成
export const createJournalEntry = async (
  prompt: string,
  content: string
): Promise<{ data: JournalEntry | null; error: any }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      prompt,
      content,
    })
    .select()
    .single();

  return { data, error };
};

// ジャーナル記録の取得
export const getJournalEntries = async (): Promise<{
  data: JournalEntry[] | null;
  error: any;
}> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { data, error };
};

// ユーザー設定の取得
export const getUserSettings = async (): Promise<{
  data: UserSettings | null;
  error: any;
}> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return { data, error };
};

// ユーザー設定の作成・更新
export const upsertUserSettings = async (
  settings: Partial<UserSettings>
): Promise<{ data: UserSettings | null; error: any }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "ユーザーが認証されていません" } };
  }

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      ...settings,
    })
    .select()
    .single();

  return { data, error };
};
