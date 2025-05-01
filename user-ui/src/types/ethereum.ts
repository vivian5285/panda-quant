import { Eip1193Provider } from 'ethers';

export interface EthereumProvider extends Eip1193Provider {
  isMetaMask?: boolean;
  isOkxWallet?: boolean;
  isTokenPocket?: boolean;
  isTrustWallet?: boolean;
  isBitKeep?: boolean;
  isMathWallet?: boolean;
  isSafePal?: boolean;
  isImToken?: boolean;
  isZerion?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: (params: any) => void) => void;
  removeListener: (eventName: string, callback: (params: any) => void) => void;
  removeAllListeners: (eventName: string) => void;
  selectedAddress?: string;
  chainId?: string;
} 