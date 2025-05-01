import { Response, ErrorRequestHandler } from 'express';
export declare function handleError(res: Response, error: any): void;
export declare const errorHandlerMiddleware: ErrorRequestHandler;
