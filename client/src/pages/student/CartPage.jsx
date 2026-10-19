import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  UtensilsCrossed, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any canteen items yet. Browse our menu to pick your favorite snack or meal!
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition active:scale-95"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Browse Canteen Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Review Your Cart 🛒
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for canteen pre-order
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-400">
                      <UtensilsCrossed className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Unit price: ₹{item.price}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity stepper */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-xs transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center font-bold text-sm text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="font-extrabold text-base text-slate-900 block">
                    ₹{item.price * item.quantity}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/menu"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add more food items</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Items Total ({cartCount})</span>
              <span className="font-semibold text-slate-800">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Packaging / Service Fee</span>
              <span className="font-semibold text-emerald-600">FREE (Campus Subsidized)</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Taxes (GST)</span>
              <span className="font-semibold text-emerald-600">₹0.00</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-base">To Pay on Pickup</span>
              <span className="font-black text-2xl text-orange-600">₹{cartTotal}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Payment is <strong>Cash on Pickup</strong> at the main canteen counter when your order is ready.
            </p>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
