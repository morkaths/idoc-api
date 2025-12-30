import cron from 'node-cron';
import BorrowService from '../services/borrow.service';

export function startOverdueJob() {
  cron.schedule('0 0 * * *', async () => {
    try {
      const count = await BorrowService.markOverdueBorrows();
      console.log(`[JOB] Updated ${count} overdue borrows`);
    } catch (err) {
      console.error('[JOB] Error in overdue job:', err);
    }
  });
}