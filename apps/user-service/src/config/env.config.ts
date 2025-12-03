
import dotenv from 'dotenv';
dotenv.config();

// ────────────────────────────────────────────────────────────────────────────────
// URLs
// ────────────────────────────────────────────────────────────────────────────────
export const PORT = process.env.PORT || 5002;
export const BASE_URL = process.env.BASE_URL || 'http://localhost:5002';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const API_URL = process.env.API_URL || 'http://localhost:8080/api';

// ────────────────────────────────────────────────────────────────────────────────
// Database (Mongo DB)
// ────────────────────────────────────────────────────────────────────────────────
export const MONGODB_URI = process.env.MONGODB_URI
	? process.env.MONGODB_URI
	: (() => {
		throw new Error('MONGODB_URI is not defined in environment variables');
	})();

// ────────────────────────────────────────────────────────────────────────────────
// API Keys
// ────────────────────────────────────────────────────────────────────────────────
export const API_KEY = process.env.API_KEY
	? process.env.API_KEY
	: (() => {
		throw new Error('API_KEY is not defined in environment variables');
	})();

