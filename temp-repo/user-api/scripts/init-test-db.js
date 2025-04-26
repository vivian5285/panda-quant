const mongoose = require('mongoose');
const User = require('../models/User');
const { hashPassword } = require('../utils/auth');

async function initTestDB() {
  try {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});

    // Create test users
    const testUsers = [
      {
        email: 'test@example.com',
        password: await hashPassword('test123'),
        name: 'Test User',
        isVerified: true,
      },
      {
        email: 'unverified@example.com',
        password: await hashPassword('test123'),
        name: 'Unverified User',
        isVerified: false,
      },
    ];

    await User.insertMany(testUsers);

    console.log('Test database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing test database:', error);
    process.exit(1);
  }
}

initTestDB(); 