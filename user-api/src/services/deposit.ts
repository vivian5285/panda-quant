import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import TronWeb from 'tronweb';
import { IUser } from '../models/user';
import { Request } from 'express';
import { AuthUser } from '../middleware/auth';
import User from '../models/User';

declare module 'tronweb' {
  interface TronWeb {
    contract(): any;
  }
}

const prisma = new PrismaClient();

interface ChainConfig {
  rpcUrl: string;
  contractAddress: string;
}

const chainConfigs: Record<string, ChainConfig> = {
  OP: {
    rpcUrl: process.env.OP_RPC_URL || '',
    contractAddress: process.env.OP_CONTRACT_ADDRESS || ''
  },
  MATIC: {
    rpcUrl: process.env.MATIC_RPC_URL || '',
    contractAddress: process.env.MATIC_CONTRACT_ADDRESS || ''
  },
  BSC: {
    rpcUrl: process.env.BSC_RPC_URL || '',
    contractAddress: process.env.BSC_CONTRACT_ADDRESS || ''
  },
  ARB: {
    rpcUrl: process.env.ARB_RPC_URL || '',
    contractAddress: process.env.ARB_CONTRACT_ADDRESS || ''
  },
  TRX: {
    rpcUrl: process.env.TRX_RPC_URL || '',
    contractAddress: process.env.TRX_CONTRACT_ADDRESS || ''
  }
};

export class DepositService {
  async getDepositAddress(userId: string, chain: string): Promise<string> {
    const config = chainConfigs[chain];
    if (!config) {
      throw new Error('Invalid chain');
    }

    if (!config.rpcUrl) {
      throw new Error(`RPC URL not configured for chain ${chain}`);
    }

    let address: string;
    if (chain === 'TRX') {
      const tronWeb = new TronWeb({
        fullHost: config.rpcUrl,
        headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY || '' }
      });
      address = await tronWeb.createAccount().then((account: any) => account.address.base58);
    } else {
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const wallet = ethers.Wallet.createRandom();
      address = wallet.address;
    }

    await prisma.depositAddress.create({
      data: {
        userId,
        chain,
        address
      }
    });

    return address;
  }

  async createDepositRecord(userId: string, chain: string, amount: string, transactionHash: string) {
    return await prisma.depositRecord.create({
      data: {
        userId,
        chain,
        amount,
        transactionHash
      }
    });
  }

  async getDepositRecords(userId: string) {
    return await prisma.depositRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async checkDepositStatus(userId: string, transactionHash: string, chain: string) {
    const config = chainConfigs[chain];
    if (!config) {
      throw new Error('Invalid chain');
    }

    if (!config.rpcUrl) {
      throw new Error(`RPC URL not configured for chain ${chain}`);
    }

    let status = 'pending';
    if (chain === 'TRX') {
      const tronWeb = new TronWeb({
        fullHost: config.rpcUrl,
        headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY || '' }
      });
      const tx = await tronWeb.trx.getTransaction(transactionHash);
      if (tx && tx.ret && tx.ret[0]) {
        status = tx.ret[0].contractRet === 'SUCCESS' ? 'completed' : 'failed';
      }
    } else {
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const tx = await provider.getTransaction(transactionHash);
      if (tx) {
        const receipt = await tx.wait();
        if (receipt) {
          status = receipt.status === 1 ? 'completed' : 'failed';
        }
      }
    }

    const record = await prisma.depositRecord.findFirst({
      where: { transactionHash }
    });

    if (record) {
      await prisma.depositRecord.update({
        where: { id: record.id },
        data: { status }
      });
    }

    return status;
  }
}

export const depositService = new DepositService();

export const createDeposit = async (user: AuthUser) => {
    try {
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        
        const userDoc = await User.findById(user.id);
        if (!userDoc) {
            throw new Error('User not found');
        }
        
        userDoc.walletAddress = address;
        await userDoc.save();
        
        return {
            address,
            privateKey: wallet.privateKey
        };
    } catch (error) {
        throw new Error('Failed to create deposit');
    }
}; 