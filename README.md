# Campus Canteen Pre-Order Management System 🍽️

> A clean, modern, and reliable Software Engineering & Project Management Capstone Web Application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**.

---

## 📌 Project Overview
The **Campus Canteen Pre-Order Management System** streamlines food ordering across college campuses. It allows students to browse today's menu, customize their cart, and pre-order food to avoid long lunch-hour queueing. Canteen administrators and kitchen staff can manage food dishes, toggle stock availability in real time, and progress orders step-by-step through kitchen preparation stages to counter pickup.

### Key Highlights
- **Role-Based Workflows:** Dedicated portals for **Students** and **Canteen Administrators**.
- **Cash on Pickup:** Practical, college-tailored workflow without third-party payment gateway dependencies.
- **Live Order Tracker:** Visual 5-stage progress pipeline (`Placed` → `Accepted` → `Preparing` → `Ready for Pickup` → `Completed`).
- **Strict Order Governance:** Order cancellation permitted strictly while in `Placed` status.
- **Admin Kitchen Control:** Real-time analytics, instant dish availability toggles, and price management.
- **Zero Fluff / Viva Ready:** Clean architecture without over-engineering; straightforward to demonstrate and defend in viva exams.
- **Responsive UI:** Mobile‑first design with Tailwind CSS.

---

## 🚀 Tech Stack

### Frontend
- **React.js 18** (SPA with Vite bundler)
- **Tailwind CSS 3** (Responsive, modern styling)
- **React Router DOM 6** (Client-side routing & route guards)
- **Lucide React** (Clean, modern UI iconography)
- **Axios** (HTTP client with JWT Bearer interceptor)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (REST API framework)
- **JSON Web Tokens (JWT)** (Stateless authorization)
- **bcryptjs** (Salted password hashing)
- **CORS & Dotenv** (Middleware & configuration management)

### Database
- **MongoDB** (NoSQL document database)
- **Mongoose ODM** (Schema validation, relational references, embedded snapshots)

---

## 📁 Project Structure

```text
campus-canteen/
│
├── client/                     # Frontend React + Vite + Tailwind application
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, FoodCard, StatusBadge, etc.)
│   │   ├── context/            # AuthContext (JWT session) & CartContext (persistent cart)
│   │   ├── layouts/            # StudentLayout & AdminLayout (with staff sidebar)
│   │   ├── pages/              # Login, Register
│   │   │   ├── student/        # Dashboard, Menu, Cart, Checkout, Live Tracker, History, Profile
│   │   │   └── admin/          # Dashboard, Manage Menu, Orders Management, Admin Profile
│   │   ├── services/           # Axios API services (authService, foodService, orderService, etc.)
│   │   ├── App.jsx             # Main Router configuration & Route Guards
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS directives & custom styles
│   ├── index.html              # HTML shell with Google Fonts
│   ├── tailwind.config.js      # Tailwind design system configuration
│   ├── vite.config.js          # Vite configuration with /api backend proxy
│   └── package.json
│
├── server/                     # Backend Node.js + Express API
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB connection
│   ├── controllers/            # Request handlers (auth, food, order, admin)
│   ├── middleware/             # authMiddleware, adminMiddleware, errorHandler
│   ├── models/                 # Mongoose schemas (User, FoodItem, Order)
│   ├── routes/                 # Express REST endpoints (/auth, /food, /orders, /admin)
│   ├── seed/
│   │   └── seed.js             # Automated database population script
│   ├── utils/                  # Unique Order ID generator
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Application entry point
│
├── docs/                       # Software Engineering & Project Management Artifacts
│   ├── SRS.md                  # Software Requirements Specification
│   ├── REQUIREMENTS.md         # Requirements matrix, user stories, acceptance criteria
│   ├── USE_CASES.md            # Detailed student & admin use cases
│   ├── ARCHITECTURE.md         # 3-tier architecture, sequence diagrams, tech justifications
│   ├── DATABASE_DESIGN.md      # ER diagram, collection schemas, price snapshot logic
│   ├── TEST_CASES.md           # 15 test cases with inputs and outcomes
│   ├── PROJECT_PLAN.md         # 3-member team work allocation & Gantt chart
│   ├── RISK_MANAGEMENT.md      # Project risk matrix and mitigation protocols
│   └── CONTRIBUTION_TEMPLATE.md# Viva preparation notes and meeting log templates
│
├── .env.example                # Root environment variable template
├── .gitignore                  # Git exclusions
└── README.md                   # Comprehensive project documentation
```

---

