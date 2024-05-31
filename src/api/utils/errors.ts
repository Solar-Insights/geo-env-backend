import { ExpressError } from "@/server/utils/errors";

export class ApiError extends ExpressError {
    constructor(
        message: string = "The request could not be resolved as the API endpoint encountered an error."
    ) {
        super( "API_ERROR", message, 500);
    }
}