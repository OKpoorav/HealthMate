import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { UserProfile } from '@/lib/types/user';
import PatientProfile from './PatientProfile';
import DoctorProfile from './DoctorProfile';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user) as UserProfile;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {user?.role === 'doctor' ? (
            <DoctorProfile user={user} />
          ) : (
            <PatientProfile user={user} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;