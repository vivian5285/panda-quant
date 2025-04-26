import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import { Web3 } from 'web3';
import { TronWeb } from 'tronweb';

const prisma = new PrismaClient();

// 配置各个链的节点
const chainConfigs = {
  OP: {
    rpcUrl: process.env.OP_RPC_URL,
    contractAddress: process.env.OP_USDT_CONTRACT,
  },
  MATIC: {
    rpcUrl: process.env.MATIC_RPC_URL,
    contractAddress: process.env.MATIC_USDT_CONTRACT,
  },
  BSC: {
    rpcUrl: process.env.BSC_RPC_URL,
    contractAddress: process.env.BSC_USDT_CONTRACT,
  },
  ARB: {
    rpcUrl: process.env.ARB_RPC_URL,
    contractAddress: process.env.ARB_USDT_CONTRACT,
  },
  TRX: {
    fullNode: process.env.TRX_FULL_NODE,
    solidityNode: process.env.TRX_SOLIDITY_NODE,
    eventServer: process.env.TRX_EVENT_SERVER,
    contractAddress: process.env.TRX_USDT_CONTRACT,
  }
};

export class DepositService {
  private async getEthereumProvider(chain: string) {
    const config = chainConfigs[chain];
    return new ethers.providers.JsonRpcProvider(config.rpcUrl);
  }

  private async getTronWeb() {
    const config = chainConfigs.TRX;
    return new TronWeb({
      fullHost: config.fullNode,
      solidityNode: config.solidityNode,
      eventServer: config.eventServer,
    });
  }

  async getDepositAddress(userId: string, chain: string): Promise<string> {
    // 检查是否已有该链的地址
    const existingAddress = await prisma.depositAddress.findFirst({
      where: {
        userId,
        chain,
      },
    });

    if (existingAddress) {
      return existingAddress.address;
    }

    // 生成新地址
    let address: string;
    if (chain === 'TRX') {
      const tronWeb = await this.getTronWeb();
      const account = await tronWeb.createAccount();
      address = account.address.base58;
    } else {
      const wallet = ethers.Wallet.createRandom();
      address = wallet.address;
    }

    // 保存地址到数据库
    await prisma.depositAddress.create({
      data: {
        userId,
        chain,
        address,
      },
    });

    return address;
  }

  async checkDepositStatus(userId: string, transactionHash: string, chain: string): Promise<string> {
    if (chain === 'TRX') {
      const tronWeb = await this.getTronWeb();
      const tx = await tronWeb.trx.getTransaction(transactionHash);
      return tx.ret[0].contractRet === 'SUCCESS' ? 'completed' : 'pending';
    } else {
      const provider = await this.getEthereumProvider(chain);
      const receipt = await provider.getTransactionReceipt(transactionHash);
      return receipt?.status === 1 ? 'completed' : 'pending';
    }
  }

  async getDepositHistory(userId: string) {
    return prisma.depositRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async startDepositMonitor() {
    // 启动各个链的监听器
    for (const chain of Object.keys(chainConfigs)) {
      if (chain === 'TRX') {
        this.startTronMonitor();
      } else {
        this.startEthereumMonitor(chain);
      }
    }
  }

  private async startTronMonitor() {
    const tronWeb = await this.getTronWeb();
    const contractAddress = chainConfigs.TRX.contractAddress;

    tronWeb.contract().at(contractAddress).then(contract => {
      contract.Transfer().watch((err, event) => {
        if (err) return;
        this.handleDepositEvent('TRX', event);
      });
    });
  }

  private async startEthereumMonitor(chain: string) {
    const provider = await this.getEthereumProvider(chain);
    const contractAddress = chainConfigs[chain].contractAddress;

    const contract = new ethers.Contract(
      contractAddress,
      ['event Transfer(address indexed from, address indexed to, uint256 value)'],
      provider
    );

    contract.on('Transfer', (from, to, value) => {
      this.handleDepositEvent(chain, { from, to, value });
    });
  }

  private async handleDepositEvent(chain: string, event: any) {
    const toAddress = chain === 'TRX' ? event.to : event.args.to;
    const amount = chain === 'TRX' ? event.value : event.args.value;
    const transactionHash = event.transactionHash;

    // 查找对应的用户
    const depositAddress = await prisma.depositAddress.findFirst({
      where: {
        address: toAddress,
        chain,
      },
    });

    if (depositAddress) {
      // 创建充值记录
      await prisma.depositRecord.create({
        data: {
          userId: depositAddress.userId,
          chain,
          amount: amount.toString(),
          status: 'completed',
          transactionHash,
        },
      });

      // 更新用户余额
      await prisma.user.update({
        where: { id: depositAddress.userId },
        data: {
          balance: {
            increment: amount.toString(),
          },
        },
      });
    }
  }
} 