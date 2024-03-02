import { ErrorRequestHandler } from "express";
import { ApiError, UnresolvedError } from "@/misc/customErrors";

export const errLogger: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    next(err);
};

export const errResponder: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(500).json(err);
    } else {
        next(err);
    }
};

export const failSafeHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json(new UnresolvedError(req.url));
};
