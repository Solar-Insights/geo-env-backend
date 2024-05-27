import { EmailErrorType } from "@/services/types";

export type ErrorType = "api-error";

export class ExpressError extends Error {
    url: string;
    error: string;
    message: string;
    code: number;

    constructor(
        url: string,
        error: string,
        message: string = "The Express server encountered an error.",
        code: number
    ) {
        super();
        this.url = url;
        this.error = error;
        this.message = message;
        this.code = code;
    }

    public toObject() {
        return {
            error: this.error,
            url: this.url,
            message: this.message,
            code: this.code
        };
    }
}

export class UnresolvedError extends ExpressError {
    constructor(url: string, message: string = "The request could not be resolved.") {
        super(url, "UNRESOLVED_ERROR", message, 500);
    }
}

export class ApiError extends ExpressError {
    constructor(
        url: string,
        message: string = "The request could not be resolved as the API endpoint encountered an error."
    ) {
        super(url, "API_ERROR", message, 500);
    }
}

export class InvalidParameterError extends ExpressError {
    constructor(url: string, message: string) {
        super(url, "INVALID_PARAMETER_ERROR", message, 400);
    }
}

export class InvalidTokenError extends ExpressError {
    constructor(url: string, message: string) {
        super(url, "INVALID_TOKEN_ERROR", message, 401);
    }
}

export function makeCoordinatesRangeError() {
    return new RangeError("Coordinates are not within of the permissible range of values");
}

export function rangeErrorToObject(rangeError: RangeError) {
    return {
        message: rangeError.message,
        name: rangeError.name,
        stack: rangeError.stack
    };
}

export class ObjectValidationError extends ExpressError {
    constructor(url: string, className: string) {
        super(url, "INVALID_OBJECT_ERROR", `An error occured when validating an object of ${className}`, 400);
    }
}

export class EmailError extends ExpressError {
    constructor(url: string, emailErrorType: EmailErrorType) {
        super(url, "EMAIL_ERROR", `An error occured when handling emails. Type: ${emailErrorType}`, 500);
    }
}