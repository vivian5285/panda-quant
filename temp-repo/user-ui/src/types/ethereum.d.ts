import { Web3Provider } from '@ethersproject/providers';

export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  selectedAddress?: string;
  chainId?: string;
}

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

export {}; 