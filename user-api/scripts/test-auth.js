const axios = require('axios');
const { MongoClient } = require('mongodb');

const API_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'Test123!';
const TEST_NAME = 'Test User';
const MONGODB_URI = 'mongodb://localhost:27017/panda-quant';

async function clearTestData() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    await db.collection('users').deleteMany({ email: TEST_EMAIL });
    await db.collection('verifications').deleteMany({ email: TEST_EMAIL });
  } finally {
    await client.close();
  }
}

async function testRegistration() {
  console.log('Testing registration flow...');
  
  try {
    // 1. 直接注册用户（跳过验证码）
    console.log('1. Registering user...');
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      name: TEST_NAME,
      verificationCode: '123456' // 使用默认验证码
    });
    console.log('Registration successful:', registerResponse.data);

    // 2. 尝试登录
    console.log('2. Testing login...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    console.log('Login successful:', loginResponse.data);

    return true;
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  try {
    // 清理测试数据
    await clearTestData();
    console.log('Test data cleared');

    // 运行注册测试
    const success = await testRegistration();
    
    if (success) {
      console.log('All tests passed!');
    } else {
      console.log('Tests failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

// 运行测试
runTests(); 