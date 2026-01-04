import { BorrowDto } from '../dtos/borrow.dto';
import { RedisClient } from '@libs/redis';

/**
 * Generic function to publish messages to Redis topics.
 * @param topic - The Redis topic to publish to.
 * @param payload - The data to publish (will be JSON stringified).
 */
export const publishEvent = async (topic: string, payload: any): Promise<void> => {
  try {
    await RedisClient.instance.publish(topic, JSON.stringify(payload));
    console.log(`Published event to Redis [${topic}]:`, payload);
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
    type: 'BORROW'
  };

  await publishEvent('borrow_topic', payload);
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
    type: 'RETURN'
  };

  await publishEvent('borrow_topic', payload);
};
