import Loan from '../models/Loan';
import { ILoan, ILoanApplicationInput, LoanStatus } from '../interfaces/ILoan';

// LoanService
class LoanService {
  async applyForLoan(userId: string, input: ILoanApplicationInput): Promise<ILoan> {
    const interestRate = 10.0;
    const totalAmount = input.amount * (1 + (interestRate / 100));
    const monthlyPayment = totalAmount / input.termMonths;

    const loan = new Loan({
      userId,
      amount: input.amount,
      purpose: input.purpose,
      termMonths: input.termMonths,
      interestRate,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      status: LoanStatus.PENDING
    });

    return await loan.save();
  }

  async getLoansByUserId(userId: string): Promise<ILoan[]> {
    return await Loan.find({ userId }).sort({ appliedAt: -1 });
  }

  async getLoanById(loanId: string): Promise<ILoan | null> {
    return await Loan.findById(loanId);
  }

  async updateLoanStatus(loanId: string, status: LoanStatus): Promise<ILoan | null> {
    const updateData: any = { status };
    if (status === LoanStatus.APPROVED) {
      updateData.approvedAt = new Date();
    }

    return await Loan.findByIdAndUpdate(loanId, updateData, { new: true });
  }
}

export default LoanService;

