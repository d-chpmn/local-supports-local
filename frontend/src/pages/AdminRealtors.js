import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const AdminRealtors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [realtors, setRealtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, approved, pending, denied

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/dashboard');
      return;
    }
    fetchRealtors();
  }, [user]);

  const fetchRealtors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/realtors');
      setRealtors(response.data.realtors);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load realtors');
    } finally {
      setLoading(false);
    }
  };

  const approveRealtor = async (realtorId) => {
    if (!window.confirm('Approve this realtor?')) return;
    
    try {
      await api.post(`/api/admin/realtors/${realtorId}/approve`);
      await fetchRealtors();
      alert('Realtor approved successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve realtor');
    }
  };

  const denyRealtor = async (realtorId) => {
    const reason = prompt('Enter reason for denial (optional):');
    if (reason === null) return;
    
    try {
      await api.post(`/api/admin/realtors/${realtorId}/deny`, { reason });
      await fetchRealtors();
      alert('Realtor denied');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to deny realtor');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      denied: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredRealtors = realtors.filter(realtor => {
    if (filter === 'all') return true;
    return realtor.approval_status === filter;
  });

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">All Realtors</h1>
          <p className="text-gray-600">Manage realtor accounts</p>
        </div>
        <Link
          to="/admin"
          className="btn btn-secondary"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({realtors.length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'approved' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approved ({realtors.filter(r => r.approval_status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'pending' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({realtors.filter(r => r.approval_status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('denied')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'denied' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Denied ({realtors.filter(r => r.approval_status === 'denied').length})
        </button>
      </div>

      {/* Realtors Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Donation Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {filteredRealtors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No realtors found
                  </td>
                </tr>
              ) : (
                filteredRealtors.map((realtor) => (
                  <tr key={realtor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {realtor.first_name} {realtor.last_name}
                        {realtor.is_admin && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{realtor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{realtor.brokerage || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{realtor.license_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${parseFloat(realtor.donation_amount_per_transaction).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(realtor.approval_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(realtor.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {realtor.approval_status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveRealtor(realtor.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => denyRealtor(realtor.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deny
                          </button>
                        </div>
                      )}
                      {realtor.approval_status === 'denied' && (
                        <button
                          onClick={() => approveRealtor(realtor.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                      )}
                      {realtor.approval_status === 'approved' && !realtor.is_admin && (
                        <button
                          onClick={() => denyRealtor(realtor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRealtors;
