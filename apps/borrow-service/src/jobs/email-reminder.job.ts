import cron from 'node-cron';
import { logger } from '@libs/logger';
import EmailService from '../services/email.service';
import BorrowService from '../services/borrow.service';

export function startEmailReminderJob() {
  cron.schedule('0 0 * * *', async () => {
  // cron.schedule('*/5 * * * *', async () => {
    try {
      const borrows = await BorrowService.getBorrowsNeedingBookReminder();
      for (const borrow of borrows) {
        try {
          await EmailService.sendReminder(borrow.email, borrow.title, borrow.expireTime, borrow.coverUrl);
        } catch (err) {
          logger.error(`[JOB] Failed to send email to ${borrow.email}:`, err);
        }
      }
      logger.info(`[JOB] Sent reminder emails for ${borrows.length} borrows`);
    } catch (err) {
      logger.error('[JOB] Error in email reminder job:', err);
    }
  });
}