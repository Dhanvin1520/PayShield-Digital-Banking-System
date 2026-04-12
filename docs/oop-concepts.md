# 🧬 OOP Concepts in PayShield

PayShield is built from the ground up using Object-Oriented Programming (OOP) to ensure a robust and maintainable digital banking foundation.

## 1. Encapsulation
We hide the internal state of objects and only expose what is necessary through public methods.
- **Implementation**: The `User` model's password is never exposed. In the `Account` service, the balance is a protected property that can only be modified through validated `deposit()` or `withdraw()` methods.
- **Benefit**: Ensures data integrity. An account balance cannot be changed by an external "hack" or coding mistake.

## 2. Abstraction
We reduce complexity by hiding away the implementation details and only showing the functionality.
- **Implementation**: The `FraudDetectionEngine` provides a simple `isTransactionSuspicious()` method. The backend logic doesn't need to know *how* it checks for high value or rapid transactions—it just gets a `true` or `false` result.
- **Benefit**: Simplifies the core banking logic.

## 3. Inheritance
Creating new classes from existing ones to reuse code.
- **Implementation**: We have a base `IBankingAccount` interface (or abstract class logic in services) that is extended into specific types:
  - `SavingsAccount`: Inherits base traits and adds interest calculation.
  - `CheckingAccount`: Inherits base traits and adds overdraft limit logic.
- **Benefit**: Drastically reduces code duplication.

## 4. Polymorphism
The ability of different objects to respond to the same method call in their own way.
- **Implementation**: The `IFraudStrategy` interface defines an `analyze()` method. 
  - `HighValueStrategy.analyze()` looks at the amount.
  - `RapidTransactionStrategy.analyze()` looks at time-stamps.
  - `NewRecipientStrategy.analyze()` looks at history.
  The Engine calls `analyze()` on all of them in a loop.
- **Benefit**: Extreme flexibility. Adding a 4th or 5th fraud rule doesn't change the engine's code.
