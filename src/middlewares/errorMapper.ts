import { ErrorRequestHandler } from "express";
import { ApiError, ExpressError, UnresolvedError } from "@/middlewares/customErrors";

export const errLogger: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    next(err);
};

export const errResponder: ErrorRequestHandler = (err, req, res, next) => {
    const isCustomError = err instanceof ExpressError;
    if (isCustomError) res.status(err.code).json(err);
    else next(err);
};

export const failSafeHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json(new UnresolvedError(req.url));
};
