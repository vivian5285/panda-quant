import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'YOUR_PROJECT_ID';

// 2. Create wagmiConfig
const metadata = {
  name: 'PandaQuant',
  description: 'PandaQuant Web3 Application',
  url: 'https://pandaquant.com',
  icons: ['https://pandaquant.com/logo.png']
};

// 配置支持的链
const chains = [mainnet, sepolia] as const;

// 创建 wagmi 配置
const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true
});

// 3. Create modal
createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Roboto, sans-serif',
    '--w3m-color-mix': '#00FFB8',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#00FFB8',
  },
  enableAnalytics: true,
  enableOnramp: true
});

export { wagmiConfig }; 