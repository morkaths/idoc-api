import { BorrowDto } from '../dtos/borrow.dto';
import { RedisClient } from '@libs/redis';
import { randomUUID } from 'crypto';

export interface EventEnvelope<T> {
  id: string;
  type: string;
  source: string;
  occurredAt: string;
  payload: T;
}

/**
 * Generic function to publish messages to Redis topics.
 * @param topic - The Redis topic to publish to.
 * @param envelope - The standard event envelope to publish.
 */
export const publishEvent = async <T>(topic: string, envelope: EventEnvelope<T>): Promise<void> => {
  try {
    await RedisClient.instance.publish(topic, JSON.stringify(envelope));
    console.log(`Published event to Redis [${topic}]:`, envelope);
  } catch (error) {
    console.error(`Failed to publish event to Redis [${topic}]:`, error);
  }
};

/**
 * Publishes a borrow event to Redis for the statistics service.
 * @param borrow - The borrow record DTO.
 */
export const publishBorrowEvent = async (borrow: BorrowDto, categoryIds: string[] = []): Promise<void> => {
  const payload = {
    userId: borrow.userId,
    bookId: borrow.itemId,
    categoryIds: categoryIds,
    eventDate: new Date(borrow.borrowTime).toISOString().split('T')[0], // YYYY-MM-DD
  };

  const envelope: EventEnvelope<typeof payload> = {
    id: randomUUID(),
    type: 'BORROW',
    source: 'borrow-service',
    occurredAt: new Date().toISOString(),
    payload
  };

  await publishEvent('idoc:borrow:events', envelope);
};

/**
 * Publishes a return event to Redis for the statistics service.
 * @param borrow - The borrow record DTO.
 */
export const publishReturnEvent = async (borrow: BorrowDto): Promise<void> => {
  const payload = {
    userId: borrow.userId,
    bookId: borrow.itemId,
    eventDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };

  const envelope: EventEnvelope<typeof payload> = {
    id: randomUUID(),
    type: 'RETURN',
    source: 'borrow-service',
    occurredAt: new Date().toISOString(),
    payload
  };

  await publishEvent('idoc:borrow:events', envelope);
};
