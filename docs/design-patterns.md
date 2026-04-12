# 🏗️ Design Patterns in PayShield

PayShield implements 5 Gang of Four (GoF) design patterns to solve common architectural challenges in banking systems.

## 1. Singleton Pattern (Creational)
- **Problem**: Multiple database connections can cause resource exhaustion and data inconsistency.
- **Solution**: The `DatabaseConnection` class ensures that only one instance of the MongoDB connection exists throughout the application lifecycle.
- **Location**: `src/server/patterns/singleton/DatabaseConnection.ts`

## 2. Factory Pattern (Creational)
- **Problem**: Manually creating different types of accounts (Savings, Checking) with various defaults is error-prone.
- **Solution**: `AccountFactory` encapsulates the creation logic. You simply tell the factory the `AccountType`, and it returns the correctly configured object.
- **Location**: `src/server/patterns/factory/AccountFactory.ts`

## 3. Strategy Pattern (Behavioral)
- **Problem**: Fraud detection logic is complex and changes frequently. Using a giant `if-else` block is unmaintainable.
- **Solution**: Each fraud rule is a "Strategy." The `FraudDetectionEngine` maintains a list of these strategies and executes them dynamically.
- **Location**: `src/server/patterns/strategy/`

## 4. Observer Pattern (Behavioral)
- **Problem**: Multiple system components (Loggers, Notification services, Admin dashboards) need to react when a transaction is flagged as fraud.
- **Solution**: The `FraudAlertObserver` listens for events emitted by the `FraudDetectionEngine`. When fraud is detected, all "subscribers" are automatically notified.
- **Location**: `src/server/patterns/observer/`

## 5. Command Pattern (Behavioral)
- **Problem**: Banking transactions like "Transfer" or "Deposit" involve multiple steps (debit, credit, log). If one fails, the system must remain consistent.
- **Solution**: Each operation is encapsulated as a `Command` object with an `execute()` method. This allows for transactional integrity and easy implementation of an "Undo" (Reversal) feature.
- **Location**: `src/server/patterns/command/`
