import { Database } from "@/db/types";

export type InsertTeam = Database["public"]["Tables"]["teams"]["Insert"];

export type UpdateTeam = Database["public"]["Tables"]["teams"]["Update"];