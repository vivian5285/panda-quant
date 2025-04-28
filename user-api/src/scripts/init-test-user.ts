import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

async function initTestUser() {
  try {
    const email = 'test@example.com';
    const password = 'test123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({ email });
    if (!user) {
      await User.create({
        email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Test user created successfully');
    } else {
      console.log('Test user already exists');
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

initTestUser(); 