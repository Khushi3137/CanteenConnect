import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  PackageCheck, 
  XCircle, 
  Ban, 
  ThumbsUp 
} from 'lucide-react';

const statusConfig = {
  Placed: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
    label: 'Placed',
  },
  Accepted: {
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: ThumbsUp,
    label: 'Accepted',
  },
  Preparing: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: ChefHat,
    label: 'Preparing',
  },
  'Ready for Pickup': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: PackageCheck,
    label: 'Ready for Pickup',
  },
  Completed: {
    bg: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
    label: 'Completed',
  },
  Cancelled: {
    bg: 'bg-slate-100 text-slate-600 border-slate-300',
    icon: XCircle,
    label: 'Cancelled',
  },
  Rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Ban,
    label: 'Rejected',
  },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Clock,
    label: status || 'Unknown',
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
