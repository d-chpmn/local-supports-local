import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SocialShare = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const shareMessage = `I'm proud to support Local Supports Local Foundation, helping families achieve their dream of homeownership! 🏡❤️ #LocalSupportsLocal #Homeownership #CommunityFirst`;

  const handleShare = (platform) => {
    const url = 'https://localmortgage.com/local-supports-local';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareMessage)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        break;
    }
  };

  const handleDownload = () => {
    // In production, this would generate and download a custom image
    alert('Download feature will be implemented with image generation in production');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-primary">Thank You!</h1>
        <p className="text-gray-600 mt-2">Your donation has been received successfully.</p>
      </div>

      {/* Thank You Card */}
      <div className="card mb-8 text-center">
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Impact Matters</h2>
          <p className="text-lg mb-2">
            Thank you, {user?.first_name} {user?.last_name}!
          </p>
          <p className="text-gray-200">
            Your generosity is helping families achieve their dream of homeownership.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">🏡</div>
            <p className="text-sm text-gray-600">Supporting Local Families</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">💝</div>
            <p className="text-sm text-gray-600">Building Stronger Communities</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">✨</div>
            <p className="text-sm text-gray-600">Creating Opportunities</p>
          </div>
        </div>
      </div>

      {/* Social Share Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">Share Your Impact</h2>
        <p className="text-gray-600 mb-6">
          Let your network know about your commitment to helping families achieve homeownership. 
          Share your support for Local Supports Local on social media!
        </p>

        {/* Preview Message */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-sm text-gray-700 italic">{shareMessage}</p>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Share on Facebook
          </button>

          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center justify-center px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Share on Twitter
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Share on LinkedIn
          </button>
        </div>

        {/* Download Marketing Image */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-primary mb-3">Download Marketing Image</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get a custom graphic to share on your social media platforms and marketing materials.
          </p>
          <button
            onClick={handleDownload}
            className="btn btn-secondary"
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Image
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
