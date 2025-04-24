import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface UserProfile {
  username: string;
  email: string;
  phone: string;
  enable2FA: boolean;
  enableNotifications: boolean;
  enableAutoTrading: boolean;
}

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/api/user/profile`, profile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/user/change-password`, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async updateSetting(setting: string, value: boolean): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/api/user/settings`, {
        [setting]: value
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }

  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/enable-2fa`);
      return response.data;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw error;
    }
  }

  async verify2FA(token: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/user/verify-2fa`, { token });
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      throw error;
    }
  }

  async disable2FA(token: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/user/disable-2fa`, { token });
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      throw error;
    }
  }
}

export default UserService.getInstance(); 