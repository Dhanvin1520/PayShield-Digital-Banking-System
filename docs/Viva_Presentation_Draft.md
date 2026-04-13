# 🛡️ PayShield — Viva Presentation Draft

*This document contains the structured content for your presentation slides. Use this as a script and layout guide for your PowerPoint/Google Slides.*

---

## Slide 1: Title Slide
**Title:** PayShield — Digital Banking System with Real-Time Fraud Detection
**Subtitle:** A Robust Financial Ecosystem built on Modern Software Design
**Team Details:**
- Dhanvin Vadlamudi (Team Lead)
- Nipun Patlori
- Tejaswini Palwai
- Meka Chaitanya Sai
- Killi Akshith Kumar

---

## Slide 2: Problem Statement
**Headlines:** Why PayShield?
- **Security Crisis:** Increasing financial fraud in digital transactions.
- **Complexity:** Managing banking data (accounts, loans, transfers) requires strict transactional integrity.
- **Maintainability:** Standard banking software often becomes "spaghetti code" without strict design patterns.
**Objective:** To build a secure, scalable, and pattern-oriented banking system.

---

## Slide 3: Project Overview
**Headlines:** Core Functionality
- **Seamless Banking:** User registration, multi-account management (Savings/Checking).
- **Secure Transfers:** Real-time fund movement with transaction logging.
- **Loan Department:** Purpose-based loan applications and eligibility checks.
- **Fraud Engine:** The system's "immune system" that flags suspicious activities instantly.

---

## Slide 4: Technology Stack
**The MERN Stack + TypeScript:**
- **Frontend:** React.js + Tailwind CSS (Premium, responsive aesthetics).
- **Backend:** Node.js + Express.js (RESTful architecture).
- **Database:** MongoDB Atlas (Document-oriented financial records).
- **Type-Safety:** TypeScript used across the stack to prevent financial calculation errors.
- **Security:** JWT for authentication, Bcrypt for password hashing.

---

## Slide 5: System Architecture
**3-Tier Layered Approach:**
1. **Presentation Layer:** Interactive React SPA.
2. **Business Logic Layer:** Service-oriented architecture with Design Patterns.
3. **Data Access Layer:** Mongoose ODM for structured data persistence.
*(Self-Correction Tip: Mention that the architecture is "Decoupled" to allow for future scalability.)*

---

## Slide 6: OOP Concepts — The Foundation
**How we used OOPS to improve the project:**
- **Abstraction:** Hiding complex database queries behind Service methods.
- **Encapsulation:** Protecting account balances; only accessible via validated methods.
- **Inheritance:** `SavingsAccount` and `CheckingAccount` extending a base `Account` logic.
- **Polymorphism:** Using the `IFraudStrategy` interface to treat all fraud rules uniformly.

---

## Slide 7: SOLID Principles — The Best Practices
**Building Clean Code:**
- **Single Responsibility (SRP):** Each Service handles exactly one domain (Auth, Loan, etc).
- **Open/Closed (OCP):** Adding new Fraud rules without modifying the core Engine.
- **Liskov Substitution (LSP):** Different account types are interchangeable in transaction logic.
- **Interface Segregation (ISP):** Using focused interfaces (IUser, ILoan) instead of bloated ones.
- **Dependency Inversion (DIP):** Controllers depend on Service abstractions, not raw database models.

---

## Slide 8: Design Patterns I (Creational)
**1. Singleton Pattern:**
- **Application:** `DatabaseConnection.ts`
- **Why:** To ensure exactly one connection pool to MongoDB, preventing resource exhaustion.
**2. Factory Pattern:**
- **Application:** `AccountFactory.ts`
- **Why:** To handle the creation of various account types (Savings/Checking) with predefined defaults.

---

## Slide 9: Design Patterns II (Behavioral)
**3. Strategy Pattern:**
- **Application:** Fraud Detection Rules.
- **Why:** Enables switching or combining different fraud detection logics (High Value, Rapid Tx) at runtime.
**4. Observer Pattern:**
- **Application:** `FraudAlertObserver`.
- **Why:** Notifies different system modules (Alert logs, Admin dashboard) simultaneously when fraud is detected.
**5. Command Pattern:**
- **Application:** `TransferCommand`.
- **Why:** Encapsulates banking operations as objects, allowing for transaction history and potential "Undo" features.

---

## Slide 10: Fraud Detection Engine
**The Rule-Based Guardian:**
- **High-Value Check:** Flags transactions over ₹50,000.
- **Rapid-Fire Check:** Flags more than 3 transactions in 60 seconds (Bot detection).
- **New Recipient Check:** Flags first-time transfers as "Low Severity" for user awareness.
*(Key Point: Mention that these rules can be added to/modified without breaking the core system.)*

---

## Slide 11: Database Schema (ER Summary)
**Core Entities:**
- **Users:** (1:N) with Accounts and Loans.
- **Accounts:** (1:N) with Transactions.
- **Transactions:** (1:0..1) with Fraud Alerts.
*(Visual Tip: Refer to the ER Diagram in your diagrams folder during this slide.)*

---

## Slide 12: SDLC & Methodology
**Agile Scrum Framework:**
- **Iterative Sprints:** 4 distinct sprints from environment setup to full integration.
- **Daily Standups:** To coordinate work across 5 team members.
- **Version Control:** Git workflow with feature branches and Pull Requests.

---

## Slide 13: Testing & Verification
**Ensuring Reliability:**
- **Manual Verification:** Rigorous testing of the "Insufficient Balance" and "Fraud Flagging" logic.
- **Environment Parity:** Using `.env` structures to ensure local and production consistency.
- **Code Reviews:** Peer reviews of Design Pattern implementations.

---

## Slide 14: Conclusion & Future Scope
- **Current Achievement:** A fully functional, pattern-oriented digital banking backend.
- **Future Scope:**
  - AI/Machine Learning models for predicting fraud before it happens.
  - Multi-factor authentication (TOTP).
  - Mobile App integration using React Native.
- **Closing Tagline:** "Secure. Smart. Reliable."

---

# 🎓 Common Viva Questions (Be Prepared!)

1. **"Why did you use the Strategy Pattern specifically for Fraud?"**
   - *Answer:* Because fraud rules change frequently. Strategy allows us to add or remove rules without changing the `FraudDetectionEngine` class itself (Open/Closed Principle).
2. **"What is the advantage of using TypeScript in a banking app?"**
   - *Answer:* It prevents runtime errors in financial calculations by catching type mismatches (e.g., trying to add a string to a balance number) during development.
3. **"Where exactly is the Singleton pattern used?"**
   - *Answer:* In the `DatabaseConnection` class. It ensures we don't accidentally open hundreds of database connections, which would crash the application.
4. **"How did you implement the Single Responsibility Principle?"**
   - *Answer:* By separating the 'Controller' (handling HTTP) from the 'Service' (handling business logic) and the 'Model' (handling data structure).
