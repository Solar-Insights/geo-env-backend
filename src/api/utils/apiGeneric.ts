import { Request } from "express";

export class ApiGeneric {
    req: Request;

    public constructor(req: Request) {
        this.req = req;
    }
}
