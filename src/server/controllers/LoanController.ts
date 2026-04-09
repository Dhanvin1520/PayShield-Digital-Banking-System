import { Request, Response, NextFunction } from 'express';
import LoanService from '../services/LoanService';

class LoanController {
  private loanService: LoanService;

  constructor() {
    this.loanService = new LoanService();
  }

  apply = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount, purpose, termMonths } = req.body;

      if (!amount || !purpose || !termMonths) {
        res.status(400).json({
          success: false,
          message: 'Amount, purpose, and termMonths are required',
        });
        return;
      }

      const userId = req.user!.id;
      const loan = await this.loanService.applyForLoan(userId, {
        amount,
        purpose,
        termMonths,
      });

      res.status(201).json({
        success: true,
        message: 'Loan application submitted successfully',
        data: { loan },
      });
    } catch (error) {
      next(error);
    }
  };

  getLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loans = await this.loanService.getLoansByUserId(req.user!.id);

      res.status(200).json({
        success: true,
        data: { loans, count: loans.length },
      });
    } catch (error) {
      next(error);
    }
  };

  getLoanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loan = await this.loanService.getLoanById(req.params.id);

      if (!loan) {
        res.status(404).json({
          success: false,
          message: 'Loan application not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { loan },
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required (approved or rejected)',
        });
        return;
      }

      const loan = await this.loanService.updateLoanStatus(req.params.id, status);

      if (!loan) {
        res.status(404).json({
          success: false,
          message: 'Loan application not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Loan application ${status} successfully`,
        data: { loan },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new LoanController();
