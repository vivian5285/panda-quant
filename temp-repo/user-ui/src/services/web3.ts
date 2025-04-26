import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthereumProvider } from '../types/window';

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    okxwallet?: EthereumProvider;
    tokenpocket?: EthereumProvider;
  }
}

const getInjectedProvider = (walletType: string): EthereumProvider | null => {
  if (typeof window === 'undefined') return null;
  
  switch (walletType) {
    case 'metamask':
      return window.ethereum?.isMetaMask ? window.ethereum : null;
    case 'okx':
      return window.okxwallet || null;
    case 'tokenpocket':
      return window.tokenpocket || null;
    default:
      return window.ethereum || null;
  }
};

export const useWeb3 = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }

          const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
          setChainId(parseInt(chainId, 16));
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      }
    };

    initProvider();
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      setAccount(accounts[0]);

      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      setChainId(parseInt(chainId, 16));

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      return provider;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  };

  return {
    provider,
    account,
    chainId,
    connect
  };
};

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private currentWalletType: string = 'metamask';

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethereum = window.ethereum;
      if (ethereum.on) {
        ethereum.on('accountsChanged', this.handleAccountsChanged);
        ethereum.on('chainChanged', this.handleChainChanged);
        ethereum.on('disconnect', this.handleDisconnect);
      }
    }
  }

  private handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.disconnect();
    }
  };

  private handleChainChanged = (chainId: string) => {
    window.location.reload();
  };

  private handleDisconnect = () => {
    this.disconnect();
  };

  private getProviderByType(walletType: string): EthereumProvider | null {
    if (typeof window === 'undefined') return null;

    const ethereum = window.ethereum;
    if (!ethereum) return null;

    switch (walletType) {
      case 'metamask':
        return ethereum.isMetaMask ? ethereum : null;
      case 'okx':
        return ethereum.isOkxWallet ? ethereum : null;
      case 'tokenpocket':
        return ethereum.isTokenPocket ? ethereum : null;
      case 'trustwallet':
        return ethereum.isTrustWallet ? ethereum : null;
      case 'bitkeep':
        return ethereum.isBitKeep ? ethereum : null;
      case 'mathwallet':
        return ethereum.isMathWallet ? ethereum : null;
      case 'safepal':
        return ethereum.isSafePal ? ethereum : null;
      case 'imtoken':
        return ethereum.isImToken ? ethereum : null;
      case 'zerion':
        return ethereum.isZerion ? ethereum : null;
      default:
        return ethereum;
    }
  }

  async connect(walletType: string = 'metamask') {
    try {
      this.currentWalletType = walletType;
      const provider = this.getProviderByType(walletType);

      if (!provider) {
        throw new Error(`${walletType} wallet not detected. Please install the wallet extension.`);
      }

      // 请求连接钱包
      await provider.request({ method: 'eth_requestAccounts' });
      
      // 创建 provider 和 signer
      this.provider = new ethers.BrowserProvider(provider);
      this.signer = await this.provider.getSigner();

      // 验证连接
      const address = await this.signer.getAddress();
      if (!address) {
        throw new Error('Failed to get wallet address');
      }

      return this.provider;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      if (error instanceof Error) {
        if (error.message.includes('User denied account access')) {
          throw new Error('Wallet connection was rejected by user');
        } else if (error.message.includes('wallet not detected')) {
          throw new Error(`${walletType} wallet not detected. Please install the wallet extension.`);
        }
      }
      throw error;
    }
  }

  async getAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('Not connected to wallet');
    }
    return await this.signer.getAddress();
  }

  async getBalance(): Promise<string> {
    if (!this.provider || !this.signer) {
      throw new Error('Not connected to wallet');
    }
    const address = await this.signer.getAddress();
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Not connected to wallet');
    }
    return await this.signer.signMessage(message);
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.currentWalletType = 'metamask';
  }

  isConnected(): boolean {
    return this.signer !== null;
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  getCurrentWalletType(): string {
    return this.currentWalletType;
  }
}

// 导出单例实例
const web3Service = new Web3Service();
export default web3Service; 