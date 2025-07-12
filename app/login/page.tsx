"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Only render the component after it has mounted on the client
  useEffect(() => {
    setMounted(true);

    // Check if already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Handle sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          // Show success message and switch to login mode
          alert(
            "登録確認メールを送信しました。メールを確認してアカウントを有効化してください。"
          );
          setIsSignUp(false);
        }
      } else {
        // Handle sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("ログイン処理中にエラーが発生しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until component has mounted on the client
  if (!mounted) {
    return null;
  }

  // Don't render anything until component has mounted on the client
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
      }}
    >
      <h2>{isSignUp ? "新規登録" : "ログイン"}</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            background: isSignUp ? "#4caf50" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          {loading ? "処理中..." : isSignUp ? "アカウント登録" : "ログイン"}
        </button>

        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignUp ? "ログインへ戻る" : "新規登録はこちら"}
          </button>
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link
            href="/"
            style={{ color: "#666", textDecoration: "none", fontSize: "0.9em" }}
          >
            ホームに戻る
          </Link>
        </div>
      </form>
    </div>
  );
}
