import { config } from '@libs/config';

export const emailConfig = {
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: false,
    auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.pass,
    },
    from: config.email.smtp.from,
};