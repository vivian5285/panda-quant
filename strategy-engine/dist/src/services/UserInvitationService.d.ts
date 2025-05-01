export interface UserInvitation {
    userId: string;
    inviterId: string;
    generation: number;
    createdAt: Date;
}
export declare class UserInvitationService {
    private static instance;
    private invitations;
    private constructor();
    static getInstance(): UserInvitationService;
    addInvitation(userId: string, inviterId: string): Promise<void>;
    getFirstGenerationUsers(userId: string): Promise<string[]>;
    getSecondGenerationUsers(userId: string): Promise<string[]>;
    getInvitationChain(userId: string): Promise<UserInvitation[]>;
    getInviter(userId: string): Promise<string | undefined>;
}
