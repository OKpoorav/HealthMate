import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  MessageSquare, 
  Brain, 
  Calendar, 
  Bell 
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Smart Document Management",
      description: "Upload and organize medical records with AI-powered categorization and instant search capabilities."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Enhanced Security",
      description: "Bank-level encryption ensures your medical data remains private and secure at all times."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Seamless Communication",
      description: "Connect with healthcare providers through secure messaging and virtual consultations."
    },
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI Health Insights",
      description: "Receive personalized health recommendations based on your medical history and lifestyle."
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Appointment Management",
      description: "Schedule and manage medical appointments with automated reminders and calendar integration."
    },
    {
      icon: <Bell className="h-8 w-8 text-blue-600" />,
      title: "Smart Notifications",
      description: "Get timely reminders for medications, appointments, and preventive health checks."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Better Health Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience healthcare management reimagined with our comprehensive suite of features
            designed to make your health journey seamless and efficient.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;