import { useAuthStore } from '../store/authStore';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor';
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  specialization?: string; // for doctors
  licenseNumber?: string; // for doctors
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
}

export class UserService {
  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users/${userId}/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 