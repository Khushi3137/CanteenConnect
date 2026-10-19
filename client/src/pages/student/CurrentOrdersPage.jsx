import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChefHat, 
  PackageCheck, 
  ShoppingBag, 
  MapPin, 
  Ban,
  ArrowRight,
  Info
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import StatusBadge from '../../components/StatusBadge';
import ConfirmationModal from '../../components/ConfirmationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const steps = ['Placed', 'Accepted', 'Preparing', 'Ready for Pickup', 'Completed'];

const CurrentOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();

  const fetchOrders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await orderService.getMyOrders();
      if (res.success) {
        // Active orders: Placed, Accepted, Preparing, Ready for Pickup
        const active = res.data.filter((o) =>
          ['Placed', 'Accepted', 'Preparing', 'Ready for Pickup'].includes(o.orderStatus)
        );
        // If no active orders, also check if there was a very recent completed/cancelled one
        if (active.length === 0 && res.data.length > 0) {
          // Show most recent order so student can see it completed or cancelled
          setOrders([res.data[0]]);
        } else {
          setOrders(active);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-poll status every 10 seconds to give real-time experience!
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      const res = await orderService.cancelOrder(orderToCancel._id, 'Student cancelled from portal');
      if (res.success) {
        setActionMessage(`Order #${orderToCancel.orderId} cancelled successfully.`);
        setCancelModalOpen(false);
        setOrderToCancel(null);
        fetchOrders();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order.';
      setErrorMessage(msg);
      setCancelModalOpen(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Checking active orders..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Order Status ⏱️
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your meal preparation progress in real-time
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-600' : ''}`} />
          <span>{refreshing ? 'Updating Status...' : 'Refresh Status'}</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-semibold">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-emerald-600 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs font-semibold">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-rose-600 hover:text-rose-900">
            Dismiss
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Active Orders</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You don't have any ongoing canteen orders right now. Ready to eat? Place an order from the menu!
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              to="/menu"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Order Food Now
            </Link>
            <Link
              to="/student/orders"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              View Past Orders
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = steps.indexOf(order.orderStatus);
            const isTerminal = order.orderStatus === 'Cancelled' || order.orderStatus === 'Rejected';
            const isCompleted = order.orderStatus === 'Completed';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        Order #{order.orderId}
                      </span>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.orderStatus === 'Placed' ? (
                      <button
                        onClick={() => handleCancelClick(order)}
                        className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
                      >
                        Cancel Order
                      </button>
                    ) : !isTerminal && !isCompleted ? (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                        Order in preparation (Cannot cancel)
                      </span>
                    ) : null}

                    <Link
                      to={`/student/orders/${order._id}`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                    >
                      Full Details
                    </Link>
                  </div>
                </div>

                {/* Progress Stepper Timeline */}
                {!isTerminal ? (
                  <div className="p-6 border-b border-slate-100 bg-linear-to-b from-white to-slate-50/30">
                    <div className="max-w-3xl mx-auto py-2">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting track */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-600 transition-all duration-500 z-0"
                          style={{
                            width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%`,
                          }}
                        />

                        {steps.map((step, idx) => {
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div
                              key={step}
                              className="relative z-10 flex flex-col items-center group"
                            >
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                                  isCurrent
                                    ? 'bg-orange-600 text-white ring-4 ring-orange-100 animate-pulse'
                                    : isDone
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white text-slate-400 border-2 border-slate-300'
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span
                                className={`mt-2 text-[11px] font-bold text-center whitespace-nowrap ${
                                  isCurrent
                                    ? 'text-orange-600 font-extrabold'
                                    : isDone
                                    ? 'text-slate-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {order.orderStatus === 'Ready for Pickup' && (
                      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 animate-bounce">
                        <PackageCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-extrabold text-sm">Your Food is Ready for Pickup!</p>
                          <p className="text-xs text-emerald-700 mt-0.5">
                            Please proceed to Express Counter #2 with ₹{order.totalAmount} in cash.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 border-b border-slate-100 bg-rose-50/50">
                    <div className="flex items-center gap-3 text-rose-700">
                      <Ban className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">
                          Order {order.orderStatus}: {order.notes || 'No additional details provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items & Payment Info */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Ordered Food Items
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-0">
                          <span className="font-semibold text-slate-800">
                            {item.quantity} × {item.name}
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{item.subtotal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50/80 p-4 rounded-2xl space-y-2 text-xs">
                    <h3 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Counter Details
                    </h3>
                    <div className="flex justify-between text-slate-600">
                      <span>Pickup Counter:</span>
                      <strong className="text-slate-800">Canteen Counter #2</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Payment Method:</span>
                      <strong className="text-slate-800">{order.paymentMethod}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Payment Status:</span>
                      <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                      <span className="text-slate-900 text-sm">Total Payable:</span>
                      <span className="text-orange-600 text-lg font-black">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Order Cancellation */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel This Order?"
        message={`Are you sure you want to cancel order #${orderToCancel?.orderId}? This cannot be undone.`}
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        isDanger={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default CurrentOrdersPage;
