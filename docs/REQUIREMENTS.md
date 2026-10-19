# System Requirements Specification & Traceability
## Campus Canteen Pre-Order Management System

---

### 1. Functional Requirements Matrix

| Req ID | Module | Feature Description | User Role | Priority | Implementation Source |
|---|---|---|---|---|---|
| **REQ-AUTH-01** | Auth | Student registration with Name, Email, Password, Student ID | Student | High | `authController.registerUser` |
| **REQ-AUTH-02** | Auth | Student and Admin login with password verification and JWT token return | All | High | `authController.loginUser` |
| **REQ-AUTH-03** | Auth | Role verification and token validation for private endpoints | System | High | `middleware/authMiddleware.js` |
| **REQ-FOOD-01** | Menu | Public viewing of food items with category, description, and price | All | High | `foodController.getFoodItems` |
| **REQ-FOOD-02** | Menu | Search food items by keyword (name or description) | All | Medium | `foodController.getFoodItems` |
| **REQ-FOOD-03** | Menu | Filter items by category (Snacks, Meals, Beverages, etc.) | All | Medium | `MenuPage.jsx` |
| **REQ-FOOD-04** | Menu | Filter items by live availability status | All | Medium | `MenuPage.jsx` |
| **REQ-CART-01** | Cart | Add item to cart, prevent adding unavailable items | Student | High | `CartContext.jsx` |
| **REQ-CART-02** | Cart | Increase, decrease quantity or remove items with automatic total update | Student | High | `CartContext.jsx` |
| **REQ-CART-03** | Cart | Session storage persistence so cart survives page reloads | Student | Medium | `CartContext.jsx` |
| **REQ-ORD-01** | Orders | Checkout and create order with unique Order ID (`ORD-YYYYMMDD-XXXX`) | Student | High | `orderController.createOrder` |
| **REQ-ORD-02** | Orders | Initialize order status to `Placed` and payment to `Cash on Pickup` (`Pending`) | Student | High | `Order.js` model defaults |
| **REQ-ORD-03** | Orders | View active order with visual step-by-step progress tracker | Student | High | `CurrentOrdersPage.jsx` |
| **REQ-ORD-04** | Orders | View complete order history and detailed breakdown of past meals | Student | Medium | `OrderHistoryPage.jsx` |
| **REQ-ORD-05** | Orders | Allow cancellation strictly while order is in `Placed` status | Student | High | `orderController.cancelOrder` |
| **REQ-ADM-01** | Admin | Admin overview dashboard with order volume and status counts | Admin | High | `adminController.getAdminDashboardStats` |
| **REQ-ADM-02** | Admin | Full menu CRUD (Add, Edit, Delete, Toggle Availability, Price change) | Admin | High | `foodController.js` & `ManageMenu.jsx` |
| **REQ-ADM-03** | Admin | View all student orders with search by Order ID and status filter | Admin | High | `AdminOrders.jsx` |
| **REQ-ADM-04** | Admin | Transition order status: `Placed` → `Accepted` → `Preparing` → `Ready for Pickup` → `Completed` | Admin | High | `adminController.updateOrderStatus` |
| **REQ-ADM-05** | Admin | Mark payment status to `Paid` automatically upon order completion | Admin | Medium | `adminController.updateOrderStatus` |

---

### 2. User Stories & Acceptance Criteria

#### User Story 1 (US1) - Menu Browsing
- **As a:** Student
- **I want to:** View the available food menu with prices, descriptions, and categories.
- **So that:** I can decide what I want to eat before walking to the canteen.
- **Acceptance Criteria:**
  1. The menu displays dishes in a responsive grid.
  2. Each card shows the item name, image/icon, category, description, price (₹), and availability status.
  3. Items marked sold-out display a distinctive badge and disable ordering.

#### User Story 2 (US2) - Multi-Item Cart
- **As a:** Student
- **I want to:** Add multiple dishes to my cart and adjust quantities.
- **So that:** I can pre-order an entire meal in a single transaction.
- **Acceptance Criteria:**
  1. Clicking "Add to Cart" increments the cart counter badge.
  2. The cart page displays itemized prices and computed grand total.
  3. Decreasing quantity to 0 prompts removal or removes the item cleanly.

#### User Story 3 (US3) - Order Placement & Cash on Pickup
- **As a:** Student
- **I want to:** Place an order with Cash on Pickup terms.
- **So that:** I receive a unique Order ID without needing a credit card or bank credentials.
- **Acceptance Criteria:**
  1. Order creation generates a readable Order ID (e.g., `ORD-20261001-XXXX`).
  2. Initial status is automatically set to `Placed`.
  3. Payment method is set to `Cash on Pickup` with status `Pending`.

#### User Story 4 (US4) - Real-Time Status Tracking
- **As a:** Student
- **I want to:** Track the live preparation state of my order.
- **So that:** I know exactly when to walk down to the pickup counter.
- **Acceptance Criteria:**
  1. Progress bar visually illustrates the 5 core milestones (`Placed`, `Accepted`, `Preparing`, `Ready for Pickup`, `Completed`).
  2. Once `Ready for Pickup`, the UI highlights the counter pickup notification.
  3. "Refresh Status" button fetches latest data from the backend.

#### User Story 5 (US5) - Kitchen Status Transitions
- **As a:** Canteen Administrator
- **I want to:** Progress orders through kitchen stages.
- **So that:** The kitchen runs in an orderly fashion and students are notified.
- **Acceptance Criteria:**
  1. Admin dashboard presents pending orders awaiting action.
  2. One-click action buttons progress orders from `Placed` to `Accepted`, `Preparing`, `Ready`, and `Completed`.
  3. Marking `Completed` switches payment status to `Paid`.

#### User Story 6 (US6) - Menu Availability Management
- **As a:** Canteen Administrator
- **I want to:** Toggle item availability on and off with a single click.
- **So that:** Students cannot place orders for items that have run out of stock.
- **Acceptance Criteria:**
  1. Menu items have an instant availability toggle button in the admin table.
  2. Toggling to "Sold Out" instantly reflects on the student menu.
  3. Backend rejects any order attempt for an unavailable item with HTTP 400.
