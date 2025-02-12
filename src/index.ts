import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/connect.mongodb";
import * as router from "./router/index.router";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

connectDB();

app.use("/api/v1", router.handleRouter());

app.listen(process.env.PORT, () => console.log(`Server is running in port ${process.env.PORT}`));