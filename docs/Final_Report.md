# 🛡️ PayShield — Final Project Report

## 1. Team Details

| Name | ID | Role | Responsibility |
|------|----|------|----------------|
| **Dhanvin Vadlamudi** | 2401010150 | **Team Lead** | Authentication, Core Setup, Singleton Pattern |
| **Nipun Patlori** | 2401010323 | Accounts, Transactions, Factory, Command Patterns |
| **Tejaswini Palwai** | 2401010314 | Fraud Detection Engine, Strategy, Observer Patterns |
| **Meka Chaitanya Sai** | 2401010275 | Project Structure, Setup, API Routing |
| **Killi Akshith Kumar** | 2401010230 | System Design, Diagrams, Database Seeding, Documentation |

---



## 2. Project Explanation

**PayShield** is a comprehensive digital banking ecosystem designed with a "security-first" mindset. Unlike traditional banking demos, PayShield integrates a **real-time Fraud Detection Engine** that monitors every transaction as it happens.

### Core Value Proposition:
- **Financial Security**: Rule-based engine flags high-value transfers, rapid-fire transactions, and unknown recipients.
- **Robustness**: Built using a strictly typed TypeScript architecture to prevent runtime errors in financial calculations.
- **Scalability**: Uses industry-standard design patterns (Singleton, Factory, Strategy) allowing for easy addition of new banking products or fraud rules.

---

## 3. OOP Application & Improvements

PayShield demonstrates deep integration of **Object-Oriented Programming (OOP)** concepts, which significantly improved codebase maintainability:

### How OOPS Improved the Project:
1. **Encapsulation**: Using private fields and service-layer abstractions prevents direct manipulation of account balances, ensuring that only validated "Commands" can modify the state.
2. **Abstraction**: The use of interfaces for Fraud Strategies (`IFraudStrategy`) allows the system to analyze transactions without knowing the specific logic of each rule.
3. **Inheritance**: Base `Account` models are extended into `SavingsAccount` and `CheckingAccount`, allowing shared logic (like `accountNumber` generation) to stay DRY (Don't Repeat Yourself).
4. **Polymorphism**: The `TransactionService` can trigger various fraud rules polymorphically. Whether it's checking for a "High Value" or "Rapid Transaction," the service calls a uniform `analyze()` method.

---

## 4. SOLID Principles

The system was architected following SOLID principles to ensure it remains agile and testable:

- **S — Single Responsibility**: Every class has one job. The `AuthService` handles identity, while `TransactionService` handles money movement.
- **O — Open/Closed**: The Fraud Engine is **open** for extension (we can add new rules) but **closed** for modification. Adding a `CryptoCheckRule` doesn't require changing the core engine code.
- **L — Liskov Substitution**: Any account type (Savings/Checking) can be passed to the transaction logic without breaking it.
- **I — Interface Segregation**: We use focused interfaces like `ITransaction` and `IUser` rather than one giant "ProjectInterface."
- **D — Dependency Inversion**: Controllers depend on high-level Service abstractions rather than low-level database models.

---

## 5. Project Details

### Technical Highlights:
- **Singleton Database**: Ensures only one active connection to MongoDB Atlas, optimized for connection pooling.
- **Command Pattern for Transactions**: Every transfer is encapsulated as a `Command` object, allowing for potential implementation of `undo()` (reversal) operations.
- **Strategy-Based Fraud Detection**: Different rules can be toggled or weighted differently based on the bank's risk appetite.

### System Architecture:
The project follows a **Layered Architecture**:
1. **Presentation**: React.js with Tailwind CSS for a premium, responsive UI.
2. **Business**: Node.js/Express service layer implementing Design Patterns.
3. **Data**: MongoDB Atlas for flexible, document-based financial records.
