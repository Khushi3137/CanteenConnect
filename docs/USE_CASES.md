# Use Cases Specification
## Campus Canteen Pre-Order Management System

---

### 1. Actor Definitions
- **Student (User):** Registered student placing pre-orders for counter pickup.
- **Admin (Canteen Staff):** Kitchen supervisor / counter staff who updates order workflow and manages dishes.
- **System:** Automated backend API executing validations, JWT authentication, and database transactions.

---

### 2. Student Use Cases

#### UC-STU-01: Student Registration
- **Primary Actor:** Student
- **Preconditions:** Student is not logged in; has valid email and student ID.
- **Main Success Scenario:**
  1. Student navigates to the Registration page.
  2. Student enters Name, Student ID, Email, Password, and Confirm Password.
  3. Student submits the form.
  4. System validates non-empty inputs, email regex, and minimum password length (6 characters).
  5. System hashes password via `bcrypt` and creates record in MongoDB.
  6. System issues JWT token and redirects student to the Student Dashboard.
- **Alternate Flows:**
  - *4a. Email already exists:* System displays error: `"An account with this email already exists"`.
  - *4b. Passwords do not match:* System displays client-side validation error.

#### UC-STU-02: Student Login
- **Primary Actor:** Student
- **Preconditions:** Registered user account exists.
- **Main Success Scenario:**
  1. Student enters Email and Password.
  2. System compares password using `bcrypt.compare`.
  3. System returns JWT bearer token and user role.
  4. Client stores token and redirects to `/student/dashboard`.
- **Alternate Flows:**
  - *2a. Invalid credentials:* System returns HTTP 401 with `"Invalid email or password"`.

#### UC-STU-03: View & Search Menu
- **Primary Actor:** Student
- **Preconditions:** None (publicly viewable or logged-in).
- **Main Success Scenario:**
  1. Student opens the Menu page.
  2. System fetches all food items from `GET /api/food`.
  3. Student types search keywords (e.g., `"Sandwich"`) or clicks a category tab (e.g., `"Snacks"`).
  4. System debounces and filters list dynamically.
  5. Student clicks a food item to inspect the detailed description and full image.

#### UC-STU-04: Add Food to Cart
- **Primary Actor:** Student
- **Preconditions:** Dish is marked as `available: true`.
- **Main Success Scenario:**
  1. Student clicks "Add to Cart" or adjusts the stepper.
  2. Cart context updates items and increments total badge.
  3. Cart synchronizes to `localStorage` for offline persistence across page reloads.

#### UC-STU-05: Place Order (Cash on Pickup)
- **Primary Actor:** Student
- **Preconditions:** Student is logged in; cart contains at least one item.
- **Main Success Scenario:**
  1. Student navigates to `/cart` and clicks "Proceed to Checkout".
  2. Student reviews itemized prices and enters optional preparation notes.
  3. Student submits order.
  4. System validates availability of each item in the database.
  5. System generates unique Order ID (`ORD-YYYYMMDD-XXXX`), sets status to `Placed`, payment method to `Cash on Pickup`, and payment status to `Pending`.
  6. Cart is cleared; student is navigated to the Live Order tracking screen.
- **Alternate Flows:**
  - *4a. Item went out of stock before submission:* System aborts order and returns HTTP 400 with error message naming the unavailable item.

#### UC-STU-06: Track Live Order Status
- **Primary Actor:** Student
- **Preconditions:** Active order exists.
- **Main Success Scenario:**
  1. Student views `/student/current-order`.
  2. Visual stepper timeline illustrates the current order stage:
     `Placed` → `Accepted` → `Preparing` → `Ready for Pickup` → `Completed`.
  3. When status reaches `Ready for Pickup`, prominent banner informs student to collect food at Express Counter #2.
  4. Background poller automatically synchronizes status changes every 10 seconds.

#### UC-STU-07: Cancel Order
- **Primary Actor:** Student
- **Preconditions:** Order status is strictly `Placed`.
- **Main Success Scenario:**
  1. Student clicks "Cancel Order" on an order in `Placed` status.
  2. Confirmation modal prompts student to confirm.
  3. System changes status to `Cancelled` and notes reason.
- **Alternate Flows:**
  - *1a. Order status is `Accepted`, `Preparing`, or beyond:* System rejects cancellation with HTTP 400: `"Order cannot be cancelled because it is already 'Preparing'"`.

#### UC-STU-08: View Order History
- **Primary Actor:** Student
- **Preconditions:** Student is authenticated.
- **Main Success Scenario:**
  1. Student navigates to `/student/orders`.
  2. System loads chronological order history.
  3. Student filters by status (`Completed`, `Cancelled`, etc.) and clicks "View" for itemized receipts.

---

### 3. Admin (Canteen Staff) Use Cases

#### UC-ADM-01: Admin Login
- **Primary Actor:** Canteen Staff
- **Preconditions:** Admin account exists in database.
- **Main Success Scenario:**
  1. Admin logs in with `admin@example.com` and `Admin@123`.
  2. System verifies admin role and grants access to `/admin/*` control routes.

#### UC-ADM-02: View Dashboard Analytics
- **Primary Actor:** Admin
- **Preconditions:** Admin authenticated.
- **Main Success Scenario:**
  1. Admin opens `/admin/dashboard`.
  2. System displays 6 core operational cards: Total Orders Today, Placed Orders, In Preparation, Ready for Pickup, Completed Orders, and Menu inventory count.
  3. System computes today's cash revenue collected from completed orders.

#### UC-ADM-03: Manage Menu (CRUD & In-Stock Toggling)
- **Primary Actor:** Admin
- **Preconditions:** Admin authenticated.
- **Main Success Scenario:**
  1. Admin opens `/admin/menu`.
  2. **Add Item:** Admin opens form modal, inputs name, price, description, category, and submits.
  3. **Edit Item:** Admin modifies price or description; system executes `PUT /api/food/:id`.
  4. **Toggle Availability:** Admin clicks "Available / Sold Out" badge; state flips immediately.
  5. **Delete Item:** Admin clicks trash icon, confirms modal prompt; record is removed.

#### UC-ADM-04: View & Search All Orders
- **Primary Actor:** Admin
- **Preconditions:** Admin authenticated.
- **Main Success Scenario:**
  1. Admin opens `/admin/orders`.
  2. System retrieves all student orders with customer names and student IDs.
  3. Admin filters by status (e.g. `Placed` or `Preparing`) or searches by specific Order ID.

#### UC-ADM-05: Update Order Workflow Status
- **Primary Actor:** Admin
- **Preconditions:** Order is active.
- **Main Success Scenario:**
  1. Admin clicks workflow transition button:
     - `Placed` → `Accepted` (or `Rejected`)
     - `Accepted` → `Preparing`
     - `Preparing` → `Ready for Pickup`
     - `Ready for Pickup` → `Completed`
  2. When transitioned to `Completed`, system marks `paymentStatus = "Paid"` automatically.
  3. Student tracker reflects new stage upon refresh or periodic polling.
