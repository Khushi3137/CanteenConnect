import React from 'react';
import { UtensilsCrossed, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900">
                Campus Canteen System
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              A streamlined pre-order management solution built for college canteens. Reduces lunchtime queue congestion and enhances student ordering convenience.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Software Engineering Academic Capstone Project</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Canteen Hours
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><strong className="text-slate-700">Mon - Fri:</strong> 8:00 AM - 6:00 PM</li>
              <li><strong className="text-slate-700">Saturday:</strong> 8:30 AM - 3:00 PM</li>
              <li><strong className="text-slate-700">Sunday:</strong> Closed</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Payment Policy
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Orders operate on a <strong>Cash on Pickup</strong> model. Pay at the canteen counter when collecting your meal.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 Campus Canteen Pre-Order Management System. Built with MERN Stack.</p>
          <p className="flex items-center gap-1">
            Engineered for College Project Evaluation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
