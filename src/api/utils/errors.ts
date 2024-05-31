import { ExpressError } from "@/server/utils/errors";

export class ApiError extends ExpressError {
    constructor(
        url: string,
        message: string = "The request could not be resolved as the API endpoint encountered an error."
    ) {
        super(url, "API_ERROR", message, 500);
    }
}