import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingRealtors, setPendingRealtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, realtorsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/realtors/pending')
      ]);
      setStats(statsRes.data);
      setPendingRealtors(realtorsRes.data.realtors);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const approveRealtor = async (realtorId) => {
    if (!window.confirm('Approve this realtor registration?')) return;
    
    try {
      setActionLoading(true);
      await api.post(`/api/admin/realtors/${realtorId}/approve`);
      await fetchData();
      alert('Realtor approved successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve realtor');
    } finally {
      setActionLoading(false);
    }
  };

  const denyRealtor = async (realtorId) => {
    const reason = prompt('Enter reason for denial (optional):');
    if (reason === null) return;
    
    try {
      setActionLoading(true);
      await api.post(`/api/admin/realtors/${realtorId}/deny`, { reason });
      await fetchData();
      alert('Realtor denied');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to deny realtor');
    } finally {
      setActionLoading(false);
    }
  };

  const sendMonthlyReminders = async () => {
    if (!window.confirm('Send monthly transaction report reminders to all approved realtors?')) return;
    
    try {
      setActionLoading(true);
      const response = await api.post('/api/admin/send-monthly-reminders');
      alert(`✓ ${response.data.message}\n\nEmails sent: ${response.data.emails_sent} / ${response.data.total_realtors}`);
      if (response.data.errors && response.data.errors.length > 0) {
        console.error('Email errors:', response.data.errors);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send reminders');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage realtors and grant applications</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500 text-sm mb-1">Pending Realtors</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending_realtors}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500 text-sm mb-1">Approved Realtors</div>
            <div className="text-3xl font-bold text-green-600">{stats.approved_realtors}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500 text-sm mb-1">Pending Applications</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending_applications}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500 text-sm mb-1">Total Applications</div>
            <div className="text-3xl font-bold text-primary">{stats.total_applications}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500 text-sm mb-1">Total Transactions</div>
            <div className="text-3xl font-bold text-primary">{stats.total_transactions}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500 text-sm mb-1">Total Donations</div>
            <div className="text-3xl font-bold text-secondary">${stats.total_donations.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/grant-applications"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-primary">View All Grant Applications</h3>
              <p className="text-gray-600 text-sm">Review and manage grant applications</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/admin/realtors"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-primary">View All Realtors</h3>
              <p className="text-gray-600 text-sm">Manage realtor accounts</p>
            </div>
          </div>
        </Link>

        <button
          onClick={sendMonthlyReminders}
          disabled={actionLoading}
          className="bg-gradient-to-r from-secondary to-yellow-500 text-primary rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left disabled:opacity-50"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Send Monthly Reminders</h3>
              <p className="text-primary text-sm opacity-90">Email all realtors to report transactions</p>
            </div>
          </div>
        </button>
      </div>

      {/* Pending Realtor Approvals */}
      {pendingRealtors.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-primary">Pending Realtor Approvals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brokerage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation/Trans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRealtors.map(realtor => (
                  <tr key={realtor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {realtor.first_name} {realtor.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {realtor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {realtor.brokerage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {realtor.license_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${realtor.donation_amount_per_transaction}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(realtor.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => approveRealtor(realtor.id)}
                        disabled={actionLoading}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => denyRealtor(realtor.id)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Deny
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pendingRealtors.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No pending realtor approvals</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
