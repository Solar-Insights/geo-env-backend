import { PostgrestError } from "@supabase/supabase-js";
import { DatabasePostRequestValidationError } from "./customErrors";

export class OperationValidator {
    data: any[] | null;
    error: PostgrestError | null;

    public constructor(data: any[] | null, error: PostgrestError | null) {
        this.data = data;
        this.error = error;

        if (this.error !== null)
            throw new DatabasePostRequestValidationError(
                "An error was detected after trying to make a request to the database."
            );
    }

    private expectsNonNullData() {
        if (this.data === null)
            throw new DatabasePostRequestValidationError(
                "Expected data to be returned from the request to the database."
            );
        return this;
    }

    private expectsOneOrMoreItem() {
        if (this.data!.length === 0)
            throw new DatabasePostRequestValidationError(
                "Expected at least one item to be returned from the request to the database."
            );
        return this;
    }

    private expecteOneOrLessItem() {
        if (this.data!.length !== 0 && this.data!.length !== 1)
            throw new DatabasePostRequestValidationError(
                "Expected one item or less to be returned from the request to the database."
            );
        return this;
    }

    private expectsOnlyOneItem() {
        if (this.data!.length !== 1)
            throw new DatabasePostRequestValidationError(
                "Expected only one item to be returned from the request to the database."
            );
        return this;
    }

    private expectsNullData() {
        if (this.data !== null)
            throw new DatabasePostRequestValidationError(
                "Expected no data to be returned from the request to the database."
            );
        return this;
    }

    public validateGetSingleOrMoreItemRequest() {
        this.expectsNonNullData();
        this.expectsOneOrMoreItem();
    }

    public validateGetSingleOrLessItemRequest() {
        this.expectsNonNullData();
        this.expecteOneOrLessItem();
    }

    public validateGetSingleItemRequest() {
        this.expectsNonNullData();
        this.expectsOnlyOneItem();
    }

    public validateCreateRequest() {
        this.expectsNullData();
    }

    public validateUpdateRequest() {
        this.expectsNullData();
    }

    public validateDeleteRequest() {
        this.expectsNullData();
    }
}
