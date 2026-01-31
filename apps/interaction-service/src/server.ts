import http from 'http';
import 'reflect-metadata';

import app from './app';
import { MongoDBClient } from '@libs/mongodb';
import { RedisClient } from '@libs/redis';
import { config } from '@libs/config';
import { logger } from '@libs/logger';

const server = http.createServer(app);

Promise.all([
    MongoDBClient.connect({ uri: config.services.interaction.db, logger }),
    RedisClient.connect({ url: config.redis.uri }),
]).then(() => {
    server.listen(config.services.interaction.port, () => {
        logger.info(`Interaction Server running on port ${config.services.interaction.port}`);
    });
}).catch(err => {
    logger.error('Failed to start server', err);
    process.exit(1);
});

const gracefulShutdown = async () => {
    logger.info("\n Gracefully shutting down...");
    try {
        await Promise.all([
            MongoDBClient.close(),
            RedisClient.disconnect(),
        ]);
        logger.info("Database connections closed");

        server.close(() => {
            logger.info("HTTP server closed");
            process.exit(0);
        });
    } catch (err) {
        logger.error(" Error during shutdown:", err);
        process.exit(1);
    }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
