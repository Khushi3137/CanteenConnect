import React from 'react';
import { Plus, Minus, ShoppingBag, Utensils, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food, onSelect }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartItem = cartItems.find((item) => item._id === food._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (food.available) {
      addToCart(food, 1);
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    updateQuantity(food._id, quantityInCart + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    updateQuantity(food._id, quantityInCart - 1);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(food)}
      className={`group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer ${
        !food.available ? 'opacity-75' : ''
      }`}
    >
      {/* Food Image */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-400">
            <Utensils className="w-12 h-12 stroke-[1.5]" />
          </div>
        )}

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-200/50">
          {food.category}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
            food.available
              ? 'bg-emerald-500 text-white'
              : 'bg-rose-500 text-white'
          }`}
        >
          {food.available ? 'Available' : 'Sold Out'}
        </span>
      </div>

      {/* Food Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-orange-600 transition">
            {food.name}
          </h3>
          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Price
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{food.price}
            </span>
          </div>

          {/* Add to Cart / Quantity Stepper */}
          {food.available ? (
            quantityInCart > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-orange-50 border border-orange-200 rounded-xl overflow-hidden p-0.5"
              >
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-lg transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-bold text-sm text-orange-950">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            )
          ) : (
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
              Currently Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
