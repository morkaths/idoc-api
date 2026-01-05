import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export function httpLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;

        logger.info({
            message: `${method} ${originalUrl} ${statusCode} ${duration}ms`,
            context: 'HTTP',
            method,
            url: originalUrl,
            statusCode,
            duration,
        });
    });

    next();
}

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    logger.error({
        message: `${status} - ${message}`,
        context: 'SYSTEM',
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
    });

    next(err);
}
