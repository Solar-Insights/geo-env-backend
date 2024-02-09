import express, { Express, Request, Response } from "express";
import { PORT } from "@/config";
import bodyParser from "body-parser";
import cors from "cors";
// Routers
import utilRouter from "@/routes/util";
import solarRouter from "@/routes/solar";
import airQualityRouter from "@/routes/airQuality";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(utilRouter);
app.use(solarRouter);
app.use(airQualityRouter);


app.listen(PORT, () => {
    console.log("server is now opened");
});
