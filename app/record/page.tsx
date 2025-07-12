"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import MoodSelector from "../../components/MoodSelector";
import StressSlider from "../../components/StressSlider";
import { createMoodEntry } from "../../lib/database";
import { supabase } from "../../lib/supabaseClient";
import type { MoodLevel, StressLevel } from "../../lib/types";

export default function RecordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [mood, setMood] = useState<MoodLevel | null>(3); // デフォルト値：真ん中（ふつう）
  const [stress, setStress] = useState<StressLevel | null>(5); // デフォルト値：5
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.push("/login");
        return;
      }
      setUserId(data.session.user.id);
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mood || !stress) {
      alert("気分とストレスレベルを選択してください");
      return;
    }

    if (!userId) {
      alert("ユーザー情報が取得できませんでした");
      return;
    }

    setLoading(true);

    try {
      // APIを使用して気分を保存
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          moodId: mood,
          stressLevel: stress,
          memo: memo || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("記録エラー:", result.error);
        alert(`記録の保存に失敗しました: ${result.error}`);
      } else {
        alert("記録を保存しました！");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("記録処理中にエラーが発生しました:", err);
      alert("記録の保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <AppLayout title="記録入力">
        <div className="text-center py-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="記録入力">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 気分選択 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        {/* ストレスレベル選択 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <StressSlider value={stress} onChange={setStress} />
        </div>

        {/* メモ入力 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            メモ（任意）
          </h3>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="今の状況や感情について書いてみましょう..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ color: "black" }}
            rows={4}
            maxLength={200}
          />
          <div className="text-right text-xs text-gray-400 mt-2">
            {memo.length}/200
          </div>
        </div>

        {/* 保存ボタン */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            !loading
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={20} />
          )}
          {loading ? "保存中..." : "記録を保存"}
        </button>
      </form>
    </AppLayout>
  );
}
