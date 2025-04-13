const Chain = require('../models/chain.model');

// 获取所有链地址
exports.getChains = async (req, res) => {
  try {
    const chains = await Chain.find().sort({ createdAt: -1 });
    res.json(chains);
  } catch (error) {
    console.error('Error fetching chains:', error);
    res.status(500).json({ message: 'Error fetching chains' });
  }
};

// 创建新链地址
exports.createChain = async (req, res) => {
  try {
    const { name, address, note } = req.body;
    
    // 检查链名是否已存在
    const existingChain = await Chain.findOne({ name });
    if (existingChain) {
      return res.status(400).json({ message: 'Chain name already exists' });
    }

    const chain = new Chain({
      name,
      address,
      note
    });

    await chain.save();
    res.status(201).json(chain);
  } catch (error) {
    console.error('Error creating chain:', error);
    res.status(500).json({ message: 'Error creating chain' });
  }
};

// 更新链地址
exports.updateChain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, note, isActive } = req.body;

    const chain = await Chain.findById(id);
    if (!chain) {
      return res.status(404).json({ message: 'Chain not found' });
    }

    // 如果更新了链名，检查是否与其他链名冲突
    if (name && name !== chain.name) {
      const existingChain = await Chain.findOne({ name });
      if (existingChain) {
        return res.status(400).json({ message: 'Chain name already exists' });
      }
    }

    chain.name = name || chain.name;
    chain.address = address || chain.address;
    chain.note = note || chain.note;
    chain.isActive = isActive !== undefined ? isActive : chain.isActive;
    chain.updatedAt = new Date();

    await chain.save();
    res.json(chain);
  } catch (error) {
    console.error('Error updating chain:', error);
    res.status(500).json({ message: 'Error updating chain' });
  }
};

// 删除链地址
exports.deleteChain = async (req, res) => {
  try {
    const { id } = req.params;

    const chain = await Chain.findById(id);
    if (!chain) {
      return res.status(404).json({ message: 'Chain not found' });
    }

    await chain.remove();
    res.json({ message: 'Chain deleted successfully' });
  } catch (error) {
    console.error('Error deleting chain:', error);
    res.status(500).json({ message: 'Error deleting chain' });
  }
}; 