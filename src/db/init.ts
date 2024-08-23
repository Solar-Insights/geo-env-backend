import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "@/server/utils/env";
import { Database } from "@/db/utils/types";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
