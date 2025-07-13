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
    const { userId, moodId, stressLevel } = body;

    // 必須パラメータのチェック
    if (!userId || !moodId || stressLevel === undefined) {
      return NextResponse.json(
        { status: "error", message: "userId, moodId, stressLevelは必須です" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("外部API呼び出し (気分記録):", body);

    // 外部APIに転送
    const response = await fetch(`${EXTERNAL_API_BASE}/api/mood/entry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        moodId,
        stressLevel,
      }),
    });

    const result = await response.json();

    console.log("外部API応答 (気分記録):", result);

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
    console.error("気分記録APIプロキシエラー:", error);
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
    { message: "気分記録API プロキシ" },
    { status: 200, headers: corsHeaders }
  );
};
