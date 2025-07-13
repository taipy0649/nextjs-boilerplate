import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../../../lib/cors";

const EXTERNAL_API_BASE =
  "https://karaoke-api-prod-ergnfybtg4gbgbea.japanwest-01.azurewebsites.net";

export const GET = async (req: NextRequest) => {
  try {
    console.log("外部API接続テスト開始");

    // 外部APIのヘルスチェック
    const response = await fetch(`${EXTERNAL_API_BASE}/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("外部API接続テスト結果:", response.status);

    const result = response.ok
      ? { status: "ok", message: "外部APIに正常に接続できました" }
      : { status: "error", message: "外部APIに接続できません" };

    return NextResponse.json(result, {
      status: response.ok ? 200 : 503,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("外部API接続テストエラー:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "外部APIに接続できません",
        data: { details: error.message },
      },
      { status: 503, headers: corsHeaders }
    );
  }
};
