import express from "express";
import {} from "solar-typing/src/general"
import {} from "solar-typing/src/solar"

const airRouter = express.Router();


airRouter.get("/", (req, res) => {
    console.log(1234);
    res.json({
        test: "test"
    });
});

export default airRouter;
