import React from 'react';
import { UserProfile } from '@/lib/types/user';

interface PatientProfileProps {
  user: UserProfile;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Patient Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Type</label>
              <p className="mt-1 text-gray-900">
                {user.healthProfile?.bloodType || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Health Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
              <div className="mt-1">
                {user.healthProfile?.conditions?.length ? (
                  <ul className="list-disc list-inside text-gray-900">
                    {user.healthProfile.conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-900">No conditions listed</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medications</label>
              <div className="mt-1">
                {user.healthProfile?.medications?.length ? (
                  <ul className="list-disc list-inside text-gray-900">
                    {user.healthProfile.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-900">No medications listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default PatientProfile;