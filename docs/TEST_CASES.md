# Test Cases & Quality Assurance Ledger
## Campus Canteen Pre-Order Management System

---

### 1. Test Suite Overview
- **Testing Approach:** Functional Black-Box & End-to-End API Integration Testing
- **Environment:** Node.js v23, MongoDB v8.2.3, Vite v5.4, Windows 11
- **Total Test Cases Executed:** 15
- **Passing Status:** 15 Passed / 0 Failed

---

### 2. Detailed Test Cases Ledger

| Test ID | Feature Under Test | Preconditions | Input Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-01** | Student Registration | System is operational; email not in DB. | Name: `"Ananya Verma"`, Email: `"ananya@college.edu"`, Password: `"Pass@123"`, Student ID: `"STU-2024-089"` | Account created in DB with hashed password; JWT returned; HTTP 201. | Account created; user returned with token; status 201. | **PASS** |
| **TC-02** | Registration with Duplicate Email | User with email already exists in DB. | Same email `"ananya@college.edu"`. | System rejects with HTTP 400 `"An account with this email already exists"`. | Received HTTP 400 error message matching expected. | **PASS** |
| **TC-03** | Valid Student Login | Account registered in DB. | Email: `"student@example.com"`, Password: `"Student@123"` | JWT token issued; user redirected to Student Dashboard. | JWT returned; redirected to dashboard. | **PASS** |
| **TC-04** | Invalid Password Login | Valid account registered. | Email: `"student@example.com"`, Password: `"WrongPassword"` | System returns HTTP 401 `"Invalid email or password"`. | HTTP 401 received; prompt displayed. | **PASS** |
| **TC-05** | Admin Login & Authorization | Admin account seeded in DB. | Email: `"admin@example.com"`, Password: `"Admin@123"` | Login succeeds; user role is `"admin"`; redirected to Admin Dashboard. | Token generated; role confirmed `"admin"`; loaded admin portal. | **PASS** |
| **TC-06** | Menu Item Search & Filter | Menu items seeded in DB. | Keyword: `"Burger"`, Category: `"Snacks"` | Only matching item (`"Crispy Veg Burger"`) is returned. | Correct single food card returned. | **PASS** |
| **TC-07** | Add Food to Cart | User browsing menu. | Item: `"Crispy Samosa"`, Qty: 2. | Cart badge updates to 2; total reflects ₹60. | Item added; badge reflects count; localStorage synchronized. | **PASS** |
| **TC-08** | Empty Cart Checkout Guard | Cart is empty (`items: []`). | Attempt to navigate to `/checkout` or submit empty order. | UI redirects back or backend rejects with HTTP 400 `"Order must contain at least one item"`. | Prevented order; displayed empty cart notice. | **PASS** |
| **TC-09** | Order Unavailable Food Guard | Item `"Steamed Idli Sambar"` has `available: false`. | `POST /api/orders` payload with unavailable item ID. | Server rejects with HTTP 400 `""Steamed Idli Sambar" is currently unavailable"`. | Rejected with HTTP 400; message displayed. | **PASS** |
| **TC-10** | Valid Order Placement | Logged-in student; valid items in cart. | Items: 2x Samosa (₹60) + 1x Cold Coffee (₹50); Notes: `"Pack in paper bag"`. | Order created with status `Placed`, payment `Cash on Pickup` (`Pending`), unique Order ID generated. | Order generated with `ORD-20261001-XXXX`; total ₹110; cart cleared. | **PASS** |
| **TC-11** | Student Cancels Valid Order | Order is in `Placed` status. | Click "Cancel Order" and confirm in modal. | Order status transitions to `Cancelled`; notes record cancellation. | Status successfully updated to `Cancelled`. | **PASS** |
| **TC-12** | Prevent Cancellation After Preparation | Order has been accepted / preparing (`orderStatus === 'Preparing'`). | Student triggers `PUT /api/orders/:id/cancel`. | Server rejects with HTTP 400 `"Order cannot be cancelled because it is already 'Preparing'"`. | Rejection received; button disabled on UI. | **PASS** |
| **TC-13** | Admin Food Item Creation | Admin authenticated. | Name: `"Masala Fries"`, Price: 50, Category: `"Snacks"`, Description: `"Peri-peri fries"`. | New item inserted into MongoDB; returned with HTTP 201. | FoodItem created; visible immediately on student menu. | **PASS** |
| **TC-14** | Admin Live Availability Toggle | Menu item active in DB. | Admin clicks availability toggle for `"Veg Grilled Sandwich"`. | Status toggles from `true` to `false`; student view marks dish `"Sold Out"`. | Immediate status change in DB and student menu. | **PASS** |
| **TC-15** | End-to-End Kitchen Status Progression | Student placed new order (`Placed`). | Admin sequentially updates: `Placed` → `Accepted` → `Preparing` → `Ready for Pickup` → `Completed`. | Status updates step-by-step; on `Completed`, payment status automatically switches to `Paid`. | Student tracker reflects each step; finalized as `Completed` & `Paid`. | **PASS** |
