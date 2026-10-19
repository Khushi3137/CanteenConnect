import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UtensilsCrossed, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { foodService } from '../../services/foodService';
import FoodFormModal from './FoodFormModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const categories = ['All', 'Snacks', 'Meals', 'Beverages', 'Desserts', 'Breakfast'];

const ManageMenu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

  const [notification, setNotification] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchFoods = async () => {
    try {
      const res = await foodService.getFoodItems();
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
    fetchFoods();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    if (editingFood) {
      // Update
      const res = await foodService.updateFoodItem(editingFood._id, formData);
      if (res.success) {
        setNotification(`"${res.data.name}" updated successfully.`);
        setTimeout(() => setNotification(''), 3000);
        fetchFoods();
      }
    } else {
      // Create
      const res = await foodService.createFoodItem(formData);
      if (res.success) {
        setNotification(`"${res.data.name}" added to menu.`);
        setTimeout(() => setNotification(''), 3000);
        fetchFoods();
      }
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      const res = await foodService.updateFoodItem(food._id, {
        available: !food.available,
      });
      if (res.success) {
        setNotification(`"${food.name}" is now ${!food.available ? 'Available' : 'Sold Out'}.`);
        setTimeout(() => setNotification(''), 3000);
        fetchFoods();
      }
    } catch (err) {
      setErrorMessage('Could not update availability.');
    }
  };

  const handleDeleteClick = (food) => {
    setFoodToDelete(food);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!foodToDelete) return;
    try {
      const res = await foodService.deleteFoodItem(foodToDelete._id);
      if (res.success) {
        setNotification(`"${foodToDelete.name}" deleted from menu.`);
        setTimeout(() => setNotification(''), 3000);
        setIsDeleteModalOpen(false);
        setFoodToDelete(null);
        fetchFoods();
      }
    } catch (err) {
      setErrorMessage('Failed to delete item.');
      setIsDeleteModalOpen(false);
    }
  };

  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner message="Loading canteen menu management..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Menu Management 🍽️
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, toggle availability, and set pricing for canteen dishes
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFood(null);
            setIsFormModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-in fade-in duration-200">
          ✓ {notification}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold animate-in fade-in duration-200">
          ✕ {errorMessage}
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredFoods.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No food items found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Dish Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                          {food.image ? (
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-orange-400">
                              <UtensilsCrossed className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {food.name}
                          </h4>
                          <p className="text-slate-400 text-[11px] max-w-sm truncate mt-0.5">
                            {food.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]">
                        {food.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm whitespace-nowrap">
                      ₹{food.price}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          food.available
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle availability"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            food.available ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{food.available ? 'Available' : 'Sold Out'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingFood(food);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                          title="Edit Food Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(food)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Food Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <FoodFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingFood(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingFood}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Food Item?"
        message={`Are you sure you want to permanently delete "${foodToDelete?.name}" from the menu?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setFoodToDelete(null);
        }}
      />
    </div>
  );
};

export default ManageMenu;
