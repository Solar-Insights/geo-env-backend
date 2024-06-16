import { randomUUID } from "crypto";
import { SupabaseUser } from "../users/types";

export function generateRandomUuid() {
    return randomUUID();
}

export function sameUsers(user1: SupabaseUser, user2: SupabaseUser) {
    return user1.auth0_id === user2.auth0_id && user1.email === user2.email;
}