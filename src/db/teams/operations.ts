import { supabase } from "@/db/init";
import { InsertTeam, UpdateTeam } from "@/db/teams/types";

export async function getTeamById(id: string) {
    const { data, error } = await supabase
        .from('teams')
        .select()
        .eq("id", id);

    return { data, error };
}

export async function createTeam(team: InsertTeam) {
    const { data, error } = await supabase
        .from('teams')
        .insert(team);

    return { data, error };
}

export async function updateTeamById(team: UpdateTeam, id: string) {
    const { data, error } = await supabase
        .from('teams')
        .update(team)
        .eq("id", id);

    return { data, error };
}

export async function deleteTeamById(id: string) {
    const { data, error } = await supabase
        .from('teams')
        .delete()
        .eq("id", id);

    return { data, error };
}
