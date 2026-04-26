import mongoose, { Schema } from 'mongoose';
import { IAccount, AccountType, AccountStatus } from '../interfaces/IAccount';


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
    interestRate: {
      type: Number,
      default: null,
    },
    overdraftLimit: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


AccountSchema.pre<IAccount>('save', async function (next) {
  if (!this.accountNumber) {
    const count = await mongoose.model('Account').countDocuments();
    this.accountNumber = `PAY${String(count + 1001).padStart(7, '0')}`;
  }
  next();
});

AccountSchema.virtual('annualInterest').get(function (this: IAccount) {
  if (this.type === AccountType.SAVINGS && this.interestRate) {
    return this.balance * this.interestRate;
  }
  return 0;
});


AccountSchema.methods.canWithdraw = function (amount: number): boolean {
  if (this.type === AccountType.CHECKING && this.overdraftLimit) {
    return this.balance + this.overdraftLimit >= amount;
  }
  return this.balance >= amount;
};

const Account = mongoose.model<IAccount>('Account', AccountSchema);
export default Account;
