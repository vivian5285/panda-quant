import { logger } from '../utils/logger';

export interface UserInvitation {
  userId: string;
  inviterId: string;
  generation: number;
  createdAt: Date;
}

export class UserInvitationService {
  private static instance: UserInvitationService;
  private invitations: Map<string, UserInvitation[]>;

  private constructor() {
    this.invitations = new Map();
  }

  public static getInstance(): UserInvitationService {
    if (!UserInvitationService.instance) {
      UserInvitationService.instance = new UserInvitationService();
    }
    return UserInvitationService.instance;
  }

  public async addInvitation(userId: string, inviterId: string): Promise<void> {
    try {
      const userInvitations = this.invitations.get(userId) || [];
      const inviterInvitations = this.invitations.get(inviterId) || [];

      // 添加用户邀请记录
      const userInvitation: UserInvitation = {
        userId,
        inviterId,
        generation: 1,
        createdAt: new Date()
      };
      userInvitations.push(userInvitation);

      // 添加邀请人记录
      const inviterInvitation: UserInvitation = {
        userId: inviterId,
        inviterId: userId,
        generation: 1,
        createdAt: new Date()
      };
      inviterInvitations.push(inviterInvitation);

      this.invitations.set(userId, userInvitations);
      this.invitations.set(inviterId, inviterInvitations);

      logger.info(`Added invitation: ${inviterId} invited ${userId}`);
    } catch (error) {
      logger.error(`Error adding invitation: ${error}`);
      throw error;
    }
  }

  public async getFirstGenerationUsers(userId: string): Promise<string[]> {
    const invitations = this.invitations.get(userId) || [];
    return invitations
      .filter(inv => inv.generation === 1)
      .map(inv => inv.userId);
  }

  public async getSecondGenerationUsers(userId: string): Promise<string[]> {
    const invitations = this.invitations.get(userId) || [];
    const firstGenUsers = await this.getFirstGenerationUsers(userId);
    const secondGenUsers: string[] = [];

    for (const firstGenUser of firstGenUsers) {
      const firstGenInvitations = this.invitations.get(firstGenUser) || [];
      const secondGen = firstGenInvitations
        .filter(inv => inv.generation === 1)
        .map(inv => inv.userId);
      secondGenUsers.push(...secondGen);
    }

    return secondGenUsers;
  }

  public async getInvitationChain(userId: string): Promise<UserInvitation[]> {
    return this.invitations.get(userId) || [];
  }

  public async getInviter(userId: string): Promise<string | undefined> {
    const invitations = this.invitations.get(userId) || [];
    const directInviter = invitations.find(inv => inv.generation === 1);
    return directInviter?.inviterId;
  }
} 