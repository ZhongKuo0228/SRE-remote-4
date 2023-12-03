import Fastify from "fastify";
import dotenv from "dotenv";
import { randomBuildOrder, getPackageStatusBySnoId } from "./controllers/createFakeOrder.js";
import { saveQueryOrderDataToCache, getOrderDataFromCache } from "./models/orderCache.js";
import { clearCache, fetchAllCache } from "./models/cacheOperation.js";
import { getTrackingStatusCounts } from "./models/orderManage.js";
import { getCurrentISOTime } from "./util/time.js";
dotenv.config();

const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
    return reply.status(200).send({ message: "SRE-Remote-4 作業" });
});

fastify.get("/fake", async (request, reply) => {
    const num = request.query.num;
    if (!num || isNaN(num)) {
        return reply.status(400).send({ error: "Invalid 'num' parameter" });
    } else if (num < 1) {
        return reply.status(200).send({ message: "輸入數量爲不能小於 1" });
    }

    const counter = await randomBuildOrder(num);
    return reply.status(200).send({
        message: `本次建立 ${counter.length} 筆數，sno_id: ${counter[0]} ~ ${counter[counter.length - 1]}`,
    });
});

fastify.get("/query", async (request, reply) => {
    const snoId = request.query.sno;

    if (!snoId || isNaN(snoId)) {
        return reply.status(400).send({
            status: "error",
            data: null,
            error: {
                code: 400,
                message: "Invalid 'sno' parameter",
            },
        });
    }

    const cachedData = await getOrderDataFromCache(snoId);
    if (cachedData) {
        return reply.status(200).send({ status: "success", data: cachedData, error: null });
    }

    const data = await getPackageStatusBySnoId(snoId);
    if (data === null) {
        return reply.status(404).send({
            status: "error",
            data: null,
            error: {
                code: 404,
                message: "Tracking number not found",
            },
        });
    }

    await saveQueryOrderDataToCache(snoId, data);

    return reply.status(200).send({ status: "success", data: data, error: null });
});

fastify.get("/trackingSummary", async (request, reply) => {
    const data = await getTrackingStatusCounts();
    const time = getCurrentISOTime();
    return reply.status(200).send({
        created_dt: time,
        trackingSummary: data,
    });
});

fastify.get("/cacheClean", async (request, reply) => {
    const data = await clearCache();
    return reply.status(200).send({ result: data });
});

fastify.get("/cacheList", async (request, reply) => {
    const data = await fetchAllCache();
    return reply.status(200).send({ cache: data });
});

const start = async () => {
    try {
        const port = process.env.SERVER_PORT || 3000;
        const host = process.env.SERVER_HOST || "127.0.0.1";
        await fastify.listen({ port, host });
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        setTimeout(start, 5000);
    }
};

start();
