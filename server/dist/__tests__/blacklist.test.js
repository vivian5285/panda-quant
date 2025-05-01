"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mongoose_1 = __importDefault(require("mongoose"));
const blacklist_1 = require("../models/blacklist");
const blacklistService_1 = require("../services/blacklistService");
const Blacklist_1 = require("../models/Blacklist");
(0, vitest_1.describe)('Blacklist Service', () => {
    (0, vitest_1.beforeEach)(async () => {
        await mongoose_1.default.connect('mongodb://localhost:27017/test');
    });
    (0, vitest_1.afterEach)(async () => {
        await blacklist_1.BlacklistEntry.deleteMany({});
        await mongoose_1.default.connection.close();
    });
    (0, vitest_1.it)('should create a new blacklist entry', async () => {
        const entryData = {
            userId: '123456',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Spamming in chat',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(Date.now() + 86400000),
            notes: 'First offense'
        };
        const entry = await blacklistService_1.blacklistService.createEntry(entryData);
        (0, vitest_1.expect)(entry).toBeDefined();
        (0, vitest_1.expect)(entry.userId).toBe(entryData.userId);
        (0, vitest_1.expect)(entry.type).toBe(entryData.type);
    });
    (0, vitest_1.it)('should get all blacklist entries', async () => {
        const entryData = {
            userId: '123456',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Spamming in chat',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(Date.now() + 86400000),
            notes: 'First offense'
        };
        await blacklistService_1.blacklistService.createEntry(entryData);
        const entries = await blacklistService_1.blacklistService.getAllEntries();
        (0, vitest_1.expect)(entries).toHaveLength(1);
    });
    (0, vitest_1.it)('should get a blacklist entry by id', async () => {
        const entryData = {
            userId: '123456',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Spamming in chat',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(Date.now() + 86400000),
            notes: 'First offense'
        };
        const createdEntry = await blacklistService_1.blacklistService.createEntry(entryData);
        const entry = await blacklistService_1.blacklistService.getEntryById(createdEntry._id);
        (0, vitest_1.expect)(entry).toBeDefined();
        (0, vitest_1.expect)(entry.userId).toBe(entryData.userId);
    });
    (0, vitest_1.it)('should update a blacklist entry', async () => {
        const entryData = {
            userId: '123456',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Spamming in chat',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(Date.now() + 86400000),
            notes: 'First offense'
        };
        const createdEntry = await blacklistService_1.blacklistService.createEntry(entryData);
        const updatedEntry = await blacklistService_1.blacklistService.updateEntry(createdEntry._id, {
            status: 'expired'
        });
        (0, vitest_1.expect)(updatedEntry.status).toBe('expired');
    });
    (0, vitest_1.it)('should delete a blacklist entry', async () => {
        const entryData = {
            userId: '123456',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Spamming in chat',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(Date.now() + 86400000),
            notes: 'First offense'
        };
        const createdEntry = await blacklistService_1.blacklistService.createEntry(entryData);
        await blacklistService_1.blacklistService.deleteEntry(createdEntry._id);
        const entries = await blacklistService_1.blacklistService.getAllEntries();
        (0, vitest_1.expect)(entries).toHaveLength(0);
    });
    (0, vitest_1.it)('should search blacklist entries', async () => {
        const entryData = {
            userId: '123456',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Spamming in chat',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(Date.now() + 86400000),
            notes: 'First offense'
        };
        await blacklistService_1.blacklistService.createEntry(entryData);
        const entries = await blacklistService_1.blacklistService.searchEntries({ type: 'spam' });
        (0, vitest_1.expect)(entries).toHaveLength(1);
    });
});
(0, vitest_1.describe)('Blacklist', () => {
    (0, vitest_1.it)('should create a blacklist entry', async () => {
        const entry = {
            userId: '123',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Test reason',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(),
            notes: 'Test notes'
        };
        const blacklistEntry = await Blacklist_1.Blacklist.create(entry);
        (0, vitest_1.expect)(blacklistEntry).toBeDefined();
        (0, vitest_1.expect)(blacklistEntry.userId).toBe(entry.userId);
    });
    (0, vitest_1.it)('should update a blacklist entry', async () => {
        const entry = await Blacklist_1.Blacklist.create({
            userId: '123',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Test reason',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(),
            notes: 'Test notes'
        });
        const updated = await Blacklist_1.Blacklist.findByIdAndUpdate(entry._id, { status: 'inactive' }, { new: true });
        (0, vitest_1.expect)(updated === null || updated === void 0 ? void 0 : updated.status).toBe('inactive');
    });
    (0, vitest_1.it)('should delete a blacklist entry', async () => {
        const entry = await Blacklist_1.Blacklist.create({
            userId: '123',
            username: 'testuser',
            email: 'test@example.com',
            reason: 'Test reason',
            type: 'spam',
            status: 'active',
            expiresAt: new Date(),
            notes: 'Test notes'
        });
        await Blacklist_1.Blacklist.findByIdAndDelete(entry._id);
        const found = await Blacklist_1.Blacklist.findById(entry._id);
        (0, vitest_1.expect)(found).toBeNull();
    });
});
//# sourceMappingURL=blacklist.test.js.map