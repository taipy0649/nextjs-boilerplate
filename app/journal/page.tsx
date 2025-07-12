"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, RefreshCw } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { createJournalEntry } from "../../lib/database";
import { getRandomPrompt } from "../../lib/utils";
import { supabase } from "../../lib/supabaseClient";

export default function JournalPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
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
    };

    checkAuth();
    setPrompt(getRandomPrompt());
  }, [router]);

  const handleNewPrompt = () => {
    setPrompt(getRandomPrompt());
    setContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("内容を入力してください");
      return;
    }

    setLoading(true);

    try {
      const { error } = await createJournalEntry(prompt, content);

      if (error) {
        console.error("ジャーナル保存エラー:", error);
        alert("ジャーナルの保存に失敗しました");
      } else {
        alert("ジャーナルを保存しました！");
        setContent("");
        setPrompt(getRandomPrompt());
      }
    } catch (err) {
      console.error("ジャーナル処理中にエラーが発生しました:", err);
      alert("ジャーナルの保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <AppLayout title="ジャーナリング">
        <div className="text-center py-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </AppLayout>
    );
  }

  const isFormValid = content.trim().length > 0;

  return (
    <AppLayout title="ジャーナリング">
      <div className="space-y-6">
        {/* 説明 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            ポジティブジャーナリングは、感謝や喜びにフォーカスすることで、
            心の健康をサポートします。質問に答えて、今日の良いことを書き留めてみましょう。
          </p>
        </div>

        {/* プロンプト表示 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex-1">
              今日の質問
            </h3>
            <button
              type="button"
              onClick={handleNewPrompt}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="別の質問に変更"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 font-medium">{prompt}</p>
          </div>
        </div>

        {/* 回答入力 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              あなたの回答
            </h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ここに思ったことを自由に書いてみてください..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ color: "black" }}
              rows={8}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-xs text-gray-400">{content.length}/500</div>
              <div className="text-xs text-gray-500">
                心に浮かんだことを素直に書いてみましょう
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              isFormValid && !loading
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {loading ? "保存中..." : "ジャーナルを保存"}
          </button>
        </form>

        {/* ヒント */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">
            💡 ジャーナリングのコツ
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 正解はありません。思ったままを書いてみましょう</li>
            <li>• 小さなことでも大丈夫です</li>
            <li>• 続けることで、ポジティブな思考の習慣が身につきます</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
