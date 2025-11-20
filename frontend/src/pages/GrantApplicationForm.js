import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const GrantApplicationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressValidating, setAddressValidating] = useState(false);
  
  const [formData, setFormData] = useState({
    application_type: '',
    // Applicant info
    applicant_first_name: '',
    applicant_last_name: '',
    applicant_address: '',
    applicant_city: '',
    applicant_state: '',
    applicant_zip: '',
    applicant_email: '',
    applicant_phone: '',
    applicant_birthday: '',
    applicant_story: '',
    // Submitter info (if applying for someone else)
    submitter_first_name: '',
    submitter_last_name: '',
    submitter_address: '',
    submitter_city: '',
    submitter_state: '',
    submitter_zip: '',
    submitter_email: '',
    submitter_phone: '',
    submitter_relationship: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({
      ...prev,
      [name]: formatted
    }));
  };

  const validateAddress = async (addressType) => {
    const prefix = addressType === 'applicant' ? 'applicant' : 'submitter';
    const address = formData[`${prefix}_address`];
    const city = formData[`${prefix}_city`];
    const state = formData[`${prefix}_state`];
    const zip = formData[`${prefix}_zip`];
    
    if (!address || !city || !state || !zip) {
      setError('Please fill in all address fields');
      return false;
    }
    
    setAddressValidating(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/grant-applications/validate-address`, {
        address,
        city,
        state,
        zip
      });
      
      if (response.data.success) {
        // Update form with standardized address
        setFormData(prev => ({
          ...prev,
          [`${prefix}_address`]: response.data.full_address
        }));
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Address validation failed. Please check your address.');
      return false;
    } finally {
      setAddressValidating(false);
    }
  };

  const handleApplicationTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      application_type: type
    }));
    if (type === 'self') {
      setStep(3); // Skip submitter info
    } else {
      setStep(2); // Collect submitter info
    }
  };

  const handleNext = async () => {
    setError('');
    
    if (step === 2) {
      // Validate submitter address before proceeding
      const isValid = await validateAddress('submitter');
      if (!isValid) return;
    }
    
    if (step === 3) {
      // Validate applicant address before final submission
      const isValid = await validateAddress('applicant');
      if (!isValid) return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === 3 && formData.application_type === 'self') {
      setStep(1); // Go back to selection
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Count words in story
      const wordCount = formData.applicant_story.trim().split(/\s+/).length;
      if (wordCount > 500) {
        setError('Your story must be 500 words or less');
        setLoading(false);
        return;
      }
      
      // Build full addresses
      const submissionData = {
        ...formData,
        applicant_address: formData.applicant_address,
        submitter_address: formData.application_type === 'someone_else' ? formData.submitter_address : null
      };
      
      const response = await axios.post(`${API_BASE}/grant-applications/`, submissionData);
      
      // Redirect to thank you page
      navigate('/application-submitted', { 
        state: { 
          applicationId: response.data.application.id,
          applicantName: `${formData.applicant_first_name} ${formData.applicant_last_name}`
        } 
      });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = formData.applicant_story.trim() ? formData.applicant_story.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Local Supports Local Foundation Grant Application
            </h1>
            <p className="text-gray-600">
              Thank you for your interest in the Local Supports Local Foundation! Our mission is to support homeownership in the Mid-South. 
              To get started, tell us a little about yourself.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Step 1: Application Type Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Are you applying for the grant for yourself or for others? *
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleApplicationTypeSelect('self')}
                    className="w-full text-left border-2 border-gray-300 hover:border-secondary rounded-lg p-4 transition-colors"
                  >
                    <div className="font-semibold text-primary">I am applying for myself or my household</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplicationTypeSelect('someone_else')}
                    className="w-full text-left border-2 border-gray-300 hover:border-secondary rounded-lg p-4 transition-colors"
                  >
                    <div className="font-semibold text-primary">I am applying for someone else</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Submitter Information (only if applying for someone else) */}
          {step === 2 && formData.application_type === 'someone_else' && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Since you're applying on behalf of someone else, please provide your information first.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your First Name *
                  </label>
                  <input
                    type="text"
                    name="submitter_first_name"
                    value={formData.submitter_first_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Last Name *
                  </label>
                  <input
                    type="text"
                    name="submitter_last_name"
                    value={formData.submitter_last_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Street Address *
                </label>
                <input
                  type="text"
                  name="submitter_address"
                  value={formData.submitter_address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main St"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="submitter_city"
                    value={formData.submitter_city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="submitter_state"
                    value={formData.submitter_state}
                    onChange={handleChange}
                    required
                    maxLength="2"
                    placeholder="TN"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="submitter_zip"
                    value={formData.submitter_zip}
                    onChange={handleChange}
                    required
                    maxLength="5"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="submitter_email"
                    value={formData.submitter_email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="submitter_phone"
                    value={formData.submitter_phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="(000) 000-0000"
                    maxLength="14"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Relationship to Grant Applicant *
                </label>
                <input
                  type="text"
                  name="submitter_relationship"
                  value={formData.submitter_relationship}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Parent, Spouse, Friend"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={addressValidating}
                  className="px-6 py-2 bg-secondary text-primary rounded-md hover:bg-secondary-dark transition-colors font-semibold disabled:opacity-50"
                >
                  {addressValidating ? 'Validating Address...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Applicant Information */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  Now, please provide information about the grant applicant.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant First Name *
                  </label>
                  <input
                    type="text"
                    name="applicant_first_name"
                    value={formData.applicant_first_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Last Name *
                  </label>
                  <input
                    type="text"
                    name="applicant_last_name"
                    value={formData.applicant_last_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicant Street Address *
                </label>
                <input
                  type="text"
                  name="applicant_address"
                  value={formData.applicant_address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main St"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="applicant_city"
                    value={formData.applicant_city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="applicant_state"
                    value={formData.applicant_state}
                    onChange={handleChange}
                    required
                    maxLength="2"
                    placeholder="TN"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="applicant_zip"
                    value={formData.applicant_zip}
                    onChange={handleChange}
                    required
                    maxLength="5"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Email *
                  </label>
                  <input
                    type="email"
                    name="applicant_email"
                    value={formData.applicant_email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="applicant_phone"
                    value={formData.applicant_phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="(000) 000-0000"
                    maxLength="14"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicant Date of Birth *
                </label>
                <input
                  type="date"
                  name="applicant_birthday"
                  value={formData.applicant_birthday}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell Us Your Story *
                  <span className="text-gray-500 ml-2">
                    ({wordCount}/500 words)
                  </span>
                </label>
                <textarea
                  name="applicant_story"
                  value={formData.applicant_story}
                  onChange={handleChange}
                  required
                  rows="8"
                  placeholder="Please tell us why you deserve this grant and how it would help you achieve homeownership..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-secondary focus:border-secondary"
                />
                {wordCount > 500 && (
                  <p className="text-red-600 text-sm mt-1">Story must be 500 words or less</p>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || addressValidating || wordCount > 500}
                  className="px-8 py-3 bg-secondary text-primary rounded-md hover:bg-secondary-dark transition-colors font-semibold text-lg disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : addressValidating ? 'Validating Address...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantApplicationForm;
