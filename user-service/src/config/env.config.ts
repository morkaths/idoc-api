
import dotenv from 'dotenv';
dotenv.config();

// ────────────────────────────────────────────────────────────────────────────────
// URLs
// ────────────────────────────────────────────────────────────────────────────────
export const PORT = process.env.PORT || 5002;
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5002';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

// ────────────────────────────────────────────────────────────────────────────────
// JWT
// ────────────────────────────────────────────────────────────────────────────────
export const JWT_SECRET = process.env.JWT_SECRET
	? process.env.JWT_SECRET
	: (() => {
		throw new Error('JWT_SECRET chưa được định nghĩa trong file .env');
	})();
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
	? process.env.JWT_EXPIRES_IN
	: '1d';

// ────────────────────────────────────────────────────────────────────────────────
// Database (Mongo DB)
// ────────────────────────────────────────────────────────────────────────────────
export const MONGODB_URI = process.env.MONGODB_URI
	? process.env.MONGODB_URI
	: (() => {
		throw new Error('MONGODB_URI chưa được định nghĩa trong file .env');
	})();

// // ────────────────────────────────────────────────────────────────────────────────
// // Account (Gmail)
// // ────────────────────────────────────────────────────────────────────────────────
// export const GMAIL_USER = process.env.GMAIL_USER
// 	? process.env.GMAIL_USER
// 	: (() => {
// 			throw new Error('GMAIL_USER chưa được định nghĩa trong file .env');
// 	  })();
// export const GMAIL_PASS = process.env.GMAIL_PASS
// 	? process.env.GMAIL_PASS
// 	: (() => {
// 			throw new Error('GMAIL_PASS chưa được định nghĩa trong file .env');
// 	  })();

// // ────────────────────────────────────────────────────────────────────────────────
// // Account (Google)
// // ────────────────────────────────────────────────────────────────────────────────
// export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL
// 	? process.env.GOOGLE_CALLBACK_URL
// 	: (() => {
// 			throw new Error('GOOGLE_CALLBACK_URL chưa được định nghĩa trong file .env');
// 	  })();
// export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// 	? process.env.GOOGLE_CLIENT_ID
// 	: (() => {
// 			throw new Error('GOOGLE_CLIENT_ID chưa được định nghĩa trong file .env');
// 	  })();
// export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
// 	? process.env.GOOGLE_CLIENT_SECRET
// 	: (() => {
// 			throw new Error('GOOGLE_CLIENT_SECRET chưa được định nghĩa trong file .env');
// 	  })();

// // ────────────────────────────────────────────────────────────────────────────────
// // Account (Facebook)
// // ────────────────────────────────────────────────────────────────────────────────
// export const FB_CALLBACK_URL = process.env.FB_CALLBACK_URL
// 	? process.env.FB_CALLBACK_URL
// 	: (() => {
// 			throw new Error('FB_CALLBACK_URL chưa được định nghĩa trong file .env');
// 	  })();
// export const FB_APP_ID = process.env.FB_APP_ID
// 	? process.env.FB_APP_ID
// 	: (() => {
// 			throw new Error('FB_APP_ID chưa được định nghĩa trong file .env');
// 	  })();
// export const FB_APP_SECRET = process.env.FB_APP_SECRET
// 	? process.env.FB_APP_SECRET
// 	: (() => {
// 			throw new Error('FB_APP_SECRET chưa được định nghĩa trong file .env');
// 	  })();