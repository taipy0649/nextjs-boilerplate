import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../../../lib/cors";

const EXTERNAL_API_BASE =
  "https://karaoke-api-prod-ergnfybtg4gbgbea.japanwest-01.azurewebsites.net";

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
        { status: "error", message: "userId, promptId, answerは必須です" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("外部API呼び出し (ジャーナル記録):", body);

    // 外部APIに転送
    const response = await fetch(`${EXTERNAL_API_BASE}/api/journal/entry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        promptId,
        answer,
      }),
    });

    const result = await response.json();

    console.log("外部API応答 (ジャーナル記録):", result);

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: result.message || "外部APIでエラーが発生しました",
          data: result.data,
        },
        { status: response.status, headers: corsHeaders }
      );
    }

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("ジャーナル記録APIプロキシエラー:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "サーバーエラーが発生しました",
        data: { details: error.message },
      },
      { status: 500, headers: corsHeaders }
    );
  }
};

export const GET = async () => {
  return NextResponse.json(
    { message: "ジャーナル記録API プロキシ" },
    { status: 200, headers: corsHeaders }
  );
};
