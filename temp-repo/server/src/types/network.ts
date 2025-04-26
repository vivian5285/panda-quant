export interface NetworkStatus {
  network: string;
  status: 'online' | 'offline' | 'checking' | 'error';
  lastChecked: Date;
  blockHeight?: number;
  latency?: number;
  error?: string;
}

export interface NetworkConfig {
  name: string;
  chainId: number | null;
  rpcUrl: string;
  explorerUrl: string;
  symbol: string;
} 