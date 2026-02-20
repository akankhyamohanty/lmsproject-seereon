import React, { useState, useEffect } from "react";
import {
  User, ChevronDown, Calendar, DollarSign, CreditCard, Check,
  CheckCircle, Loader, Plus, Trash2, Eye, Copy, X, AlertCircle,
  Banknote, TrendingUp, Users, Hash, Search, RefreshCw
} from "lucide-react";
import {
  SALARY_KEY, MONTHS, getFaculty, ensureFaculty,
  getRecords, addRecord, deleteRecord, genTxnId, STATUS_STYLE
} from "./ExpenseStorage";

// ─── Shared sub-components ────────────────────────────────────────────────────
const SelectField = ({ label, value, onChange, options, error, required, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div className="relative">
      <select value={value} onChange={onChange}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-md font-medium outline-none appearance-none transition-all
          ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-violet-100 focus:bg-white"}`}>
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="text-md text-red-500 flex items-center gap-1 mt-0.5"><AlertCircle size={10}/>{error}</p>}
  </div>
);

const InputField = ({ label, name, type="text", value, onChange, error, required, placeholder, prefix }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div className="relative">
      {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-md">{prefix}</span>}
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full ${prefix ? "pl-8" : "px-3.5"} pr-3.5 py-2.5 rounded-xl border text-md font-medium outline-none transition-all
          ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-violet-100 focus:bg-white"}`} />
    </div>
    {error && <p className="text-md text-red-500 flex items-center gap-1 mt-0.5"><AlertCircle size={10}/>{error}</p>}
  </div>
);

// ─── Success Toast ────────────────────────────────────────────────────────────
const Toast = ({ txnId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(txnId).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]" style={{ animation: "toastIn 0.3s ease" }}>
      <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
        <div className="p-2 bg-emerald-500 rounded-xl flex-shrink-0"><CheckCircle size={16}/></div>
        <div className="flex-1">
          <p className="text-md font-black uppercase tracking-widest text-slate-400">Salary Paid</p>
          <p className="font-mono font-bold text-md mt-0.5">{txnId}</p>
        </div>
        <button onClick={copy} className={`px-3 py-1.5 rounded-xl text-md font-black transition-all ${copied ? "bg-emerald-500" : "bg-white/10 hover:bg-white/20"}`}>
          {copied ? <Check size={12}/> : <Copy size={12}/>}
        </button>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={15}/></button>
      </div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ record, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(8px)" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
      style={{ animation: "modalIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
      <div className="bg-gradient-to-r from-blue-700 to-blue-700 px-6 py-5 flex justify-between items-center">
        <div>
          <p className="text-violet-200 text-[10px] font-black uppercase tracking-widest">Salary Record</p>
          <p className="text-white font-black text-lg mt-0.5">{record.facultyName}</p>
        </div>
        <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl"><X size={18}/></button>
      </div>
      <div className="p-6 space-y-3">
        {[
          { label: "Txn ID",      value: record.txnId },
          { label: "Month",       value: record.month },
          { label: "Designation", value: record.designation },
          { label: "Department",  value: record.department },
          { label: "Amount",      value: `₹${Number(record.amount).toLocaleString()}` },
          { label: "Method",      value: record.method },
          { label: "Status",      value: record.status },
          { label: "Date",        value: record.date },
        ].map(r => (
          <div key={r.label} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.label}</span>
            <span className="text-md font-bold text-slate-700">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
export const Salary = () => {
  useEffect(() => { ensureFaculty(); }, []);

  const faculty = getFaculty().filter(f => ["active","approved"].includes(f.status?.toLowerCase()));
  const [records, setRecords] = useState([]);
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState(null);
  const [viewRec, setViewRec] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});

  const [form, setForm] = useState({
    facultyId: "", month: "", amount: "",
    method: "Online Payment", txnNumber: "", note: "",
  });

  const reload = () => setRecords(getRecords(SALARY_KEY));
  useEffect(() => { reload(); }, []);

  const selectedFaculty = faculty.find(f => f.id === Number(form.facultyId));

  const h = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.facultyId) e.facultyId = "Select a faculty member";
    if (!form.month)     e.month     = "Select a month";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter valid amount";
    if (form.method === "Mark as Paid" && !form.txnNumber.trim()) e.txnNumber = "Transaction number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    const txnId = form.method === "Mark as Paid" ? form.txnNumber : genTxnId("SAL");
    setTimeout(() => {
      const rec = {
        id: Date.now(), txnId,
        facultyId: Number(form.facultyId),
        facultyName: `${selectedFaculty?.first_name} ${selectedFaculty?.last_name}`,
        designation: selectedFaculty?.designation || "",
        department: selectedFaculty?.department || "",
        month: form.month, amount: Number(form.amount),
        method: form.method, status: "Paid",
        note: form.note,
        date: new Date().toISOString().split("T")[0],
      };
      addRecord(SALARY_KEY, rec);
      reload();
      setSaving(false);
      setToast(txnId);
      setForm({ facultyId: "", month: "", amount: "", method: "Online Payment", txnNumber: "", note: "" });
      setErrors({});
      setTimeout(() => setToast(null), 5000);
    }, 800);
  };

  const totalPaid = records.reduce((s, r) => s + (r.amount || 0), 0);
  const filtered = records.filter(r =>
    r.facultyName?.toLowerCase().includes(search.toLowerCase()) ||
    r.month?.toLowerCase().includes(search.toLowerCase()) ||
    r.txnId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="w-full font-sans text-left pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Salary Management</h1>
          <p className="text-slate-500 mt-1.5 text-md">Process and track faculty salary payments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Disbursed", value: `₹${(totalPaid/1000).toFixed(1)}K`, icon: TrendingUp, color: "violet" },
            { label: "Records",         value: records.length,                       icon: Hash,       color: "blue"   },
            { label: "Faculty",         value: faculty.length,                       icon: Users,      color: "emerald"},
          ].map((s, i) => {
            const Icon = s.icon;
            const cls = { violet:"bg-violet-50 text-violet-600 border-violet-100", blue:"bg-blue-50 text-blue-600 border-blue-100", emerald:"bg-emerald-50 text-emerald-600 border-emerald-100" }[s.color];
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" style={{ animation:`fadeIn 0.3s ease ${i*70}ms both` }}>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${cls}`}><Icon size={16}/></div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Banknote size={18} className="text-white"/></div>
                <div>
                  <h2 className="text-white font-black text-lg">Pay Salary</h2>
                  <p className="text-violet-200 text-md mt-0.5">Process faculty payment</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <SelectField label="Select Faculty" value={form.facultyId} onChange={h("facultyId")} error={errors.facultyId} required
                options={faculty.map(f => ({ value: f.id, label: `${f.first_name} ${f.last_name} — ${f.designation}` }))}
                placeholder="Choose faculty member" />

              {selectedFaculty && (
                <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-md uppercase">
                    {selectedFaculty.first_name?.[0]}{selectedFaculty.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-md">{selectedFaculty.first_name} {selectedFaculty.last_name}</p>
                    <p className="text-md text-slate-500">{selectedFaculty.designation} · {selectedFaculty.department}</p>
                    {selectedFaculty.salary && <p className="text-md font-bold text-blue-700 mt-0.5">Base: ₹{Number(selectedFaculty.salary).toLocaleString()}</p>}
                  </div>
                </div>
              )}

              <SelectField label="Select Month" value={form.month} onChange={h("month")} error={errors.month} required options={MONTHS} />
              <InputField  label="Salary Amount" value={form.amount} onChange={h("amount")} error={errors.amount} required placeholder="0" prefix="₹" type="number" />

              <SelectField label="Payment Method" value={form.method} onChange={h("method")}
                options={["Online Payment", "Mark as Paid"]} />

              {form.method === "Mark as Paid" && (
                <InputField label="Transaction Number" value={form.txnNumber} onChange={h("txnNumber")} error={errors.txnNumber} required placeholder="Enter existing transaction ID" />
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Note (Optional)</label>
                <textarea value={form.note} onChange={h("note")} rows={2} placeholder="Any remarks..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={saving}
                className={`w-full py-3.5 rounded-xl font-black text-md flex items-center justify-center gap-2 transition-all
                  ${saving ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"}`}>
                {saving ? <><Loader size={15} className="animate-spin"/>Processing...</> : <><CreditCard size={15}/>Pay Salary</>}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty, month, txn..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all" />
              </div>
              <button onClick={reload} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><RefreshCw size={15}/></button>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Banknote size={40} className="mx-auto text-slate-200 mb-3"/>
                <p className="text-slate-400 font-bold text-md">No salary records yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>{["Faculty","Month","Amount","Method","Txn ID",""].map(h=>(
                      <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors group" style={{ animation:`fadeIn 0.3s ease ${i*40}ms both` }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center text-white font-black text-md uppercase">{r.facultyName?.[0]}</div>
                            <div>
                              <p className="text-md font-bold text-slate-800">{r.facultyName}</p>
                              <p className="text-md text-slate-400">{r.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-md font-bold text-slate-600 whitespace-nowrap">{r.month}</td>
                        <td className="px-4 py-3 text-md font-black text-slate-900 whitespace-nowrap">₹{r.amount?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-md font-semibold text-slate-500 whitespace-nowrap">{r.method}</td>
                        <td className="px-4 py-3"><span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{r.txnId}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setViewRec(r)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={13}/></button>
                            <button onClick={() => { deleteRecord(SALARY_KEY, r.id); reload(); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast txnId={toast} onClose={() => setToast(null)}/>}
      {viewRec && <DetailModal record={viewRec} onClose={() => setViewRec(null)}/>}
    </>
  );
};

export default Salary;