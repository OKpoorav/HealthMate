import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Activity, 
  Bell, 
  Settings, 
  Upload,
  Clock,
  Heart
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

type Tab = 'overview' | 'records' | 'appointments' | 'health' | 'settings';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const user = useAuthStore((state) => state.user);

  const stats = [
    { icon: <FileText />, label: 'Medical Records', value: '12' },
    { icon: <Calendar />, label: 'Upcoming Appointments', value: '2' },
    { icon: <Activity />, label: 'Health Score', value: '85%' },
    { icon: <Bell />, label: 'Notifications', value: '3' },
  ];

  const recentDocuments = [
    { name: 'Blood Test Results', date: '2023-11-01', type: 'Lab Report' },
    { name: 'X-Ray Report', date: '2023-10-28', type: 'Radiology' },
    { name: 'Prescription', date: '2023-10-25', type: 'Medication' },
  ];

  const upcomingAppointments = [
    { doctor: 'Dr. Smith', date: '2023-11-15', time: '10:00 AM', type: 'Check-up' },
    { doctor: 'Dr. Johnson', date: '2023-11-20', time: '2:30 PM', type: 'Follow-up' },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', trend: 'stable' },
    { label: 'Heart Rate', value: '72 bpm', trend: 'improving' },
    { label: 'Weight', value: '70 kg', trend: 'stable' },
    { label: 'Sleep', value: '7.5 hrs', trend: 'declining' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Manage your health information and appointments</p>
        </div>

        {/* Stats Overview */}
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

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', label: 'Overview', icon: <Activity className="h-5 w-5" /> },
                { id: 'records', label: 'Medical Records', icon: <FileText className="h-5 w-5" /> },
                { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
                { id: 'health', label: 'Health Tracking', icon: <Heart className="h-5 w-5" /> },
                { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-sm font-medium text-center
                    hover:bg-gray-50 focus:z-10 focus:outline-none
                    ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 border-b-2 border-transparent'}
                  `}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Documents */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h3>
                  <div className="bg-white rounded-lg divide-y divide-gray-200">
                    {recentDocuments.map((doc, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type}</p>
                        </div>
                        <p className="text-sm text-gray-500">{doc.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
                  <div className="bg-white rounded-lg divide-y divide-gray-200">
                    {upcomingAppointments.map((apt, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{apt.doctor}</p>
                          <p className="text-sm text-gray-500">{apt.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{apt.date}</p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Health Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {healthMetrics.map((metric, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">{metric.label}</p>
                        <p className="text-lg font-medium text-gray-900">{metric.value}</p>
                        <p className={`text-sm ${
                          metric.trend === 'improving' ? 'text-green-500' : 
                          metric.trend === 'declining' ? 'text-red-500' : 
                          'text-gray-500'
                        }`}>
                          {metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Medical Records</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Document
                  </button>
                </div>
                {/* Add medical records content */}
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Clock className="h-5 w-5 mr-2" />
                    Schedule New
                  </button>
                </div>
                {/* Add appointments content */}
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Health Tracking</h3>
                {/* Add health tracking content */}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                {/* Add settings content */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 