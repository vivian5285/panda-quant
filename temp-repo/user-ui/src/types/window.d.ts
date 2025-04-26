import { ethers } from 'ethers';

interface EthereumRequestParams {
  method: string;
  params?: unknown[];
}

interface BaseProvider {
  request: (args: EthereumRequestParams) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

export interface EthereumProvider extends BaseProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isOKXWallet?: boolean;
  isTokenPocket?: boolean;
  isTrustWallet?: boolean;
  isBitKeep?: boolean;
  isMathWallet?: boolean;
  isSafePal?: boolean;
  isImToken?: boolean;
}

interface Web3Interface {
  currentProvider: EthereumProvider | null;
  getSigner: () => ethers.JsonRpcSigner;
  getNetwork: () => Promise<ethers.Network>;
  getBalance: (address: string) => Promise<ethers.BigNumberish>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    web3?: Web3Interface;
    okxwallet?: EthereumProvider;
    tokenpocket?: EthereumProvider;
  }
}

// This export is needed to make this a module
export {}; 