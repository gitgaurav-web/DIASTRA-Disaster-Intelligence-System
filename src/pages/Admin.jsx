import { PageHeader, Disclaimer } from '@/components/Layout';
import { LayoutDashboard, Database, Server, GitBranch, Activity, ShieldCheck } from 'lucide-react';

const SYSTEM_STATUS = [
  { name: 'GIS Service', status: 'Operational', real: false },
  { name: 'Database', status: 'Operational', real: false },
  { name: 'Risk Engine', status: 'Operational', real: false },
  { name: 'Data Validation', status: 'Demo', real: false },
];

const DATASETS = [
  { name: 'Habitation Data', status: 'Loaded', records: 30, lastUpdated: 'Prototype' },
  { name: 'Relocation Sites', status: 'Loaded', records: 8, lastUpdated: 'Prototype' },
  { name: 'Hazard Layers', status: 'Mock', records: 3, lastUpdated: 'Prototype' },
  { name: 'District Boundaries', status: 'Mock', records: 10, lastUpdated: 'Prototype' },
];

export default function Admin() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Admin Dashboard" subtitle="System status & data sources — Prototype" icon={LayoutDashboard} />

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-xs text-amber-800">
          This admin dashboard shows simulated status for demonstration. In production, these services would
          reflect actual infrastructure health. The statuses below do not represent real production systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* System Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" /> System Status
          </h3>
          <div className="space-y-3">
            {SYSTEM_STATUS.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.status === 'Operational' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span className={`text-xs font-medium ${s.status === 'Operational' ? 'text-green-700' : 'text-amber-700'}`}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" /> Dataset Status
          </h3>
          <div className="space-y-3">
            {DATASETS.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div>
                  <p className="text-sm text-slate-700">{d.name}</p>
                  <p className="text-xs text-slate-400">{d.records} records · Updated: {d.lastUpdated}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  d.status === 'Loaded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-slate-400" /> Architecture
          </h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-2.5 bg-blue-50 rounded-md font-medium text-blue-800">React Frontend</div>
            <div className="text-center text-slate-300">↓</div>
            <div className="p-2.5 bg-slate-50 rounded-md">Python FastAPI Backend (Planned)</div>
            <div className="text-center text-slate-300">↓</div>
            <div className="p-2.5 bg-slate-50 rounded-md">PostgreSQL + PostGIS (Planned)</div>
            <div className="text-center text-slate-300">↓</div>
            <div className="p-2.5 bg-slate-50 rounded-md">GIS / ML Processing (Planned)</div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400" /> Security & Access
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-slate-50 rounded-md">
              <span className="text-sm text-slate-600">Authentication</span>
              <span className="text-xs font-medium text-amber-700">Demo Mode</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-md">
              <span className="text-sm text-slate-600">Data Access</span>
              <span className="text-xs font-medium text-slate-600">Public Demo</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-md">
              <span className="text-sm text-slate-600">API Status</span>
              <span className="text-xs font-medium text-amber-700">Not Connected</span>
            </div>
          </div>
        </div>
      </div>

      <Disclaimer text="All system statuses shown are simulated for prototype demonstration. No real backend services are running. Data is loaded from local demo datasets." />
    </div>
  );
}
