import { Request, Response } from 'express';
import Chain from '../models/chain.model';

// 获取所有链
export const getChains = async (req: Request, res: Response) => {
  try {
    const chains = await Chain.find().sort({ createdAt: -1 });
    res.json(chains);
  } catch (error) {
    console.error('Error getting chains:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 创建新链
export const createChain = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;

    // 验证链名称是否已存在
    const existingChain = await Chain.findOne({ name });
    if (existingChain) {
      return res.status(400).json({ message: 'Chain name already exists' });
    }

    const chain = await Chain.create({
      name,
      address,
      isActive: true
    });

    res.status(201).json(chain);
  } catch (error) {
    console.error('Error creating chain:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 更新链
export const updateChain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    // 验证链是否存在
    const chain = await Chain.findById(id);
    if (!chain) {
      return res.status(404).json({ message: 'Chain not found' });
    }

    // 如果更新名称，检查新名称是否已存在
    if (name && name !== chain.name) {
      const existingChain = await Chain.findOne({ name });
      if (existingChain) {
        return res.status(400).json({ message: 'Chain name already exists' });
      }
    }

    // 更新链信息
    chain.name = name || chain.name;
    chain.address = address || chain.address;
    await chain.save();

    res.json(chain);
  } catch (error) {
    console.error('Error updating chain:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 删除链
export const deleteChain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chain = await Chain.findById(id);
    if (!chain) {
      return res.status(404).json({ message: 'Chain not found' });
    }

    await chain.deleteOne();
    res.json({ message: 'Chain deleted successfully' });
  } catch (error) {
    console.error('Error deleting chain:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 