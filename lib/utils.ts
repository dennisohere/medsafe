import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {z} from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PatientFormSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  gender: z.string().min(2).max(10),
  dateOfBirth: z.date(),
  contactAddress: z.string().min(2),
  contactPhoneNumber: z.string().min(2).max(50),
  emergencyContactName: z.string().min(2).max(50),
  emergencyContactPhone: z.string().min(2).max(50),
  emergencyContactAddress: z.string().min(2),
})

export const PhysicianFormSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  gender: z.string().min(2).max(10),
  specialty: z.string().min(2),
})

export const MedicalRecordFormSchema = z.object({
  diagnosis: z.string().min(2),
  treatment: z.string().min(2),
  physicianUserId: z.string(),
})
