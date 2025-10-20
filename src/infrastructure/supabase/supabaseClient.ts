import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Supabase configuration constants
const SUPABASE_URL = "https://wgwadotsgwhhqdgkcqbs.supabase.co";
const SUPABASE_KEY = "sb_publishable_tiT7Rpm43GGpViJNDBxq4g_s0pnD3cW";

// Create and export a Supabase client instance
export const supabase = createClient<Database>( SUPABASE_URL, SUPABASE_KEY );