import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MenuPage from './pages/student/MenuPage';
import CartPage from './pages/student/CartPage';
import CheckoutPage from './pages/student/CheckoutPage';
import CurrentOrdersPage from './pages/student/CurrentOrdersPage';
import OrderHistoryPage from './pages/student/OrderHistoryPage';
import OrderDetailsPage from './pages/student/OrderDetailsPage';
import StudentProfile from './pages/student/StudentProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMenu from './pages/admin/ManageMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProfile from './pages/admin/AdminProfile';

// Smart Home Redirector
const HomeRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Root smart redirect */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Student & Public Browse Routes */}
            <Route element={<StudentLayout />}>
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Protected Student Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute roleRequired="student">
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute roleRequired="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/current-order"
                element={
                  <ProtectedRoute roleRequired="student">
                    <CurrentOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/orders"
                element={
                  <ProtectedRoute roleRequired="student">
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute roleRequired="student">
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Management Routes */}
            <Route
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<ManageMenu />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
