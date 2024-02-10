import { ErrorRequestHandler } from "express";

export const errLogger: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    next(err);
};

export const errResponder: ErrorRequestHandler = (err, req, res, next) => {
    if (err.type === "api-error") {
        res.status(500).json({ 
            error: "The request could not be resolved, the API endpoint encountered an error.",
            url: req.url
        });
    } else {
        next(err);
    }
};

export const failSafeHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({ 
        error: "The request could not be resolved.",
        url: req.url
    });
};