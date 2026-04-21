// === DAY 1: KILLI AKSHITH KUMAR ===
// Task: Build robust team-seeding logic for development
// Files: db/seed.ts, src/server/controllers/AccountController.ts, src/server/routes/accountRoutes.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/server/models/User';
import Account from '../src/server/models/Account';
import { AccountType } from '../src/server/interfaces/IAccount';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/payshield';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');


    await User.deleteMany({});
    await Account.deleteMany({});


    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', 
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user'
    });


    await Account.create({
      userId: user1._id,
      accountNumber: 'PS-SAV-1001',
      type: AccountType.SAVINGS,
      balance: 100000,
      status: 'active'
    });

    await Account.create({
      userId: user2._id,
      accountNumber: 'PS-CHK-2001',
      type: AccountType.CHECKING,
      balance: 50000,
      status: 'active'
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
