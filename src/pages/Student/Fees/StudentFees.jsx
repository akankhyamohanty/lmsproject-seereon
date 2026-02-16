import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, AlertCircle, Calendar, Download, CreditCard } from 'lucide-react';

export default function StudentFees() {
  const [activeTab, setActiveTab] = useState('fees');
  const [feeDetails, setFeeDetails] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [stats, setStats] = useState({
    totalFees: 0,
    feesPaid: 0,
    feesDue: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for fee details
  const mockFeeDetails = [
    {
      id: 1,
      feeType: 'Semester Fee - Spring 2026',
      amount: 2500,
      dueDate: 'Feb 5, 2026',
      status: 'due',
      paidDate: null,
    },
    {
      id: 2,
      feeType: 'Examination Fee - Mid-term',
      amount: 200,
      dueDate: 'Feb 1, 2026',
      status: 'overdue',
      paidDate: null,
    },
    {
      id: 3,
      feeType: 'Library Fee',
      amount: 100,
      dueDate: 'Mar 1, 2026',
      status: 'due',
      paidDate: null,
    },
    {
      id: 4,
      feeType: 'Semester Fee - Fall 2025',
      amount: 2500,
      dueDate: 'Sep 5, 2025',
      status: 'paid',
      paidDate: 'Sep 1, 2025',
    },
  ];

  // Mock data for payment history
  const mockPaymentHistory = [
    {
      id: 1,
      feeType: 'Semester Fee - Fall 2025',
      amount: 2500,
      paymentMode: 'Credit Card',
      transactionId: 'TXN123456789',
      date: 'Sep 1, 2025',
    },
    {
      id: 2,
      feeType: 'Examination Fee - Final',
      amount: 200,
      paymentMode: 'UPI',
      transactionId: 'TXN987654321',
      date: 'Nov 15, 2025',
    },
    {
      id: 3,
      feeType: 'Library Fee',
      amount: 100,
      paymentMode: 'Net Banking',
      transactionId: 'TXN456789123',
      date: 'Aug 10, 2025',
    },
  ];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTab = localStorage?.getItem('fees_active_tab') || 'fees';
      setActiveTab(storedTab);

      const storedFeeDetails = localStorage?.getItem('student_fee_details');
      const fees = storedFeeDetails ? JSON.parse(storedFeeDetails) : mockFeeDetails;
      setFeeDetails(fees);
      calculateStats(fees);

      const storedPaymentHistory = localStorage?.getItem('student_payment_history');
      const history = storedPaymentHistory ? JSON.parse(storedPaymentHistory) : mockPaymentHistory;
      setPaymentHistory(history);

      setLoading(false);
    } catch (error) {
      console.error('Error loading fee data:', error);
      setFeeDetails(mockFeeDetails);
      setPaymentHistory(mockPaymentHistory);
      calculateStats(mockFeeDetails);
      setLoading(false);
    }
  }, []);

  // Calculate statistics
  const calculateStats = (fees) => {
    if (!fees || fees.length === 0) {
      setStats({ totalFees: 0, feesPaid: 0, feesDue: 0, upcoming: 0 });
      return;
    }

    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const feesPaid = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    const feesDue = fees.filter(fee => fee.status === 'due' || fee.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);
    const upcoming = fees.filter(fee => fee.status === 'due' || fee.status === 'overdue').length;

    const newStats = { totalFees, feesPaid, feesDue, upcoming };
    setStats(newStats);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage?.setItem('fees_active_tab', tab);
  };

  // Handle pay now button
  const handlePayNow = (feeId) => {
    const fee = feeDetails.find(f => f.id === feeId);
    if (!fee) return;

    const transactionId = `TXN${Math.random().toString(9).slice(2, 11)}`;
    const paymentRecord = {
      id: Date.now(),
      feeType: fee.feeType,
      amount: fee.amount,
      paymentMode: 'Credit Card',
      transactionId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };

    const updatedPaymentHistory = [paymentRecord, ...paymentHistory];
    setPaymentHistory(updatedPaymentHistory);
    localStorage?.setItem('student_payment_history', JSON.stringify(updatedPaymentHistory));

    const updatedFeeDetails = feeDetails.map(f =>
      f.id === feeId ? { ...f, status: 'paid', paidDate: new Date().toLocaleDateString() } : f
    );
    setFeeDetails(updatedFeeDetails);
    localStorage?.setItem('student_fee_details', JSON.stringify(updatedFeeDetails));

    calculateStats(updatedFeeDetails);
    alert(`Payment of $${fee.amount} successful! Transaction ID: ${transactionId}`);
  };

  // Get status badge color and label
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
          label: 'Paid',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'due':
        return {
          color: 'bg-amber-100 text-amber-700 border border-amber-300',
          label: 'Due',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-700 border border-red-300',
          label: 'Overdue',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-700',
          label: 'Unknown',
          icon: null,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-slate-600">Loading fee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Fees & Payments</h1>
          <p className="text-lg text-slate-600">Manage your fee payments and view payment history</p>
        </div>

        {/* ===== MODERN TAB SECTION ===== */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          {/* Tab Navigation Bar */}
          <div className="flex items-center bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            {/* Fees Tab */}
            <button
              onClick={() => handleTabChange('fees')}
              className={`
                flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-all duration-300 relative
                ${
                  activeTab === 'fees'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <DollarSign className="w-5 h-5" />
              Fees
              
              {/* Animated Indicator */}
              {activeTab === 'fees' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-full" />
              )}
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />

            {/* Payments Tab */}
            <button
              onClick={() => handleTabChange('payments')}
              className={`
                flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-all duration-300 relative
                ${
                  activeTab === 'payments'
                    ? 'text-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <CreditCard className="w-5 h-5" />
              Payments
              
              {/* Animated Indicator */}
              {activeTab === 'payments' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="p-8">
            {/* ===== FEES TAB CONTENT ===== */}
            {activeTab === 'fees' && (
              <div className="animate-in fade-in duration-300">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {/* Total Fees */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Total Fees</span>
                    </div>
                    <p className="text-4xl font-bold text-blue-900">${stats.totalFees}</p>
                  </div>

                  {/* Fees Paid */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Fees Paid</span>
                    </div>
                    <p className="text-4xl font-bold text-emerald-900">${stats.feesPaid}</p>
                  </div>

                  {/* Fees Due */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Fees Due</span>
                    </div>
                    <p className="text-4xl font-bold text-red-900">${stats.feesDue}</p>
                  </div>

                  {/* Upcoming */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Upcoming</span>
                    </div>
                    <p className="text-4xl font-bold text-amber-900">{stats.upcoming}</p>
                  </div>
                </div>

                {/* Fee Details Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Fee Details</h2>
                      <p className="text-slate-600 text-md mt-1">View and pay your pending fees</p>
                    </div>
                  </div>

                  {/* Fee Details Table */}
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Fee Type</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Amount</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Due Date</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeDetails.map((fee, index) => {
                            const statusBadge = getStatusBadge(fee.status);
                            return (
                              <tr
                                key={fee.id}
                                className={`${index !== feeDetails.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 transition-colors`}
                              >
                                <td className="px-6 py-4 text-left font-semibold text-slate-900">{fee.feeType}</td>
                                <td className="px-6 py-4 text-left text-slate-700">${fee.amount}</td>
                                <td className="px-6 py-4 text-left text-slate-700">{fee.dueDate}</td>
                                <td className="px-6 py-4 text-left">
                                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-md font-medium ${statusBadge.color}`}>
                                    {statusBadge.icon}
                                    {statusBadge.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-left">
                                  {fee.status === 'paid' ? (
                                    <span className="text-slate-500 font-medium">-</span>
                                  ) : (
                                    <button
                                      onClick={() => handlePayNow(fee.id)}
                                      className={`px-4 py-2 rounded-lg font-semibold text-white transition-all active:scale-95 ${
                                        fee.status === 'overdue'
                                          ? 'bg-red-600 hover:bg-red-700'
                                          : 'bg-blue-600 hover:bg-blue-700'
                                      }`}
                                    >
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
                  </div>
                </div>
              </div>
            )}

            {/* ===== PAYMENTS TAB CONTENT ===== */}
            {activeTab === 'payments' && (
              <div className="animate-in fade-in duration-300">
                {/* Payment History Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Payment History</h2>
                      <p className="text-slate-600 text-md mt-1">Your transaction records and receipts</p>
                    </div>
                  </div>

                  {/* Payment History Table */}
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Fee Type</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Amount</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Payment Mode</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Transaction ID</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Date</th>
                            <th className="px-6 py-4 text-left text-md font-semibold text-slate-900">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.length > 0 ? (
                            paymentHistory.map((payment, index) => (
                              <tr
                                key={payment.id}
                                className={`${index !== paymentHistory.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 transition-colors`}
                              >
                                <td className="px-6 py-4 text-left font-semibold text-slate-900">{payment.feeType}</td>
                                <td className="px-6 py-4 text-left text-slate-700">${payment.amount}</td>
                                <td className="px-6 py-4 text-left text-slate-700">{payment.paymentMode}</td>
                                <td className="px-6 py-4 text-left text-slate-700 font-mono text-md">{payment.transactionId}</td>
                                <td className="px-6 py-4 text-left text-slate-700">{payment.date}</td>
                                <td className="px-6 py-4 text-left">
                                  <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-semibold">
                                    <Download className="w-4 h-4" />
                                    Download
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center">
                                <p className="text-slate-500">No payment history found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}