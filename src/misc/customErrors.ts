export type ErrorType = "api-error";

export class ExpressError extends Error {
    url: string;
    message: string;
    code: number;

    constructor(
        url: string,
        message: string = "The Express server encountered an error.",
        code: number = 500,
    ) {
        super();
        this.url = url;
        this.message = message;
        this.code = code;
    }

    public toObject() {
        return {
            url: this.url,
            message: this.message,
            code: this.code
        };
    }
}

export class UnresolvedError extends ExpressError {
    constructor(
        url: string,
        message: string = "The request could not be resolved.",
        code: number = 500,
    ) {
        super(url, message, code);
    }
}

export class ApiError extends ExpressError {
    constructor(
        url: string,
        message: string = "The request could not be resolved as the API endpoint encountered an error.",
        code: number = 500,
    ) {
        super(url, message, code);
    }
}
