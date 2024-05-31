import { ErrorRequestHandler } from "express";
import { ExpressError, UnresolvedError } from "@/server/utils/errors";
import { DatabaseError } from "@/db/utils/errors";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";

export const errLogger: ErrorRequestHandler = (err, req, res, next) => {
    console.error(req.url, err);
    next(err);
};

export const errResponder: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ExpressError) res.status(err.code).json(err);
    else if (err instanceof DatabaseError) res.status(err.code).json(err);
    else if (err instanceof UnauthorizedError) res.status(err.statusCode).json(err);
    else next(err);
};

export const failSafeHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json(new UnresolvedError(req.url));
};
