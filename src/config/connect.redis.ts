import { createClient } from "redis";
import { logger } from "../logger";

const redisClient = createClient({
    url: "redis://127.0.0.1:6379", 
});

redisClient.on("connect", () => {
    logger.info("Connected to Redis database");
});

redisClient.on("error", (error: any) => {
    logger.error(`Error while connecting to Redis: ${error.message}`);
});

(async () => {
    try {
        await redisClient.connect();
    } catch (error: any) {
        logger.error(`Failed to connect to Redis: ${error.message}`);
    }
})();

export default redisClient;