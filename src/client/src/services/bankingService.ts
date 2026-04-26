import api from './api';

export interface User {
   id: string;
   name: string;
   email: string;
   role: string;
}

export interface AuthResponse {
   success: boolean;
   data: {
      user: User;
      token: string;
   };
}

export const authService = {
   register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
   },

   login: async (email: string, password: string): Promise<AuthResponse> => {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
   },

   getProfile: async (): Promise<{ success: boolean; data: { user: User } }> => {
      const res = await api.get('/auth/me');
      return res.data;
   },
};

export const accountService = {
   create: async (type: string) => {
      const res = await api.post('/accounts', { type });
      return res.data;
   },

   getAll: async () => {
      const res = await api.get('/accounts');
      return res.data;
   },

   getById: async (id: string) => {
      const res = await api.get(`/accounts/${id}`);
      return res.data;
   },

   getTotalBalance: async () => {
      const res = await api.get('/accounts/balance/total');
      return res.data;
   },

   getBeneficiaries: async () => {
      const res = await api.get('/accounts/beneficiaries');
      return res.data;
   },

   seedTeamData: async () => {
      const res = await api.post('/accounts/admin/seed');
      return res.data;
   },

   adminGetAll: async () => {
      const res = await api.get('/accounts/all');
      return res.data;
   }
};

export const transactionService = {
   transfer: async (fromAccountId: string, toAccountId: string, amount: number, description?: string) => {
      const res = await api.post('/transactions/transfer', { fromAccountId, toAccountId, amount, description });
      return res.data;
   },

   getAll: async (limit = 50) => {
      const res = await api.get(`/transactions?limit=${limit}`);
      return res.data;
   },

   getByAccount: async (accountId: string, limit = 50) => {
      const res = await api.get(`/transactions/account/${accountId}?limit=${limit}`);
      return res.data;
   },

   getFlagged: async () => {
      const res = await api.get('/transactions/flagged');
      return res.data;
   },
};

export const loanService = {
   apply: async (amount: number, purpose: string, termMonths: number) => {
      const res = await api.post('/loans/apply', { amount, purpose, termMonths });
      return res.data;
   },

   getAll: async () => {
      const res = await api.get('/loans');
      return res.data;
   },

   updateStatus: async (id: string, status: string) => {
      const res = await api.patch(`/loans/${id}/status`, { status });
      return res.data;
   },

   adminGetAll: async () => {
      const res = await api.get('/loans/all');
      return res.data;
   },
};
