// 外部API呼び出し用のヘルパー関数

const BASE_API_URL =
  "https://karaoke-api-prod-ergnfybtg4gbgbea.japanwest-01.azurewebsites.net";

interface ApiResponse {
  status: string;
  message: string;
  data: any;
}

interface ApiError extends Error {
  status?: number;
  details?: any;
}

// 共通のAPI呼び出し関数
const callExternalApi = async (
  endpoint: string,
  data: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      const error = new Error(
        `API呼び出しに失敗しました: ${result.message || response.statusText}`
      ) as ApiError;
      error.status = response.status;
      error.details = result;
      throw error;
    }

    return result;
  } catch (error) {
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
  return callExternalApi("/api/mood/entry", {
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
  return callExternalApi("/api/journal/entry", {
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
  if (error instanceof Error) {
    const apiError = error as ApiError;
    if (apiError.details?.message) {
      return apiError.details.message;
    }
    return error.message;
  }
  return defaultMessage;
};
