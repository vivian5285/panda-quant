"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInvitationService = void 0;
const logger_1 = require("../utils/logger");
class UserInvitationService {
    constructor() {
        this.invitations = new Map();
    }
    static getInstance() {
        if (!UserInvitationService.instance) {
            UserInvitationService.instance = new UserInvitationService();
        }
        return UserInvitationService.instance;
    }
    addInvitation(userId, inviterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInvitations = this.invitations.get(userId) || [];
                const inviterInvitations = this.invitations.get(inviterId) || [];
                // 添加用户邀请记录
                const userInvitation = {
                    userId,
                    inviterId,
                    generation: 1,
                    createdAt: new Date()
                };
                userInvitations.push(userInvitation);
                // 添加邀请人记录
                const inviterInvitation = {
                    userId: inviterId,
                    inviterId: userId,
                    generation: 1,
                    createdAt: new Date()
                };
                inviterInvitations.push(inviterInvitation);
                this.invitations.set(userId, userInvitations);
                this.invitations.set(inviterId, inviterInvitations);
                logger_1.logger.info(`Added invitation: ${inviterId} invited ${userId}`);
            }
            catch (error) {
                logger_1.logger.error(`Error adding invitation: ${error}`);
                throw error;
            }
        });
    }
    getFirstGenerationUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitations = this.invitations.get(userId) || [];
            return invitations
                .filter(inv => inv.generation === 1)
                .map(inv => inv.userId);
        });
    }
    getSecondGenerationUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitations = this.invitations.get(userId) || [];
            const firstGenUsers = yield this.getFirstGenerationUsers(userId);
            const secondGenUsers = [];
            for (const firstGenUser of firstGenUsers) {
                const firstGenInvitations = this.invitations.get(firstGenUser) || [];
                const secondGen = firstGenInvitations
                    .filter(inv => inv.generation === 1)
                    .map(inv => inv.userId);
                secondGenUsers.push(...secondGen);
            }
            return secondGenUsers;
        });
    }
    getInvitationChain(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invitations.get(userId) || [];
        });
    }
    getInviter(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitations = this.invitations.get(userId) || [];
            const directInviter = invitations.find(inv => inv.generation === 1);
            return directInviter === null || directInviter === void 0 ? void 0 : directInviter.inviterId;
        });
    }
}
exports.UserInvitationService = UserInvitationService;
