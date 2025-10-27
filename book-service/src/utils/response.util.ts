import { Response } from 'express';

export const sendResponse = (
    res: Response,
    message: string = 'Success',
    data?: any,
    error?: any,
    statusCode: number = 200
) => {
    const payload: Record<string, any> = { success: !error, message };
    if (data !== undefined && data !== null) payload.data = data;
    if (error !== undefined && error !== null) payload.error = error;
    res.status(statusCode).json(payload);
};

export const sendSuccessResponse = (
    res: Response,
    message: string = 'Success',
    data?: any
) => {
    const payload: Record<string, any> = { success: true, message };
    if (data !== undefined && data !== null) payload.data = data;
    res.status(200).json(payload);
};

export const sendCreatedResponse = (
    res: Response,
    message: string = 'Created successfully',
    data?: any,
) => {
    const payload: Record<string, any> = { success: true, message };
    if (data !== undefined && data !== null) payload.data = data;
    res.status(201).json(payload);
};

export const sendUpdatedResponse = (
    res: Response,
    message: string = 'Updated successfully',
    data: any = null,
) => {
    const payload: Record<string, any> = { success: true, message };
    if (data !== undefined && data !== null) payload.data = data;
    res.status(200).json(payload);
}

export const sendDeletedResponse = (
    res: Response,
    message: string = 'Deleted successfully'
) => {
    res.status(200).json({ success: true, message });
};

export const sendNoContentResponse = (res: Response) => {
    res.status(204).send();
};

export const sendErrorResponse = (
    res: Response,
    message: string = 'Bad Request',
    error?: any
) => {
    const payload: Record<string, any> = { success: false, message };
    if (error) payload.error = error;
    res.status(400).json(payload);
};

export const sendUnauthorizedResponse = (
    res: Response,
    message: string = 'Unauthorized'
) => {
    res.status(401).json({ success: false, message });
};

export const sendForbiddenResponse = (
    res: Response,
    message: string = 'Forbidden'
) => {
    res.status(403).json({ success: false, message });
};

export const sendNotFoundResponse = (
    res: Response,
    message: string = 'Resource not found'
) => {
    res.status(404).json({ success: false, message });
};

export const sendInternalServerErrorResponse = (
    res: Response,
    message: string = 'Internal server error',
    error?: any
) => {
    const payload: Record<string, any> = { success: false, message };
    if (error) payload.error = error;
    res.status(500).json(payload);
}

