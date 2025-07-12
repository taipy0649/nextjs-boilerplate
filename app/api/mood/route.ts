import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { corsHeaders } from "../../../lib/cors";

export const POST = async (req: NextRequest) => {
  // CORS対応
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const { userId, moodId, stressLevel, memo } = body;

    // 必須パラメータのチェック
    if (!userId || !moodId || stressLevel === undefined) {
      return NextResponse.json(
        { error: "userId, moodId, stressLevelは必須です" },
        { status: 400, headers: corsHeaders }
      );
    }

    // mood_entriesテーブルに記録
    const { data, error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: userId,
        mood_level: moodId,
        stress_level: stressLevel,
        memo: memo || null, // メモはオプション
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "気分の記録に失敗しました", details: error },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("APIエラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
};

// GETリクエストは現在使用しないため、シンプルなレスポンスを返す
export const GET = async () => {
  return NextResponse.json(
    { message: "気分記録API" },
    { status: 200, headers: corsHeaders }
  );
};
