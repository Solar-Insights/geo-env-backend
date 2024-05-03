import { supabase } from "@/db/init";
import { InsertTeam, UpdateTeam } from "@/db/teams/types";

export async function selectTeamById(id: number) {
    const { data, error } = await supabase
        .from('teams')
        .select()
        .eq("id", id);
}

export async function createTeam(team: InsertTeam) {
    const { error } = await supabase
        .from('teams')
        .insert(team);
}

export async function updateTeamById(team: UpdateTeam, id: number) {
    const { error } = await supabase
        .from('teams')
        .update(team)
        .eq("id", id);
}

export async function deleteTeamById(id: number) {
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq("id", id);
}
