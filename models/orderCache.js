import redis from "./cache.js";
import dotenv from "dotenv";
dotenv.config();

export const saveQueryOrderDataToCache = async (key, data) => {
    const redisKey = `packageStatus_sno=${key}`;
    try {
        const value = JSON.stringify(data);

        const expiryTime = parseInt(process.env.CACHE_EXPIRY_TIME, 10) || 3600;

        await redis.set(redisKey, value, "EX", expiryTime);

        console.log(`Data for sno ${key} saved to Redis successfully with expiry of ${expiryTime} seconds.`);
    } catch (error) {
        console.error("Error saving to Redis:", error);
    }
};

export const getOrderDataFromCache = async (key) => {
    const redisKey = `packageStatus_sno=${key}`;
    try {
        const value = await redis.get(redisKey);

        if (value) {
            console.log(`Query packageStatus_sno=${key} success`);
            return JSON.parse(value);
        } else {
            console.log(`No data found for sno ${key}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching from Redis:", error);
        return null;
    }
};
