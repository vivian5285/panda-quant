import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface AssetSummary {
  balance: number;
  voucher: number;
  freePeriodEnd: string | null;
}

export interface PaymentRecord {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission';
  amount: number;
  chain: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface ChainAddress {
  chain: string;
  address: string;
}

export const getAssetSummary = async (): Promise<AssetSummary> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/asset/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset summary:', error);
    throw error;
  }
};

export const getPaymentHistory = async (): Promise<PaymentRecord[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/asset/payment-history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

export const getChainAddresses = async (): Promise<ChainAddress[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/asset/chain-addresses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chain addresses:', error);
    throw error;
  }
}; 