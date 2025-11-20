import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SubmitTransactions from './pages/SubmitTransactions';
import MakePayment from './pages/MakePayment';
import History from './pages/History';
import SocialShare from './pages/SocialShare';
import GrantApplicationForm from './pages/GrantApplicationForm';
import ApplicationSubmitted from './pages/ApplicationSubmitted';
import GrantApplications from './pages/GrantApplications';
import GrantApplicationDetail from './pages/GrantApplicationDetail';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Loading from './components/Loading';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/apply" element={<GrantApplicationForm />} />
      <Route path="/application-submitted" element={<ApplicationSubmitted />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/transactions/submit" element={<PrivateRoute><SubmitTransactions /></PrivateRoute>} />
      <Route path="/donations/payment" element={<PrivateRoute><MakePayment /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/donations/share" element={<PrivateRoute><SocialShare /></PrivateRoute>} />
      <Route path="/grant-applications" element={<PrivateRoute><GrantApplications /></PrivateRoute>} />
      <Route path="/grant-applications/:id" element={<PrivateRoute><GrantApplicationDetail /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/realtors" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
