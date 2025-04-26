import { ethers } from 'ethers';

export class Web3Service {
  private static instance: Web3Service;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private account: string | null = null;
  private balance: string | null = null;
  private chainId: number | null = null;

  private constructor() {}

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  public getInjectedProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }
    return null;
  }

  public async connect(): Promise<ethers.BrowserProvider> {
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = await this.signer.getAddress();
      
      if (this.account) {
        const balance = await this.provider.getBalance(this.account);
        this.balance = ethers.formatEther(balance);
      }
      
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);
      
      return this.provider;
    } catch (error) {
      console.error('Error connecting to Ethereum:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.balance = null;
    this.chainId = null;
  }

  public async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }

  public getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  public getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  public getAccount(): string | null {
    return this.account;
  }

  public getBalance(): string | null {
    return this.balance;
  }

  public getChainId(): number | null {
    return this.chainId;
  }
}

const web3Service = Web3Service.getInstance();
export default web3Service; 