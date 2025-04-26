declare module 'tronweb' {
  interface TronWebConfig {
    fullHost: string;
    headers?: Record<string, string>;
  }

  interface Account {
    address: {
      base58: string;
    };
  }

  interface Transaction {
    ret: Array<{
      contractRet: string;
    }>;
  }

  class TronWeb {
    constructor(config: TronWebConfig);
    createAccount(): Promise<Account>;
    trx: {
      getTransaction(hash: string): Promise<Transaction>;
    };
  }

  export default TronWeb;
} 