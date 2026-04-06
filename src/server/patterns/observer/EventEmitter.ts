/**
 * TransactionEventEmitter — Observer Pattern
 * 
 * Implements a publish-subscribe mechanism for transaction events.
 * When a transaction is flagged as fraudulent, all subscribed observers
 * (like the FraudAlertObserver) are automatically notified.
 * 
 * Design Pattern: Observer (Behavioral)
 * OOP: Abstraction — observers don't know about each other
 * SOLID: Single Responsibility — event handling separated from business logic
 */

type EventCallback = (data: any) => void;

class TransactionEventEmitter {
  // Map of event names to their subscriber callbacks
  private observers: Map<string, EventCallback[]> = new Map();

  /**
   * Subscribe to an event
   * @param event - Event name to listen for
   * @param callback - Function to call when event is emitted
   */
  public subscribe(event: string, callback: EventCallback): void {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(callback);
    console.log(`👀 Observer subscribed to event: ${event}`);
  }

  /**
   * Unsubscribe from an event
   * @param event - Event name to stop listening for
   * @param callback - The specific callback to remove
   */
  public unsubscribe(event: string, callback: EventCallback): void {
    const callbacks = this.observers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        console.log(`🔕 Observer unsubscribed from event: ${event}`);
      }
    }
  }

  /**
   * Emit an event, notifying all subscribers
   * @param event - Event name to trigger
   * @param data - Data to pass to all subscribers
   */
  public emit(event: string, data: any): void {
    const callbacks = this.observers.get(event);
    if (callbacks) {
      console.log(`📢 Emitting event: ${event} to ${callbacks.length} observer(s)`);
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Observer error on event ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get number of subscribers for an event
   */
  public getSubscriberCount(event: string): number {
    return this.observers.get(event)?.length || 0;
  }
}

export default TransactionEventEmitter;
