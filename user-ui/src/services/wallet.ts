import { ethers } from 'ethers';
import { EthereumProvider } from '../types/window';

export class WalletService {
  private static instance: WalletService;
  private provider: ethers.BrowserProvider | null = null;
  private currentWallet: string | null = null;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private getWalletProvider(walletType: string): EthereumProvider | null {
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
  }

  public async connect(walletType: string = 'metamask'): Promise<ethers.BrowserProvider> {
    try {
      this.currentWallet = walletType;
      const provider = this.getWalletProvider(walletType);

      if (!provider) {
        throw new Error(`${walletType} wallet not detected. Please install the wallet extension.`);
      }

      // Request wallet connection
      await provider.request({ method: 'eth_requestAccounts' });
      
      // Create provider
      this.provider = new ethers.BrowserProvider(provider);

      // Setup event listeners
      this.setupEventListeners(provider);

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

  private setupEventListeners(provider: EthereumProvider) {
    if (provider.on) {
      provider.on('accountsChanged', this.handleAccountsChanged);
      provider.on('chainChanged', this.handleChainChanged);
      provider.on('disconnect', this.handleDisconnect);
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

  public disconnect() {
    if (this.provider) {
      const provider = this.getWalletProvider(this.currentWallet || 'metamask');
      if (provider?.removeAllListeners) {
        provider.removeAllListeners('accountsChanged');
        provider.removeAllListeners('chainChanged');
        provider.removeAllListeners('disconnect');
      }
      this.provider = null;
      this.currentWallet = null;
    }
  }

  public getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  public getCurrentWallet(): string | null {
    return this.currentWallet;
  }
} 