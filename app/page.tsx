"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Heart,
  TrendingUp,
  BarChart3,
  BookOpen,
  Shield,
  Sparkles,
  BarChart,
  Activity,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoading(false);
    };

    checkSession();
  }, []);

  // ログイン済みの場合はダッシュボードにリダイレクト
  if (mounted && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">ログイン済みです</p>
          <Link href="/dashboard">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              ダッシュボードへ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">MindCare</span>
            </div>
            <Link href="/login">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                ログイン
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* メインセクション */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ヒーローセクション */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">MindCare</h1>
          </div>
          <p className="text-xl text-gray-600 mb-12">
            あなたの心の健康をサポートするストレス管理アプリ
          </p>
        </div>

        {/* 機能紹介 */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              気分を記録
            </h3>
            <p className="text-gray-600">
              日々の気分とストレスレベルを簡単に記録。感情の変化を可視化します。
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              データ分析
            </h3>
            <p className="text-gray-600">
              グラフやカレンダーで過去のデータを分析。ストレスパターンを理解できます。
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ポジティブジャーナル
            </h3>
            <p className="text-gray-600">
              感謝や喜びを記録するジャーナリング機能で、前向きな気持ちを育みます。
            </p>
          </div>
        </div>

        {/* なぜMindCareを選ぶのか */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            なぜMindCareを選ぶのか？
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  シンプルで使いやすい
                </h3>
                <p className="text-gray-600">
                  直感的なインターフェースで、毎日続けやすい設計になっています。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  プライバシー保護
                </h3>
                <p className="text-gray-600">
                  あなたの大切なデータは安全に暗号化され、プライバシーが守られます。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  科学的アプローチ
                </h3>
                <p className="text-gray-600">
                  心理学に基づいたポジティブジャーナリングで、メンタルヘルスをサポート。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <BarChart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  詳細な分析
                </h3>
                <p className="text-gray-600">
                  グラフやカレンダーで自分の感情パターンを深く理解できます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA セクション */}
        <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            今すぐ始めましょう
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            心の健康管理を始めて、より良い毎日を送りませんか？
          </p>
          <div className="space-y-4">
            <Link href="/login">
              <button className="w-full max-w-md bg-blue-500 text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors">
                新規登録
              </button>
            </Link>
            <p className="text-gray-500">すでにアカウントをお持ちの方</p>
            <Link href="/login">
              <button className="w-full max-w-md border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-lg text-lg font-medium hover:border-gray-400 transition-colors">
                ログイン
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2024 MindCare. あなたの心の健康をサポートします。
          </p>
        </div>
      </footer>
    </div>
  );
}
