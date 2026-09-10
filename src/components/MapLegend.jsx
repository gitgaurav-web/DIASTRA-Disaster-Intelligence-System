export default function MapLegend() {
  const items = [
    { label: 'Low', color: '#16a34a' },
    { label: 'Moderate', color: '#ca8a04' },
    { label: 'High', color: '#ea580c' },
    { label: 'Critical', color: '#dc2626' },
  ];
  return (
    <div className="flex items-center gap-4 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
      <span className="text-xs font-semibold text-slate-600">Risk Legend:</span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
          <span className="text-xs text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
