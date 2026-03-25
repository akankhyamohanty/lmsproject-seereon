import { useState } from 'react';
import {
  DollarSign, CheckCircle, AlertCircle, Calendar,
  Download, CreditCard, X, Landmark, Smartphone, Shield, FileText, Plus,
  TrendingUp, ArrowUpRight, Receipt, Banknote, Search, SlidersHorizontal,
} from 'lucide-react';

// ── Receipt Generator ──────────────────────────────────────────────────────────
const downloadReceipt = (payment) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Receipt - ${payment.transactionId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; display: flex; justify-content: center; padding: 40px 20px; }
    .receipt { background: white; width: 480px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; padding: 32px; text-align: center; }
    .header h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { font-size: 13px; opacity: 0.85; margin-top: 4px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); border-radius: 999px; padding: 6px 14px; margin-top: 14px; font-size: 13px; font-weight: 600; }
    .body { padding: 32px; }
    .amount-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px; }
    .amount-box .label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .amount-box .amount { font-size: 40px; font-weight: 800; color: #1e40af; margin-top: 4px; }
    .divider { border: none; border-top: 1px dashed #e2e8f0; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
    .row .key { font-size: 13px; color: #64748b; font-weight: 500; }
    .row .val { font-size: 13px; color: #0f172a; font-weight: 600; text-align: right; max-width: 60%; }
    .txn { font-family: monospace; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #94a3b8; line-height: 1.6; }
    .footer strong { color: #475569; }
  </style>
</head>
<body>
<div class="receipt">
  <div class="header">
    <h1>🎓 EduPortal</h1>
    <p>Official Payment Receipt</p>
    <div class="badge">✅ Payment Successful</div>
  </div>
  <div class="body">
    <div class="amount-box">
      <div class="label">Amount Paid</div>
      <div class="amount">$${payment.amount}</div>
    </div>
    <div class="row"><span class="key">Fee Type</span><span class="val">${payment.feeType}</span></div>
    <div class="row"><span class="key">Payment Date</span><span class="val">${payment.date}</span></div>
    <div class="row"><span class="key">Payment Mode</span><span class="val">${payment.paymentMode}</span></div>
    <hr class="divider" />
    <div class="row"><span class="key">Transaction ID</span><span class="val txn">${payment.transactionId}</span></div>
    <div class="row"><span class="key">Status</span><span class="val" style="color:#16a34a">✓ Paid</span></div>
  </div>
  <div class="footer">
    <p>This is an auto-generated receipt. Keep it for your records.<br/><strong>EduPortal Student Finance Portal</strong></p>
  </div>
</div>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `Receipt_${payment.transactionId}.html`; a.click();
  URL.revokeObjectURL(url);
};

// ── Add Fee Modal ──────────────────────────────────────────────────────────────
const FEE_CATEGORIES = [
  'Semester Fee', 'Examination Fee', 'Library Fee', 'Laboratory Fee',
  'Sports Fee', 'Hostel Fee', 'Transportation Fee', 'Miscellaneous Fee',
];

const AddFeeModal = ({ onAdd, onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm]     = useState({ feeType: '', customType: '', amount: '', dueDate: '', status: 'due' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    const label = form.feeType === '__custom__' ? form.customType.trim() : form.feeType;
    if (!label)          e.feeType  = 'Fee type is required.';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
                         e.amount   = 'Enter a valid amount greater than 0.';
    if (!form.dueDate)   e.dueDate  = 'Due date is required.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const label = form.feeType === '__custom__' ? form.customType.trim() : form.feeType;
    const dateStr = new Date(form.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    onAdd({
      id:       Date.now(),
      feeType:  label,
      amount:   Number(form.amount),
      dueDate:  dateStr,
      status:   form.status,
      paidDate: null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
        <div className="h-1.5 bg-blue-600 w-full" />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Add New Fee</h2>
              <p className="text-sm text-gray-500 mt-0.5">Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">

          {/* Fee Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fee Type <span className="text-red-500">*</span></label>
            <select
              name="feeType"
              value={form.feeType}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 border rounded-lg text-md text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.feeType ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            >
              <option value="">Select fee category</option>
              {FEE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__custom__">Custom / Other</option>
            </select>
            {form.feeType === '__custom__' && (
              <input
                name="customType"
                value={form.customType}
                onChange={handleChange}
                placeholder="Enter custom fee name"
                className={`mt-2 w-full px-3 py-2.5 border rounded-lg text-md text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.feeType ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
            )}
            {errors.feeType && <p className="mt-1 text-sm text-red-500">{errors.feeType}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount ($) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-md">$</span>
              <input
                name="amount"
                type="number"
                min="1"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full pl-7 pr-3 py-2.5 border rounded-lg text-md text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date <span className="text-red-500">*</span></label>
            <input
              name="dueDate"
              type="date"
              min={today}
              value={form.dueDate}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 border rounded-lg text-md text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition bg-white ${errors.dueDate ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Initial Status</label>
            <div className="flex gap-2">
              {[
                { val: 'due',     label: 'Due',     color: 'amber'   },
                { val: 'overdue', label: 'Overdue', color: 'red'     },
                { val: 'paid',    label: 'Paid',    color: 'emerald' },
              ].map(({ val, label, color }) => {
                const active = form.status === val;
                const cls = {
                  amber:   active ? 'bg-amber-50 border-amber-400 text-amber-700'     : 'border-gray-200 text-gray-500',
                  red:     active ? 'bg-red-50 border-red-400 text-red-700'           : 'border-gray-200 text-gray-500',
                  emerald: active ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'border-gray-200 text-gray-500',
                }[color];
                return (
                  <button
                    key={val}
                    onClick={() => { setForm(p => ({ ...p, status: val })); }}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${cls}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 text-md font-medium py-2.5 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition active:scale-95">
              <Plus className="w-4 h-4" /> Add Fee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Payment Modal ──────────────────────────────────────────────────────────────
const PAYMENT_MODES = [
  { id: 'credit', label: 'Credit Card', Icon: CreditCard, desc: 'Visa / Mastercard / Amex' },
  { id: 'upi',    label: 'UPI',         Icon: Smartphone, desc: 'GPay, PhonePe, Paytm'    },
  { id: 'net',    label: 'Net Banking', Icon: Landmark,   desc: 'All major banks'           },
];

const PaymentModal = ({ fee, onConfirm, onCancel, processing }) => {
  const [mode, setMode] = useState('credit');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
        <div className="h-1.5 bg-blue-600 w-full" />
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Complete Payment</h2>
              <p className="text-sm text-gray-500 mt-0.5">{fee.feeType}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="mx-6 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
          <p className="text-sm text-blue-600 font-medium uppercase tracking-wide mb-1">Amount Due</p>
          <p className="text-3xl font-black text-blue-700">${fee.amount}</p>
          <p className="text-sm text-blue-500 mt-1">Due: {fee.dueDate}</p>
        </div>
        <div className="px-6 mb-5">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Method</p>
          <div className="space-y-2">
            {PAYMENT_MODES.map(({ id, label, Icon, desc }) => (
              <button key={id} onClick={() => setMode(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition text-left ${mode === id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${mode === id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-4 h-4 ${mode === id ? 'text-blue-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-md font-semibold ${mode === id ? 'text-blue-700' : 'text-gray-800'}`}>{label}</p>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${mode === id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                  {mode === id && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mx-6 mb-5 flex items-center gap-2 text-sm text-gray-400">
          <Shield className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Payments are secured with 256-bit SSL encryption</span>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel} className="flex-1 border border-gray-300 text-gray-700 text-md font-medium py-2.5 rounded-lg hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => onConfirm(mode)} disabled={processing}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-md font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
            {processing ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Processing...</> : <><CreditCard className="w-4 h-4" /> Pay ${fee.amount}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Toast ──────────────────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl">
    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
    <p className="text-md font-medium">{message}</p>
    <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white transition"><X className="w-4 h-4" /></button>
  </div>
);

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS = {
  paid:    { color: 'bg-emerald-100 text-emerald-700 border border-emerald-300', label: 'Paid',    Icon: CheckCircle },
  due:     { color: 'bg-amber-100 text-amber-700 border border-amber-300',       label: 'Due',     Icon: AlertCircle },
  overdue: { color: 'bg-red-100 text-red-700 border border-red-300',             label: 'Overdue', Icon: AlertCircle },
};

// ── Mock Data ──────────────────────────────────────────────────────────────────
const INITIAL_FEES = [
  { id: 1, feeType: 'Semester Fee - Spring 2026', amount: 2500, dueDate: 'Feb 5, 2026',  status: 'due',     paidDate: null },
  { id: 2, feeType: 'Examination Fee - Mid-term', amount: 200,  dueDate: 'Feb 1, 2026',  status: 'overdue', paidDate: null },
  { id: 3, feeType: 'Library Fee',                amount: 100,  dueDate: 'Mar 1, 2026',  status: 'due',     paidDate: null },
  { id: 4, feeType: 'Semester Fee - Fall 2025',   amount: 2500, dueDate: 'Sep 5, 2025',  status: 'paid',    paidDate: 'Sep 1, 2025' },
];

const INITIAL_HISTORY = [
  { id: 1, feeType: 'Semester Fee - Fall 2025', amount: 2500, paymentMode: 'Credit Card', transactionId: 'TXN123456789', date: 'Sep 1, 2025'  },
  { id: 2, feeType: 'Examination Fee - Final',  amount: 200,  paymentMode: 'UPI',         transactionId: 'TXN987654321', date: 'Nov 15, 2025' },
  { id: 3, feeType: 'Library Fee',              amount: 100,  paymentMode: 'Net Banking', transactionId: 'TXN456789123', date: 'Aug 10, 2025' },
];

// ── Mode icon helper ───────────────────────────────────────────────────────────
const ModeIcon = ({ mode }) => {
  if (mode === 'Credit Card') return <CreditCard className="w-4 h-4" />;
  if (mode === 'UPI')         return <Smartphone  className="w-4 h-4" />;
  if (mode === 'Net Banking') return <Landmark    className="w-4 h-4" />;
  return <Banknote className="w-4 h-4" />;
};
const modeBg = { 'Credit Card': 'bg-blue-100 text-blue-600', 'UPI': 'bg-violet-100 text-violet-600', 'Net Banking': 'bg-emerald-100 text-emerald-700' };

// ── Payments Tab ───────────────────────────────────────────────────────────────
function PaymentsTab({ paymentHistory }) {
  const [search, setSearch]     = useState('');
  const [filterMode, setFilter] = useState('all');

  const totalPaid    = paymentHistory.reduce((s, p) => s + p.amount, 0);
  const lastPayment  = paymentHistory[0] ?? null;
  const uniqueModes  = [...new Set(paymentHistory.map(p => p.paymentMode))];

  const filtered = paymentHistory.filter(p => {
    const matchMode   = filterMode === 'all' || p.paymentMode === filterMode;
    const matchSearch = search === '' ||
      p.feeType.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchMode && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total paid */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold opacity-80 uppercase tracking-wide">Total Paid</span>
          </div>
          <p className="text-3xl font-black text-left">${totalPaid.toLocaleString()}</p>
          <p className="text-sm opacity-70 mt-1 text-left">{paymentHistory.length} transaction{paymentHistory.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Last payment */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Last Payment</span>
          </div>
          {lastPayment ? (
            <>
              <p className="text-2xl font-black text-gray-900 text-left">${lastPayment.amount}</p>
              <p className="text-sm text-gray-400 mt-1 truncate text-left">{lastPayment.feeType}</p>
              <p className="text-sm text-gray-400 text-left">{lastPayment.date}</p>
            </>
          ) : (
            <p className="text-md text-gray-400">No payments yet</p>
          )}
        </div>

        {/* Most used mode */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Methods Used</span>
          </div>
          {uniqueModes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {uniqueModes.map(m => (
                <span key={m} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold ${modeBg[m] ?? 'bg-gray-100 text-gray-600'}`}>
                  <ModeIcon mode={m} /> {m}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-md text-gray-400">No data</p>
          )}
        </div>
      </div>

      {/* ── History list ── */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">

        {/* Header + filters */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-md font-bold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-400">{filtered.length} of {paymentHistory.length} records</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 bg-white w-40"
              />
            </div>

            {/* Mode filter */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select
                value={filterMode}
                onChange={e => setFilter(e.target.value)}
                className="pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none bg-white focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction cards */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Receipt className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="text-md font-medium text-gray-400">No transactions found</p>
            {(search || filterMode !== 'all') && (
              <button onClick={() => { setSearch(''); setFilter('all'); }} className="mt-2 text-sm text-emerald-600 hover:underline font-semibold">Clear filters</button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${modeBg[p.paymentMode] ?? 'bg-gray-100 text-gray-500'}`}>
                  <ModeIcon mode={p.paymentMode} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-md font-bold text-gray-900 truncate">{p.feeType}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-sm text-gray-400">{p.date}</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-sm text-gray-400">{p.paymentMode}</span>
                    <span className="text-gray-200">·</span>
                    <span className="font-mono text-sm text-gray-400 truncate max-w-[140px]">{p.transactionId}</span>
                  </div>
                </div>

                {/* Amount + download */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-base font-black text-gray-900">${p.amount.toLocaleString()}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                      <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                  </div>

                  <button
                    onClick={() => downloadReceipt(p)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 text-sm font-semibold transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Download className="w-3.5 h-3.5" /> Receipt
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Footer total */}
        {filtered.length > 0 && (
          <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} shown</span>
            <span className="text-md font-black text-gray-900">
              Total: <span className="text-emerald-600">${filtered.reduce((s, p) => s + p.amount, 0).toLocaleString()}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudentFees() {
  const [activeTab,      setActiveTab]      = useState('fees');
  const [feeDetails,     setFeeDetails]     = useState(INITIAL_FEES);
  const [paymentHistory, setPaymentHistory] = useState(INITIAL_HISTORY);
  const [payingFee,      setPayingFee]      = useState(null);
  const [processing,     setProcessing]     = useState(false);
  const [toast,          setToast]          = useState(null);
  const [showAddFee,     setShowAddFee]     = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const totalFees = feeDetails.reduce((s, f) => s + f.amount, 0);
  const feesPaid  = feeDetails.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const feesDue   = feeDetails.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0);
  const upcoming  = feeDetails.filter(f => f.status !== 'paid').length;

  const handleAddFee = (newFee) => {
    setFeeDetails(prev => [newFee, ...prev]);
    showToast(`"${newFee.feeType}" added successfully!`);
  };

  const handleConfirmPayment = async (mode) => {
    if (!payingFee) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1600));
    const modeLabel = { credit: 'Credit Card', upi: 'UPI', net: 'Net Banking' }[mode];
    const txnId     = `TXN${Math.floor(Math.random() * 900000000 + 100000000)}`;
    const dateStr   = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const record    = { id: Date.now(), feeType: payingFee.feeType, amount: payingFee.amount, paymentMode: modeLabel, transactionId: txnId, date: dateStr };
    setPaymentHistory(prev => [record, ...prev]);
    setFeeDetails(prev => prev.map(f => f.id === payingFee.id ? { ...f, status: 'paid', paidDate: dateStr } : f));
    setProcessing(false);
    setPayingFee(null);
    showToast(`Payment of $${payingFee.amount} successful! TXN: ${txnId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">

        {showAddFee  && <AddFeeModal onAdd={handleAddFee} onClose={() => setShowAddFee(false)} />}
        {payingFee   && <PaymentModal fee={payingFee} processing={processing} onConfirm={handleConfirmPayment} onCancel={() => { if (!processing) setPayingFee(null); }} />}
        {toast       && <Toast message={toast} onClose={() => setToast(null)} />}

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl text-left font-bold text-gray-900 mb-1">Fees & Payments</h1>
          <p className="text-md text-left text-gray-500">Manage your fee payments and view payment history</p>
        </div>

        {/* Tab Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Tab Bar */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'fees',     label: 'Fees',     Icon: DollarSign, active: 'text-blue-600',    bar: 'bg-blue-600'    },
              { id: 'payments', label: 'Payments', Icon: CreditCard, active: 'text-emerald-600', bar: 'bg-emerald-600' },
            ].map(({ id, label, Icon, active, bar }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-6 py-4 font-semibold text-md transition-colors ${activeTab === id ? active : 'text-gray-500 hover:text-gray-800'}`}>
                <Icon className="w-4 h-4" />
                {label}
                {activeTab === id && <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${bar} rounded-t-full`} />}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── FEES TAB ─────────────────────────────────────────────────── */}
            {activeTab === 'fees' && (
              <div>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Fees', value: `$${totalFees}`, Icon: DollarSign,  bg: 'bg-blue-50',    iconBg: 'bg-blue-600',    text: 'text-blue-900'    },
                    { label: 'Fees Paid',  value: `$${feesPaid}`,  Icon: CheckCircle, bg: 'bg-emerald-50', iconBg: 'bg-emerald-600', text: 'text-emerald-900' },
                    { label: 'Fees Due',   value: `$${feesDue}`,   Icon: AlertCircle, bg: 'bg-red-50',     iconBg: 'bg-red-600',     text: 'text-red-900'     },
                    { label: 'Upcoming',   value: upcoming,        Icon: Calendar,    bg: 'bg-amber-50',   iconBg: 'bg-amber-600',   text: 'text-amber-900'   },
                  ].map(({ label, value, Icon, bg, iconBg, text }) => (
                    <div key={label} className={`${bg} rounded-xl p-5 border border-gray-100`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{label}</span>
                      </div>
                      <p className={`text-2xl font-black ${text}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Fee Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-md font-bold text-gray-900">Fee Details</h2>
                        <p className="text-sm text-gray-500">View and pay your pending fees</p>
                      </div>
                    </div>
                    <button onClick={() => setShowAddFee(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold rounded-lg transition">
                      <Plus className="w-3.5 h-3.5" /> Add Fee
                    </button>
                  </div>

                  {feeDetails.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
                      <DollarSign className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-md font-medium text-gray-400">No fees added yet</p>
                      <button onClick={() => setShowAddFee(true)}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                        <Plus className="w-3.5 h-3.5" /> Add First Fee
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full text-md text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-5 py-3.5 font-semibold text-gray-600">Fee Type</th>
                            <th className="px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                            <th className="px-5 py-3.5 font-semibold text-gray-600">Due Date</th>
                            <th className="px-5 py-3.5 font-semibold text-gray-600">Status</th>
                            <th className="px-5 py-3.5 font-semibold text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {feeDetails.map((fee) => {
                            const s = STATUS[fee.status] ?? STATUS.due;
                            return (
                              <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4 font-semibold text-gray-900">{fee.feeType}</td>
                                <td className="px-5 py-4 text-gray-700">${fee.amount}</td>
                                <td className="px-5 py-4 text-gray-700">{fee.dueDate}</td>
                                <td className="px-5 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${s.color}`}>
                                    <s.Icon className="w-3.5 h-3.5" />{s.label}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  {fee.status === 'paid' ? (
                                    <span className="text-gray-400 text-sm">—</span>
                                  ) : (
                                    <button onClick={() => setPayingFee(fee)}
                                      className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition active:scale-95 ${fee.status === 'overdue' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                      Pay Now
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── PAYMENTS TAB ─────────────────────────────────────────────── */}
            {activeTab === 'payments' && (
              <PaymentsTab paymentHistory={paymentHistory} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}