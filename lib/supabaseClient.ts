// Supabaseクライアントの初期化
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "./cors";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// カスタムfetchを定義してCORSヘッダーを含める
const customFetch = (url: RequestInfo | URL, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...corsHeaders,
    },
  });
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== "undefined", // Only persist sessions in browser environments
    autoRefreshToken: typeof window !== "undefined",
    detectSessionInUrl: typeof window !== "undefined",
  },
  global: {
    fetch: customFetch,
  },
});
