const Chain = require('../models/chain');
const logger = require('../utils/logger');

// 获取所有链地址
exports.getAllChains = async (req, res) => {
  try {
    const chains = await Chain.find({ isActive: true })
      .select('name address network')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: chains
    });
  } catch (error) {
    logger.error('获取链地址列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取链地址列表失败'
    });
  }
};

// 创建新链地址
exports.createChain = async (req, res) => {
  try {
    const { name, address, network } = req.body;

    // 检查链名称是否已存在
    const existingChain = await Chain.findOne({ name });
    if (existingChain) {
      return res.status(400).json({
        success: false,
        message: '链名称已存在'
      });
    }

    const chain = new Chain({
      name,
      address,
      network
    });

    await chain.save();

    res.status(201).json({
      success: true,
      data: chain
    });
  } catch (error) {
    logger.error('创建链地址失败:', error);
    res.status(500).json({
      success: false,
      message: '创建链地址失败'
    });
  }
};

// 更新链地址
exports.updateChain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, network, isActive } = req.body;

    const chain = await Chain.findById(id);
    if (!chain) {
      return res.status(404).json({
        success: false,
        message: '链地址不存在'
      });
    }

    // 如果更新名称，检查新名称是否已存在
    if (name && name !== chain.name) {
      const existingChain = await Chain.findOne({ name });
      if (existingChain) {
        return res.status(400).json({
          success: false,
          message: '链名称已存在'
        });
      }
    }

    // 更新字段
    if (name) chain.name = name;
    if (address) chain.address = address;
    if (network) chain.network = network;
    if (typeof isActive === 'boolean') chain.isActive = isActive;

    await chain.save();

    res.json({
      success: true,
      data: chain
    });
  } catch (error) {
    logger.error('更新链地址失败:', error);
    res.status(500).json({
      success: false,
      message: '更新链地址失败'
    });
  }
};

// 删除链地址
exports.deleteChain = async (req, res) => {
  try {
    const { id } = req.params;

    const chain = await Chain.findById(id);
    if (!chain) {
      return res.status(404).json({
        success: false,
        message: '链地址不存在'
      });
    }

    await chain.remove();

    res.json({
      success: true,
      message: '链地址已删除'
    });
  } catch (error) {
    logger.error('删除链地址失败:', error);
    res.status(500).json({
      success: false,
      message: '删除链地址失败'
    });
  }
}; 