## ⚡ Prerequisites
Make sure you have installed on your machine:
- **Node.js:** v18.0.0 or higher (Tested on Node v23)
- **npm:** v9.0.0 or higher
- **MongoDB:** A locally running MongoDB instance (default port `27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

---

## 🛠️ Installation & Setup

### Step 1: Clone or Navigate to Project
```bash
cd campus-canteen
```

### Step 2: Configure Environment Variables
Inside `server/`, create a `.env` file (a `.env.example` is provided):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/campus_canteen
JWT_SECRET=super_secret_jwt_key_campus_canteen_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Install Server Dependencies
```bash
cd server
npm install
```

### Step 4: Seed the Database
Populate the database with the default Admin account, a sample Student, and 11 delicious food menu items:
```bash
npm run seed
```
> **Output:**
> ```text
> ✓ Admin created: admin@example.com
> ✓ Student created: student@example.com
> ✓ 11 food items created successfully
> ✓ 3 sample orders created for demo & test verification
> ```

### Step 5: Install Client Dependencies
Open a second terminal window or navigate to the `client/` folder:
```bash
cd ../client
npm install
```

---

## ▶️ Running the Application

### 1. Start the Backend Server
In the `server/` directory:
```bash
npm run dev
# OR: npm start
```
- Server starts at: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

### 2. Start the Frontend Client
In the `client/` directory:
```bash
npm run dev
```
- Client launches at: `http://localhost:5173`

---

## 🔑 Default Login Credentials

For quick evaluation and viva demonstrations, the login screen includes **one-click auto-fill buttons**:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Canteen Admin** | `admin@example.com` | `Admin@123` | Full menu CRUD, kitchen workflow order management, analytics |
| **Sample Student** | `student@example.com` | `Student@123` | Menu browse, cart, checkout, live order tracking, history |

> *Tip: You can also register a brand-new student account directly on the `/register` page.*

---

## 🔄 End-to-End Demonstration Walkthrough (Viva Flow)

Follow this sequence to demonstrate the complete full-stack flow:

1. **Student Login & Menu:**
   - Log in as Student (`student@example.com` / `Student@123`).
   - Browse the Menu at `/menu`. Filter by `"Snacks"`, search for `"Burger"`.
   - Add **Crispy Veg Burger** (₹70) and **Chilled Cold Coffee** (₹50) to cart.
2. **Checkout & Order Creation:**
   - Go to Cart (`/cart`) and click **"Proceed to Checkout"**.
   - Enter cooking note: *"Less ice in coffee"*.
   - Click **"Confirm & Place Order"**.
   - Note the generated unique Order ID (e.g., `ORD-20261001-XXXX`).
   - Status is initially **`Placed`**.
3. **Admin Kitchen Processing:**
   - In another browser tab/window or incognito, log in as Admin (`admin@example.com` / `Admin@123`).
   - Open **Admin Orders** (`/admin/orders`).
   - Locate the student's new order.
   - Click **Accept** → status changes to `Accepted`.
   - Click **Start Cooking** → status changes to `Preparing`.
   - Click **Ready for Pickup** → status changes to `Ready for Pickup`.
4. **Student Live Pickup Notification:**
   - Return to the Student portal at `/student/current-order`.
   - The visual stepper shows **`Ready for Pickup`** with an alert to collect at Counter #2.
5. **Counter Handoff & Cash Collection:**
   - In Admin portal, click **Mark Completed (Paid)**.
   - Payment status changes from `Pending` to `Paid`, and order status becomes `Completed`.
   - Admin Dashboard stats increment today's cash revenue!

---

## 📡 REST API Reference

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` — Register a student account
- `POST /api/auth/login` — Authenticate user and obtain JWT token
- `GET /api/auth/me` — Retrieve logged-in profile *(Protected)*

### Food Menu Routes (`/api/food`)
- `GET /api/food` — Public list with search (`?search=...`), category (`?category=...`), and availability (`?available=true`)
- `GET /api/food/:id` — Retrieve single food item details
- `POST /api/food` — Create new menu item *(Admin only)*
- `PUT /api/food/:id` — Update food details or toggle stock *(Admin only)*
- `DELETE /api/food/:id` — Remove item from menu *(Admin only)*

### Order Routes (`/api/orders`)
- `POST /api/orders` — Place order with items and notes *(Student)*
- `GET /api/orders/my-orders` — View logged-in student's order history *(Student)*
- `GET /api/orders/:id` — View details of a specific order *(Owner or Admin)*
- `PUT /api/orders/:id/cancel` — Cancel order *(Allowed strictly while in `Placed` status)*

### Admin Management Routes (`/api/admin`)
- `GET /api/admin/dashboard` — Fetch operational metrics and today's revenue *(Admin only)*
- `GET /api/admin/orders` — Retrieve all campus orders with search and status filters *(Admin only)*
- `PUT /api/admin/orders/:id/status` — Transition order status (`Placed` → `Completed`) *(Admin only)*

---

## 🖼️ Screenshots Section Placeholder

| Screen | Description |
|---|---|
| **Student Dashboard** | *Clean welcome hero, active order highlight card, and popular canteen picks* |
| **Menu & Filter View** | *Category pills (Snacks, Meals, Beverages), search debounce, availability toggles* |
| **Interactive Cart** | *Itemized quantity adjusters, subsidized fee breakdown, cash pickup summary* |
| **Live Order Stepper** | *5-step visual timeline tracking order from placement to counter pickup* |
| **Admin Kitchen Dashboard** | *KPI cards for orders today, in-cooking count, ready count, and cash revenue* |
| **Menu CRUD Console** | *Instant availability toggle buttons, dish modal editor, and delete protections* |

---

## 🔮 Future Enhancements
- **SMS / Push Notifications:** Notify students via WebPush API when food is ready.
- **Counter QR Code Scanner:** Student presents a digital QR on pickup for instant validation.
- **Kitchen Display System (KDS):** Large-screen kitchen view with auto-sound alerts on new incoming orders.
- **Daily Specials & Combos:** Time-based menus (e.g. Breakfast available only before 11:00 AM).
- **Analytics Dashboard:** Visualize sales and order trends.

---

## 📜 Academic Integrity & License
This project was developed strictly for academic purposes as a Software Engineering & Project Management capstone project. Open source under the MIT License.
