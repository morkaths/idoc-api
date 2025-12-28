import cron from 'node-cron';
import EmailService from '../services/email.service';
import BorrowService from '../services/borrow.service';

export function startEmailReminderJob() {
  // Schedule the job to run daily at midnight(00:00)
  cron.schedule('0 0 * * *', async () => {
    try {
      const borrows = await BorrowService.getBorrowsNeedingBookReminder();
      for (const borrow of borrows) {
        try {
          await EmailService.sendReminder(borrow.email, borrow.title, borrow.expireTime);
        } catch (err) {
          console.error(`[JOB] Failed to send email to ${borrow.email}:`, err);
        }
      }
      console.log(`[JOB] Sent reminder emails for ${borrows.length} borrows`);
    } catch (err) {
      console.error('[JOB] Error in email reminder job:', err);
    }
  });
}