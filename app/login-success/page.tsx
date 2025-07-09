"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginSuccessPage() {
  const router = useRouter();
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

  const handleSignOut = async () => {
    try {
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
      } else {
        const data = await response.json();
        console.log("サインアウト成功:", data);
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
    } catch (err) {
      console.error("サインアウト処理中に例外が発生しました:", err);
    } finally {
      // エラーがあってもなくてもホームページにリダイレクト
      router.push("/");
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  // Don't render until component has mounted
  if (!mounted) {
    return null;
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <h2>ログインが成功しました</h2>
      {user && <p>ようこそ！{user.email}</p>}

      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleBackToHome}
          style={{
            padding: "8px 16px",
            marginRight: 8,
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          ホームに戻る
        </button>

        <button
          onClick={handleSignOut}
          style={{
            padding: "8px 16px",
            background: "#ff4d4f",
            border: "none",
            color: "white",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          サインアウト
        </button>
      </div>
    </div>
  );
}
