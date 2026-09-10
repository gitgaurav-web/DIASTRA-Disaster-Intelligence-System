import { useState } from 'react';
import {
  Sliders,
  CloudRain,
  Activity,
  AlertOctagon,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Bus,
  Users,
} from 'lucide-react';

export default function ScenarioSandbox({ onSimulationResult, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulation controls
  const [rainfallSurge, setRainfallSurge] = useState(0);
  const [riverMultiplier, setRiverMultiplier] = useState(1.0);
  const [seismicScale, setSeismicScale] = useState(0.0);
  const [accessOverride, setAccessOverride] = useState('');

  const [simulationResult, setSimulationResult] = useState(null);

  const runSimulation = async () => {
    try {
      setLoading(true);
      setError('');

      let response = await fetch('/api/simulation/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rainfall_surge_mm: parseFloat(rainfallSurge),
          river_discharge_multiplier: parseFloat(riverMultiplier),
          seismic_shake_scale: parseFloat(seismicScale),
          accessibility_override: accessOverride || null,
        }),
      }).catch(() => null);

      if (!response || !response.ok) {
        response = await fetch('http://127.0.0.1:8000/api/simulation/what-if', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rainfall_surge_mm: parseFloat(rainfallSurge),
            river_discharge_multiplier: parseFloat(riverMultiplier),
            seismic_shake_scale: parseFloat(seismicScale),
            accessibility_override: accessOverride || null,
          }),
        });
      }

      if (!response.ok) throw new Error('Simulation failed to execute');
      const data = await response.json();
      setSimulationResult(data);
      if (onSimulationResult) {
        onSimulationResult(data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not run simulation sandbox. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setRainfallSurge(0);
    setRiverMultiplier(1.0);
    setSeismicScale(0.0);
    setAccessOverride('');
    setSimulationResult(null);
    setError('');
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden mb-6 transition-all">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Multi-Hazard "What-If" Scenario Simulator
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full uppercase tracking-wider">
                Interactive DSS Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate cloudbursts, dam releases & road blockages to test evacuation resilience in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {simulationResult && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              Scenario Active (+{simulationResult.impact_summary.escalations_count} escalated)
            </span>
          )}
          <button className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Sandbox Controls */}
      {isOpen && (
        <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Control 1: Rainfall Surge */}
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  Rainfall Surge
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                  +{rainfallSurge} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="10"
                value={rainfallSurge}
                onChange={(e) => setRainfallSurge(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Normal (0mm)</span>
                <span>Flash Flood (100mm)</span>
                <span>Cloudburst (180mm)</span>
              </div>
            </div>

            {/* Control 2: River Discharge */}
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-500" />
                  River Discharge Multiplier
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded">
                  {riverMultiplier.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.2"
                value={riverMultiplier}
                onChange={(e) => setRiverMultiplier(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Baseline (1.0x)</span>
                <span>Warning (1.8x)</span>
                <span>Dam Release (3.0x)</span>
              </div>
            </div>

            {/* Control 3: Seismic Intensity Scale */}
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-orange-500" />
                  Seismic Intensity Scale
                </span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/40 px-2 py-0.5 rounded">
                  +{seismicScale.toFixed(1)} Mag
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.5"
                value={seismicScale}
                onChange={(e) => setSeismicScale(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Stable (+0.0)</span>
                <span>Tremor (+1.0)</span>
                <span>Major Quake (+2.5)</span>
              </div>
            </div>

            {/* Control 4: Road Accessibility Override */}
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Road Network Condition
              </span>
              <select
                value={accessOverride}
                onChange={(e) => setAccessOverride(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Maintain Baseline Status</option>
                <option value="Moderate">Moderate (Debris / Slow traffic)</option>
                <option value="Poor">Poor (Waterlogged / High Clearance Only)</option>
                <option value="Blocked">Blocked (Landslide / Bridge Cut-off)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-2">
                Forces accessibility constraint in priority calculation.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={runSimulation}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Evaluating Scenario...' : 'Execute What-If Simulation'}
              </button>

              <button
                onClick={resetSimulation}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 border border-slate-200 dark:border-slate-600 rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Baseline
              </button>
            </div>

            {error && <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</span>}
          </div>

          {/* Simulation Output Cards */}
          {simulationResult && (
            <div className="mt-4 p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Scenario Escalation Impact
                </span>
                <span className="text-xs text-indigo-700 dark:text-indigo-300">
                  {simulationResult.impact_summary.total_habitations} Habitations Re-screened
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Escalated Risk</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {simulationResult.impact_summary.escalations_count}
                  </p>
                  <p className="text-[10px] text-slate-400">habitations shifted up</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">New Critical</p>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    +{simulationResult.impact_summary.newly_critical_count}
                  </p>
                  <p className="text-[10px] text-slate-400">entered red-zone</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">People at Risk</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                    <Users className="w-4 h-4 text-indigo-500" />
                    {simulationResult.impact_summary.total_vulnerable_population.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400">urgent evacuation needed</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Buses Required</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1">
                    <Bus className="w-4 h-4" />
                    {simulationResult.impact_summary.buses_needed_estimate}
                  </p>
                  <p className="text-[10px] text-slate-400">@ 50 passengers/bus</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
