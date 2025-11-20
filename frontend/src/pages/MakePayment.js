import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../services/api';

const MakePayment = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingDonations();
  }, []);

  const fetchPendingDonations = async () => {
    try {
      const response = await donationAPI.getPending();
      setPending(response.data.pending);
      if (response.data.pending.length > 0) {
        setSelectedTransaction(response.data.pending[0]);
      }
    } catch (error) {
      console.error('Error fetching pending donations:', error);
      setError('Error loading pending donations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTransaction) {
      setError('Please select a transaction');
      return;
    }

    setSubmitting(true);

    try {
      await donationAPI.submitPayment({
        transaction_id: selectedTransaction.id,
        payment_method: paymentMethod,
        payment_reference: `Payment-${Date.now()}`
      });

      setSuccess('Payment submitted successfully! Thank you for your contribution.');
      
      setTimeout(() => {
        navigate('/donations/share');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error processing payment');
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

  if (pending.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-primary mb-4">All Caught Up!</h2>
          <p className="text-gray-600 mb-6">You have no pending donations at this time.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
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
        <h1 className="text-3xl font-bold text-primary">Make a Payment</h1>
        <p className="text-gray-600 mt-2">Submit your monthly donation to support families in need.</p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-6">
          {success}
        </div>
      )}

      <form className="card" onSubmit={handleSubmitPayment}>
        <h2 className="text-xl font-semibold text-primary mb-4">Select Transaction</h2>
        
        <div className="space-y-3 mb-6">
          {pending.map((transaction) => (
            <label
              key={transaction.id}
              className={`block border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedTransaction?.id === transaction.id
                  ? 'border-secondary bg-secondary bg-opacity-5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="transaction"
                value={transaction.id}
                checked={selectedTransaction?.id === transaction.id}
                onChange={() => setSelectedTransaction(transaction)}
                className="mr-3"
              />
              <span className="font-medium text-primary">
                {months[transaction.month - 1]} {transaction.year}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600">
                {transaction.closed_transactions_count} transaction{transaction.closed_transactions_count !== 1 ? 's' : ''}
              </span>
              <span className="float-right font-bold text-secondary">
                ${parseFloat(transaction.calculated_donation_amount).toFixed(2)}
              </span>
            </label>
          ))}
        </div>

        {selectedTransaction && (
          <>
            <div className="bg-primary bg-opacity-5 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Donation Amount:</span>
                <span className="text-3xl font-bold text-primary">
                  ${parseFloat(selectedTransaction.calculated_donation_amount).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                This donation is based on {selectedTransaction.closed_transactions_count} closed transaction{selectedTransaction.closed_transactions_count !== 1 ? 's' : ''} in {months[selectedTransaction.month - 1]} {selectedTransaction.year}.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-primary mb-4">Payment Method</h2>
            
            <div className="mb-6">
              <label className="block mb-3">
                <input
                  type="radio"
                  name="payment_method"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                Credit/Debit Card
              </label>
              <label className="block mb-3">
                <input
                  type="radio"
                  name="payment_method"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                Bank Transfer (ACH)
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="payment_method"
                  value="check"
                  checked={paymentMethod === 'check'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                Check
              </label>
            </div>

            <div className="alert alert-info mb-6">
              <p className="font-semibold mb-2">Payment Integration Coming Soon</p>
              <p className="text-sm">
                Full payment processing with Stripe will be integrated in the production version. 
                For now, clicking "Submit Payment" will record your donation commitment.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn btn-primary py-3 text-lg"
            >
              {submitting ? 'Processing...' : `Submit Payment - $${parseFloat(selectedTransaction.calculated_donation_amount).toFixed(2)}`}
            </button>
          </>
        )}
      </form>

      <div className="mt-8 card">
        <h3 className="font-semibold text-primary mb-4">Your Impact</h3>
        <p className="text-gray-600 mb-4">
          Your generous donation helps provide down payment assistance to deserving families, 
          making homeownership dreams come true. Together, we're strengthening our community 
          one home at a time.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center mt-6">
          <div>
            <div className="text-2xl font-bold text-secondary">100%</div>
            <div className="text-sm text-gray-600">Goes to Families</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">Tax</div>
            <div className="text-sm text-gray-600">Deductible</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">501(c)(3)</div>
            <div className="text-sm text-gray-600">Nonprofit Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
