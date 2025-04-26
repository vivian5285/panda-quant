import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface ReferralSummary {
  referrer: {
    id: string;
    username: string;
    commission: number;
  } | null;
  referrals: Array<{
    id: string;
    username: string;
    commission: number;
  }>;
  totalCommission: number;
}

export const getReferralSummary = async (): Promise<ReferralSummary> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/referral/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching referral summary:', error);
    throw error;
  }
}; 