// 外部API呼び出し用のヘルパー関数

interface ApiResponse {
  status: string;
  message: string;
  data: any;
}

interface ApiError extends Error {
  status?: number;
  details?: any;
}

// 共通のAPI呼び出し関数（Next.jsのAPIルート経由）
const callInternalApi = async (
  endpoint: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    console.log(`API呼び出し開始: /api${endpoint}`, data);

    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(`API応答ステータス: ${response.status}`);

    // レスポンスのContent-Typeをチェック
    const contentType = response.headers.get("content-type");
    let result: any;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      // JSONでない場合のフォールバック
      const text = await response.text();
      result = { status: "error", message: text, data: null };
    }

    console.log("API応答データ:", result);

    if (!response.ok) {
      const error = new Error(
        `API呼び出しに失敗しました (${response.status}): ${
          result.message || response.statusText
        }`
      ) as ApiError;
      error.status = response.status;
      error.details = result;
      throw error;
    }

    return result;
  } catch (error) {
    console.error("API呼び出しエラー:", error);

    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      // ネットワークエラー
      const networkError = new Error(
        "ネットワークエラーまたはサーバーに接続できません。インターネット接続を確認してください。"
      ) as ApiError;
      networkError.status = 0;
      networkError.details = { originalError: error.message };
      throw networkError;
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("予期しないエラーが発生しました");
  }
};

// 気分記録API呼び出し
export const saveMoodEntry = async (
  userId: string,
  moodId: string,
  stressLevel: number
): Promise<ApiResponse> => {
  return callInternalApi("/external/mood", {
    userId,
    moodId,
    stressLevel,
  });
};

// ジャーナル記録API呼び出し
export const saveJournalEntry = async (
  userId: string,
  promptId: string,
  answer: string
): Promise<ApiResponse> => {
  return callInternalApi("/external/journal", {
    userId,
    promptId,
    answer,
  });
};

// エラーハンドリング用のヘルパー関数
export const handleApiError = (
  error: unknown,
  defaultMessage: string
): string => {
  console.error("エラーハンドリング:", error);

  if (error instanceof Error) {
    const apiError = error as ApiError;

    // ネットワークエラーの場合
    if (apiError.status === 0) {
      return apiError.message;
    }

    // APIエラーレスポンスがある場合
    if (apiError.details?.message) {
      return `${apiError.details.message} (ステータス: ${
        apiError.status || "不明"
      })`;
    }

    // 一般的なエラーメッセージ
    if (apiError.message) {
      return apiError.message;
    }
  }

  return defaultMessage;
};

// 接続テスト用の関数
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/external/health", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("接続テスト結果:", response.status);
    return response.ok;
  } catch (error) {
    console.error("接続テストエラー:", error);
    return false;
  }
};
