// Configs
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// Routers
import utilRouter from "@/routes/util";
import solarRouter from "@/routes/solar";
import airRouter from "@/routes/air";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(utilRouter);
app.use(solarRouter);
app.use(airRouter);

export default app;
