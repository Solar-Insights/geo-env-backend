import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// Routers
import solarRouter from "@/routes/solar";
import airQualityRouter from "@/routes/airQuality";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(airQualityRouter);
app.use(solarRouter);

app.listen(port, () => {
    console.log("test");
});