import { supabase } from "@/db/init";
import { InsertOrganization, UpdateOrganization } from "@/db/organizations/types";
import { OperationValidator } from "@/db/utils/validator";

export async function getOrganizationById(id: string) {
    const { data, error } = await supabase.from("organizations").select().eq("id", id);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function createOrganization(organization: InsertOrganization) {
    const { data, error } = await supabase.from("organizations").insert(organization).select();

    new OperationValidator(data, error).validateCreateRequest();

    return data![0];
}

export async function updateOrganizationById(organization: UpdateOrganization, id: string) {
    const { data, error } = await supabase.from("organizations").update(organization).eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();
}
