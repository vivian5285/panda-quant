import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { EthereumProvider } from '../types/ethereum';

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
            const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
            if (accounts.length > 0) {
              setAccount(accounts[0]);
            }

            const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
            setChainId(chainId);
          } catch (error) {
            console.error('Error initializing provider:', error);
            setError('Failed to initialize provider');
          }
        }
      } catch (error) {
        console.error('Error initializing web3:', error);
        setError('Failed to initialize web3');
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    initWeb3();

    return () => {
      mounted = false;
    };
  }, [isInitialized]);

  const connect = async () => {
    if (!window.ethereum) {
      setError('No Ethereum provider found');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      setChainId(chainId);

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError('Failed to connect to wallet');
    }
  };

  const disconnect = () => {
    setProvider(null);
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  const isConnected = () => {
    return !!account;
  };

  return {
    provider,
    account,
    chainId,
    error,
    isInitialized,
    connect,
    disconnect,
    isConnected,
  };
}; 