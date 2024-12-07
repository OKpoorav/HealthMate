import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Search,
  Plus,
  Clock
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

type Tab = 'overview' | 'patients' | 'appointments' | 'records' | 'messages';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const user = useAuthStore((state) => state.user);

  const stats = [
    { icon: <Users />, label: 'Total Patients', value: '150' },
    { icon: <Calendar />, label: 'Today\'s Appointments', value: '8' },
    { icon: <FileText />, label: 'Pending Reports', value: '12' },
    { icon: <MessageSquare />, label: 'New Messages', value: '5' },
  ];

  const upcomingAppointments = [
    { 
      patient: 'Jane Smith',
      time: '10:00 AM',
      type: 'Check-up',
      status: 'confirmed',
      duration: '30 min'
    },
    { 
      patient: 'John Doe',
      time: '11:00 AM',
      type: 'Follow-up',
      status: 'pending',
      duration: '45 min'
    },
    { 
      patient: 'Alice Johnson',
      time: '2:30 PM',
      type: 'Consultation',
      status: 'confirmed',
      duration: '30 min'
    },
  ];

  const recentPatients = [
    {
      name: 'Sarah Wilson',
      age: 45,
      lastVisit: '2023-10-28',
      condition: 'Hypertension',
      status: 'Stable'
    },
    {
      name: 'Michael Brown',
      age: 32,
      lastVisit: '2023-10-30',
      condition: 'Diabetes',
      status: 'Review needed'
    },
    {
      name: 'Emily Davis',
      age: 28,
      lastVisit: '2023-11-01',
      condition: 'Pregnancy',
      status: 'Monitoring'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user?.name}</h1>
          <p className="text-gray-600">Here's your practice overview</p>
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
                { id: 'overview', label: 'Overview', icon: <Users className="h-5 w-5" /> },
                { id: 'patients', label: 'Patients', icon: <Users className="h-5 w-5" /> },
                { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
                { id: 'records', label: 'Medical Records', icon: <FileText className="h-5 w-5" /> },
                { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
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
                {/* Today's Schedule */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
                  </div>
                  <div className="bg-white rounded-lg divide-y divide-gray-200">
                    {upcomingAppointments.map((apt, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{apt.patient}</p>
                          <p className="text-sm text-gray-500">{apt.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{apt.time}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Patients */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Patients</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
                  </div>
                  <div className="bg-white rounded-lg divide-y divide-gray-200">
                    {recentPatients.map((patient, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.condition}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${patient.status === 'Stable' ? 'bg-green-100 text-green-800' : 
                              patient.status === 'Review needed' ? 'bg-red-100 text-red-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative flex-1 max-w-lg">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-4">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Patient
                  </button>
                </div>
                {/* Add patient list content */}
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Appointment Calendar</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Clock className="h-5 w-5 mr-2" />
                    Schedule Appointment
                  </button>
                </div>
                {/* Add calendar content */}
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative flex-1 max-w-lg">
                    <input
                      type="text"
                      placeholder="Search medical records..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {/* Add medical records content */}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                {/* Add messages content */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
