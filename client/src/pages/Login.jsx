import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, ArrowRight, AlertCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } else {
      setLocalError(result.message);
    }
  };

  // Quick Viva Demo credentials autofill
  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('Admin@123');
    } else {
      setEmail('student@example.com');
      setPassword('Student@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Canteen Portal
        </h2>
        <p className="mt-1.5 text-center text-sm text-slate-500">
          Sign in to your pre-order account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-100 sm:px-10">
          {/* Quick Demo Autofill Notice for Viva Evaluation */}
          <div className="mb-6 p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Quick Viva Demo Accounts
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition"
              >
                Auto-fill Student
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition"
              >
                Auto-fill Admin
              </button>
            </div>
          </div>

          {localError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md shadow-orange-600/20 transition disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have a student account?{' '}
            <Link
              to="/register"
              className="font-bold text-orange-600 hover:text-orange-700 underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
