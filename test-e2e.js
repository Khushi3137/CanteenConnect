// Automated End-to-End Verification Script
// Run with: node test-e2e.js
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

async function makeRequest(path, method = 'GET', data = null, token = null) {
  const url = new URL(`${BASE_URL}${path}`);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✓ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('========================================================');
  console.log('Starting End-to-End System Tests for Campus Canteen API');
  console.log('========================================================\n');

  // 1. Health check
  const health = await makeRequest('/health');
  assert(health.status === 200 && health.data.status === 'online', 'Health check is online');

  // 2. Student Registration
  const testStudentEmail = `test_${Date.now()}@college.edu`;
  const regRes = await makeRequest('/auth/register', 'POST', {
    name: 'Test Student',
    email: testStudentEmail,
    password: 'Password@123',
    studentId: 'STU-9999',
  });
  assert(regRes.status === 201 && regRes.data.success, 'New student registration');
  assert(regRes.data.token, 'Registration returns JWT token');

  // 3. Login as Seeded Student
  const studentLogin = await makeRequest('/auth/login', 'POST', {
    email: 'student@example.com',
    password: 'Student@123',
  });
  assert(studentLogin.status === 200 && studentLogin.data.success, 'Seeded student login');
  const studentToken = studentLogin.data.token;

  // 4. Login as Seeded Admin
  const adminLogin = await makeRequest('/auth/login', 'POST', {
    email: 'admin@example.com',
    password: 'Admin@123',
  });
  assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', 'Seeded admin login & role');
  const adminToken = adminLogin.data.token;

  // 5. RBAC Protection: Student cannot access Admin Dashboard
  const forbiddenCheck = await makeRequest('/admin/dashboard', 'GET', null, studentToken);
  assert(forbiddenCheck.status === 403, 'RBAC prevents student from accessing Admin APIs');

  // 6. Browse Menu & Search
  const menuRes = await makeRequest('/food?search=Burger');
  assert(menuRes.status === 200 && menuRes.data.count > 0, 'Menu search by keyword');
  const vegBurger = menuRes.data.data[0];

  const allMenu = await makeRequest('/food');
  assert(allMenu.status === 200 && allMenu.data.count >= 10, 'Full menu list retrieval');
  const availableItems = allMenu.data.data.filter((i) => i.available);
  const unavailableItem = allMenu.data.data.find((i) => !i.available);

  // 7. Place Order Guard: Attempting to order unavailable item should fail
  if (unavailableItem) {
    const invalidOrder = await makeRequest(
      '/orders',
      'POST',
      { items: [{ foodItemId: unavailableItem._id, quantity: 1 }] },
      studentToken
    );
    assert(invalidOrder.status === 400, 'Ordering unavailable item rejected with HTTP 400');
  }

  // 8. Place Valid Order
  const orderRes = await makeRequest(
    '/orders',
    'POST',
    {
      items: [
        { foodItemId: availableItems[0]._id, quantity: 2 },
        { foodItemId: availableItems[1]._id, quantity: 1 },
      ],
      notes: 'Pack separately for lunch',
    },
    studentToken
  );
  assert(orderRes.status === 201 && orderRes.data.success, 'Valid order placement');
  const placedOrder = orderRes.data.data;
  assert(placedOrder.orderStatus === 'Placed', 'Initial order status is "Placed"');
  assert(placedOrder.paymentMethod === 'Cash on Pickup', 'Payment method is "Cash on Pickup"');
  assert(placedOrder.paymentStatus === 'Pending', 'Payment status is "Pending"');
  assert(placedOrder.orderId.startsWith('ORD-'), 'Unique Order ID generated');

  // 9. Admin Dashboard shows new order
  const dashRes = await makeRequest('/admin/dashboard', 'GET', null, adminToken);
  assert(dashRes.status === 200 && dashRes.data.stats.totalFoodItems > 0, 'Admin dashboard stats retrieval');

  // 10. Admin accepts order
  const acceptRes = await makeRequest(
    `/admin/orders/${placedOrder._id}/status`,
    'PUT',
    { status: 'Accepted' },
    adminToken
  );
  assert(acceptRes.status === 200 && acceptRes.data.data.orderStatus === 'Accepted', 'Admin transitions order: Placed -> Accepted');

  // 11. Admin moves order to Preparing
  const prepRes = await makeRequest(
    `/admin/orders/${placedOrder._id}/status`,
    'PUT',
    { status: 'Preparing' },
    adminToken
  );
  assert(prepRes.status === 200 && prepRes.data.data.orderStatus === 'Preparing', 'Admin transitions order: Accepted -> Preparing');

  // 12. Student Cancellation Guard: Student CANNOT cancel once in Preparing!
  const cancelAttempt = await makeRequest(
    `/orders/${placedOrder._id}/cancel`,
    'PUT',
    { reason: 'Changed mind' },
    studentToken
  );
  assert(cancelAttempt.status === 400, 'Student prevented from cancelling order in "Preparing" status');

  // 13. Admin moves order to Ready for Pickup
  const readyRes = await makeRequest(
    `/admin/orders/${placedOrder._id}/status`,
    'PUT',
    { status: 'Ready for Pickup' },
    adminToken
  );
  assert(readyRes.status === 200 && readyRes.data.data.orderStatus === 'Ready for Pickup', 'Admin transitions order: Preparing -> Ready for Pickup');

  // 14. Admin completes order & receives cash (Auto-marks Paid)
  const completeRes = await makeRequest(
    `/admin/orders/${placedOrder._id}/status`,
    'PUT',
    { status: 'Completed' },
    adminToken
  );
  assert(completeRes.status === 200 && completeRes.data.data.orderStatus === 'Completed', 'Admin marks order Completed');
  assert(completeRes.data.data.paymentStatus === 'Paid', 'Payment status automatically updated to "Paid" on completion');

  // 15. Student places another order and cancels it while still "Placed"
  const order2 = await makeRequest(
    '/orders',
    'POST',
    { items: [{ foodItemId: availableItems[0]._id, quantity: 1 }] },
    studentToken
  );
  assert(order2.status === 201, 'Student places second order');
  const cancelOrder2 = await makeRequest(
    `/orders/${order2.data.data._id}/cancel`,
    'PUT',
    { reason: 'Have to attend class' },
    studentToken
  );
  assert(cancelOrder2.status === 200 && cancelOrder2.data.data.orderStatus === 'Cancelled', 'Student cancels order while in "Placed" status');

  // 16. Admin Menu Management CRUD
  const newDish = await makeRequest(
    '/food',
    'POST',
    {
      name: 'Paneer Kulcha',
      description: 'Stuffed spicy paneer flatbread',
      price: 65,
      category: 'Meals',
      available: true,
    },
    adminToken
  );
  assert(newDish.status === 201, 'Admin creates new food item');
  const dishId = newDish.data.data._id;

  // Toggle availability
  const toggleRes = await makeRequest(
    `/food/${dishId}`,
    'PUT',
    { available: false },
    adminToken
  );
  assert(toggleRes.status === 200 && toggleRes.data.data.available === false, 'Admin toggles food availability');

  // Delete dish
  const deleteRes = await makeRequest(`/food/${dishId}`, 'DELETE', null, adminToken);
  assert(deleteRes.status === 200 && deleteRes.data.success, 'Admin deletes food item');

  console.log('\n========================================================');
  console.log('🎉 ALL END-TO-END SYSTEM INTEGRATION TESTS PASSED (16/16)');
  console.log('========================================================\n');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Fatal Test Failure:', err);
  process.exit(1);
});
