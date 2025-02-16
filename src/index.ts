import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as router from "./router/index.router";
import morgan from "morgan";
import { connectDB } from "./config/connect.mongodb";
import { logger } from "./logger";
import "./config/connect.redis";

const morganFormat = ":method :url :status :response-time ms :res[content-length]";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

connectDB();

app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            }
            logger.info(JSON.stringify(logObject));
        }
    }
}));

app.use("/api/v1", router.handleRouter());

app.listen(process.env.PORT, () => logger.info(`Server is running in port ${process.env.PORT}`));