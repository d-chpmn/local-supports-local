import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Local Supports Local
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              A 501(c)(3) Foundation Helping Families Achieve Homeownership
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Realtors supporting their community by providing down payment grants 
              to deserving homebuyers, one transaction at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-block bg-secondary text-primary hover:bg-secondary-dark px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/apply"
                    className="inline-block bg-secondary text-primary hover:bg-secondary-dark px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                  >
                    Apply for Grant
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg border-2 border-white"
                  >
                    Realtor Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Sign Up</h3>
              <p className="text-gray-600">
                Register as a foundation member and commit to a donation amount per closed transaction.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Report Monthly</h3>
              <p className="text-gray-600">
                Each month, report your closed transactions. We'll calculate your donation automatically.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Make Impact</h3>
              <p className="text-gray-600">
                Submit your donation and help families achieve their dream of homeownership. Share your impact on social media!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Why Join?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                <svg className="w-6 h-6 mr-2 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Give Back to Your Community
              </h3>
              <p className="text-gray-600">
                Help deserving families overcome down payment barriers and achieve homeownership.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                <svg className="w-6 h-6 mr-2 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Marketing Benefits
              </h3>
              <p className="text-gray-600">
                Showcase your community involvement with shareable social media graphics and recognition.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                <svg className="w-6 h-6 mr-2 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Easy Management
              </h3>
              <p className="text-gray-600">
                Simple dashboard to track your donations, submit transactions, and manage payments.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                <svg className="w-6 h-6 mr-2 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tax Deductible
              </h3>
              <p className="text-gray-600">
                Your donations are tax-deductible as we are a registered 501(c)(3) nonprofit organization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8">
            Join Local Supports Local today and start helping families achieve their homeownership dreams.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/apply"
                className="inline-block bg-secondary text-primary hover:bg-secondary-dark px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              >
                Apply for Grant
              </Link>
              <Link
                to="/register"
                className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg border-2 border-white"
              >
                Become a Realtor Member
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">© 2024 Local Supports Local Foundation. A 501(c)(3) nonprofit organization.</p>
          <p className="text-gray-400">
            Powered by{' '}
            <a href="https://localmortgage.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary-light">
              Local Mortgage
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
