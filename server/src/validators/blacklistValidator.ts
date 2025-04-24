import { IBlacklistEntry } from '../models/blacklist';

export function validateBlacklistEntry(entryData: Partial<IBlacklistEntry>): string | null {
  // 验证必填字段
  if (!entryData.userId) {
    return '用户ID是必需的';
  }
  if (!entryData.username) {
    return '用户名是必需的';
  }
  if (!entryData.email) {
    return '邮箱是必需的';
  }
  if (!entryData.reason) {
    return '加入黑名单原因是必需的';
  }
  if (!entryData.type) {
    return '黑名单类型是必需的';
  }

  // 验证用户名长度
  if (entryData.username && (entryData.username.length < 2 || entryData.username.length > 50)) {
    return '用户名长度必须在2-50个字符之间';
  }

  // 验证邮箱格式
  if (entryData.email && !/^\S+@\S+\.\S+$/.test(entryData.email)) {
    return '请输入有效的邮箱地址';
  }

  // 验证原因长度
  if (entryData.reason && (entryData.reason.length < 10 || entryData.reason.length > 500)) {
    return '原因描述长度必须在10-500个字符之间';
  }

  // 验证黑名单类型
  const validTypes = ['spam', 'fraud', 'abuse', 'other'];
  if (entryData.type && !validTypes.includes(entryData.type)) {
    return '无效的黑名单类型';
  }

  // 验证状态
  const validStatuses = ['active', 'expired'];
  if (entryData.status && !validStatuses.includes(entryData.status)) {
    return '无效的状态';
  }

  // 验证过期时间
  if (entryData.expiresAt && entryData.expiresAt <= new Date()) {
    return '过期时间必须大于当前时间';
  }

  // 验证备注长度
  if (entryData.notes && entryData.notes.length > 1000) {
    return '备注不能超过1000个字符';
  }

  return null;
} 