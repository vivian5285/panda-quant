import { ethers } from 'ethers';

// 使用更具体的类型定义
type MetaMaskProvider = {
  isMetaMask: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (params?: any) => void) => void;
  removeListener: (event: string, callback: (params?: any) => void) => void;
};

// 只在类型声明中扩展 Window 接口
declare global {
  interface Window {
    ethereum?: MetaMaskProvider & ethers.Eip1193Provider;
  }
}

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