import { EmailOperationType, MonthlyQuotaField } from "@/server/utils/types";

export type ErrorType = "api-error";

export class ExpressError extends Error {
    error: string;
    message: string;
    code: number;

    public constructor(error: string, message: string = "The Express server encountered an error.", code: number) {
        super();
        this.error = error;
        this.message = message;
        this.code = code;
    }

    public toObject() {
        return JSON.stringify(this);
    }
}

export class UnresolvedError extends ExpressError {
    public constructor(message: string = "The request could not be resolved.") {
        super("UNRESOLVED_ERROR", message, 500);
    }
}

export class InvalidParameterError extends ExpressError {
    public constructor(message: string = "The request had invalid parameters") {
        super("INVALID_PARAMETER_ERROR", message, 400);
    }

    public forInvalidCoord() {
        this.message =
            "Coordinates should respect a certain range, and be numbers. Longitudes range between -180 and 180, and latitudes range between -90 and 90.";
        return this;
    }
}

export class InvalidTokenError extends ExpressError {
    public constructor(message: string) {
        super("INVALID_TOKEN_ERROR", message, 401);
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
    constructor(className: string) {
        super("INVALID_OBJECT_ERROR", `An error occured when validating an object of ${className}`, 400);
    }
}

export class EmailError extends ExpressError {
    constructor(emailOperationType: EmailOperationType) {
        super("EMAIL_ERROR", `An error occured when handling emails. Type: ${emailOperationType}`, 500);
    }
}

export class QuotaLimitReachedError extends ExpressError {
    quotaField: string;
    hard: boolean;

    constructor(quotaField: string) {
        super("QUOTA_LIMIT_REACHED", `The organization has reached its hard quota limit for ${quotaField}`, 422);
        this.quotaField = quotaField;
        this.hard = true;
    }
}
