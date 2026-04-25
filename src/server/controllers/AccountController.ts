import { Request, Response, NextFunction } from 'express';
import AccountService from '../services/AccountService';

/**
 * AccountController — HTTP Handler for Account Routes
 *
 * Handles all incoming HTTP requests related to bank accounts.
 * Delegates business logic to AccountService (Abstraction — OOP).
 *
 * OOP Concepts:
 *   - Encapsulation: Controller hides request parsing from service layer
 *   - Abstraction: Service layer abstracts database operations
 *
 * SOLID Principles:
 *   - Single Responsibility: Only handles HTTP request/response
 *   - Dependency Inversion: Depends on AccountService abstraction
 */
class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  /**
   * POST /api/accounts
   * Create a new bank account (Savings or Checking)
   * Uses Factory Pattern internally via AccountService → AccountFactory
   */
  createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type } = req.body;

      if (!type) {
        res.status(400).json({
          success: false,
          message: 'Account type is required (savings or checking)',
        });
        return;
      }

      const account = await this.accountService.createAccount(req.user!.id, type);

      res.status(201).json({
        success: true,
        message: `${type} account created successfully`,
        data: { account },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/accounts
   * Get all accounts for the authenticated user
   */
  getAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accounts = await this.accountService.getAccountsByUserId(req.user!.id);

      res.status(200).json({
        success: true,
        data: { accounts, count: accounts.length },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/accounts/:id
   * Get a specific account by its ID
   */
  getAccountById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const account = await this.accountService.getAccountById(req.params.id);

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { account },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/accounts/balance/total
   * Get total balance across all active accounts for the user
   */
  getTotalBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const totalBalance = await this.accountService.getTotalBalance(req.user!.id);

      res.status(200).json({
        success: true,
        data: { totalBalance },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/accounts/beneficiaries
   * Get all other user accounts to populate the contacts list
   */
  getBeneficiaries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const beneficiaries = await this.accountService.getBeneficiaries(req.user!.id);

      res.status(200).json({
        success: true,
        data: { beneficiaries, count: beneficiaries.length },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/accounts/all
   * Admin — Get all accounts across all users
   */
  getAllAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accounts = await this.accountService.getAllAccounts();

      res.status(200).json({
        success: true,
        data: { accounts, count: accounts.length },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AccountController();
