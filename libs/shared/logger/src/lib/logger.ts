import * as winston from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile = require('winston-daily-rotate-file');
import { getTraceId } from './context.store';

const LOG_DIR = process.env.LOG_DIR || 'logs';
const AUDIT_DIR = `${LOG_DIR}/.audit`;

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'creditCard', 'secret', 'apiKey'];

/**
 * Recursive data masking function
 */
function maskData(data: any, seen = new WeakSet()): any {
    if (!data) return data;
    if (typeof data !== 'object') return data;
    if (seen.has(data)) return '[Circular]';

    seen.add(data);

    if (typeof data.toJSON === 'function') {
        try {
            return maskData(data.toJSON(), seen);
        } catch (err) {
            // ignore error
        }
    }

    if (Array.isArray(data)) {
        return data.map(item => maskData(item, seen));
    }

    const masked: any = {};
    for (const key of Object.keys(data)) {
        if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
            masked[key] = '*****';
        } else {
            masked[key] = maskData(data[key], seen);
        }
    }
    return masked;
}

/**
 * Custom format to inject traceId and mask sensitive data
 */
const advancedFormat = winston.format((info) => {
    const traceId = getTraceId();
    if (traceId) {
        info.traceId = traceId;
    }
    // Mask metadata (excluding core fields like level, message)
    const { level, message, timestamp, stack, context, traceId: tid, ...meta } = info;
    const maskedMeta = maskData(meta);
    return { ...info, ...maskedMeta };
});

export class LoggerClient {
    private static instance: LoggerClient;
    private logger: winston.Logger;

    private constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                advancedFormat(),
                winston.format.timestamp(),
                process.env.NODE_ENV === 'production'
                    ? winston.format.json()
                    : winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, context, traceId, ...meta }) => {
                            const ctxStr = context ? `[${context}]` : '[Sys]';
                            const traceStr = traceId ? `(tid:${traceId})` : '';
                            const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
                            return `${timestamp} ${level} ${ctxStr}${traceStr}: ${message} ${metaStr}`;
                        })
                    )
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format((info) => info.context === 'MONGO' ? false : info)(),
                        advancedFormat(),
                        winston.format.timestamp(),
                        process.env.NODE_ENV === 'production'
                            ? winston.format.json()
                            : winston.format.combine(
                                winston.format.colorize(),
                                winston.format.printf(({ timestamp, level, message, context, traceId, ...meta }) => {
                                    const ctxStr = context ? `[${context}]` : '[Sys]';
                                    const traceStr = traceId ? `(tid:${traceId})` : '';
                                    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
                                    return `${timestamp} ${level} ${ctxStr}${traceStr}: ${message} ${metaStr}`;
                                })
                            )
                    )
                }),
                this.createTransport('error', 'error'),
                this.createTransport('mongo', undefined, (info) => info.context === 'MONGO'),
                this.createTransport('http', undefined, (info) => info.context === 'HTTP'),
                this.createTransport('app', undefined, (info) =>
                    !['HTTP', 'MONGO'].includes(info.context as string) && info.level !== 'error'
                ),
            ],
        });
    }

    public static getInstance(): LoggerClient {
        if (!LoggerClient.instance) {
            LoggerClient.instance = new LoggerClient();
        }
        return LoggerClient.instance;
    }

    public getLogger(): winston.Logger {
        return this.logger;
    }

    private createTransport(
        filenameBase: string,
        level?: string,
        filterFn?: (info: any) => boolean
    ): DailyRotateFile {
        const option: DailyRotateFile.DailyRotateFileTransportOptions = {
            dirname: LOG_DIR,
            filename: `${filenameBase}-%DATE%.log`,
            auditFile: `${AUDIT_DIR}/${filenameBase}-audit.json`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level,
        };

        if (filterFn) {
            option.format = winston.format.combine(
                winston.format((info) => filterFn(info) ? info : false)(),
                winston.format.json()
            );
        }

        return new DailyRotateFile(option);
    }
}

export const logger = LoggerClient.getInstance().getLogger();