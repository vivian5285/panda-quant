import { ethers } from 'ethers';
import TronWeb from 'tronweb';
import { IUser, User } from '../../models/user.model';
import { AuthUser } from '../../types/auth';
import { Deposit } from '../models/deposit';
import mongoose from 'mongoose';

declare module 'tronweb' {
  interface TronWeb {
    contract(): any;
  }
}

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

interface IUserWithWallet extends IUser {
  walletAddress?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

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
      address = await retry(async () => {
        const account = await tronWeb.createAccount();
        return account.address.base58;
      });
    } else {
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const wallet = ethers.Wallet.createRandom();
      address = wallet.address;
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      await User.findByIdAndUpdate(
        userId,
        { $push: { depositAddresses: { chain, address } } },
        { session }
      );

      await session.commitTransaction();
      return address;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createDepositRecord(userId: string, chain: string, amount: string, transactionHash: string) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const deposit = new Deposit({
        userId,
        amount: parseFloat(amount),
        currency: chain,
        transactionHash,
        status: 'pending'
      });

      await deposit.save({ session });

      // 更新用户的总存款金额
      await User.findByIdAndUpdate(
        userId,
        { $inc: { totalDeposits: parseFloat(amount) } },
        { session }
      );

      await session.commitTransaction();
      return deposit;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getDepositRecords(userId: string) {
    return await Deposit.find({ userId }).sort({ createdAt: -1 });
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
    try {
      status = await retry(async () => {
        if (chain === 'TRX') {
          const tronWeb = new TronWeb({
            fullHost: config.rpcUrl,
            headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY || '' }
          });
          const tx = await tronWeb.trx.getTransaction(transactionHash);
          return tx?.ret?.[0]?.contractRet === 'SUCCESS' ? 'completed' : 'failed';
        } else {
          const provider = new ethers.JsonRpcProvider(config.rpcUrl);
          const tx = await provider.getTransaction(transactionHash);
          if (!tx) return 'pending';
          const receipt = await tx.wait();
          return receipt?.status === 1 ? 'completed' : 'failed';
        }
      });
    } catch (error) {
      console.error('Error checking transaction status:', error);
      status = 'failed';
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const deposit = await Deposit.findOne({ transactionHash }).session(session);
      if (deposit) {
        if (status === 'failed' && deposit.status === 'completed') {
          // 如果之前是完成状态，现在变成失败，需要回滚用户的总存款金额
          await User.findByIdAndUpdate(
            userId,
            { $inc: { totalDeposits: -deposit.amount } },
            { session }
          );
        }

        deposit.status = status;
        await deposit.save({ session });
      }

      await session.commitTransaction();
      return status;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createDeposit(user: AuthUser) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const wallet = ethers.Wallet.createRandom();
      const userDoc = await User.findById(user.id).session(session);
      if (!userDoc) {
        throw new Error('User not found');
      }

      (userDoc as IUserWithWallet).walletAddress = wallet.address;
      await userDoc.save({ session });

      await session.commitTransaction();
      return {
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error('Failed to create deposit');
    } finally {
      session.endSession();
    }
  }

  // 添加数据同步检查机制
  async validateDepositData(userId: string) {
    const deposits = await Deposit.find({ userId });
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const calculatedTotal = deposits
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);

    if (user.totalDeposits !== calculatedTotal) {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        
        await User.findByIdAndUpdate(
          userId,
          { totalDeposits: calculatedTotal },
          { session }
        );

        await session.commitTransaction();
        console.log(`Fixed deposit total for user ${userId}`);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
  }
}

export const depositService = new DepositService();