import { PostgrestError } from "@supabase/supabase-js";
import { DatabasePostRequestValidationError } from "./customErrors";

export class OperationValidator {
    data: any[] | null;
    error: PostgrestError | null;

    public constructor(data: any[] | null, error: PostgrestError | null) {
        this.data = data;
        this.error = error;

        if (this.error !== null) 
            throw new DatabasePostRequestValidationError("An error was detected after trying to make a request to the database.");
    }

    public expectsNonNullData() {
        if (this.data === null) 
            throw new DatabasePostRequestValidationError("Expected data to be returned from the request to the database.");
        return this;
    }

    public expectsOnlyOneItem() {
        if (this.data!.length > 1) 
            throw new DatabasePostRequestValidationError("Expected only one item to be returned from the request to the database.");
        return this;
    }

    public expectsNullData() {
        if (this.data !== null) 
            throw new DatabasePostRequestValidationError("Expected no data to be returned from the request to the database.");
        return this;
    }
}