import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
    traceId: string;
}

export const contextStore = new AsyncLocalStorage<RequestContext>();

export function getTraceId(): string | undefined {
    const store = contextStore.getStore();
    return store?.traceId;
}

export function runWithContext(traceId: string, callback: () => void): void {
    contextStore.run({ traceId }, callback);
}
