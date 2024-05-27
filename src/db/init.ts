/* 
    - Update tables definition / attributes:
    npx supabase gen types typescript --project-id "ypapaxzpkbwjevhpokfj" --schema public > ./src/db/types.ts
*/

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "@/config";
import { Database } from "@/db/types";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
