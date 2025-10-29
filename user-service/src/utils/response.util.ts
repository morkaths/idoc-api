import { Response } from 'express';

export const success = (res: Response, message = 'Success', data?: any) =>
  res.status(200).json({ success: true, message, ...(data !== undefined ? { data } : {}) });

export const created = (res: Response, message = 'Created', data?: any) =>
  res.status(201).json({ success: true, message, ...(data !== undefined ? { data } : {}) });

export const updated = (res: Response, message = 'Updated', data?: any) =>
  res.status(200).json({ success: true, message, ...(data !== undefined ? { data } : {}) });

export const deleted = (res: Response, message = 'Deleted') =>
  res.status(200).json({ success: true, message });

export const noContent = (res: Response) => res.status(204).send();

export const error = (res: Response, message = 'Bad Request', statusCode = 400, err?: any) =>
  res.status(statusCode).json({ success: false, message, ...(err ? { error: err } : {}) });

export const unauthorized = (res: Response, message = 'Unauthorized') =>
  res.status(401).json({ success: false, message });

export const forbidden = (res: Response, message = 'Forbidden') =>
  res.status(403).json({ success: false, message });

export const notFound = (res: Response, message = 'Not found') =>
  res.status(404).json({ success: false, message });

export const methodNotAllowed = (res: Response, message = 'Method Not Allowed') =>
  res.status(405).json({ success: false, message });

export const requestTimeout = (res: Response, message = 'Request Timeout') =>
  res.status(408).json({ success: false, message });

export const duplicate = (res: Response, message = 'Duplicate resource', err?: any) =>
  res.status(409).json({ success: false, message, ...(err ? { error: err } : {}) });

export const gone = (res: Response, message = 'Gone') =>
  res.status(410).json({ success: false, message });

export const unsupportedMediaType = (res: Response, message = 'Unsupported Media Type') =>
  res.status(415).json({ success: false, message });

export const unprocessable = (res: Response, message = 'Unprocessable Entity', err?: any) =>
  res.status(422).json({ success: false, message, ...(err ? { error: err } : {}) });

export const tooManyRequests = (res: Response, message = 'Too Many Requests') =>
  res.status(429).json({ success: false, message });

export const internalError = (res: Response, message = 'Internal server error', err?: any) =>
  res.status(500).json({ success: false, message, ...(err ? { error: err } : {}) });

export const notImplemented = (res: Response, message = 'Not Implemented') =>
  res.status(501).json({ success: false, message });

export const serviceUnavailable = (res: Response, message = 'Service Unavailable') =>
  res.status(503).json({ success: false, message });

