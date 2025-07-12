"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentAction, setCurrentAction] = useState<"login" | "signup" | null>(
    null
  );
  const [user, setUser] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Only render the component after it has mounted on the client
  useEffect(() => {
    setMounted(true);

    // Check if already logged in
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setCurrentAction("login");

      // APIルート経由でサインアウト（CORS対応）
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("サインアウトAPIエラー:", errorData);
      }

      // クライアントサイドでもサインアウト処理を実行
      try {
        await supabase.auth.signOut();
      } catch (supabaseError) {
        console.log("Supabase client signout handled server-side");
      }

      // ブラウザストレージもクリア
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      // ユーザー状態をクリア
      setUser(null);
    } catch (err) {
      console.error("サインアウト処理中に例外が発生しました:", err);
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };

  // Don't render anything until component has mounted on the client
  if (!mounted) {
    return null;
  }

  // セッション確認中の場合は読み込み表示
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // ユーザーがログイン済みの場合
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">MindCare</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ログイン済み
          </h2>
          <p className="text-gray-600 mb-6">ようこそ、{user.email}さん！</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              ダッシュボードへ
            </button>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full border-2 border-red-300 text-red-600 py-3 px-6 rounded-lg font-medium hover:border-red-400 disabled:opacity-50 transition-colors"
            >
              {loading ? "ログアウト中..." : "ログアウト"}
            </button>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">MindCare</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isSignUpMode ? "新規登録" : "ログイン"}
          </h2>
          <p className="text-gray-600">
            {isSignUpMode
              ? "心の健康管理を始めて、より良い毎日を送りませんか？"
              : "アカウントにログインしてください"}
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ color: "black" }}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ color: "black" }}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isSignUpMode ? (
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError("");
                setCurrentAction("signup");

                try {
                  const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                  });

                  if (error) {
                    setError(error.message);
                  } else {
                    if (data.user && !data.user.email_confirmed_at) {
                      alert(
                        "登録確認メールを送信しました。メールを確認してアカウントを有効化してください。"
                      );
                    } else {
                      setUser(data.user);
                    }
                  }
                } catch (err) {
                  setError("新規登録処理中にエラーが発生しました。");
                  console.error(err);
                } finally {
                  setLoading(false);
                  setCurrentAction(null);
                }
              }}
              disabled={loading || !email || !password}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading && currentAction === "signup" ? "登録中..." : "新規登録"}
            </button>
          ) : (
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError("");
                setCurrentAction("login");

                try {
                  const { error, data } =
                    await supabase.auth.signInWithPassword({
                      email,
                      password,
                    });

                  if (error) {
                    setError(error.message);
                  } else {
                    setUser(data.user);
                    router.push("/dashboard");
                  }
                } catch (err) {
                  setError("ログイン処理中にエラーが発生しました。");
                  console.error(err);
                } finally {
                  setLoading(false);
                  setCurrentAction(null);
                }
              }}
              disabled={loading || !email || !password}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading && currentAction === "login"
                ? "ログイン中..."
                : "ログイン"}
            </button>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              {isSignUpMode
                ? "すでにアカウントをお持ちの方"
                : "アカウントをお持ちでない方"}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setError("");
              }}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-gray-400 transition-colors"
            >
              {isSignUpMode ? "ログイン" : "新規登録"}
            </button>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ホームに戻る
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
