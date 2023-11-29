import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
    enableReadyCheck: false,
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (err) => {
    console.error("Error connecting to Redis: ", err);
});

export default redis;
