import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Utensils, 
  X, 
  ShoppingBag, 
  Plus, 
  Minus,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { foodService } from '../../services/foodService';
import { useCart } from '../../context/CartContext';
import FoodCard from '../../components/FoodCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const categories = ['All', 'Snacks', 'Meals', 'Beverages', 'Desserts', 'Breakfast'];

const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // 'All' | 'true' | 'false'
  const [selectedFood, setSelectedFood] = useState(null); // For detail modal
  const [modalQty, setModalQty] = useState(1);

  const { addToCart, cartItems } = useCart();

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (availabilityFilter !== 'All') params.available = availabilityFilter;

      const res = await foodService.getFoodItems(params);
      if (res.success) {
        setFoods(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch food items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search/filter
    const timeout = setTimeout(() => {
      fetchFoods();
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory, availabilityFilter]);

  const handleOpenModal = (food) => {
    setSelectedFood(food);
    const existing = cartItems.find((item) => item._id === food._id);
    setModalQty(existing ? existing.quantity : 1);
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
    setModalQty(1);
  };

  const handleModalAddToCart = () => {
    if (selectedFood && selectedFood.available) {
      addToCart(selectedFood, modalQty);
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Canteen Food Menu 🍽️
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse today's freshly prepared food items and order ahead for counter pickup
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes (e.g. Samosa, Burger, Coffee)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setAvailabilityFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                availabilityFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setAvailabilityFilter('true')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                availabilityFilter === 'true'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Now
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Foods Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching canteen delicacies..." />
      ) : foods.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Food Items Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any dishes matching your current search or filter criteria. Try adjusting your filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setAvailabilityFilter('All');
            }}
            className="mt-4 px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onSelect={handleOpenModal}
            />
          ))}
        </div>
      )}

      {/* Food Details Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Image */}
            <div className="relative h-60 w-full bg-slate-100">
              {selectedFood.image ? (
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-400">
                  <Utensils className="w-16 h-16" />
                </div>
              )}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                {selectedFood.category}
              </span>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {selectedFood.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        selectedFood.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedFood.available ? 'Ready to Order' : 'Currently Sold Out'}
                    </span>
                    <span className="text-xs text-slate-400">• Cash on Pickup</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Price
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{selectedFood.price}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedFood.description}
                </p>
              </div>

              {selectedFood.available ? (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <button
                      onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-xs transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 text-sm">
                      {modalQty}
                    </span>
                    <button
                      onClick={() => setModalQty(modalQty + 1)}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-xs transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ₹{selectedFood.price * modalQty}</span>
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-700 font-semibold">
                  This food item is currently sold out and cannot be added to the cart.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
