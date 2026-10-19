import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { foodService } from '../../services/foodService';
import { orderService } from '../../services/orderService';
import FoodCard from '../../components/FoodCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [allOrdersCount, setAllOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [foodsRes, ordersRes] = await Promise.all([
          foodService.getFoodItems({ available: 'true' }),
          orderService.getMyOrders(),
        ]);

        if (foodsRes.success) {
          // Take first 4 as featured
          setFeaturedFoods(foodsRes.data.slice(0, 4));
        }

        if (ordersRes.success) {
          const ongoing = ordersRes.data.filter((ord) =>
            ['Placed', 'Accepted', 'Preparing', 'Ready for Pickup'].includes(ord.orderStatus)
          );
          setActiveOrders(ongoing);
          setAllOrdersCount(ordersRes.data.length);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Preparing your dashboard..." />;
  }

  const latestActiveOrder = activeOrders.length > 0 ? activeOrders[0] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-orange-600 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-600/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Fast College Pre-Order System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-orange-100 max-w-xl leading-relaxed">
            Order your meals ahead, skip the long lunch hour queues at the counter, and collect your food fresh and hot.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-orange-700 font-bold text-sm hover:bg-orange-50 transition shadow-sm active:scale-95"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Explore Menu & Order
            </Link>

            {latestActiveOrder && (
              <Link
                to="/student/current-order"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-700/80 hover:bg-orange-700 text-white font-bold text-sm border border-orange-400/40 transition active:scale-95"
              >
                <Clock className="w-4 h-4" />
                Track Active Order ({latestActiveOrder.orderId})
              </Link>
            )}
          </div>
        </div>

        {/* Decorative Circle Background */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Active Order Highlight Card (if any) */}
      {latestActiveOrder && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Live Active Order
                  </span>
                  <StatusBadge status={latestActiveOrder.orderStatus} size="sm" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                  Order #{latestActiveOrder.orderId}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {latestActiveOrder.items.length} items • Total: ₹{latestActiveOrder.totalAmount} • Cash on Pickup
                </p>
              </div>
            </div>

            <Link
              to="/student/current-order"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs rounded-xl transition"
            >
              <span>View Live Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Orders
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {activeOrders.length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting pickup</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Lifetime Orders
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {allOrdersCount}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Since registration</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student ID
            </p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1 truncate">
              {user?.studentId || 'N/A'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{user?.email}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Featured / Popular Food Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Popular Canteen Picks
            </h2>
            <p className="text-xs text-slate-500">
              Quickly add student favorites to your order
            </p>
          </div>
          <Link
            to="/menu"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredFoods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
