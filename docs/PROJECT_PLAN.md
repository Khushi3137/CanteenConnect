# Project Management Plan & Team Work Breakdown
## Campus Canteen Pre-Order Management System

---

### 1. Team Organization & Work Allocation (4-Member Team)

| Team Member | Role Focus | Primary Responsibilities |
|---|---|---|
| **Member 1** | **Frontend / Student UI Specialist** | - Responsive React UI using Vite & Tailwind CSS<br>- Student Dashboard, Menu view, and Food detail modals<br>- Shopping Cart management and Checkout workflow<br>- Live Order progress tracker with visual stepper |
| **Member 2** | **Backend / API / Security Engineer** | - Node.js Express server architecture and routing<br>- JWT token generation and authentication middleware<br>- Password salting and hashing with `bcryptjs`<br>- Student and Admin RESTful endpoints and error handling |
| **Member 3** | **Database & Admin Operations Lead** | - MongoDB schema design (User, FoodItem, Order models)<br>- Admin Dashboard metrics and operational aggregations<br>- Menu Item CRUD and instant availability toggling<br>- Order workflow status state machine and seed scripts |
| **Member 4** | **QA, Documentation & Integration Lead** | - Black-box testing and Test Case ledger creation<br>- Software Engineering documentation (SRS, Architecture, Use Cases)<br>- API testing and cross-browser responsiveness checks<br>- Viva presentation preparation and repository hygiene |

---

### 2. Work Breakdown Structure (WBS) & Milestones

```mermaid
gantt
    title Project Timeline & Milestones (4-Week Sprint)
    dateFormat  YYYY-MM-DD
    section Week 1: Inception
    Problem Analysis & Requirements     :done, w1_1, 2026-09-01, 3d
    Tech Stack Selection & Architecture :done, w1_2, after w1_1, 4d
    section Week 2: Core Development
    DB Schema & Seed Script Setup       :done, w2_1, 2026-09-08, 3d
    Auth APIs & JWT Security            :done, w2_2, 2026-09-10, 4d
    Frontend Scaffold & Tailwind Design :done, w2_3, 2026-09-08, 7d
    section Week 3: Business Logic
    Menu CRUD & Cart Implementation     :done, w3_1, 2026-09-15, 4d
    Order Placement & Status Stepper    :done, w3_2, 2026-09-18, 5d
    Admin Kitchen Dashboard & Controls  :done, w3_3, 2026-09-19, 4d
    section Week 4: Integration & QA
    End-to-End Testing (TC-01 - TC-17)  :done, w4_1, 2026-09-24, 3d
    SRS & Software Eng Artifacts        :done, w4_2, 2026-09-26, 3d
    Dry Run & Viva Preparation          :done, w4_3, 2026-09-29, 2d
```

---

### 3. Weekly Progress Tracking Template

| Week | Milestone / Deliverable | Target Date | Actual Completion | Reviewer Notes |
|---|---|---|---|---|
| **Week 1** | Project SRS, Architecture & Schema Finalization | Sept 07, 2026 | Completed | Approved by team |
| **Week 2** | User Auth (JWT), Database Models, Base UI Shell | Sept 14, 2026 | Completed | Auth verified via Postman |
| **Week 3** | Cart, Order APIs, Admin Kitchen Dashboard | Sept 21, 2026 | Completed | End-to-end order working |
| **Week 4** | Full Testing (17 test cases), Documentation, Viva Prep | Sept 30, 2026 | Completed | Ready for evaluation |

---

### 4. Meeting Log Template

#### Meeting 1: Architecture & Scope Alignment
- **Date:** September 02, 2026 | **Duration:** 45 mins
- **Attendees:** All Members (1, 2, 3, 4)
- **Agenda:** Finalize tech stack and agree on scope (strictly no real payment gateway; use Cash on Pickup).
- **Outcomes:** Selected React + Vite for client, Express + MongoDB for backend.

#### Meeting 2: API Contract & Database Freezing
- **Date:** September 09, 2026 | **Duration:** 60 mins
- **Attendees:** Member 2 (Backend), Member 3 (DB), Member 1 (Frontend)
- **Agenda:** Define REST route names and JSON payload formats.
- **Outcomes:** Frozen `/api/auth`, `/api/food`, `/api/orders`, `/api/admin` schema contracts.

#### Meeting 3: End-to-End Workflow Verification
- **Date:** September 22, 2026 | **Duration:** 50 mins
- **Attendees:** All Members
- **Agenda:** Walk through student order placement and admin kitchen status transition.
- **Outcomes:** Verified live status updates; refined cancellation rules for `Placed` only.

---

### 5. Individual Contribution Record Template

| Team Member | Specific Files Contributed | Key Achievements |
|---|---|---|
| **Member 1 (Frontend)** | `client/src/pages/student/*`, `client/src/components/FoodCard.jsx`, `CartContext.jsx` | Designed clean student ordering interface, responsive cart, and visual live progress stepper. |
| **Member 2 (Backend)** | `server/server.js`, `controllers/authController.js`, `middleware/*`, `routes/authRoutes.js` | Built robust JWT authentication, bcrypt password hashing, and role verification guards. |
| **Member 3 (Database/Admin)** | `models/*`, `controllers/adminController.js`, `seed/seed.js`, `pages/admin/*` | Created Mongoose schemas, seed scripts, admin kitchen dashboard, and status change workflow. |
| **Member 4 (QA/Docs)** | `docs/*`, `README.md`, `tests`, `controllers/orderController.js` verification | Formulated 17 black-box test cases, SRS, architecture specs, and viva demo verification. |
