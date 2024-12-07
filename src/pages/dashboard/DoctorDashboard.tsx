import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, FileText, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

const DoctorDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { icon: <Users />, label: 'Total Patients', value: '150' },
    { icon: <Calendar />, label: 'Appointments Today', value: '8' },
    { icon: <FileText />, label: 'Reports Pending', value: '12' },
    { icon: <MessageSquare />, label: 'New Messages', value: '5' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user?.name}</h1>
          <p className="text-gray-600">Here's your practice overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="text-blue-600">{stat.icon}</div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {/* Placeholder for appointments list */}
              <p className="text-gray-600">No appointments scheduled</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Patient Updates</h2>
            <div className="space-y-4">
              {/* Placeholder for patient updates */}
              <p className="text-gray-600">No recent updates</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;