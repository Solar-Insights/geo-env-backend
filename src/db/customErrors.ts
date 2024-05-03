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
        error: "DATABASE_POST_REQUEST_VALIDATION_ERROR",
        message: string = "An error was encountered when validating the response from the database."
    ) {
        super(error, message=message);
    }
}