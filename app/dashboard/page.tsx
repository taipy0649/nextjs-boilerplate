"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, TrendingUp, BookOpen } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { getLatestMoodEntry, getTodayMoodEntries } from "../../lib/database";
import { MOOD_OPTIONS, formatTime, getStressLevelColor } from "../../lib/utils";
import { supabase } from "../../lib/supabaseClient";
import type { MoodEntry } from "../../lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [latestEntry, setLatestEntry] = useState<MoodEntry | null>(null);
  const [todayEntries, setTodayEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.push("/login");
        return;
      }
      setUser(data.session.user);

      // データを取得
      const [latestResult, todayResult] = await Promise.all([
        getLatestMoodEntry(),
        getTodayMoodEntries(),
      ]);

      if (latestResult.data) setLatestEntry(latestResult.data);
      if (todayResult.data) setTodayEntries(todayResult.data);

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (!mounted || loading) {
    return (
      <AppLayout title="ホーム">
        <div className="text-center py-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </AppLayout>
    );
  }

  // 今日の平均ストレスレベルを計算
  const todayAvgStress =
    todayEntries.length > 0
      ? Math.round(
          todayEntries.reduce((sum, entry) => sum + entry.stress_level, 0) /
            todayEntries.length
        )
      : null;

  // 最新の気分を取得
  const latestMood = latestEntry
    ? MOOD_OPTIONS.find((option) => option.level === latestEntry.mood_level)
    : null;

  return (
    <AppLayout title="ホーム">
      <div className="space-y-6">
        {/* ウェルカムメッセージ */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            こんにちは！
          </h2>
          <p className="text-gray-600 text-sm">
            今日も一日お疲れさまです。気分はいかがですか？
          </p>
        </div>

        {/* 今日の概況 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">今日の状況</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* 最新の気分 */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">最新の気分</div>
              {latestMood ? (
                <>
                  <div className="text-3xl mb-1">{latestMood.emoji}</div>
                  <div className="text-xs text-gray-600">
                    {latestMood.label}
                  </div>
                  {latestEntry && (
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTime(latestEntry.created_at)}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-400">記録なし</div>
              )}
            </div>

            {/* 平均ストレスレベル */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">平均ストレス</div>
              {todayAvgStress ? (
                <>
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      backgroundColor: getStressLevelColor(todayAvgStress),
                    }}
                  >
                    {todayAvgStress}
                  </div>
                  <div className="text-xs text-gray-600">
                    レベル {todayAvgStress}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-400">記録なし</div>
              )}
            </div>
          </div>

          {/* 今日の記録数 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xs text-gray-500">今日の記録数</div>
              <div className="text-lg font-semibold text-gray-900">
                {todayEntries.length}回
              </div>
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">
            クイックアクション
          </h3>

          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/record"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-medium">今の気分を記録</div>
                <div className="text-sm opacity-90">
                  気分とストレスレベルを記録しましょう
                </div>
              </div>
              <Plus size={24} />
            </Link>

            <Link
              href="/analytics"
              className="bg-white border border-gray-200 hover:border-gray-300 text-gray-900 rounded-lg p-4 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-medium">記録を分析</div>
                <div className="text-sm text-gray-600">
                  これまでの記録を確認しましょう
                </div>
              </div>
              <TrendingUp size={24} />
            </Link>

            <Link
              href="/journal"
              className="bg-white border border-gray-200 hover:border-gray-300 text-gray-900 rounded-lg p-4 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-medium">ジャーナリング</div>
                <div className="text-sm text-gray-600">
                  ポジティブな思考を書き留めましょう
                </div>
              </div>
              <BookOpen size={24} />
            </Link>
          </div>
        </div>

        {/* 最新のメモ */}
        {latestEntry?.memo && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              最新のメモ
            </h3>
            <p className="text-sm text-gray-600">{latestEntry.memo}</p>
            <div className="text-xs text-gray-400 mt-2">
              {formatTime(latestEntry.created_at)}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
