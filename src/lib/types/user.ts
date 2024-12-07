import { z } from 'zod';

export const userRoleSchema = z.enum(['patient', 'doctor', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const healthProfileSchema = z.object({
  conditions: z.array(z.string()),
  medications: z.array(z.string()),
  allergies: z.array(z.string()),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),
});

export type HealthProfile = z.infer<typeof healthProfileSchema>;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  healthProfile?: HealthProfile;
  specialization?: string; // For doctors
  license?: string; // For doctors
  hospital?: string; // For doctors
}