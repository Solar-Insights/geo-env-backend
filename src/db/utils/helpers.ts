import { randomUUID } from "crypto";
import { SupabaseUser } from "../users/types";

export function generateRandomUuid() {
    return randomUUID();
}
