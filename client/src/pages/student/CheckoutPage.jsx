import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Banknote, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto my-8">
        <h3 className="text-lg font-bold text-slate-900">Your cart is empty</h3>
        <p className="text-xs text-slate-500 mt-1">Please select food items from the menu first.</p>
        <Link
          to="/menu"
          className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Go to Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          foodItemId: item._id,
          quantity: item.quantity,
        })),
        notes: notes.trim(),
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success) {
        clearCart();
        // Redirect directly to current order tracking page with fresh order ID
        navigate('/student/current-order', {
          state: { newOrderId: res.data.orderId, success: true },
        });
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please check availability and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/cart')}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Confirmation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verify your food order and pickup instructions
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Pickup & Student Details */}
        <div className="md:col-span-2 space-y-5">
          {/* Student Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Student Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Student Name</span>
                <span className="text-sm font-bold text-slate-800">{user?.name}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Student ID</span>
                <span className="text-sm font-bold text-slate-800">{user?.studentId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Email Address</span>
                <span className="text-sm font-bold text-slate-800">{user?.email}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Pre-Order Time</span>
                <span className="text-sm font-bold text-slate-800">Immediate Preparation</span>
              </div>
            </div>
          </div>

          {/* Pickup Location & Policy */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-600" />
              Pickup Counter
            </h2>
            <div className="p-3.5 bg-orange-50/60 border border-orange-100 rounded-xl">
              <p className="text-sm font-bold text-orange-950">
                Central Campus Canteen — Express Counter #2
              </p>
              <p className="text-xs text-orange-800/80 mt-1">
                Show your Order ID to the canteen staff once the order status changes to "Ready for Pickup".
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Payment Details
            </h2>
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-emerald-950 block">Cash on Pickup</span>
                <span className="text-xs text-emerald-700">Payment Status: <strong>Pending</strong> (Pay upon food collection)</span>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs">
                Zero Advance Fee
              </span>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Cooking or Packaging Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Less spicy, no ketchup, pack separately..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>
        </div>

        {/* Right Column: Order Items Summary & Action */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-600" />
            <span>Items in Order ({cartItems.length})</span>
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span className="text-slate-400 block">
                    Qty: {item.quantity} × ₹{item.price}
                  </span>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{item.quantity * item.price}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax & Surcharge</span>
              <span className="font-semibold text-emerald-600">₹0.00</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Payable Amount</span>
              <span className="font-black text-2xl text-orange-600">₹{cartTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            By placing this order, you commit to picking up and paying at the counter.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
