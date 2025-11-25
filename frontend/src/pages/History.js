import React, { useState, useEffect } from 'react';
import { transactionAPI, donationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('donations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      let transactionsRes, donationsRes;
      
      // If admin, fetch all transactions/donations, otherwise fetch for current realtor only
      if (user?.is_admin) {
        [transactionsRes, donationsRes] = await Promise.all([
          api.get('/api/admin/transactions'),
          api.get('/api/admin/donations')
        ]);
      } else {
        [transactionsRes, donationsRes] = await Promise.all([
          transactionAPI.getHistory(),
          donationAPI.getHistory()
        ]);
      }

      setTransactions(transactionsRes.data.transactions);
      setDonations(donationsRes.data.donations);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">History</h1>
        <p className="text-gray-600 mt-2">View your donation and transaction history.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('donations')}
            className={`py-3 px-4 font-medium transition-colors ${
              activeTab === 'donations'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Donations ({donations.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3 px-4 font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Transactions ({transactions.length})
          </button>
        </div>
      </div>

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div className="card">
          {donations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {user?.is_admin && <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Realtor</th>}
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Period</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {user?.is_admin && (
                        <td className="py-3 px-4 text-sm">
                          <div className="font-medium">{donation.realtor_name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{donation.realtor_email}</div>
                        </td>
                      )}
                      <td className="py-3 px-4 text-sm">
                        {new Date(donation.paid_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {donation.transaction 
                          ? `${months[donation.transaction.month - 1]} ${donation.transaction.year}`
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-primary">
                        ${parseFloat(donation.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">
                        {donation.payment_method?.replace('_', ' ') || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          donation.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {donation.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {donation.payment_reference || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p>No donation history yet</p>
            </div>
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="card">
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {user?.is_admin && <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Realtor</th>}
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Period</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Closed Deals</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Donation Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {user?.is_admin && (
                        <td className="py-3 px-4 text-sm">
                          <div className="font-medium">{transaction.realtor_name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{transaction.realtor_email}</div>
                        </td>
                      )}
                      <td className="py-3 px-4 text-sm font-medium text-primary">
                        {months[transaction.month - 1]} {transaction.year}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {transaction.closed_transactions_count}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-secondary">
                        ${parseFloat(transaction.calculated_donation_amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(transaction.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No transaction history yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
