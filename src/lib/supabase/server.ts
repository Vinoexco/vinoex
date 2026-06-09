import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      `Missing Supabase env. URL=${url ? "present" : "missing"} KEY=${key ? "present" : "missing"}`
    );
  }

  return createClient<Database>(url, key);
}