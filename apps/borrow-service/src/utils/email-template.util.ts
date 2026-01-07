import { config } from '@libs/config';

export const getBookReminderTemplate = (bookTitle: string, expireTime: Date, coverUrl?: string): string => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:0;margin:0;">
      <tr>
        <td align="center">
          <table width="420" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;box-shadow:0 4px 24px rgba(25,118,210,0.10);margin:40px 0;overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="background:#1976d2;padding:28px 0 18px 0;text-align:center;">
                <img src="https://res.cloudinary.com/dt06zhju9/image/upload/v1766774264/favicon_light_tmiky9.png" alt="iDoc Library" width="54" style="border-radius:10px;box-shadow:0 2px 8px #eee;">
                <div style="font-family:'Inter',Arial,sans-serif;font-size:22px;font-weight:700;color:#fff;margin-top:10px;letter-spacing:1px;">iDoc Library</div>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding:32px 32px 18px 32px;font-family:'Inter',Arial,sans-serif;color:#222;">
                <h2 style="font-size:22px;font-weight:700;color:#1976d2;margin:0 0 14px 0;line-height:1.2;">Book Due Date Reminder</h2>
                <p style="font-size:15px;line-height:1.7;color:#222;margin:0 0 16px 0;">
                  Hello,<br>
                  This is a friendly reminder that you have borrowed the book <b style="color:#1976d2;">${bookTitle}</b> from <b>iDoc Library</b>.
                </p>
                ${coverUrl ? `<div style="text-align:center;margin-bottom:16px;"><img src="${coverUrl}" alt="${bookTitle}" style="max-width:150px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>` : ''}
                <div style="background:#e3f0fc;border-radius:8px;padding:14px 18px;margin:0 0 16px 0;">
                  <span style="color:#d32f2f;font-weight:600;">Due date:</span>
                  <span style="font-size:15px;font-weight:500;color:#0a1a38;">${expireTime.toLocaleString()}</span>
                </div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:0 0 20px 0;">
                  Please return the book on time to avoid any penalties.<br>
                  Thank you for using <b>iDoc Library</b>!
                </p>
                <div style="text-align:center;margin-bottom:18px;">
                  <a href="${config.app.web}" style="display:inline-block;padding:11px 28px;background:#1976d2;color:#fff;border-radius:6px;font-size:15px;font-weight:600;text-decoration:none;box-shadow:0 2px 8px #e3eafc;transition:background 0.2s;">View My Borrowings</a>
                </div>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:18px 32px 24px 32px;">
                <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 16px 0;">
                <div style="font-size:12px;color:#aaa;text-align:center;font-family:'Inter',Arial,sans-serif;">
                  iDoc Library, 123 Main St, Your City<br>
                  <a href="#" style="color:#1976d2;text-decoration:underline;">Unsubscribe</a>
                </div>
                <div style="text-align:center;margin-top:12px;">
                  <a href="#"><img src="https://cloudfilesdm.com/postcards/89120808eeaf345d35614179b0bf4ab3.png" width="18" height="18" alt="Facebook" style="margin:0 3px;"></a>
                  <a href="#"><img src="https://cloudfilesdm.com/postcards/ee6731b3040d45f55f653008923b2b7f.png" width="20" height="20" alt="Instagram" style="margin:0 3px;"></a>
                  <a href="#"><img src="https://cloudfilesdm.com/postcards/1fb26efe0bbf4ca78d19744139fd2a56.png" width="18" height="18" alt="Twitter" style="margin:0 3px;"></a>
                  <a href="#"><img src="https://cloudfilesdm.com/postcards/2dbdd08c3b32db26a0373bf0c4fad206.png" width="18" height="18" alt="LinkedIn" style="margin:0 3px;"></a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `;
};