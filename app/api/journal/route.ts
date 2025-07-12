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
    const { userId, promptId, answer } = body;

    // 必須パラメータのチェック
    if (!userId || !promptId || !answer) {
      return NextResponse.json(
        { error: "userId, promptId, answerは必須です" },
        { status: 400, headers: corsHeaders }
      );
    }

    // プロンプトの内容を取得（コードからプロンプトのテキストを取得）
    let promptText = "";
    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .select("prompt")
      .eq("code", promptId)
      .single();

    if (promptError) {
      // プロンプトテーブルがない場合は、utils.tsからプロンプトを取得する実装も可能
      // ここでは、直接APIのリクエストのみで処理を行う
      return NextResponse.json(
        { error: "プロンプトの取得に失敗しました", details: promptError },
        { status: 500, headers: corsHeaders }
      );
    }

    promptText = promptData?.prompt || "";

    // journal_entriesテーブルに記録
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: userId,
        prompt_id: promptId, // promptIdをそのまま保存
        prompt: promptText, // プロンプトのテキスト
        content: answer,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "ジャーナルの保存に失敗しました", details: error },
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
    { message: "ジャーナリングAPI" },
    { status: 200, headers: corsHeaders }
  );
};
