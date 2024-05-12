/* 
    - Update tables definition / attributes:
    I suggest you do it manually on the supabase table editor, then update your types using the below command. You will need to update your db calls.

    - Generate types with:
    npx supabase gen types typescript --project-id "PROJECT_ID" --schema public > ./src/db/types.ts
*/

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "@/config";
import { Database } from "@/db/types";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
