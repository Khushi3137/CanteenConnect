import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Clock, 
  User as UserIcon, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  LayoutDashboard,
  ClipboardList,
  Coffee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                Campus<span className="text-orange-600">Canteen</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Pre-Order Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!isAdmin ? (
              // Student Links
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/student/dashboard')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/menu"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/menu')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Menu
                </Link>
                <Link
                  to="/student/current-order"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/student/current-order')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Live Order
                </Link>
                <Link
                  to="/student/orders"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/student/orders')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Order History
                </Link>
              </>
            ) : (
              // Admin Links
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                    isActive('/admin/dashboard')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/menu"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                    isActive('/admin/menu')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  Manage Menu
                </Link>
                <Link
                  to="/admin/orders"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                    isActive('/admin/orders')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  Orders
                </Link>
              </>
            )}
          </div>

          {/* Right Action Icons & User Info */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAdmin && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-in zoom-in-50">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <Link
                  to={isAdmin ? '/admin/profile' : '/student/profile'}
                  className="flex items-center gap-2 group text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-200 group-hover:bg-orange-100 group-hover:text-orange-700 transition">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 capitalize">
                      {user.role} {user.studentId ? `(${user.studentId})` : ''}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-orange-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            {!isAdmin && user && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {!isAdmin ? (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Student Dashboard
              </Link>
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Menu
              </Link>
              <Link
                to="/student/current-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Live / Current Order
              </Link>
              <Link
                to="/student/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Order History
              </Link>
              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Manage Menu Items
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Orders Management
              </Link>
              <Link
                to="/admin/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Admin Profile
              </Link>
            </>
          )}

          {user && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">{user.name}</span>
                <span className="text-xs text-slate-400">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
