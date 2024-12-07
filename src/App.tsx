import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Footer from './components/Footer';
import AuthPage from './pages/auth/AuthPage';
import ChatBot from './components/chat/ChatBot';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import ProfilePage from './pages/profile/ProfilePage';
import { useAuthStore } from './lib/store/authStore';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50"
      >
        <Navbar />
        <Routes>
          <Route 
            path="/auth" 
            element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} 
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                user?.role === 'doctor' ? (
                  <DoctorDashboard />
                ) : (
                  <PatientDashboard />
                )
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <Hero />
                  <Features />
                  <About />
                </>
              )
            }
          />
        </Routes>
        <Footer />
        <ChatBot />
      </motion.div>
    </Router>
  );
}

export default App;
