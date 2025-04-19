import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  balance: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const balance = await provider.getBalance(accounts[0]);

      setAccount(accounts[0]);
      setBalance(ethers.formatEther(balance));
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 