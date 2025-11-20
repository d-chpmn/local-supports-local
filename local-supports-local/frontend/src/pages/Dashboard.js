import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { realtorAPI, transactionAPI, donationAPI, notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes, notificationsRes] = await Promise.all([
        realtorAPI.getStats(),
        donationAPI.getPending(),
        notificationAPI.getAll({ limit: 5 })
      ]);

      setStats(statsRes.data);
      setPending(pendingRes.data.pending);
      setNotifications(notificationsRes.data.notifications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

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
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your donation overview.</p>
      </div>

      {/* Pending Approval Notice */}
      {user && !user.is_approved && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Account Pending Approval</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Your account is currently pending administrator approval. You'll have full access once approved. We'll notify you via email when your account is activated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard Link */}
      {user?.is_admin && (
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary-dark"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Dashboard
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card stat-card-primary">
          <div className="text-sm text-gray-600 mb-1">Total Donations</div>
          <div className="text-3xl font-bold text-primary">
            ${stats?.total_donations?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="text-sm text-gray-600 mb-1">Year to Date</div>
          <div className="text-3xl font-bold text-primary">
            ${stats?.ytd_donations?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="stat-card stat-card-primary">
          <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
          <div className="text-3xl font-bold text-primary">
            {stats?.total_transactions || 0}
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="text-sm text-gray-600 mb-1">Pending Donations</div>
          <div className="text-3xl font-bold text-primary">
            ${stats?.pending_donations?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Pending Payments</h2>
            <Link to="/donations/payment" className="text-secondary hover:text-secondary-dark text-sm font-medium">
              Make Payment →
            </Link>
          </div>

          {pending && pending.length > 0 ? (
            <div className="space-y-3">
              {pending.map((transaction) => (
                <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-primary">
                        {transaction.closed_transactions_count} Transaction{transaction.closed_transactions_count !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-600">
                        Month {transaction.month}/{transaction.year}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-secondary">
                        ${parseFloat(transaction.calculated_donation_amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Amount Due</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No pending payments</p>
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Recent Notifications</h2>
          </div>

          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${
                    notification.is_read ? 'border-gray-200 bg-white' : 'border-secondary bg-secondary bg-opacity-5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-primary">{notification.subject}</div>
                      <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                      {notification.action_url && (
                        <Link
                          to={notification.action_url}
                          className="text-secondary hover:text-secondary-dark text-sm font-medium mt-2 inline-block"
                        >
                          Take Action →
                        </Link>
                      )}
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p>No notifications</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Link to="/transactions/submit" className="card-hover text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-primary mb-2">Submit Transactions</h3>
          <p className="text-gray-600 text-sm">Report your monthly closed deals</p>
        </Link>

        <Link to="/donations/payment" className="card-hover text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-primary mb-2">Make Payment</h3>
          <p className="text-gray-600 text-sm">Submit your monthly donation</p>
        </Link>

        <Link to="/history" className="card-hover text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-primary mb-2">View History</h3>
          <p className="text-gray-600 text-sm">See your donation history</p>
        </Link>
      </div>

      {/* Recent Donations */}
      {stats?.recent_donations && stats.recent_donations.length > 0 && (
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Recent Donations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm">
                      {new Date(donation.paid_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-primary">
                      ${parseFloat(donation.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm capitalize">
                      {donation.payment_method || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        donation.payment_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donation.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
