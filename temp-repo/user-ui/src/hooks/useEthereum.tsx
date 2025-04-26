import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useEthereum = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);

      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (...args: unknown[]) => {
        const chainId = args[0] as string;
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // 初始设置
      web3Provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      });

      web3Provider.getNetwork().then(network => {
        setChainId(Number(network.chainId));
      });

      setProvider(web3Provider);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connect = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask');
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const network = await web3Provider.getNetwork();
      setChainId(Number(network.chainId));
      setProvider(web3Provider);
      setError(null);

      return web3Provider;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      throw err;
    }
  };

  return {
    provider,
    account,
    chainId,
    error,
    connect
  };
}; 