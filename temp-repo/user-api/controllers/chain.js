const Chain = require('../models/chain');
const logger = require('../utils/logger');

// 获取所有链地址
exports.getAllChains = async (req, res) => {
  try {
    const chains = await Chain.find().sort({ createdAt: -1 });
    res.json(chains);
  } catch (error) {
    logger.error('获取链地址列表失败:', error);
    res.status(500).json({ message: '获取链地址列表失败' });
  }
};

// 创建新链地址
exports.createChain = async (req, res) => {
  try {
    const { name, address } = req.body;

    // 检查名称是否已存在
    const existingChain = await Chain.findOne({ name });
    if (existingChain) {
      return res.status(400).json({ message: '该链名称已存在' });
    }

    const chain = new Chain({
      name,
      address
    });

    await chain.save();
    res.status(201).json(chain);
  } catch (error) {
    logger.error('创建链地址失败:', error);
    res.status(500).json({ message: '创建链地址失败' });
  }
};

// 更新链地址
exports.updateChain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, isActive } = req.body;

    // 检查名称是否与其他链重复
    if (name) {
      const existingChain = await Chain.findOne({ name, _id: { $ne: id } });
      if (existingChain) {
        return res.status(400).json({ message: '该链名称已存在' });
      }
    }

    const chain = await Chain.findByIdAndUpdate(
      id,
      { name, address, isActive },
      { new: true, runValidators: true }
    );

    if (!chain) {
      return res.status(404).json({ message: '链地址不存在' });
    }

    res.json(chain);
  } catch (error) {
    logger.error('更新链地址失败:', error);
    res.status(500).json({ message: '更新链地址失败' });
  }
};

// 删除链地址
exports.deleteChain = async (req, res) => {
  try {
    const { id } = req.params;
    const chain = await Chain.findByIdAndDelete(id);

    if (!chain) {
      return res.status(404).json({ message: '链地址不存在' });
    }

    res.json({ message: '链地址已删除' });
  } catch (error) {
    logger.error('删除链地址失败:', error);
    res.status(500).json({ message: '删除链地址失败' });
  }
}; 