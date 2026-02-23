import { Patient } from "@/types"
export type { Patient }

export interface Doctor {
  id: string
  name: string
  specialization: string
  email: string
}

export interface MessageUser {
  id: string
  name: string
  email: string
  role: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
  category?: 'general' | 'appointment' | 'urgent'
  appointmentId?: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  type: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  notes: string
  doctor: string
  visitReason?: string
}

export interface PrescriptionMedication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface Prescription {
  id: string
  patientId: string
  appointmentId: string
  createdAt: string
  medications: PrescriptionMedication[]
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-03-15',
    address: '123 Maple St, Springfield',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: { name: 'Linda Wilson', phone: '(555) 123-0001', relationship: 'Spouse' },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 'p2',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1992-08-22',
    address: '456 Oak Ave, Shelbyville',
    medicalHistory: ['Asthma'],
    emergencyContact: { name: 'Tom Davis', phone: '(555) 234-0002', relationship: 'Brother' },
    createdAt: '2024-02-14T08:00:00Z',
    updatedAt: '2024-07-18T10:00:00Z',
  },
  {
    id: 'p3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1978-11-05',
    address: '789 Pine Rd, Capital City',
    medicalHistory: ['High Cholesterol', 'Back Pain'],
    emergencyContact: { name: 'Carol Brown', phone: '(555) 345-0003', relationship: 'Wife' },
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-07-22T10:00:00Z',
  },
  {
    id: 'p4',
    firstName: 'Sofia',
    lastName: 'Martinez',
    email: 'sofia.martinez@email.com',
    phone: '(555) 456-7890',
    dateOfBirth: '1995-01-30',
    address: '321 Elm St, Ogdenville',
    medicalHistory: [],
    emergencyContact: { name: 'Carlos Martinez', phone: '(555) 456-0004', relationship: 'Father' },
    createdAt: '2024-04-05T08:00:00Z',
    updatedAt: '2024-07-21T10:00:00Z',
  },
  {
    id: 'p5',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@email.com',
    phone: '(555) 567-8901',
    dateOfBirth: '1968-06-12',
    address: '654 Birch Blvd, North Haverbrook',
    medicalHistory: ['Coronary Artery Disease', 'Obesity'],
    emergencyContact: { name: 'Nancy Taylor', phone: '(555) 567-0005', relationship: 'Daughter' },
    createdAt: '2024-05-20T08:00:00Z',
    updatedAt: '2024-07-19T10:00:00Z',
  },
]

// Doctor ids must match auth user ids (lib/auth.tsx) so doctor-filtered appointments work
export const MOCK_DOCTORS: Doctor[] = [
  { id: '2', name: 'Dr. Michael Chen', specialization: 'General Practice', email: 'doctor@hospital.com' },
  { id: '3', name: 'Dr. Sarah Williams', specialization: 'Cardiology', email: 'sarah.williams@hospital.com' },
  { id: '4', name: 'Dr. James Brown', specialization: 'Pediatrics', email: 'james.brown@hospital.com' },
]

