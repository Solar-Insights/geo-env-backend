export class DatabaseError extends Error {
    error: string;
    message: string;
    code: number;

    constructor(
        error: string,
        message: string = "An error was encountered during a request made to the database.",
        code: number = 500
    ) {
        super();
        this.error = error;
        this.message = message;
        this.code = code;
    }

    public toObject() {
        return {
            error: this.error,
            message: this.message,
            code: this.code
        };
    }
}

export class DatabasePostRequestValidationError extends DatabaseError {
    constructor(
        message: string,
        error: string = "DATABASE_POST_REQUEST_VALIDATION_ERROR"
    ) {
        super(error=error, message=message);
    }
}