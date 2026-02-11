import { useState } from "react";
import { Search, Filter, Download, TrendingUp, AlertCircle } from "lucide-react";

export const FeeCollection = () => {
  // --- MOCK DATA ---
  const transactions = [
    { id: "TXN-8854", student: "Amit Sharma", feeType: "Tuition Fee", amount: "25,000", date: "2024-02-01", method: "Online", status: "Paid" },
    { id: "TXN-8855", student: "Priya Das", feeType: "Exam Fee", amount: "2,500", date: "2024-02-02", method: "Cash", status: "Paid" },
    { id: "TXN-8856", student: "Rahul Singh", feeType: "Tuition Fee", amount: "25,000", date: "2024-02-03", method: "Cheque", status: "Pending" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fee Collection</h1>
          <p className="text-sm text-slate-500">Track payments and outstanding dues</p>
        </div>
        <button className="bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 shadow-sm">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
           <div>
             <p className="text-xs text-green-600 uppercase font-bold">Total Collected</p>
             <h3 className="text-2xl font-bold text-green-900">₹ 4,50,000</h3>
           </div>
           <TrendingUp className="text-green-500" />
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
           <div>
             <p className="text-xs text-red-600 uppercase font-bold">Pending Dues</p>
             <h3 className="text-2xl font-bold text-red-900">₹ 85,000</h3>
           </div>
           <AlertCircle className="text-red-500" />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex gap-4">
           <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1">
              <Search size={18} className="text-slate-400 mr-2" />
              <input type="text" placeholder="Search student or transaction ID..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
           </div>
           <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><Filter size={18} className="text-slate-500" /></button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Trans ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fee Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Method</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{txn.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{txn.student}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{txn.feeType}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{txn.amount}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{txn.method}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    txn.status === "Paid" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  }`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};