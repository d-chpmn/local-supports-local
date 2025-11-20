import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const GrantApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/grant-applications/${id}`);
      setApplication(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus, notes = '') => {
    if (!user?.is_admin) {
      alert('Only administrators can update application status');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to mark this application as ${newStatus}?`);
    if (!confirmed) return;

    try {
      setUpdating(true);
      await api.put(`/api/grant-applications/${id}/status`, {
        status: newStatus,
        admin_notes: notes
      });
      await fetchApplication();
      alert('Application status updated successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate('/grant-applications')}
          className="mt-4 text-secondary hover:text-secondary-dark"
        >
          ← Back to Applications
        </button>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/grant-applications')}
          className="text-secondary hover:text-secondary-dark mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Applications
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Application #{application.id}
            </h1>
            <p className="text-gray-600">Submitted on {formatDate(application.created_at)}</p>
          </div>
          <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(application.status)}`}>
            {application.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Applicant Information */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-primary">Applicant Information</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 font-medium">
                {application.applicant.first_name} {application.applicant.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{application.applicant.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{application.applicant.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-gray-900">{application.applicant.birthday}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">{application.applicant.address}</p>
            </div>
          </div>
        </div>

        {/* Submitter Information (if applicable) */}
        {application.submitter && (
          <>
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold text-primary">Submitted By</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900 font-medium">
                    {application.submitter.first_name} {application.submitter.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{application.submitter.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{application.submitter.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship to Applicant</label>
                  <p className="text-gray-900">{application.submitter.relationship}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{application.submitter.address}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Applicant Story */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-primary">Applicant's Story</h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {application.applicant.story}
          </p>
        </div>

        {/* Admin Notes (if any) */}
        {application.admin_notes && (
          <>
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold text-primary">Admin Notes</h2>
            </div>
            <div className="px-6 py-4 bg-yellow-50">
              <p className="text-gray-700 whitespace-pre-wrap">
                {application.admin_notes}
              </p>
              {application.reviewed_at && (
                <p className="text-sm text-gray-500 mt-2">
                  Last reviewed: {formatDate(application.reviewed_at)}
                </p>
              )}
            </div>
          </>
        )}

        {/* Admin Actions */}
        {user?.is_admin && (
          <div className="px-6 py-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-primary mb-4">Admin Actions</h3>
            <div className="flex flex-wrap gap-3">
              {application.status !== 'under_review' && (
                <button
                  onClick={() => updateStatus('under_review')}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Mark as Under Review
                </button>
              )}
              {application.status !== 'approved' && (
                <button
                  onClick={() => updateStatus('approved')}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Approve Application
                </button>
              )}
              {application.status !== 'denied' && (
                <button
                  onClick={() => {
                    const notes = prompt('Enter reason for denial (optional):');
                    if (notes !== null) {
                      updateStatus('denied', notes);
                    }
                  }}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Deny Application
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantApplicationDetail;
