import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Banknote, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Utensils
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import StatusBadge from '../../components/StatusBadge';
import ConfirmationModal from '../../components/ConfirmationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await orderService.getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setErrorMessage('Could not load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      const res = await orderService.cancelOrder(order._id, cancellationReason || 'Cancelled by student');
      if (res.success) {
        setCancelModalOpen(false);
        setActionMessage('Order was successfully cancelled.');
        fetchOrder();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order.';
      setErrorMessage(msg);
      setCancelModalOpen(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving order breakdown..." />;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto my-8 border border-slate-200">
        <p className="text-sm text-slate-600">Order not found.</p>
        <Link to="/student/orders" className="mt-3 inline-block text-xs font-bold text-orange-600 underline">
          Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Order #{order.orderId}
              </h1>
              <StatusBadge status={order.orderStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ordered on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {order.orderStatus === 'Placed' && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
          >
            Cancel Order
          </button>
        )}
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold">
          {actionMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Items Table */}
        <div className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Items Ordered
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, index) => (
              <div key={index} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                  <span className="text-slate-400">
                    Unit: ₹{item.price} • Qty: {item.quantity}
                  </span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">
                  ₹{item.subtotal}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-800">₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Campus Subsidized Convenience Fee</span>
              <span className="font-semibold text-emerald-600">₹0.00</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline font-bold">
              <span className="text-slate-900 text-sm">Total Amount Payable</span>
              <span className="text-orange-600 text-xl font-black">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Counter & Student Metadata */}
        <div className="bg-slate-50/60 p-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Pickup Counter</span>
            <span className="text-slate-800 font-bold">Central Campus Canteen — Counter #2</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Payment Mode & Status</span>
            <span className="text-slate-800 font-bold">
              {order.paymentMethod} •{' '}
              <span className={order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>
                {order.paymentStatus}
              </span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Student Name & ID</span>
            <span className="text-slate-800 font-bold">
              {order.userId?.name} ({order.userId?.studentId || 'N/A'})
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Order Instructions / Notes</span>
            <span className="text-slate-800 font-medium">
              {order.notes || 'None specified'}
            </span>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Food Order?"
        message="Are you sure you want to cancel this order? It will not be prepared by the kitchen."
        confirmText="Confirm Cancellation"
        cancelText="Keep Order"
        isDanger={true}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default OrderDetailsPage;
