import dotenv from 'dotenv';
import DatabaseConnection from '../patterns/singleton/DatabaseConnection';

dotenv.config();

const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/payshield';
  const db = DatabaseConnection.getInstance();
  await db.connect(mongoUri);
};

export default connectDatabase;
