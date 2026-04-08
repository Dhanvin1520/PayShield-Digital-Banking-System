import { Request, Response, NextFunction } from 'express';
import TransactionService from '../services/TransactionService';

/**
 * TransactionController — HTTP Handler for Transaction Routes
 *
 * Handles all incoming HTTP requests related to fund transfers
 * and transaction history. Delegates business logic to TransactionService.
 *
 * Key Design Patterns used downstream:
 *   - Command Pattern: Transfers are executed as command objects (TransferCommand)
 *   - Strategy Pattern: Fraud detection uses interchangeable strategies
 *   - Observer Pattern: Fraud alerts are emitted as events
 *
 * SOLID Principles:
 *   - Single Responsibility: Only handles HTTP request/response
 *   - Open/Closed: New transaction types can be added without modifying this controller
 */
class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * POST /api/transactions/transfer
   * Transfer funds between two accounts
   *
   * Flow: Controller → TransactionService → FraudDetectionEngine → TransferCommand
   * If fraud is detected, transaction is flagged (Observer emits alert)
   * If clean, CommandInvoker executes the TransferCommand
   */
  transfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { fromAccountId, toAccountId, amount, description } = req.body;

      if (!fromAccountId || !toAccountId || !amount) {
        res.status(400).json({
          success: false,
          message: 'fromAccountId, toAccountId, and amount are required',
        });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'Amount must be greater than zero',
        });
        return;
      }

      if (fromAccountId === toAccountId) {
        res.status(400).json({
          success: false,
          message: 'Cannot transfer to the same account',
        });
        return;
      }

      const transaction = await this.transactionService.transfer(
        fromAccountId,
        toAccountId,
        amount,
        description
      );

      // Return 202 Accepted if flagged, 201 Created if clean
      const statusCode = transaction.flagged ? 202 : 201;

      res.status(statusCode).json({
        success: true,
        message: transaction.flagged
          ? '⚠️ Transaction flagged for fraud review'
          : '✅ Transfer completed successfully',
        data: { transaction },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/transactions
   * Get all transactions for the authenticated user
   */
  getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await this.transactionService.getUserTransactions(req.user!.id, limit);

      res.status(200).json({
        success: true,
        data: { transactions, count: transactions.length },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/transactions/account/:accountId
   * Get transaction history for a specific account
   */
  getAccountTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await this.transactionService.getTransactionHistory(
        req.params.accountId,
        limit
      );

      res.status(200).json({
        success: true,
        data: { transactions, count: transactions.length },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/transactions/flagged
   * Get all flagged (suspicious) transactions — Admin only
   */
  getFlaggedTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactions = await this.transactionService.getFlaggedTransactions();

      res.status(200).json({
        success: true,
        data: { transactions, count: transactions.length },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TransactionController();
