import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Eye, 
  Check, 
  X, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  CheckCircle2, 
  Ban,
  RefreshCw,
  User,
  MapPin,
  Banknote
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const allStatuses = [
  'All',
  'Placed',
  'Accepted',
  'Preparing',
  'Ready for Pickup',
  'Completed',
  'Cancelled',
  'Rejected',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // For detail modal
  const [statusMessage, setStatusMessage] = useState('');

  const fetchOrders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await adminService.getAllOrders(params);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, searchTerm]);

  const handleUpdateStatus = async (orderId, newStatus, notes = '') => {
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus, notes);
      if (res.success) {
        setStatusMessage(`Order updated to "${newStatus}"`);
        setTimeout(() => setStatusMessage(''), 3000);
        // If modal is open with this order, update it too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data);
        }
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading canteen orders ledger..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Management 📋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Filter, search, review details, and transition order workflow statuses
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-600' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Orders'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-in fade-in duration-200">
          ✓ {statusMessage}
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. ORD-2026...), Student Name, or Student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {allStatuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
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

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Update Status Workflow</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      <div>{order.orderId}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">
                        {order.userId?.name || 'Unknown Student'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {order.userId?.studentId ? `ID: ${order.userId.studentId}` : order.userId?.email}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-700 max-w-xs truncate">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-black text-slate-900">₹{order.totalAmount}</div>
                      <div className={`text-[10px] font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {order.paymentStatus}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={order.orderStatus} size="sm" />
                    </td>

                    {/* Step Transitions */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {order.orderStatus === 'Placed' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Rejected', 'Rejected by canteen')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {order.orderStatus === 'Accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Start Preparing
                        </button>
                      )}

                      {order.orderStatus === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Ready for Pickup')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Ready for Pickup
                        </button>
                      )}

                      {order.orderStatus === 'Ready for Pickup' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Completed')}
                          className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Mark Completed (Paid)
                        </button>
                      )}

                      {(order.orderStatus === 'Completed' ||
                        order.orderStatus === 'Cancelled' ||
                        order.orderStatus === 'Rejected') && (
                        <span className="text-[11px] text-slate-400 font-medium italic">
                          No further action
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-slate-900">
                Order #{selectedOrder.orderId}
              </h3>
              <StatusBadge status={selectedOrder.orderStatus} size="sm" />
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            <div className="mt-5 space-y-4">
              {/* Student details */}
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1 text-xs">
                <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px] block">
                  Customer
                </span>
                <p className="font-bold text-slate-900">
                  {selectedOrder.userId?.name} ({selectedOrder.userId?.studentId || 'No ID'})
                </p>
                <p className="text-slate-500">{selectedOrder.userId?.email}</p>
                {selectedOrder.notes && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 text-[11px] font-medium">
                    Note: {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* Items breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Items Breakdown
                </h4>
                <div className="divide-y divide-slate-100 border-y border-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 block">
                          ₹{item.price} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-black text-slate-900">
                        ₹{item.subtotal}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex justify-between items-baseline font-bold text-xs">
                  <span className="text-slate-600">Total Order Amount</span>
                  <span className="text-orange-600 text-lg font-black">
                    ₹{selectedOrder.totalAmount}
                  </span>
                </div>
              </div>

              {/* Status Update Dropdown from Modal */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Change Order Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Accepted', 'Preparing', 'Ready for Pickup', 'Completed', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                      disabled={selectedOrder.orderStatus === status}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                        selectedOrder.orderStatus === status
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
