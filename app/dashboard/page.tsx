"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { getLatestMoodEntry } from "../../lib/database";
import { MOOD_OPTIONS, formatTime, getStressLevelColor } from "../../lib/utils";
import { supabase } from "../../lib/supabaseClient";
import type { MoodEntry } from "../../lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [latestEntry, setLatestEntry] = useState<MoodEntry | null>(null);
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

      // 最新のデータを取得
      const latestResult = await getLatestMoodEntry();
      if (latestResult.data) setLatestEntry(latestResult.data);

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

        {/* 最新の記録 */}
        {latestEntry && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              最新の記録
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl mb-1">{latestMood?.emoji}</div>
                <div className="text-sm text-gray-600">{latestMood?.label}</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: getStressLevelColor(
                      latestEntry.stress_level
                    ),
                  }}
                >
                  {latestEntry.stress_level}
                </div>
                <div className="text-sm text-gray-600">ストレス</div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-3">
              {formatTime(latestEntry.created_at)}
            </div>
          </div>
        )}

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
