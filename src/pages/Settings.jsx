import { PageHeader } from '@/components/Layout';
import { Settings as SettingsIcon, Sliders } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Settings" subtitle="Prototype configuration" icon={SettingsIcon} />

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-400" /> Risk Calculation Weights
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Hazard Exposure', value: '0.35' },
              { label: 'Vulnerability', value: '0.30' },
              { label: 'Population Exposure', value: '0.20' },
              { label: 'Accessibility', value: '0.15' },
            ].map((w) => (
              <div key={w.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <span className="text-sm text-slate-600">{w.label}</span>
                <span className="text-sm font-medium text-slate-800">{w.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Weights are configurable for future calibration. Current values are prototype defaults.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Data Source</h3>
          <div className="p-3 bg-slate-50 rounded-md">
            <p className="text-sm text-slate-600">Current: <span className="font-medium text-slate-800">Demo Data (Local)</span></p>
            <p className="text-xs text-slate-400 mt-1">Backend API connection is planned but not yet active.</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Display</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
              <span className="text-sm text-slate-600">Show demo banner</span>
              <span className="text-xs font-medium text-green-700">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
              <span className="text-sm text-slate-600">Default map view</span>
              <span className="text-xs font-medium text-slate-800">OpenStreetMap</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
              <span className="text-sm text-slate-600">Table page size</span>
              <span className="text-xs font-medium text-slate-800">10 rows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
