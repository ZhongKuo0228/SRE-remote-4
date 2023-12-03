import redis from "./cache.js";

export const clearCache = async () => {
    try {
        await redis.flushall();
        console.log("All cache data cleared successfully.");
        return "All cache data cleared successfully.";
    } catch (error) {
        console.error("Error clearing cache:", error);
    }
};

export const fetchAllCache = async () => {
    try {
        const keys = await redis.keys("*");
        const values = await redis.mget(keys);

        const cacheData = keys.reduce((obj, key, index) => {
            obj[key] = values[index];
            return obj;
        }, {});

        return cacheData;
    } catch (error) {
        console.error("Error fetching all cache data:", error);
        return null;
    }
};
