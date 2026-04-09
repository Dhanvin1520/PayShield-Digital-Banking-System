import mongoose, { Schema } from 'mongoose';
import { ILoan, LoanPurpose, LoanStatus } from '../interfaces/ILoan';

const LoanSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  purpose: { 
    type: String, 
    enum: Object.values(LoanPurpose), 
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(LoanStatus), 
    default: LoanStatus.PENDING 
  },
  interestRate: { 
    type: Number, 
    default: 10.0 
  },
  termMonths: { 
    type: Number, 
    required: true 
  },
  monthlyPayment: { 
    type: Number, 
    required: true 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  approvedAt: { 
    type: Date 
  }
});

export default mongoose.model<ILoan>('Loan', LoanSchema);
