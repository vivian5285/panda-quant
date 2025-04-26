const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const API_BASE_URL = 'http://localhost:3000/api';
const ADMIN_API_BASE_URL = 'http://localhost:3001/api';

// 测试用户信息
const testUser = {
  username: `test_${uuidv4().substring(0, 8)}`,
  password: 'Test123!',
  email: `test_${uuidv4().substring(0, 8)}@example.com`,
  referralCode: 'TEST123' // 测试推荐码
};

// 测试充值信息
const depositInfo = {
  chain: 'BSC',
  amount: 1000,
  txHash: `0x${uuidv4().replace(/-/g, '')}`
};

// 测试策略信息
const strategyInfo = {
  name: 'SuperTrend',
  params: {
    period: 10,
    multiplier: 3
  }
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testUserFlow() {
  try {
    console.log('开始测试用户流程...');

    // 1. 用户注册
    console.log('1. 用户注册...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      ...testUser,
      referralCode: testUser.referralCode
    });
    console.log('注册成功:', registerResponse.data);

    // 2. 用户登录
    console.log('2. 用户登录...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    const token = loginResponse.data.token;
    console.log('登录成功');

    // 3. 提交充值
    console.log('3. 提交充值...');
    const depositResponse = await axios.post(
      `${API_BASE_URL}/deposit/create`,
      depositInfo,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('充值提交成功:', depositResponse.data);

    // 4. 管理员确认充值
    console.log('4. 管理员确认充值...');
    const adminToken = 'YOUR_ADMIN_TOKEN'; // 需要替换为实际的管理员token
    await axios.post(
      `${ADMIN_API_BASE_URL}/deposit/confirm`,
      { txHash: depositInfo.txHash },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('充值确认成功');

    // 5. 创建策略
    console.log('5. 创建策略...');
    const strategyResponse = await axios.post(
      `${API_BASE_URL}/strategy`,
      strategyInfo,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const strategyId = strategyResponse.data.strategyId;
    console.log('策略创建成功:', strategyId);

    // 6. 等待策略执行并生成收益
    console.log('6. 等待策略执行...');
    await sleep(5000); // 等待5秒模拟策略执行

    // 7. 查看收益
    console.log('7. 查看收益...');
    const profitResponse = await axios.get(
      `${API_BASE_URL}/profit/history`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('收益记录:', profitResponse.data);

    // 8. 查看推荐奖励
    console.log('8. 查看推荐奖励...');
    const referralResponse = await axios.get(
      `${API_BASE_URL}/referral/rewards`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('推荐奖励:', referralResponse.data);

    // 9. 申请提现
    console.log('9. 申请提现...');
    const withdrawalResponse = await axios.post(
      `${API_BASE_URL}/withdrawal/request`,
      {
        amount: 100,
        chain: 'BSC',
        address: '0x123...' // 测试提现地址
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('提现申请成功:', withdrawalResponse.data);

    // 10. 管理员审核提现
    console.log('10. 管理员审核提现...');
    await axios.post(
      `${ADMIN_API_BASE_URL}/withdrawal/approve`,
      { requestId: withdrawalResponse.data.requestId },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('提现审核成功');

    console.log('测试流程完成！');
  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

testUserFlow(); 