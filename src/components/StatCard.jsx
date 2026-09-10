import { TrendingDown, AlertTriangle, Users, Gauge, Move, ShieldAlert } from 'lucide-react';

const ICONS = {
  total: Users,
  critical: ShieldAlert,
  population: AlertTriangle,
  deficit: TrendingDown,
  relocation: Move,
  capacity: Gauge,
};

export default function StatCard({ label, value, type, suffix, isDemo }) {
  const Icon = ICONS[type] || Users;
  const accentColors = {
    total: 'bg-blue-50 text-blue-600',
    critical: 'bg-red-50 text-red-600',
    population: 'bg-amber-50 text-amber-600',
    deficit: 'bg-orange-50 text-orange-600',
    relocation: 'bg-red-50 text-red-600',
    capacity: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentColors[type] || 'bg-slate-50 text-slate-600'}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix && <span className="text-sm font-normal text-slate-400 ml-1">{suffix}</span>}
      </p>
      {isDemo && (
        <p className="text-[10px] text-slate-300 mt-1">Demo / Sample Data</p>
      )}
    </div>
  );
}
