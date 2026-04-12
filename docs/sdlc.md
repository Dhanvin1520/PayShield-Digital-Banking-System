# 🔄 SDLC Methodology — Agile Scrum

PayShield was developed using the **Agile** methodology, specifically following the **Scrum** framework to allow for iterative development and frequent feedback.

## 1. Requirement Analysis
- Conducted stakeholder interviews to define core banking features.
- Identified the "Fraud Detection Engine" as the USP (Unique Selling Proposition).

## 2. Design Phase
- Created **UML Diagrams** (Class, Sequence, Use Case).
- Designed the **ER Diagram** for MongoDB schema optimization.
- Selected a **Layered Architecture** to separate concerns.

## 3. Iterative Development (Sprints)
- **Sprint 1 (Core Foundations)**: Database setup, Singleton connection, and JWT Authentication.
- **Sprint 2 (Banking Logic)**: Implementation of Account Factory and Command Pattern for transfers.
- **Sprint 3 (Security & Fraud)**: Development of the Strategy-based Fraud Engine and Observers.
- **Sprint 4 (Frontend Integration)**: Building the React dashboard and connecting to backend APIs.

## 4. Testing & Verification
- **Unit Testing**: Testing individual services like `AuthService`.
- **Integration Testing**: Verifying the flow from API Routes → Controllers → Services.
- **Manual QA**: Testing edge cases like insufficient balance and multiple rapid transactions.

## 5. Deployment & Maintenance
- Configured environment variables for security.
- Documentation of API endpoints for future maintainability.
