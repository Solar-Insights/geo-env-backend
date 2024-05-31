import { RequestHandler } from "express";

export const userResponseHandler: RequestHandler = (req, res, next) => {
    const data = res.locals.data;
    res.json(data);
};
