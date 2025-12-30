import { startEmailReminderJob } from './email-reminder.job';
import { startOverdueJob } from './overdue.job';

export function startAllJobs() {
  startEmailReminderJob();
  startOverdueJob();
}