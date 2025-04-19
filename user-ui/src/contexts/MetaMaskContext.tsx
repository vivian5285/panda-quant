import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectMetaMask, isMetaMaskInstalled } from '../utils/metamask';

interface MetaMaskContextType {
  isConnected: boolean;
  address: string | null;
  network: ethers.Network | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export const MetaMaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<ethers.Network | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setError(null);
      const { address, network } = await connectMetaMask();
      setAddress(address);
      setNetwork(network);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to MetaMask');
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setNetwork(null);
    setIsConnected(false);
    setError(null);
  };

  return (
    <MetaMaskContext.Provider
      value={{
        isConnected,
        address,
        network,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
}; 