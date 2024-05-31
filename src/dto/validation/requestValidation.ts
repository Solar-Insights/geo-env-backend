import { ObjectValidationError } from "@/server/utils/errors";
import { validateOrReject } from "class-validator";
import { Request } from "express";

export async function validate(object: any, className: string, req: Request) {
    await validateOrReject(object)
        .catch(() => {
            throw new ObjectValidationError(req.url, className);
        })
}
