import mongoose from 'mongoose';

class DatabaseConnection {
  
  private static instance: DatabaseConnection;

  private isConnected: boolean = false;

  private constructor() {
    console.log('🔧 DatabaseConnection instance created');
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      console.log('📦 Using existing database connection');
      return;
    }

    try {
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    await mongoose.disconnect();
    this.isConnected = false;
    console.log('🔌 MongoDB disconnected');
  }

  public getStatus(): boolean {
    return this.isConnected;
  }
}

export default DatabaseConnection;
