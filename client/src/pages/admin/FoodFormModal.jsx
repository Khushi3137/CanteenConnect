import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const categories = ['Snacks', 'Meals', 'Beverages', 'Desserts', 'Breakfast'];

const FoodFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Snacks',
    image: '',
    available: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price !== undefined ? initialData.price : '',
        category: initialData.category || 'Snacks',
        image: initialData.image || '',
        available: initialData.available !== undefined ? initialData.available : true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Snacks',
        image: '',
        available: true,
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.description.trim() || formData.price === '') {
      setError('Please provide name, description, and price.');
      return;
    }

    if (Number(formData.price) < 0) {
      setError('Price cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-slate-900">
          {initialData ? 'Edit Food Item' : 'Add New Food Item'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {initialData ? 'Update details of this menu dish' : 'Create a fresh item for the campus canteen menu'}
        </p>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Food Item Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Masala Dosa"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe ingredients, portion, spices, flavor..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="availableCheck"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="availableCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
              Mark as Available for Ordering Immediately
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Food Item' : 'Add Food Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodFormModal;
