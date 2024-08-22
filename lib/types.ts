import {BigNumber} from "ethers";

export interface IPatientData {
    userId?: string | undefined;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    contactAddress: string;
    contactPhoneNumber: string;
    emergencyContactName: string;
    emergencyContactAddress: string;
    emergencyContactPhone: string;
}

export interface IPhysicianData {
    userId?: string | undefined;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    specialty: string;
}

export type AllowedAuthNavLink = 'Home' | 'Medical Records' | 'Patients';

export interface IAuthNavLink {
    label: AllowedAuthNavLink;
    iconPath: string;
}

export interface IMedicalRecord {
    diagnosis: string;
    treatment: string;
    timestamp: Date;
}

