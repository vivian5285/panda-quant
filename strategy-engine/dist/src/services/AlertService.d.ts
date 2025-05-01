export declare class AlertService {
    private static instance;
    private constructor();
    static getInstance(): AlertService;
    sendAlert(message: string): Promise<void>;
}
