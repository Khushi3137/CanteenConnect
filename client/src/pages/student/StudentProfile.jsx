import React, { useState, useEffect } from 'react';
import { User, Mail, IdCard, Calendar, ShoppingBag, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentProfile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading student profile..." />;
  }

  const completedCount = orders.filter((o) => o.orderStatus === 'Completed').length;
  const totalSpent = orders
    .filter((o) => o.orderStatus === 'Completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile 👤
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your registered campus canteen account information
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Profile Card Header */}
        <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl text-white shadow-inner">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Campus Student Account</span>
            </p>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="p-6 space-y-4 divide-y divide-slate-100">
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <IdCard className="w-4 h-4 text-orange-600" />
              Student ID / Roll No.
            </span>
            <span className="font-bold text-slate-900">{user?.studentId || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-3">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-600" />
              Email Address
            </span>
            <span className="font-bold text-slate-900">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-3">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              Account Role
            </span>
            <span className="font-bold text-slate-900 capitalize">{user?.role}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-3">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              Member Since
            </span>
            <span className="font-bold text-slate-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Current Academic Term'}
            </span>
          </div>
        </div>
      </div>

      {/* Canteen Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Completed Orders
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{completedCount}</p>
          <span className="text-[10px] text-slate-400">Collected at counter</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Spend
          </span>
          <p className="text-2xl font-black text-orange-600 mt-1">₹{totalSpent}</p>
          <span className="text-[10px] text-slate-400">Cash on pickup</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Canteen Portal</span>
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
