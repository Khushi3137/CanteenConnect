import React from 'react';
import { User, Mail, ShieldAlert, LogOut, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Profile 🛡️
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Canteen Staff & Administrator credentials and permissions
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 bg-linear-to-r from-slate-900 to-slate-800 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-2xl text-white shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || 'Administrator'}</h2>
            <p className="text-xs text-orange-400 flex items-center gap-1.5 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Full Canteen Staff Operations Access</span>
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4 divide-y divide-slate-100">
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-600" />
              Admin Email
            </span>
            <span className="font-bold text-slate-900">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-3">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              Role & Permissions
            </span>
            <span className="font-bold text-orange-600 uppercase tracking-wide">
              {user?.role} (Menu Management & Order Transition)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-3">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Counter Assigned
            </span>
            <span className="font-bold text-slate-900">
              Campus Canteen — Express Counter #2
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Admin Console</span>
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
