import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    console.log(1234);
    res.json({
        test: "test"
    });
});

export default router;
