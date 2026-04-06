import mongoose from 'mongoose';
import { IFraudAlert } from '../../interfaces/IFraudRule';

/**
 * FraudAlertObserver — Observer Pattern (Concrete Observer)
 * 
 * Subscribes to fraud detection events and creates FraudAlert documents
 * in the database when suspicious transactions are detected.
 * 
 * This observer is decoupled from the fraud detection engine —
 * it only reacts to events, demonstrating loose coupling.
 */

// FraudAlert Schema (defined here since it's closely tied to the observer)
const FraudAlertSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ruleTriggered: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved'],
    default: 'open',
  },
  description: {
    type: String,
    required: true,
  },
  detectedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
});

const FraudAlert = mongoose.model('FraudAlert', FraudAlertSchema);

/**
 * Handler function that creates a FraudAlert when fraud is detected
 * This is registered as an observer callback
 */
async function handleFraudDetected(alertData: IFraudAlert): Promise<void> {
  try {
    const alert = new FraudAlert({
      transactionId: alertData.transactionId,
      userId: alertData.userId,
      ruleTriggered: alertData.ruleTriggered,
      severity: alertData.severity,
      status: 'open',
      description: alertData.description,
      detectedAt: new Date(),
    });

    await alert.save();
    console.log(`🚨 Fraud alert created: ${alertData.ruleTriggered} — ${alertData.description}`);
  } catch (error) {
    console.error('❌ Failed to create fraud alert:', error);
  }
}

export { FraudAlert, handleFraudDetected };
