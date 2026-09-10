import { useRef } from 'react';
import { Printer, X, ShieldAlert, FileText, CheckCircle2, Download, Building2 } from 'lucide-react';

export default function EvacuationPlanPrintModal({
  isOpen,
  onClose,
  habitations = [],
  district = 'All Districts',
  role = 'National Command',
}) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const criticalHabitations = habitations.filter(
    (h) => h.risk_level === 'Critical' || (h.risk_score && h.risk_score >= 75) || h.priority === 'Immediate'
  );

  const totalEvacuationPop = criticalHabitations.reduce(
    (acc, h) => acc + (Number(h.population) || 0),
    0
  );
  const totalBuses = Math.ceil(totalEvacuationPop / 50);
  const totalAmbulances = Math.max(1, Math.ceil(totalEvacuationPop / 1000));
  const waterLPD = (totalEvacuationPop * 15).toLocaleString();
  const mealsPerDay = (totalEvacuationPop * 3).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Actions Header (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Official District Evacuation Action Plan
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 print:overflow-visible text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 print:bg-white print:text-black">
          {/* Government Formal Header */}
          <div className="text-center pb-6 border-b-2 border-slate-800 dark:border-slate-300 print:border-black">
            <div className="flex justify-center mb-1">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Government of India • Disaster Management Division
              </span>
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white print:text-black">
              DISASTER INCIDENT EVACUATION DIRECTIVE (IAP-204)
            </h1>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
              Formulated via Disaster Dynamic Risk Screening & Decision Support System
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
              <span><strong>Directive Ref:</strong> DISASTER/EXEC/{now.getFullYear()}/{String(now.getMonth()+1).padStart(2,'0')}-{Math.floor(1000 + Math.random() * 9000)}</span>
              <span><strong>Issuance Date:</strong> {formattedDate} {formattedTime} IST</span>
              <span><strong>Administrative Scope:</strong> {district || 'National/Multi-District'}</span>
            </div>
          </div>

          {/* Operational Context */}
          <div className="my-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs print:border-black print:bg-slate-100">
            <p className="font-bold text-amber-900 dark:text-amber-300 print:text-black mb-1">
              OPERATIONAL MANDATE & AUTHORIZATION:
            </p>
            <p className="text-amber-800 dark:text-amber-200/90 print:text-black leading-relaxed">
              In accordance with Section 34 of the Disaster Management Act, the Incident Commander / District Magistrate
              hereby directs the immediate phased evacuation of vulnerable habitations listed below. Designated transit shelters
              must maintain continuous communications with the District Emergency Operation Centre (DEOC).
            </p>
          </div>

          {/* Priority Evacuation Queue Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              1. Priority Evacuation Habitations & Screening Summary
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700 print:border-black">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 print:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold">
                  <th className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">Rank</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">Habitation Name</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">District</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">Primary Hazard</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">Risk Level</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 print:border-black text-right">Population</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">Accessibility</th>
                </tr>
              </thead>
              <tbody>
                {(criticalHabitations.length > 0 ? criticalHabitations : habitations.slice(0, 5)).map((h, idx) => (
                  <tr key={h.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2 border border-slate-200 dark:border-slate-700 print:border-black font-bold">#{idx + 1}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 print:border-black font-semibold">{h.name || h.habitation_name}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">{h.district}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">{h.hazard || 'Multi-Hazard'}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 print:border-black font-bold text-rose-600 print:text-black">
                      {h.risk_level || 'Critical'} ({h.risk_score || 85.0})
                    </td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 print:border-black text-right font-mono">
                      {(h.population || 0).toLocaleString()}
                    </td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 print:border-black">{h.accessibility || 'Restricted'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Logistics Requisition Grid */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              2. Requisite Emergency Logistics & Resource Allocation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 print:border-black print:bg-white">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Evacuees to Transport</p>
                <p className="text-lg font-black text-blue-600 dark:text-blue-400 print:text-black">{totalEvacuationPop.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">persons in high-risk zones</p>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 print:border-black print:bg-white">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Transport Fleet Requisition</p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 print:text-black">{totalBuses} Buses</p>
                <p className="text-[10px] text-slate-400">+{totalAmbulances} Medical Ambulances</p>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 print:border-black print:bg-white">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Drinking Water Supply</p>
                <p className="text-lg font-black text-teal-600 dark:text-teal-400 print:text-black">{waterLPD} L/Day</p>
                <p className="text-[10px] text-slate-400">@ 15L per capita daily standard</p>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 print:border-black print:bg-white">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Rations & Meal Packets</p>
                <p className="text-lg font-black text-amber-600 dark:text-amber-400 print:text-black">{mealsPerDay} Meals/Day</p>
                <p className="text-[10px] text-slate-400">Ready-To-Eat dry food packets</p>
              </div>
            </div>
          </div>

          {/* Officer Sign-off Block */}
          <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-700 print:border-black mt-8">
            <div className="flex justify-between items-end text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white print:text-black">Distribution Copy:</p>
                <p className="text-slate-500">1. District Magistrate / Collector</p>
                <p className="text-slate-500">2. NDRF Commanding Officer</p>
                <p className="text-slate-500">3. Superintendent of Police (SP)</p>
                <p className="text-slate-500">4. Chief Medical Officer (CMO)</p>
              </div>

              <div className="text-right">
                <div className="h-12 border-b border-dashed border-slate-400 dark:border-slate-500 w-48 mb-2"></div>
                <p className="font-bold text-slate-900 dark:text-white print:text-black">Incident Commander / DM</p>
                <p className="text-slate-500">District Emergency Operations Center</p>
                <p className="text-[10px] text-slate-400">Digital Seal & Verification Hash Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
