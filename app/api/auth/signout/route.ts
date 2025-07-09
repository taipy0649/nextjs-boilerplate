import { corsHeaders } from "../../../../lib/cors";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function OPTIONS() {
  return new NextResponse("ok", { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Cookie情報を取得
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("supabase-auth-token")?.value;

    // サーバーサイドでSupabaseクライアントを初期化
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // アクセストークンがある場合はセッションを設定してからサインアウト
    if (accessToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: "",
      });
    }

    // サーバーサイドでサインアウト
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Server-side signout error:", error);
      return NextResponse.json(
        { error: error.message },
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully signed out" },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Server-side signout exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}
