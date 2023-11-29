import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
    return { hello: "world" };
});

const start = async () => {
    try {
        await fastify.listen({ port: config.serverPort });
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
