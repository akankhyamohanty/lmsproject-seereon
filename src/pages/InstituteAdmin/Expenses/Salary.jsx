import React, { useState, useEffect } from "react";
import {
  User, ChevronDown, Calendar, DollarSign, CreditCard, Check,
  CheckCircle, Loader, Plus, Trash2, Eye, Copy, X, AlertCircle,
  Banknote, TrendingUp, Users, Hash, Search, RefreshCw, Printer, FileText
} from "lucide-react";
import {
  SALARY_KEY, MONTHS, getFaculty, ensureFaculty,
  getRecords, addRecord, deleteRecord, genTxnId
} from "./expensestorage";

// ─── Salary Slip Document (Printable) ─────────────────────────────────────────
const SalarySlip = ({ record, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText size={18} className="text-blue-600" />
            <span className="font-black uppercase tracking-tight text-sm">Salary Slip Preview</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95">
              <Printer size={16} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div id="salary-slip-content" className="p-10 text-slate-800 bg-white">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-blue-700">ACADEMIC INSTITUTION</h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Official Pay Advice</p>
            </div>
            <div className="text-right">
              <div className="bg-slate-100 px-3 py-1 rounded-lg inline-block mb-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Transaction ID</p>
              </div>
              <p className="font-mono font-bold text-sm text-slate-900">{record.txnId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-10 border-y border-slate-100 py-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Employee Information</p>
              <p className="font-black text-xl text-slate-900">{record.facultyName}</p>
              <p className="text-md font-bold text-slate-600">{record.designation}</p>
              <p className="text-sm text-slate-500">{record.department}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Details</p>
              <p className="font-black text-xl text-slate-900">{record.month} 2026</p>
              <p className="text-md font-bold text-slate-600">Paid via {record.method}{record.onlineProvider ? ` · ${record.onlineProvider}` : ""}</p>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-tighter mt-1 flex items-center justify-end gap-1">
                <CheckCircle size={12}/> Disbursed
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b-2 border-slate-900">
              <span className="font-black text-xs uppercase tracking-widest">Description</span>
              <span className="font-black text-xs uppercase tracking-widest">Amount</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-700 font-bold">Base Professional Salary</span>
              <span className="font-black text-slate-900">₹{Number(record.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-slate-400 italic">
              <span className="text-sm">Allowances / Incentives</span>
              <span className="text-sm font-bold">₹0.00</span>
            </div>
            <div className="mt-8 pt-6 border-t-2 border-slate-900 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Net Pay (Rounded)</p>
                <p className="text-[11px] text-slate-500 font-medium italic">Amount in words: Rupees {Number(record.amount).toLocaleString('en-IN')} Only</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-blue-700 tracking-tighter">₹{Number(record.amount).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-24 flex justify-between items-center">
            <div className="text-center">
              <div className="w-32 h-px bg-slate-200 mb-2"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recipient Signature</p>
            </div>
            <div className="text-center">
              <div className="mb-2 opacity-20 grayscale">
                <CheckCircle size={40} className="mx-auto text-blue-600" />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Finance Department</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-50">
            <p className="text-[8px] text-center text-slate-400 leading-relaxed uppercase tracking-[0.2em]">
              This is a digitally generated payroll advice. No physical signature is required. <br/>
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Shared sub-components ────────────────────────────────────────────────────
const SelectField = ({ label, value, onChange, options, error, required, placeholder }) => (
  <div className="space-y-1.5 text-left">
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
  <div className="space-y-1.5 text-left">
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

// ─── Main Component ───────────────────────────────────────────────────────────
export const Salary = () => {
  // ✅ FIX: faculty is now in state, populated AFTER ensureFaculty() seeds the data
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    ensureFaculty();
    const all = getFaculty();
    // Filter active/approved, but fall back to ALL faculty if none match
    const active = all.filter(f =>
      !f.status || ["active", "approved"].includes(f.status?.toLowerCase?.())
    );
    setFaculty(active.length > 0 ? active : all);
  }, []);

  const [records, setRecords] = useState([]);
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState(null);
  const [viewRec, setViewRec] = useState(null);
  const [printRec, setPrintRec] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});

  const [form, setForm] = useState({
    facultyId: "", month: "", amount: "",
    method: "Online Payment", onlineProvider: "GPay", txnNumber: "", note: "",
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
        method: form.method,
        onlineProvider: form.method === "Online Payment" ? form.onlineProvider : "",
        status: "Paid",
        note: form.note,
        date: new Date().toISOString().split("T")[0],
      };
      addRecord(SALARY_KEY, rec);
      reload();
      setSaving(false);
      setToast(txnId);
      setForm({ facultyId: "", month: "", amount: "", method: "Online Payment", onlineProvider: "GPay", txnNumber: "", note: "" });
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
        
        @media print {
          body > *:not(#salary-slip-content) { display: none !important; }
          #salary-slip-content { 
            display: block !important; 
            position: absolute; 
            left: 0; top: 0; width: 100%;
            padding: 40px !important;
          }
          .fixed { display: none !important; }
          #salary-slip-content { visibility: visible !important; }
        }
      `}</style>

      <div className="w-full font-sans text-left pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Salary Management</h1>
          <p className="text-slate-500 mt-1.5 text-md">Process and track faculty salary payments</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Disbursed", value: `₹${(totalPaid/1000).toFixed(1)}K`, icon: TrendingUp, color: "violet" },
            { label: "Records", value: records.length, icon: Hash, color: "blue" },
            { label: "Faculty", value: faculty.length, icon: Users, color: "emerald"},
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
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-left">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-white/20 rounded-xl"><Banknote size={18} className="text-white"/></div>
                <div className="text-left">
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
                <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-md uppercase">
                    {selectedFaculty.first_name?.[0]}{selectedFaculty.last_name?.[0]}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-800 text-md">{selectedFaculty.first_name} {selectedFaculty.last_name}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{selectedFaculty.designation}</p>
                  </div>
                </div>
              )}

              <SelectField label="Select Month" value={form.month} onChange={h("month")} error={errors.month} required options={MONTHS} />
              <InputField label="Salary Amount" value={form.amount} onChange={h("amount")} error={errors.amount} required placeholder="0" prefix="₹" type="number" />

              <SelectField label="Payment Method" value={form.method} onChange={h("method")}
                options={["Online Payment", "Mark as Paid"]} />

              {form.method === "Online Payment" && (
                <div className="space-y-1.5 text-left animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Provider</label>
                  <div className="flex gap-2">
                    {[
                      { id: "GPay",    label: "GPay",    logo: "https://img.icons8.com/color/96/google-pay.png" },
                      { id: "Paytm",   label: "Paytm",   logo: "https://img.icons8.com/color/96/paytm.png" },
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, onlineProvider: p.id }))}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border-2 transition-all
                          ${form.onlineProvider === p.id
                            ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100 ring-2 ring-blue-300"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}
                      >
                        <img
                          src={p.logo}
                          alt={p.label}
                          className="h-9 w-9 object-contain"
                          onError={e => { e.target.src = `https://logo.clearbit.com/${p.id.toLowerCase()}.com`; }}
                        />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${form.onlineProvider === p.id ? "text-blue-600" : "text-slate-400"}`}>
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.method === "Mark as Paid" && (
                <InputField label="Transaction Number" value={form.txnNumber} onChange={h("txnNumber")} error={errors.txnNumber} required placeholder="Enter existing transaction ID" />
              )}

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Note (Optional)</label>
                <textarea value={form.note} onChange={h("note")} rows={2} placeholder="Any remarks..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={saving}
                className={`w-full py-3.5 rounded-xl font-black text-md flex items-center justify-center gap-2 transition-all
                  ${saving ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"}`}>
                {saving ? <><Loader size={15} className="animate-spin"/>Processing...</> : <><CreditCard size={15}/>Pay Salary</>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty, month, txn..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all" />
              </div>
              <button onClick={reload} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><RefreshCw size={15}/></button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>{["Faculty","Month","Amount","Txn ID","Actions"].map(h=>(
                    <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No records found</td></tr>
                  ) : filtered.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors group" style={{ animation:`fadeIn 0.3s ease ${i*40}ms both` }}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-md font-bold text-slate-800">{r.facultyName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{r.department}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-md font-bold text-slate-600">{r.month}</td>
                      <td className="px-4 py-3 text-md font-black text-slate-900">₹{r.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{r.txnId}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setPrintRec(r)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Print Slip"><Printer size={13}/></button>
                          <button onClick={() => setViewRec(r)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={13}/></button>
                          <button onClick={() => { deleteRecord(SALARY_KEY, r.id); reload(); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {printRec && <SalarySlip record={printRec} onClose={() => setPrintRec(null)}/>}
      {viewRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setViewRec(null)}>
           <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                <span className="font-black uppercase tracking-widest text-[10px]">Record Details</span>
                <button onClick={() => setViewRec(null)}><X size={18}/></button>
             </div>
             <div className="p-6 space-y-4">
               {Object.entries({ Name: viewRec.facultyName, Month: viewRec.month, Amount: `₹${viewRec.amount}`, Method: viewRec.method, ID: viewRec.txnId }).map(([k,v]) => (
                 <div key={k} className="flex justify-between border-b border-slate-50 pb-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase">{k}</span>
                   <span className="font-bold text-slate-800">{v}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Salary;3