import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Coffee, 
  ClipboardList, 
  User, 
  LogOut, 
  Eye, 
  Menu as MenuIcon, 
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Menu', path: '/admin/menu', icon: Coffee },
    { name: 'All Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight leading-none">
                Canteen<span className="text-orange-500">Admin</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                Staff Control
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Preview
          </div>
          <Link
            to="/menu"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition"
          >
            <Eye className="w-5 h-5 text-slate-400" />
            Student Menu View
          </Link>
        </nav>

        {/* Admin User Card in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                A
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              Campus Canteen Management Portal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Service Active
            </span>

            <Link
              to="/menu"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Menu
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
