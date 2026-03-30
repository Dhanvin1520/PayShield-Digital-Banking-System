import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database';
import errorHandler from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import loanRoutes from './routes/loanRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🛡️ PayShield API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'PayShield — Digital Banking System',
    version: '1.0.0',
    description: 'Full-stack digital banking API with fraud detection',
    endpoints: {
      auth: '/api/auth',
      accounts: '/api/accounts',
      transactions: '/api/transactions',
      loans: '/api/loans',
      health: '/api/health',
    },
  });
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🛡️  PayShield Digital Banking System       ║
  ║   📡 Server running on port ${PORT}             ║
  ║   🌐 http://localhost:${PORT}                   ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
