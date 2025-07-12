import type { MoodOption, MoodLevel, JournalPrompt } from "./types";

// 気分レベルの選択肢
export const MOOD_OPTIONS: MoodOption[] = [
  { level: 1, emoji: "😢", label: "とても悪い", color: "#ef4444" },
  { level: 2, emoji: "😟", label: "悪い", color: "#f97316" },
  { level: 3, emoji: "😐", label: "ふつう", color: "#eab308" },
  { level: 4, emoji: "😊", label: "良い", color: "#22c55e" },
  { level: 5, emoji: "😄", label: "とても良い", color: "#10b981" },
];

// ストレスレベルの色を取得
export const getStressLevelColor = (level: number): string => {
  if (level <= 3) return "#10b981"; // 緑
  if (level <= 6) return "#eab308"; // 黄
  if (level <= 8) return "#f97316"; // オレンジ
  return "#ef4444"; // 赤
};

// 日付フォーマット関数
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 今日の日付を取得
export const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

// 期間の開始日を計算
export const getStartDate = (period: "day" | "week" | "month"): Date => {
  const today = new Date();
  const startDate = new Date(today);

  switch (period) {
    case "day":
      return startDate;
    case "week":
      startDate.setDate(today.getDate() - 7);
      return startDate;
    case "month":
      startDate.setMonth(today.getMonth() - 1);
      return startDate;
    default:
      return startDate;
  }
};

// ジャーナリングのプロンプト
export const JOURNAL_PROMPTS: JournalPrompt[] = [
  { code: "gratitude", prompt: "今日感謝したいことは何ですか？" },
  { code: "success", prompt: "今日うまくいったことを教えてください" },
  { code: "support", prompt: "あなたを支えてくれる人について書いてください" },
  { code: "learning", prompt: "今日学んだことは何ですか？" },
  { code: "tomorrow", prompt: "明日楽しみにしていることは何ですか？" },
  { code: "strength", prompt: "あなたの強みを一つ教えてください" },
  { code: "smile", prompt: "今日笑顔になった瞬間はありましたか？" },
  { code: "goal", prompt: "今週達成したい小さな目標は何ですか？" },
];

// ランダムなプロンプトを取得
export const getRandomPrompt = (): string => {
  const randomPrompt =
    JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
  return randomPrompt.prompt;
};

// プロンプトをコードで取得
export const getPromptByCode = (code: string): string => {
  const promptObj = JOURNAL_PROMPTS.find((p) => p.code === code);
  return promptObj ? promptObj.prompt : JOURNAL_PROMPTS[0].prompt;
};
