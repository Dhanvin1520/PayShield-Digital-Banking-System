# 📐 SOLID Principles in PayShield

PayShield adheres to the SOLID principles to ensure the banking system is easy to maintain, extend, and test.

## 1. Single Responsibility Principle (SRP)
*“A class should have one, and only one, reason to change.”*
- **Application**: We separated our logic into distinct layers:
  - **Models**: Only define the data schema (Mongoose).
  - **Controllers**: Only handle HTTP requests/responses.
  - **Services**: Only handle business logic (e.g., `LoanService.ts` only cares about loan eligibility).
- **Result**: If the loan interest logic changes, we only touch one file.

## 2. Open/Closed Principle (OCP)
*“Software entities should be open for extension, but closed for modification.”*
- **Application**: The `FraudDetectionEngine` uses the **Strategy Pattern**. 
- **Result**: If we want to add a "Cross-Border Transaction" fraud check, we create a new Strategy class. We **don't** need to modify the `FraudDetectionEngine.ts` file itself.

## 3. Liskov Substitution Principle (LSP)
*“Subtypes must be substitutable for their base types.”*
- **Application**: Both `SavingsAccount` and `CheckingAccount` implement the `IAccount` interface.
- **Result**: Any part of the system that needs to "check balance" or "process transaction" can work with *any* account type without knowing which specific one it is.

## 4. Interface Segregation Principle (ISP)
*“Clients should not be forced to depend on methods they do not use.”*
- **Application**: We use granular interfaces:
  - `IUser` for profile data.
  - `IAccount` for financial data.
  - `ITransaction` for movement data.
- **Result**: The `AuthService` only needs to know about `IUser`. It doesn't get cluttered with `ITransaction` properties.

## 5. Dependency Inversion Principle (DIP)
*“Depend on abstractions, not concretions.”*
- **Application**: Our `TransactionController` depends on `TransactionService` (an abstraction of the business logic), not directly on the MongoDB connection or raw Mongoose queries.
- **Result**: If we decided to switch from MongoDB to PostgreSQL, we would only change the implementation inside the Service; the Controller would remain identical.
