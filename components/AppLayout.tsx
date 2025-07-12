"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import { supabase } from "../lib/supabaseClient";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);

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

      // ログインページにリダイレクト
      router.push("/login");
    } catch (err) {
      console.error("サインアウト処理中に例外が発生しました:", err);
      // エラーが発生してもログインページにリダイレクト
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {title && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="ログアウト"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
      )}

      <main className="max-w-md mx-auto px-4 py-6 pb-24">{children}</main>

      <BottomNavigation />
    </div>
  );
}
