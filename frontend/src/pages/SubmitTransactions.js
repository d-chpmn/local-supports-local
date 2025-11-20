import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';

const SubmitTransactions = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    closed_transactions_count: '',
    month: '',
    year: ''
  });
  const [currentMonth, setCurrentMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkCurrentMonth();
  }, []);

  const checkCurrentMonth = async () => {
    try {
      const response = await transactionAPI.getCurrentMonth();
      setCurrentMonth(response.data);
      
      // Set default month/year to previous month
      if (!response.data.submitted) {
        setFormData({
          ...formData,
          month: response.data.month,
          year: response.data.year
        });
      }
    } catch (error) {
      console.error('Error checking current month:', error);
      setError('Error loading form data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.closed_transactions_count || parseInt(formData.closed_transactions_count) < 0) {
      setError('Please enter a valid number of transactions');
      return;
    }

    setSubmitting(true);

    try {
      const response = await transactionAPI.submit({
        closed_transactions_count: parseInt(formData.closed_transactions_count),
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      });

      setSuccess('Transactions submitted successfully!');
      
      // Redirect to payment page if there's a donation due
      setTimeout(() => {
        if (response.data.transaction.calculated_donation_amount > 0) {
          navigate('/donations/payment');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error submitting transactions');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Submit Monthly Transactions</h1>
        <p className="text-gray-600 mt-2">
          Report your closed transactions for {currentMonth && `${months[currentMonth.month - 1]} ${currentMonth.year}`}
        </p>
      </div>

      {currentMonth?.submitted && (
        <div className="alert alert-info mb-6">
          You've already submitted transactions for {months[currentMonth.month - 1]} {currentMonth.year}.
          You can view your submission history on your dashboard.
        </div>
      )}

      <form className="card" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            {success}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="closed_transactions_count" className="label">
            Number of Closed Transactions *
          </label>
          <input
            id="closed_transactions_count"
            name="closed_transactions_count"
            type="number"
            min="0"
            required
            className="input"
            placeholder="Enter number of closed deals"
            value={formData.closed_transactions_count}
            onChange={handleChange}
            disabled={currentMonth?.submitted}
          />
          <p className="text-sm text-gray-600 mt-2">
            Enter the total number of transactions you closed during this period.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="month" className="label">
              Month *
            </label>
            <select
              id="month"
              name="month"
              required
              className="input"
              value={formData.month}
              onChange={handleChange}
              disabled={currentMonth?.submitted}
            >
              <option value="">Select Month</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="label">
              Year *
            </label>
            <select
              id="year"
              name="year"
              required
              className="input"
              value={formData.year}
              onChange={handleChange}
              disabled={currentMonth?.submitted}
            >
              <option value="">Select Year</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-secondary bg-opacity-10 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-primary mb-2">Donation Preview</h3>
          <p className="text-sm text-gray-600">
            Based on your committed donation amount, your calculated donation will be displayed here after entering the number of transactions.
          </p>
        </div>

        {!currentMonth?.submitted && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn btn-primary py-3 text-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Transactions'}
          </button>
        )}

        {currentMonth?.submitted && (
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full btn btn-outline py-3 text-lg"
          >
            Return to Dashboard
          </button>
        )}
      </form>

      <div className="mt-8 card">
        <h3 className="font-semibold text-primary mb-4">What Happens Next?</h3>
        <ol className="space-y-3 text-gray-600">
          <li className="flex">
            <span className="mr-3 font-bold text-secondary">1.</span>
            <span>Your donation amount will be automatically calculated based on your transactions and committed per-transaction amount.</span>
          </li>
          <li className="flex">
            <span className="mr-3 font-bold text-secondary">2.</span>
            <span>You'll receive a notification with your donation amount and a link to make payment.</span>
          </li>
          <li className="flex">
            <span className="mr-3 font-bold text-secondary">3.</span>
            <span>After payment, you'll receive a thank you message and a shareable social media graphic.</span>
          </li>
          <li className="flex">
            <span className="mr-3 font-bold text-secondary">4.</span>
            <span>Your contribution helps deserving families achieve their dream of homeownership!</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default SubmitTransactions;
