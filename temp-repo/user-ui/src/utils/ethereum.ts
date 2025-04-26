// 处理ethereum注入问题
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const getEthereum = () => {
  if (typeof window === 'undefined') return null;
  
  // 检查是否已经存在ethereum对象
  if (window.ethereum) {
    return window.ethereum;
  }
  
  // 如果没有ethereum对象，返回null
  return null;
};

export const isMetaMaskInstalled = () => {
  return !!getEthereum()?.isMetaMask;
};

export const isWalletConnected = async () => {
  const ethereum = getEthereum();
  if (!ethereum) return false;
  
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
}; 