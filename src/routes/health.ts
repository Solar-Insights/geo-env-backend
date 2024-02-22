import express from "express";

const healthRouter = express.Router();

healthRouter.get("/health", async (req, res, next) => {
    res.status(200).json({
        status: "server is up"
    })
});


export default healthRouter;
