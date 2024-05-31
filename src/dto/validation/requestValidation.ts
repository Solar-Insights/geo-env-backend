import { ObjectValidationError } from "@/server/utils/errors";
import { validateOrReject } from "class-validator";

export async function validate(object: any, className: string) {
    await validateOrReject(object).catch(() => {
        throw new ObjectValidationError(className);
    });
}
