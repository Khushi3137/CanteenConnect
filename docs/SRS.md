# Software Requirements Specification (SRS)
## Campus Canteen Pre-Order Management System

---

### 1. Document Control & Overview
- **Project Name:** Campus Canteen Pre-Order Management System
- **Document Version:** 1.0.0
- **Academic Context:** Software Engineering & Project Management Capstone
- **Primary Stakeholders:** College Students, Canteen Staff / Administrators, Project Evaluators

---

### 2. Problem Statement
In traditional campus canteens, students face substantial delays during peak recess and lunch hours (12:00 PM – 2:00 PM). The conventional manual ordering workflow entails:
1. Physical queueing at the cash register to place an order and collect a paper token.
2. Waiting around the preparation counter with crowds while food is cooked.
3. Frequent discrepancies in order queues, misplaced tokens, and stock shortages.
4. Inefficient workload forecasting for kitchen staff, resulting in food waste or delayed orders.

---

### 3. Motivation
Modernizing the campus dining workflow via a web-based pre-ordering portal eliminates congestion, enhances student break efficiency, and gives canteen administrators clear visibility into impending kitchen demand without introducing cumbersome third-party dependencies or payment gateway processing fees.

---

### 4. Objectives
- **Queue Reduction:** Enable students to browse real-time canteen menus and place meal orders in advance from any device on campus.
- **Workflow Transparency:** Implement a distinct 5-stage order status progression (`Placed` → `Accepted` → `Preparing` → `Ready for Pickup` → `Completed`).
- **Administrative Control:** Empower canteen operators to manage item availability, pricing, and descriptions, preventing orders for out-of-stock items.
- **Academic Clarity:** Maintain a clean, maintainable MERN architecture without over-engineering so students can explain every software engineering decision during viva.

---

### 5. Scope of the System
#### 5.1 In-Scope (Features Included)
- **Role-based Authentication:** Secure JWT authentication and bcrypt password hashing for Student and Admin roles.
- **Menu Catalog & Categorization:** Filterable food catalog across Snacks, Meals, Beverages, Desserts, and Breakfast.
- **Search & Availability Filtering:** Real-time search by food name/description and live in-stock/sold-out status indicators.
- **Shopping Cart Management:** Session-persistent cart with quantity adjustments and dynamic total computation.
- **Pre-Order Placement:** Generation of unique human-readable Order IDs (`ORD-YYYYMMDD-XXXX`), order persistence, and status tracking.
- **Live Status Tracking:** Real-time visual pipeline showing order progress from kitchen receipt to pickup.
- **Controlled Order Cancellation:** Order cancellation permitted strictly while status remains `Placed`.
- **Admin Kitchen Dashboard:** Real-time operational metrics (orders today, pending, in preparation, ready, completed, revenue).
- **Menu Item CRUD:** Complete administrative management of dishes, prices, descriptions, and availability.

#### 5.2 Out-of-Scope (Features Excluded)
- Real external payment gateways (e.g. Razorpay/Stripe); the system deliberately uses a college-appropriate **Cash on Pickup** workflow.
- Complex GPS tracking or delivery to classroom locations.
- Machine learning recommendation algorithms.
- Heavy WebSocket microservices; uses lightweight auto-refresh and reactive RESTful state updates.

---

### 6. Assumptions and Constraints
#### 6.1 Assumptions
- Students have network access via campus Wi-Fi or mobile data.
- Food is picked up physically at the designated canteen counter.
- Canteen staff access the portal on a counter PC, laptop, or tablet.

#### 6.2 Constraints
- **Platform:** Modern web browsers (Chrome, Edge, Firefox, Safari).
- **Database:** MongoDB instance running locally or via MongoDB Atlas.
- **Security:** Passwords salted and hashed with bcrypt (min. 10 rounds); routes protected by JWT bearer authentication.
- **Budget:** Built using 100% open-source technologies (Node.js, Express, React, Tailwind CSS, Mongoose).

---

### 7. Stakeholders & User Roles
| Stakeholder | Description | Primary Interest |
|---|---|---|
| **College Student** | Primary consumer who registers, searches food, orders ahead, and collects food. | Quick ordering, minimal queueing, accurate order status. |
| **Canteen Staff / Admin** | Operational managers preparing meals and managing counter handoffs. | Accurate demand forecasting, item toggling, order fulfillment. |
| **College Faculty / Evaluators** | Academic evaluators assessing architecture, modularity, and viva clarity. | Code quality, design patterns, testing, requirement compliance. |

---

### 8. Functional Requirements
- **FR1 (Auth):** The system shall allow students to register with Name, Student ID, Email, and Password.
- **FR2 (Auth):** The system shall authenticate users via JWT and prevent unauthorized access to role-gated routes.
- **FR3 (Menu):** The system shall list all menu items showing Name, Description, Category, Price, and In-Stock badge.
- **FR4 (Filter):** The system shall support real-time searching by title and filtering by category and availability.
- **FR5 (Cart):** The system shall allow users to add, increment, decrement, and remove items with persistent storage.
- **FR6 (Order):** The system shall create an order with unique ID, status `Placed`, and payment `Cash on Pickup` (`Pending`).
- **FR7 (Validation):** The system shall reject orders containing sold-out items or negative quantities.
- **FR8 (Track):** Students shall be able to track order progression through visual status stages.
- **FR9 (Cancel):** Students can cancel orders only if the kitchen has not progressed past `Placed`.
- **FR10 (Admin):** Admins shall view dashboard analytics including daily orders, active kitchen counts, and revenue.
- **FR11 (Admin):** Admins shall update order stages: `Placed` → `Accepted` → `Preparing` → `Ready for Pickup` → `Completed`.
- **FR12 (Admin Menu):** Admins shall create, update, delete, and toggle availability of any menu item.

---

### 9. Non-Functional Requirements
- **Performance:** API response times under 200ms under standard local network conditions.
- **Usability:** Responsive UI optimized for mobile screens (smartphones) as well as desktop monitors.
- **Reliability:** Data integrity guaranteed via Mongoose schema validators and pre-save database middleware.
- **Security:** Passwords never stored in plaintext; JWT tokens signed with SHA-256 and stored safely in client headers.
- **Maintainability:** Modular MVC folder separation on backend and component-driven architecture on frontend.

---

### 10. Requirement Prioritization (MoSCoW Matrix)
- **Must Have (M):** Student registration/login, Menu browsing, Cart, Checkout with unique Order ID, Admin order status transitions (`Placed` → `Completed`), Menu CRUD.
- **Should Have (S):** Real-time order status tracking with visual timeline, Order cancellation constraint (`Placed` only), Admin dashboard metrics.
- **Could Have (C):** Search debounce, quick viva autofill buttons, category tab switching animations.
- **Won't Have (W) [for initial release]:** Third-party online credit card processing, delivery fleet tracking.
