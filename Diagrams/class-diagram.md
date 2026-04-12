# 🏛️ Class Diagram

The class diagram illustrates the relationships between our core entities, service layers, and design pattern implementations.

![Class Diagram](./Class%20diagrams/Class_diagrams.png)

### Key Relationships:
- **Inheritance**: `SavingsAccount` and `CheckingAccount` inherit from `Account`.
- **Composition**: `TransactionService` uses `FraudDetectionEngine` and `CommandInvoker`.
- **Implementation**: Multiple strategies implement the `IFraudStrategy` interface.
