import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    okxwallet?: EthereumProvider;
    tokenpocket?: EthereumProvider;
    trustwallet?: EthereumProvider;
    bitkeep?: EthereumProvider;
    mathwallet?: EthereumProvider;
    safepal?: EthereumProvider;
    imToken?: EthereumProvider;
    web3?: Web3Provider;
  }
}

export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  selectedAddress?: string;
  chainId?: string;
}

export const useWeb3 = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initWeb3 = async () => {
      try {
        // 等待 MetaMask 注入完成
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
          // 避免重复初始化
          if (isInitialized) return;

          // 创建 provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          if (!mounted) return;
          setProvider(provider);

          try {
            const accounts = await provider.send('eth_accounts', []);
            if (mounted && accounts.length > 0) {
              setAccount(accounts[0]);
            }

            const chainId = await provider.send('eth_chainId', []);
            if (mounted) {
              setChainId(chainId);
            }
          } catch (err) {
            console.warn('Failed to get initial accounts or chainId:', err);
          }

          const handleAccountsChanged = (...args: unknown[]) => {
            if (mounted) {
              const accounts = args[0] as string[];
              setAccount(accounts[0] || null);
            }
          };

          const handleChainChanged = (...args: unknown[]) => {
            if (mounted) {
              const chainId = args[0] as string;
              setChainId(chainId);
              // 不要自动刷新页面，让用户决定是否刷新
              // window.location.reload();
            }
          };

          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);

          setIsInitialized(true);

          return () => {
            if (window.ethereum) {
              window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
              window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
          };
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to initialize Web3');
          console.error('Web3 initialization error:', err);
        }
      }
    };

    initWeb3();

    return () => {
      mounted = false;
    };
  }, [isInitialized]);

  const connect = async () => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window is not defined');
      }

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        return accounts[0];
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Web3 wallet';
      setError(errorMessage);
      console.error('Web3 connection error:', err);
      throw err;
    }
  };

  return {
    provider,
    account,
    chainId,
    error,
    connect,
    isInitialized,
  };
}; 