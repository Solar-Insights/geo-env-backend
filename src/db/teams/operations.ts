import { supabase } from "@/db/init";
import { InsertTeam, UpdateTeam } from "@/db/teams/types";
import { OperationValidator } from "@/db/operationValidator"; 

export async function getTeamById(id: string) {
    const { data, error } = await supabase
        .from('teams')
        .select()
        .eq("id", id);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return { data, error };
}

export async function createTeam(team: InsertTeam) {
    const { data, error } = await supabase
        .from('teams')
        .insert(team);

    new OperationValidator(data, error).validateCreateRequest();

    return { data, error };
}

export async function updateTeamById(team: UpdateTeam, id: string) {
    const { data, error } = await supabase
        .from('teams')
        .update(team)
        .eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();

    return { data, error };
}

export async function deleteTeamById(id: string) {
    const { data, error } = await supabase
        .from('teams')
        .delete()
        .eq("id", id);

    new OperationValidator(data, error).validateDeleteRequest();

    return { data, error };
}
