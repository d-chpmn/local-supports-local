import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { realtorAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    brokerage: '',
    license_number: '',
    donation_amount_per_transaction: '',
    bio: ''
  });
  const [headshot, setHeadshot] = useState(null);
  const [headshotPreview, setHeadshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        brokerage: user.brokerage || '',
        license_number: user.license_number || '',
        donation_amount_per_transaction: user.donation_amount_per_transaction || '',
        bio: user.bio || ''
      });
      if (user.headshot_url) {
        setHeadshotPreview(`${process.env.REACT_APP_API_URL}${user.headshot_url}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleHeadshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setHeadshot(file);
      setHeadshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await realtorAPI.updateProfile(formData);
      updateUser(response.data.realtor);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleHeadshotUpload = async () => {
    if (!headshot) {
      setError('Please select a file to upload');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const response = await realtorAPI.uploadHeadshot(headshot);
      setSuccess('Headshot uploaded successfully!');
      // Update user context
      const updatedUser = { ...user, headshot_url: response.data.headshot_url };
      updateUser(updatedUser);
    } catch (error) {
      setError(error.response?.data?.error || 'Error uploading headshot');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information and settings.</p>
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

      {/* Headshot Upload */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Profile Photo</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            {headshotPreview ? (
              <img
                src={headshotPreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-secondary"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block">
              <span className="label">Upload New Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeadshotChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-primary hover:file:bg-secondary-dark mt-2"
              />
            </label>
            <p className="text-sm text-gray-600 mt-2">
              Recommended: Square image, at least 400x400px. Max file size: 5MB
            </p>
            {headshot && (
              <button
                onClick={handleHeadshotUpload}
                disabled={uploading}
                className="btn btn-secondary mt-4"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form className="card" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-primary mb-4">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="first_name" className="label">
              First Name
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
              Last Name
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

        <div className="mb-6">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input bg-gray-100"
            value={user?.email || ''}
            disabled
          />
          <p className="text-sm text-gray-600 mt-1">Email cannot be changed</p>
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="label">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="input"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <h2 className="text-xl font-semibold text-primary mb-4 mt-8">Professional Information</h2>

        <div className="mb-6">
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

        <div className="mb-6">
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

        <div className="mb-6 bg-secondary bg-opacity-10 p-4 rounded-lg">
          <label htmlFor="donation_amount_per_transaction" className="label">
            Donation Amount Per Transaction ($)
          </label>
          <input
            id="donation_amount_per_transaction"
            name="donation_amount_per_transaction"
            type="number"
            step="0.01"
            min="0"
            required
            className="input"
            value={formData.donation_amount_per_transaction}
            onChange={handleChange}
          />
          <p className="text-sm text-gray-600 mt-2">
            This is the amount you commit to donate for each closed transaction.
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="bio" className="label">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            className="input"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-3 text-lg"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
