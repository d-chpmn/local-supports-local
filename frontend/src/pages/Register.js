import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    brokerage: '',
    license_number: '',
    donation_amount_per_transaction: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.donation_amount_per_transaction || parseFloat(formData.donation_amount_per_transaction) < 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    setLoading(true);

    // Remove confirmPassword before sending
    const { confirmPassword, ...registrationData } = formData;

    const result = await register(registrationData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-primary">
            Become a Foundation Member
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-secondary hover:text-secondary-dark">
              Sign in
            </Link>
          </p>
        </div>

        <form className="bg-white p-8 rounded-lg shadow-md space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="label">
                  First Name *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="input"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="label">
                  Last Name *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className="input"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="label">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="brokerage" className="label">
                  Brokerage
                </label>
                <input
                  id="brokerage"
                  name="brokerage"
                  type="text"
                  className="input"
                  value={formData.brokerage}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="license_number" className="label">
                  License Number
                </label>
                <input
                  id="license_number"
                  name="license_number"
                  type="text"
                  className="input"
                  value={formData.license_number}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Donation Commitment */}
          <div className="bg-secondary bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-4">Donation Commitment</h3>
            <div>
              <label htmlFor="donation_amount_per_transaction" className="label">
                Donation Amount Per Closed Transaction * ($)
              </label>
              <input
                id="donation_amount_per_transaction"
                name="donation_amount_per_transaction"
                type="number"
                step="0.01"
                min="0"
                required
                className="input"
                placeholder="100.00"
                value={formData.donation_amount_per_transaction}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-600 mt-2">
                This amount will be calculated and collected monthly based on your closed transactions.
              </p>
            </div>
          </div>

          {/* Optional Bio */}
          <div>
            <label htmlFor="bio" className="label">
              Bio (Optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              className="input"
              placeholder="Tell us a bit about yourself..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Account Security</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="label">
                  Password * (minimum 8 characters)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <p className="text-xs text-center text-gray-600">
            By registering, you agree to support the Local Supports Local Foundation 
            and commit to your monthly donation based on closed transactions.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
