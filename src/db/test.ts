/*
    - Run using:
    npx tsx src/db/test.ts
*/ 
import { supabase } from "@/db/init";

await supabase
    .from('teams')
    .select()
    .then((data) => {
        console.log(data);
    })