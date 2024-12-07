import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-blue-50 rounded-lg p-6 text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <h4 className="text-lg font-semibold text-blue-600 mb-2">{label}</h4>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default StatCard;