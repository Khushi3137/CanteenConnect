import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  CheckCircle2, 
  UtensilsCrossed, 
  IndianRupee, 
  TrendingUp, 
  ArrowRight, 
  RefreshCw,
  AlertCircle,
  Plus
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        setRecentOrders(res.recentOrders);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto refresh every 15s so admin sees incoming orders
    const timer = setInterval(() => {
      fetchDashboardData();
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setActionSuccess(`Order updated to "${newStatus}"`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating dashboard statistics..." />;
  }

  const statCards = [
    {
      title: 'Orders Today',
      value: stats?.totalOrdersToday ?? 0,
      sub: 'All orders placed today',
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Pending (Placed)',
      value: stats?.placedOrders ?? 0,
      sub: 'Need admin acceptance',
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'In Preparation',
      value: stats?.preparingOrders ?? 0,
      sub: 'Kitchen currently cooking',
      icon: ChefHat,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Ready for Pickup',
      value: stats?.readyOrders ?? 0,
      sub: 'Waiting at Counter #2',
      icon: PackageCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Completed Orders',
      value: stats?.completedOrders ?? 0,
      sub: 'Delivered & paid',
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600 border-green-100',
    },
    {
      title: 'Menu Items',
      value: `${stats?.availableFoodItems ?? 0} / ${stats?.totalFoodItems ?? 0}`,
      sub: 'Available / Total items',
      icon: UtensilsCrossed,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kitchen & Canteen Overview 📊
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time orders queue, preparation status, and inventory metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-600' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            to="/admin/menu"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-in fade-in duration-200">
          ✓ {actionSuccess}
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${card.color} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{card.value}</span>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Completed Cash Collection
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{stats?.todayRevenue ?? 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">From completed pickups today</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            ₹
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              All-Time Canteen Revenue
            </p>
            <h3 className="text-2xl font-black text-orange-600 mt-1">
              ₹{stats?.totalRevenue ?? 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Total processed orders value</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section with Quick Status Transition */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Recent Live Orders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Incoming orders needing preparation and status changes
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 sm:px-6">Order ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                      {ord.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{ord.userId?.name || 'Student'}</div>
                      <div className="text-[10px] text-slate-400">{ord.userId?.studentId || ord.userId?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={ord.orderStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      {ord.orderStatus === 'Placed' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleQuickStatusUpdate(ord._id, 'Accepted')}
                            className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold rounded-lg text-[11px] transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleQuickStatusUpdate(ord._id, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[11px] transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {ord.orderStatus === 'Accepted' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(ord._id, 'Preparing')}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-[11px] transition"
                        >
                          Start Cooking
                        </button>
                      )}
                      {ord.orderStatus === 'Preparing' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(ord._id, 'Ready for Pickup')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition"
                        >
                          Mark Ready
                        </button>
                      )}
                      {ord.orderStatus === 'Ready for Pickup' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(ord._id, 'Completed')}
                          className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[11px] transition shadow-xs"
                        >
                          Complete & Paid
                        </button>
                      )}
                      {(ord.orderStatus === 'Completed' || ord.orderStatus === 'Cancelled' || ord.orderStatus === 'Rejected') && (
                        <span className="text-[11px] text-slate-400 font-medium">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
