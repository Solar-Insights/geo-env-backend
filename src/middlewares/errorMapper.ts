import { ErrorRequestHandler } from "express";
import { ExpressError, UnresolvedError } from "@/middlewares/customErrors";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";

export const errLogger: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    next(err);
};

export const errResponder: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ExpressError) res.status(err.code).json(err);
    else if (err instanceof UnauthorizedError) res.status(err.statusCode).json(err);
    else next(err);
};

export const failSafeHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json(new UnresolvedError(req.url));
};
