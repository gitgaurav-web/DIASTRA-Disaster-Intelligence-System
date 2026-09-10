export function RiskBadge({ level }) {
  const colors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };
  const cls = colors[level] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${cls}`}>
      {level}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const colors = {
    Immediate: 'bg-red-600 text-white',
    'Short-Term': 'bg-orange-500 text-white',
    'Medium-Term': 'bg-yellow-500 text-white',
    Monitor: 'bg-green-500 text-white',
  };
  const cls = colors[priority] || 'bg-slate-200 text-slate-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wide ${cls}`}>
      {priority}
    </span>
  );
}

export function CapacityBadge({ status }) {
  const colors = {
    'Critical Deficit': 'bg-red-100 text-red-700 border-red-200',
    Deficit: 'bg-orange-100 text-orange-700 border-orange-200',
    Warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Adequate: 'bg-green-100 text-green-700 border-green-200',
  };
  const cls = colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${cls}`}>
      {status}
    </span>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    'At Risk': 'bg-red-100 text-red-700 border-red-200',
    Monitored: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Stable: 'bg-green-100 text-green-700 border-green-200',
    Ready: 'bg-green-100 text-green-700 border-green-200',
    Available: 'bg-blue-100 text-blue-700 border-blue-200',
    Limited: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  const cls = colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${cls}`}>
      {status}
    </span>
  );
}
