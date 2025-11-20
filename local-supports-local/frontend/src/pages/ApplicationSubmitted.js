import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ApplicationSubmitted = () => {
  const location = useLocation();
  const { applicantName = 'there', applicationId = '' } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Application Submitted Successfully!
        </h1>
        
        <p className="text-xl text-gray-700 mb-2">
          Thank you, {applicantName}!
        </p>
        
        <p className="text-gray-600 mb-8">
          Your grant application has been received and is being reviewed by our team. 
          We will contact you via email with updates on your application status.
        </p>

        {applicationId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Your Application ID:</p>
            <p className="text-2xl font-mono font-bold text-primary">#{applicationId}</p>
            <p className="text-xs text-gray-500 mt-1">Please save this for your records</p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-xl font-semibold text-primary mb-4">What Happens Next?</h2>
          <div className="text-left space-y-4 max-w-lg mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-primary font-bold">
                  1
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-700">
                  Our team will review your application carefully
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-primary font-bold">
                  2
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-700">
                  You'll receive an email with the decision within 2-3 weeks
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-primary font-bold">
                  3
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-700">
                  If approved, we'll work with you on the next steps toward homeownership
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-block bg-secondary text-primary hover:bg-secondary-dark px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Questions? Contact us at <a href="mailto:info@localsupportslocal.org" className="text-secondary hover:underline">info@localsupportslocal.org</a></p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;
