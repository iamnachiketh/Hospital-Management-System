import mongoose from "mongoose";
import { logger } from "../logger";

export const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}`)
        .then(() => logger.info("Database has been connected"))
        .catch((error: any) => logger.error(error));
}