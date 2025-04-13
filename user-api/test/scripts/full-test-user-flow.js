const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const API_BASE_URL = 'http://localhost:3001/api';
const DB_CONFIG = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool(DB_CONFIG);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testUserFlow() {
  try {
    console.log('Starting full user flow test...');

    // 1. User registration with referral code
    console.log('\n1. Registering new user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'Test123!',
      referralCode: 'REF123'
    });
    const { token, userId } = registerResponse.data;
    console.log('User registered successfully:', userId);

    // 2. User deposits with BSC txHash
    console.log('\n2. Submitting deposit...');
    const depositResponse = await axios.post(`${API_BASE_URL}/asset/deposit`, {
      chain: 'BSC',
      txHash: '0x1234567890abcdef',
      amount: 1000
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Deposit submitted:', depositResponse.data);

    // 3. Admin confirms deposit
    console.log('\n3. Admin confirming deposit...');
    await pool.query(
      'UPDATE deposits SET status = $1 WHERE tx_hash = $2',
      ['confirmed', '0x1234567890abcdef']
    );
    console.log('Deposit confirmed');

    // 4. User selects strategy and starts hosting
    console.log('\n4. Starting strategy hosting...');
    const strategyResponse = await axios.post(`${API_BASE_URL}/strategy/create`, {
      userId,
      preset: {
        name: 'SuperTrend',
        params: {
          period: 10,
          multiplier: 3
        }
      }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const strategyId = strategyResponse.data.strategyId;
    console.log('Strategy created:', strategyId);

    // 5. Simulate strategy execution and profit generation
    console.log('\n5. Simulating strategy execution...');
    await pool.query(
      'INSERT INTO strategy_logs (user_id, strategy_id, profit, executed_at) VALUES ($1, $2, $3, NOW())',
      [userId, strategyId, 50]
    );
    console.log('Strategy execution logged');

    // 6. User checks profit and referral rewards
    console.log('\n6. Checking profit and rewards...');
    const profitResponse = await axios.get(`${API_BASE_URL}/asset/profit`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Profit data:', profitResponse.data);

    // 7. User requests withdrawal of referral rewards
    console.log('\n7. Requesting withdrawal...');
    const withdrawalResponse = await axios.post(`${API_BASE_URL}/asset/withdraw`, {
      amount: 20,
      chain: 'BSC',
      address: '0x9876543210fedcba'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Withdrawal requested:', withdrawalResponse.data);

    // 8. Admin approves withdrawal
    console.log('\n8. Admin approving withdrawal...');
    await pool.query(
      'UPDATE withdrawals SET status = $1 WHERE user_id = $2 AND amount = $3',
      ['approved', userId, 20]
    );
    console.log('Withdrawal approved');

    // 9. User checks withdrawal record
    console.log('\n9. Checking withdrawal record...');
    const withdrawalRecord = await axios.get(`${API_BASE_URL}/asset/withdrawals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Withdrawal record:', withdrawalRecord.data);

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  } finally {
    await pool.end();
  }
}

testUserFlow(); 