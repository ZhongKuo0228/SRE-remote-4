import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
    port: process.env.REDIS_PORT || "6379",
    host: process.env.REDIS_HOST || "127.0.0.1",
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD || "",
    db: process.env.REDIS_DB || "0",
    enableReadyCheck: false,
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (err) => {
    console.error("Error connecting to Redis: ", err);
});

export default redis;
