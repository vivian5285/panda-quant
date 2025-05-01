import type { EthereumProvider } from './ethereum';

export type { EthereumProvider };

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    binance?: EthereumProvider;
    coinbase?: EthereumProvider;
    trust?: EthereumProvider;
    bitget?: EthereumProvider;
    okx?: EthereumProvider;
    gate?: EthereumProvider;
    huobi?: EthereumProvider;
    kucoin?: EthereumProvider;
    mexc?: EthereumProvider;
    bybit?: EthereumProvider;
    kraken?: EthereumProvider;
    crypto?: EthereumProvider;
    phantom?: EthereumProvider;
    solflare?: EthereumProvider;
    slope?: EthereumProvider;
    backpack?: EthereumProvider;
    brave?: EthereumProvider;
    opera?: EthereumProvider;
    math?: EthereumProvider;
    tokenpocket?: EthereumProvider;
    safepal?: EthereumProvider;
    imtoken?: EthereumProvider;
    bitkeep?: EthereumProvider;
    onto?: EthereumProvider;
    coin98?: EthereumProvider;
    walletconnect?: EthereumProvider;
    metamask?: EthereumProvider;
  }
} 