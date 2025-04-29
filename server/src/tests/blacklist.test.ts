import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { BlacklistEntry } from '../models/blacklist';
import { blacklistService } from '../services/blacklistService';
import { IBlacklistEntry } from '../interfaces/IBlacklistEntry';
import { Blacklist } from '../models/Blacklist';

describe('Blacklist Service', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');
  });

  afterEach(async () => {
    await BlacklistEntry.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create a new blacklist entry', async () => {
    const entryData = {
      userId: '123456',
      username: 'testuser',
      email: 'test@example.com',
      reason: 'Spamming in chat',
      type: 'spam',
      status: 'active',
      expiresAt: new Date(Date.now() + 86400000), // 1 day from now
      notes: 'First offense'
    };

    const entry = await blacklistService.createEntry(entryData);
    expect(entry).toBeDefined();
    expect(entry.userId).toBe(entryData.userId);
    expect(entry.type).toBe(entryData.type);
  });

  it('should get all blacklist entries', async () => {
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

    await blacklistService.createEntry(entryData);
    const entries = await blacklistService.getAllEntries();
    expect(entries).toHaveLength(1);
  });

  it('should get a blacklist entry by id', async () => {
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

    const createdEntry = await blacklistService.createEntry(entryData);
    const entry = await blacklistService.getEntryById(createdEntry._id);
    expect(entry).toBeDefined();
    expect(entry.userId).toBe(entryData.userId);
  });

  it('should update a blacklist entry', async () => {
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

    const createdEntry = await blacklistService.createEntry(entryData);
    const updatedEntry = await blacklistService.updateEntry(createdEntry._id, {
      status: 'expired'
    });
    expect(updatedEntry.status).toBe('expired');
  });

  it('should delete a blacklist entry', async () => {
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

    const createdEntry = await blacklistService.createEntry(entryData);
    await blacklistService.deleteEntry(createdEntry._id);
    const entries = await blacklistService.getAllEntries();
    expect(entries).toHaveLength(0);
  });

  it('should search blacklist entries', async () => {
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

    await blacklistService.createEntry(entryData);
    const entries = await blacklistService.searchEntries({ type: 'spam' });
    expect(entries).toHaveLength(1);
  });
});

describe('Blacklist', () => {
  it('should create a blacklist entry', async () => {
    const entry: Partial<IBlacklistEntry> = {
      userId: '123',
      username: 'testuser',
      email: 'test@example.com',
      reason: 'Test reason',
      type: 'spam' as const,
      status: 'active',
      expiresAt: new Date(),
      notes: 'Test notes'
    };

    const blacklistEntry = await Blacklist.create(entry);
    expect(blacklistEntry).toBeDefined();
    expect(blacklistEntry.userId).toBe(entry.userId);
  });

  it('should update a blacklist entry', async () => {
    const entry = await Blacklist.create({
      userId: '123',
      username: 'testuser',
      email: 'test@example.com',
      reason: 'Test reason',
      type: 'spam' as const,
      status: 'active',
      expiresAt: new Date(),
      notes: 'Test notes'
    });

    const updated = await Blacklist.findByIdAndUpdate(
      entry._id,
      { status: 'inactive' },
      { new: true }
    );

    expect(updated?.status).toBe('inactive');
  });

  it('should delete a blacklist entry', async () => {
    const entry = await Blacklist.create({
      userId: '123',
      username: 'testuser',
      email: 'test@example.com',
      reason: 'Test reason',
      type: 'spam' as const,
      status: 'active',
      expiresAt: new Date(),
      notes: 'Test notes'
    });

    await Blacklist.findByIdAndDelete(entry._id);
    const found = await Blacklist.findById(entry._id);
    expect(found).toBeNull();
  });
}); 