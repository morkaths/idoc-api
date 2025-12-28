import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email.config';
import { getBookReminderTemplate } from 'src/utils/email-template.util';

const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
});

const EmailService = {
    
    async sendMail(options: {
        to: string;
        subject: string;
        text: string;
        html?: string;
    }) {
        const mailOptions = {
            from: emailConfig.from,
            ...options,
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`[EmailService] Email sent to ${options.to}: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error(`[EmailService] Failed to send email to ${options.to}:`, error);
            throw error;
        }
    },

    async sendReminder(userEmail: string, bookTitle: string, expireTime: Date) {
        const subject = `[Action Required] Due Date Reminder: "${bookTitle}"`;
        const htmlContent = getBookReminderTemplate(bookTitle, expireTime);
        const textContent = `You have borrowed "${bookTitle}". Due date: ${expireTime.toLocaleString()}. Please return on time.`;
        return this.sendMail({
            to: userEmail,
            subject,
            text: textContent,
            html: htmlContent,
        });
    }
}

export default EmailService;