import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';

const Hero = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // In a real app, navigate to dashboard
      console.log('Navigate to dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section id="home" className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Medical Records, Simplified
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              HealthMate provides seamless, secure access to your medical reports, 
              connecting patients with their healthcare information efficiently.
            </p>
            <button 
              onClick={handleGetStarted}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
              alt="Medical Professional"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {[
            {
              icon: <FileText className="h-8 w-8 text-blue-600" />,
              title: "Easy Report Access",
              description: "Access and manage your medical documents anytime, anywhere."
            },
            {
              icon: <Shield className="h-8 w-8 text-blue-600" />,
              title: "Secure Sharing",
              description: "Share your medical information securely with healthcare providers."
            },
            {
              icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
              title: "Direct Communication",
              description: "Connect directly with your healthcare team through our platform."
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl 
              transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;