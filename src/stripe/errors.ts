export class StripeError extends Error {
    error: string;
    message: string;
    code: number;

    constructor(
        error: string,
        message: string = "An error was encountered during a request made to stripe.",
        code: number = 500
    ) {
        super();
        this.error = error;
        this.message = message;
        this.code = code;
    }

    public toObject() {
        return JSON.stringify(this);
    }
}