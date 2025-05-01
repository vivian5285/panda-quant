import { ethers } from 'ethers';
import { useEffect } from 'react';
import { EthereumProvider } from '../types/ethereum';

const handleAccountsChanged = (accounts: string[]) => {
  if (accounts.length === 0) {
    // 用户已断开连接
    console.log('Please connect to MetaMask');
  } else {
    // 用户已切换账户
    console.log('Account changed:', accounts[0]);
  }
};

const handleChainChanged = (chainId: string) => {
  // 网络已更改
  console.log('Chain changed:', chainId);
  window.location.reload();
};

export const useMetaMask = () => {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // ... existing code ...
};

let injectedProvider: ethers.BrowserProvider | null = null;

export const getInjectedProvider = async () => {
  if (injectedProvider) {
    return injectedProvider;
  }

  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // 检查是否是 MetaMask
      const isMetaMask = window.ethereum.isMetaMask;
      if (!isMetaMask) {
        console.warn('Non-MetaMask provider detected');
        return null;
      }

      // 请求用户授权
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // 创建 provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      injectedProvider = provider;
      
      // 监听账户变化
      const handleAccountsChanged = () => {
        window.location.reload();
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // 清理函数
      const cleanup = () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };

      return provider;
    } catch (error) {
      console.error('Error initializing MetaMask:', error);
      return null;
    }
  }

  return null;
};

export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && window.ethereum?.isMetaMask;
};

export const connectMetaMask = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const provider = await getInjectedProvider();
    if (!provider) {
      throw new Error('Failed to initialize MetaMask');
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return {
      provider,
      signer,
      address,
      network,
    };
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

useEffect(() => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
  }

  return () => {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  };
}, []); 