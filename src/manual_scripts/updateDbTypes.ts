/*
    npx tsx src/manual_scripts/updateDbTypes.ts
*/

import { exec } from "node:child_process";

const COMMAND = `npx supabase gen types typescript --project-id "ypapaxzpkbwjevhpokfj" --schema public > ./src/db/utils/types.ts`;

exec(COMMAND);
