import mongoose, { Schema } from 'mongoose';
import { IAccount, AccountType, AccountStatus } from '../interfaces/IAccount';

/**
 * Account Model
 * Base model that supports both Savings and Checking accounts
 * Demonstrates Inheritance through discriminators and Liskov Substitution Principle
 */
const AccountSchema: Schema = new Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: Object.values(AccountType),
      required: [true, 'Account type is required'],
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    // Savings account specific
    interestRate: {
      type: Number,
      default: null,
    },
    // Checking account specific
    overdraftLimit: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Generate unique account number before saving
 */
AccountSchema.pre<IAccount>('save', async function (next) {
  if (!this.accountNumber) {
    const count = await mongoose.model('Account').countDocuments();
    this.accountNumber = `PAY${String(count + 1001).padStart(7, '0')}`;
  }
  next();
});

/**
 * Virtual — Calculate interest for savings accounts
 * Demonstrates Abstraction: complex calculation hidden behind simple property
 */
AccountSchema.virtual('annualInterest').get(function (this: IAccount) {
  if (this.type === AccountType.SAVINGS && this.interestRate) {
    return this.balance * this.interestRate;
  }
  return 0;
});

/**
 * Method — Check if account can process withdrawal
 * Demonstrates Encapsulation: overdraft logic internal to model
 */
AccountSchema.methods.canWithdraw = function (amount: number): boolean {
  if (this.type === AccountType.CHECKING && this.overdraftLimit) {
    return this.balance + this.overdraftLimit >= amount;
  }
  return this.balance >= amount;
};

const Account = mongoose.model<IAccount>('Account', AccountSchema);
export default Account;
