import express from "express";

const router = express.Router();

router.get("/", () => {
    console.log(1234);
});

export default router;
