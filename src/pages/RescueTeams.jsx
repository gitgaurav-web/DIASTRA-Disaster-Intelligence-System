import { useEffect, useState, useMemo } from 'react';
import { PageHeader, Disclaimer } from '@/components/Layout';
import {
  ShieldAlert,
  Users,
  Radio,
  Navigation,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Phone,
  Crosshair,
  Truck,
  Anchor,
  Activity,
  Check,
  X,
  Clock,
  Filter,
} from 'lucide-react';

export default function RescueTeams() {
  const [units, setUnits] = useState([]);
  const [habitations, setHabitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active Role Scope Tracking
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('dss_user_role') || 'national';
  });

  useEffect(() => {
    const handleRoleUpdate = () => {
      setActiveRole(localStorage.getItem('dss_user_role') || 'national');
    };
    window.addEventListener('roleChanged', handleRoleUpdate);
    window.addEventListener('storage', handleRoleUpdate);
    return () => {
      window.removeEventListener('roleChanged', handleRoleUpdate);
      window.removeEventListener('storage', handleRoleUpdate);
    };
  }, []);

  const districtScope =
    activeRole === 'chamoli'
      ? 'Chamoli'
      : activeRole === 'darbhanga'
      ? 'Darbhanga'
      : activeRole === 'wayanad'
      ? 'Wayanad'
      : null;

  // Dispatch Modal State
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [targetHabitationId, setTargetHabitationId] = useState('');
  const [actionNote, setActionNote] = useState('Immediate life-safety evacuation & perimeter cordon');
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      let [unitRes, habRes] = await Promise.all([
        fetch('/api/relief-assets').catch(() => null),
        fetch('/api/habitations').catch(() => null),
      ]);

      if (!unitRes || !unitRes.ok) {
        unitRes = await fetch('http://127.0.0.1:8000/api/relief-assets');
      }
      if (!habRes || !habRes.ok) {
        habRes = await fetch('http://127.0.0.1:8000/api/habitations');
      }

      if (!unitRes.ok) throw new Error('Failed to load rescue assets');
      const unitData = await unitRes.json();
      const habData = habRes && habRes.ok ? await habRes.json() : [];

      setUnits(Array.isArray(unitData) ? unitData : []);
      setHabitations(Array.isArray(habData) ? habData : []);
    } catch (err) {
      console.error(err);
      setError('Unable to load rescue fleet telemetry from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter based on active DM scope
  const filteredUnits = useMemo(() => {
    if (!districtScope) return units;
    return units.filter(
      (u) => u.district?.toLowerCase() === districtScope.toLowerCase()
    );
  }, [units, districtScope]);

  const criticalHabitations = useMemo(() => {
    let list = habitations;
    if (districtScope) {
      list = list.filter(
        (h) => h.district?.toLowerCase() === districtScope.toLowerCase()
      );
    }
    return list.filter((h) => h.risk_level === 'Critical' || h.risk_score >= 70);
  }, [habitations, districtScope]);

  const handleOpenDispatch = (unit) => {
    setSelectedUnit(unit);
    setDispatchSuccess('');
    if (criticalHabitations.length > 0) {
      setTargetHabitationId(String(criticalHabitations[0].id));
    }
  };

  const handleExecuteDispatch = async (e) => {
    e.preventDefault();
    if (!selectedUnit || !targetHabitationId) return;

    const targetHab = habitations.find((h) => String(h.id) === String(targetHabitationId));
    if (!targetHab) return;

    try {
      setDispatching(true);
      let res = await fetch('/api/relief-assets/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: selectedUnit.id,
          habitation_id: targetHab.id,
          habitation_name: targetHab.name,
          target_district: targetHab.district,
          action_note: actionNote,
        }),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('http://127.0.0.1:8000/api/relief-assets/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            unit_id: selectedUnit.id,
            habitation_id: targetHab.id,
            habitation_name: targetHab.name,
            target_district: targetHab.district,
            action_note: actionNote,
          }),
        });
      }

      if (!res.ok) throw new Error('Dispatch order failed');
      const data = await res.json();
      setDispatchSuccess(data.message);

      // Refresh units
      loadData();
      setTimeout(() => {
        setSelectedUnit(null);
        setDispatchSuccess('');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Could not dispatch rescue unit. Please try again.');
    } finally {
      setDispatching(false);
    }
  };

  const handleQuickStatus = async (unitId, nextStatus) => {
    try {
      let res = await fetch(`/api/relief-assets/${unitId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch(`http://127.0.0.1:8000/api/relief-assets/${unitId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        });
      }

      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="NDRF & SDRF Rescue Asset Dispatch"
          subtitle="Real-time battalion readiness, tactical deployment & equipment tracking"
          icon={ShieldAlert}
        />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={loadData} className="font-bold underline hover:no-underline ml-4">
              Retry
            </button>
          </div>
        )}

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Total Deployment Units</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{filteredUnits.length}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Tactical taskforces tracked</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Ready on Standby</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {filteredUnits.filter((u) => u.status === 'Ready').length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Available for immediate dispatch</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Dispatched / En Route</p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {filteredUnits.filter((u) => u.status === 'Dispatched').length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Mobilized to hazard zones</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">Active On-Site</p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {filteredUnits.filter((u) => u.status === 'On-Site').length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Conducting live evacuations</p>
          </div>
        </div>

        {/* Main Units List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Active Tactical Units Inventory {districtScope ? `(${districtScope} Sector)` : '(All-India Command)'}
              </h2>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Telemetry
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading && filteredUnits.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Loading rescue units telemetry...</p>
              </div>
            ) : filteredUnits.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-400">
                <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">No rescue units found for this sector.</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Switch to All-India Command or check another sector.</p>
              </div>
            ) : (
              filteredUnits.map((unit) => {
                const isReady = unit.status === 'Ready';
                const isDispatched = unit.status === 'Dispatched';
                const isOnSite = unit.status === 'On-Site';

                return (
                  <div
                    key={unit.id}
                    className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-750 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">{unit.name}</h3>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                          {unit.unit_type}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
                            isReady
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                              : isDispatched
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 animate-pulse'
                              : isOnSite
                              ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                          }`}
                        >
                          ● {unit.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                        <span>
                          <strong className="text-slate-800 dark:text-slate-200">Sector:</strong> {unit.district}
                        </span>
                        <span>
                          <strong className="text-slate-800 dark:text-slate-200">Base:</strong> {unit.base_location}
                        </span>
                        <span>
                          <strong className="text-slate-800 dark:text-slate-200">Commander:</strong> {unit.commander}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                          <Phone className="w-3 h-3" /> {unit.contact}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <p className="text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 border border-slate-200/60 dark:border-slate-600/60 px-2.5 py-1 rounded inline-block">
                          <strong className="text-slate-900 dark:text-white">Gear / Assets:</strong> {unit.equipment_details}
                        </p>

                        {unit.current_assignment && (
                          <div className="text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-md">
                            ⚠️ {unit.current_assignment}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                      {isReady ? (
                        <button
                          onClick={() => handleOpenDispatch(unit)}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Dispatch to Habitation
                        </button>
                      ) : isDispatched ? (
                        <button
                          onClick={() => handleQuickStatus(unit.id, 'On-Site')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Confirm On-Site
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickStatus(unit.id, 'Ready')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Recall to Ready Standby
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dispatch Modal */}
        {selectedUnit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-850 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Dispatch Directive: {selectedUnit.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleExecuteDispatch} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1.5">
                    Select Target High-Risk Habitation
                  </label>
                  <select
                    value={targetHabitationId}
                    onChange={(e) => setTargetHabitationId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {habitations.map((h) => (
                      <option key={h.id} value={h.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                        {h.name} ({h.district}) — {h.hazard || 'Hazard'} [Pop: {h.population}, Risk: {h.risk_level || 'High'}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1.5">
                    Operational Directive & Action Note
                  </label>
                  <textarea
                    rows={3}
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Specify boat deployment, triage camp or road clearing..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {dispatchSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {dispatchSuccess}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUnit(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={dispatching || !targetHabitationId}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    {dispatching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Confirm Dispatch Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