// doctorId values must match auth doctor user ids (2, 3, 4) for role-based filtering
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: '2',
    date: '2026-02-04',
    time: '09:00 AM',
    type: 'follow-up',
    status: 'completed',
    notes: 'Post-surgery check-up',
    doctor: 'Dr. Michael Chen',
    visitReason: 'Post-surgery recovery assessment',
  },
  {
    id: 'a2',
    patientId: 'p2',
    doctorId: '2',
    date: '2026-02-04',
    time: '10:30 AM',
    type: 'consultation',
    status: 'in-progress',
    notes: 'Initial consultation for headaches',
    doctor: 'Dr. Michael Chen',
    visitReason: 'Recurring migraine headaches',
  },
  {
    id: 'a3',
    patientId: 'p3',
    doctorId: '2',
    date: '2026-02-04',
    time: '02:00 PM',
    type: 'check-up',
    status: 'confirmed',
    notes: 'Annual physical examination',
    doctor: 'Dr. Michael Chen',
    visitReason: 'Annual physical examination',
  },
  {
    id: 'a4',
    patientId: 'p4',
    doctorId: '2',
    date: '2026-02-04',
    time: '03:30 PM',
    type: 'lab-review',
    status: 'pending',
    notes: 'Blood work results discussion',
    doctor: 'Dr. Michael Chen',
    visitReason: 'Blood work results discussion',
  },
  {
    id: 'a5',
    patientId: 'p5',
    doctorId: '3',
    date: '2026-02-05',
    time: '09:00 AM',
    type: 'consultation',
    status: 'confirmed',
    notes: 'Heart palpitations evaluation',
    doctor: 'Dr. Sarah Williams',
    visitReason: 'Heart palpitations and chest discomfort',
  },
  {
    id: 'a6',
    patientId: 'p1',
    doctorId: '4',
    date: '2026-02-05',
    time: '11:00 AM',
    type: 'follow-up',
    status: 'pending',
    notes: 'Follow-up on medication',
    doctor: 'Dr. James Brown',
    visitReason: 'Medication adjustment review',
  },
  {
    id: 'a7',
    patientId: 'p3',
    doctorId: '2',
    date: '2026-02-06',
    time: '10:00 AM',
    type: 'check-up',
    status: 'pending',
    notes: 'Routine check-up',
    doctor: 'Dr. Michael Chen',
    visitReason: 'Routine wellness check-up',
  },
  {
    id: 'a8',
    patientId: 'p2',
    doctorId: '3',
    date: '2026-02-01',
    time: '02:30 PM',
    type: 'consultation',
    status: 'completed',
    notes: 'Initial cardiac assessment',
    doctor: 'Dr. Sarah Williams',
    visitReason: 'Cardiac assessment',
  },
  {
    id: 'a9',
    patientId: 'p4',
    doctorId: '2',
    date: '2026-01-28',
    time: '09:30 AM',
    type: 'follow-up',
    status: 'cancelled',
    notes: 'Patient requested cancellation',
    doctor: 'Dr. Michael Chen',
    visitReason: 'Follow-up consultation',
  },
]

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx1',
    patientId: 'p1',
    appointmentId: 'a1',
    createdAt: '2026-02-04T10:00:00Z',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning with food' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals' },
    ],
  },
  {
    id: 'rx2',
    patientId: 'p2',
    appointmentId: 'a8',
    createdAt: '2026-02-01T15:00:00Z',
    medications: [
      { name: 'Atenolol', dosage: '25mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take at the same time each day' },
    ],
  },
  {
    id: 'rx3',
    patientId: 'p3',
    appointmentId: 'a3',
    createdAt: '2026-02-04T14:30:00Z',
    medications: [
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take at bedtime' },
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '7 days', instructions: 'Take with food for back pain' },
    ],
  },
]

// Users that can send/receive messages (matches auth user ids: 1,2,3,4,5,6)
export const MOCK_USERS: MessageUser[] = [
  { id: '1', name: 'Sarah Johnson', email: 'receptionist@hospital.com', role: 'receptionist' },
  { id: '2', name: 'Dr. Michael Chen', email: 'doctor@hospital.com', role: 'doctor' },
  { id: '3', name: 'Dr. Sarah Williams', email: 'sarah.williams@hospital.com', role: 'doctor' },
  { id: '4', name: 'Dr. James Brown', email: 'james.brown@hospital.com', role: 'doctor' },
  { id: '5', name: 'Emma Davis', email: 'emma.davis@hospital.com', role: 'receptionist' },
  { id: '6', name: 'Admin User', email: 'admin@hospital.com', role: 'admin' },
]

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: '1',
    receiverId: '2',
    content: 'Dr. Chen, could you confirm the 9 AM slot for James Wilson tomorrow?',
    timestamp: '2026-02-03T09:00:00Z',
    read: true,
    category: 'appointment',
    appointmentId: 'a1',
  },
  {
    id: 'm2',
    senderId: '2',
    receiverId: '1',
    content: 'Confirmed. I have him down for the post-surgery check-up.',
    timestamp: '2026-02-03T09:15:00Z',
    read: true,
    category: 'appointment',
    appointmentId: 'a1',
  },
  {
    id: 'm3',
    senderId: '2',
    receiverId: '3',
    content: 'Sarah, can you take a look at the cardiac referral for Emily Davis?',
    timestamp: '2026-02-04T08:30:00Z',
    read: true,
    category: 'general',
  },
  {
    id: 'm4',
    senderId: '1',
    receiverId: '2',
    content: 'Urgent: Patient in room 4 needs immediate attention.',
    timestamp: '2026-02-04T10:45:00Z',
    read: false,
    category: 'urgent',
  },
  {
    id: 'm5',
    senderId: '3',
    receiverId: '2',
    content: 'I will review the referral and get back to you by EOD.',
    timestamp: '2026-02-04T09:00:00Z',
    read: true,
    category: 'general',
  },
]
