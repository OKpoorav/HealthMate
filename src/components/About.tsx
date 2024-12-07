import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';

const About = () => {
  const navigate = useNavigate();
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      value: "100,000+",
      label: "Active Users",
      description: "Trust HealthMate for their medical record management"
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      value: "99.9%",
      label: "Uptime",
      description: "Ensuring your medical data is always accessible"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      value: "5M+",
      label: "Documents Processed",
      description: "Securely stored and managed through our platform"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About HealthMate
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're on a mission to revolutionize healthcare management by making medical
            information accessible, secure, and easy to understand for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-blue-50 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Commitment to Your Health
              </h3>
              <p className="text-gray-600 mb-6">
                At HealthMate, we believe that everyone deserves access to their medical
                information in a format they can understand and use effectively. Our
                platform is built with the latest technology to ensure security,
                accessibility, and ease of use.
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                  transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Learn More
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80"
                alt="Medical Team"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;