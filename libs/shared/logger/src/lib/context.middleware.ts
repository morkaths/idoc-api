import { Request, Response, NextFunction } from 'express';
import { runWithContext } from './context.store';
import { v4 as uuidv4 } from 'uuid';

export function contextMiddleware(req: Request, res: Response, next: NextFunction) {
    const traceId = (req.headers['x-request-id'] as string) || uuidv4();
    res.setHeader('x-request-id', traceId);
    runWithContext(traceId, () => {
        next();
    });
}
