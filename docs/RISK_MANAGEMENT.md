# Risk Management Plan & Mitigation Strategies
## Campus Canteen Pre-Order Management System

---

### 1. Risk Assessment Framework
Risks are evaluated using a standard 3x3 Probability and Impact matrix:
- **Probability:** Low (L), Medium (M), High (H)
- **Impact:** Low (L), Medium (M), High (H)

---

### 2. Risk Log & Mitigation Table

| Risk ID | Risk Category | Risk Description | Probability | Impact | Severity | Mitigation Strategy |
|---|---|---|---|---|---|---|
| **RSK-01** | Infrastructure | **Database Connection Failure**<br>MongoDB service fails to start or network drops on local/Atlas connection. | Low | High | **Medium** | - Implement try/catch blocks with informative error logging in `config/db.js`.<br>- Support fallback connection strings in `.env`.<br>- Provide automated database seeding script (`npm run seed`) to quickly restore initial collections. |
| **RSK-02** | Security | **Authentication & Authorization Vulnerabilities**<br>Students bypassing client UI to invoke administrative APIs or brute forcing passwords. | Medium | High | **High** | - Server-side enforcement using `adminMiddleware` on all `/api/admin/*` endpoints.<br>- Hash passwords using `bcrypt` with 10 salt rounds.<br>- Issue cryptographically signed JWT tokens with 7-day expiration.<br>- Never return password hashes in API responses (`select('-password')`). |
| **RSK-03** | Schedule | **Delayed Development Schedule**<br>Team members falling behind on milestone deadlines, jeopardizing college viva deadlines. | Medium | Medium | **Medium** | - Adopt a strict "No Over-Engineering" policy.<br>- Eliminate third-party external dependencies (e.g. no real payment gateways).<br>- Maintain weekly milestones with clear task separation between UI, backend, and documentation. |
| **RSK-04** | Architecture | **Frontend & Backend Integration Conflicts**<br>CORS errors, schema mismatches, or unexpected HTTP payload structures. | Medium | High | **High** | - Configure Express CORS middleware with permissive development settings (`origin: '*'`).<br>- Maintain proxy configuration in `vite.config.js` (`/api` → `http://localhost:5000`).<br>- Define centralized API service files (`api.js`, `orderService.js`) matching server response schemas. |
| **RSK-05** | Quality | **Critical Bugs During Testing / Viva Demo**<br>Ordering unavailable dishes, negative quantities, or race conditions during status transitions. | Medium | High | **High** | - Enforce server-side validation for all item availability and quantities before saving orders.<br>- Provide confirmation modals before destructive actions (cancellation, item deletion).<br>- Formulate and execute 17 rigorous test cases covering edge cases prior to submission. |

---

### 3. Contingency Protocols
1. **Database Corruption or Missing Test Data:**
   - Execute: `npm run seed` in the `server` directory. Restores default admin, test student, 11 food dishes, and 3 realistic demo orders in under 3 seconds.
2. **Port Conflict (Port 5000 or 5173 occupied):**
   - Backend PORT configurable via `server/.env`.
   - Frontend Vite automatically suggests port 5174 or can be specified via `vite --port <port>`.
3. **Lost Session or Stale Token:**
   - Client detects HTTP 401 and clears `localStorage` token, safely navigating student back to `/login`.
