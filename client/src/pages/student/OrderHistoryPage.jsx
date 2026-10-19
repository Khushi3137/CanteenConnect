import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Eye, 
  ArrowRight, 
  Clock, 
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your order history..." />;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Order History 📜
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review all your past and ongoing canteen meal orders
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Placed', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto shadow-xs">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Orders Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            No order records match the selected filter or search term.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      {order.orderId}
                    </td>
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}{' '}
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 max-w-xs truncate">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900 whitespace-nowrap">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={order.orderStatus} size="sm" />
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <Link
                        to={`/student/orders/${order._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
