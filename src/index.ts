import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.listen(port, () => {
    console.log("test")
})
