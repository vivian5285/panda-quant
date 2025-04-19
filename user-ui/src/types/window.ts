import { ethers } from 'ethers';

export interface EthereumProvider extends ethers.Eip1193Provider {
  isMetaMask?: boolean;
  isOkxWallet?: boolean;
  isTokenPocket?: boolean;
  isTrustWallet?: boolean;
  isBitKeep?: boolean;
  isMathWallet?: boolean;
  isSafePal?: boolean;
  isImToken?: boolean;
  isZerion?: boolean;
  removeAllListeners?: (event: string) => void;
  on?: (event: string, callback: (...args: any[]) => void) => void;
} 