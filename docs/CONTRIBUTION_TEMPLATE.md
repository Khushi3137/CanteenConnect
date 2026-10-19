# Academic Project Contribution & Viva Preparation Templates
## Campus Canteen Pre-Order Management System

This document provides standardized templates for team members to document their contributions and prepare for project viva examinations.

---

### 1. Individual Contribution Submission Template

```markdown
### Team Member Contribution Statement

- **Student Name:** [Your Name]
- **Roll Number / Student ID:** [e.g. STU-2024-XXXX]
- **Assigned Module:** [e.g., Module 1: Frontend Student UI / Module 2: Backend & Security]

#### Specific Contributions:
1. Designed and implemented [Feature / Component / Endpoint].
2. Created schema / service integration for [Module].
3. Formulated and tested test cases [e.g. TC-01 to TC-05].

#### Key Technologies Handled:
- [e.g., React.js, Tailwind CSS, Axios, Express, Mongoose, etc.]

#### Challenges Faced & Resolution:
- *Challenge:* [e.g., Synchronizing live order status without heavy WebSockets.]
- *Resolution:* [Implemented an efficient 10-second polling interval and manual Refresh button in CurrentOrdersPage.jsx.]

#### Viva Self-Assessment:
- Can explain JWT payload structure and token storage: [Yes / No]
- Can explain Mongoose schema validation and embedded OrderItem snapshot: [Yes / No]
- Can demonstrate live order placement and admin status update: [Yes / No]
```

---

### 2. Weekly Sprint Log Template

```markdown
### Sprint Log: Week [Number] (Date: [Start Date] - [End Date])

#### Goals for the Week:
- [ ] Deliverable 1
- [ ] Deliverable 2

#### Accomplished This Week:
- [x] Task completed by Member 1
- [x] Task completed by Member 2

#### Blockers / Pending Tasks:
- None / [Detail any pending blocker]

#### Next Sprint Priorities:
- Priority 1
- Priority 2
```

---

### 3. Team Meeting Log Template

```markdown
### Meeting Minutes #[Meeting Number]

- **Date & Time:** [Date, Time]
- **Location / Platform:** [Campus Lab / Google Meet / Discord]
- **Presiding Member:** [Member Name]
- **Attendees:** [List of members present]

#### Agenda Items:
1. Review of current milestone
2. Technical discussions on API contracts
3. Work allocation for coming week

#### Decisions Made:
- [Document final architectural or design consensus]

#### Action Items:
| Action Item | Assigned To | Due Date |
|---|---|---|
| Complete FoodFormModal.jsx | Member 1 | DD/MM/YYYY |
| Write seed script seed.js | Member 3 | DD/MM/YYYY |
```

---

### 4. Viva Preparation Quick Reference

When presenting this project to internal/external examiners, focus on these questions:

1. **Why MERN Stack?**
   - *Answer:* Unified JavaScript environment across frontend and backend. Non-blocking asynchronous I/O in Node.js handles concurrent order requests efficiently. MongoDB document format perfectly models nested order line items.
2. **Why not a real payment gateway (Razorpay/Stripe)?**
   - *Answer:* Real payment gateways require business entity registration, merchant KYC, and incur transaction fees. For an academic campus canteen, a **Cash on Pickup** model is clean, realistic, and matches on-campus operations without external failure points.
3. **How is security handled?**
   - *Answer:* Passwords are never stored in plaintext; salted with 10 rounds of `bcrypt`. JWT tokens authenticate requests statelessly. Routes are protected with two levels of middleware (`protect` for authenticated users, `adminOnly` for canteen staff).
4. **Why are order item details duplicated inside the Order document?**
   - *Answer:* To preserve **historical price integrity**. If the price of Samosa changes from ₹30 to ₹35 next month, past completed orders must retain their original ₹30 price snapshot.
5. **How does the system prevent invalid orders?**
   - *Answer:* Before saving an order, the server verifies each food item ID in the database, ensures `available === true`, checks quantity $\ge 1$, and recalculates the grand total on the backend rather than trusting client-sent prices.
