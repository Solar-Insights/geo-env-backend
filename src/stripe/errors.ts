export class StripeError extends Error {
    error: string;
    message: string;
    code: number;

    constructor(
        error: string,
        message: string = "An error was encountered during a request made to Stripe.",
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

export class StripeCustomerError extends StripeError {
    constructor(message: string, error: string = "STRIPE_CUSTOMER_ERROR") {
        super((error = error), (message = message));
    }
}
