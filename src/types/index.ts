export interface User {
  id: string;
  name: string;
  email: string;
  role: "receptionist" | "doctor" | "admin";
  avatar?: string;
  specialization?: string; // For doctors
  department?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string; // Optional for quick display
  doctorId: string;
  date: string;
  time: string;
  type: "consultation" | "follow-up" | "emergency";
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  visitReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // User ID who created the appointment
  cancelReason?: string; // Reason for cancellation
  sessionStartTime?: string; // When doctor started the session
  sessionEndTime?: string; // When doctor ended the session
}

export interface ConsultationNote {
  id: string;
  appointmentId: string;
  doctorId: string;
  notes: string;
  diagnosis?: string;
  treatment?: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  createdAt: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  testType: string;
  status: "requested" | "in-progress" | "completed";
  results?: string;
  requestedAt: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  appointmentId?: string; // Optional: link to specific appointment
  category?: "general" | "appointment" | "urgent"; // Message category
  readAt?: string; // When message was read
}

export interface BillingRecord {
  id: string;
  patientId: string;
  appointmentId: string;
  amount: number;
  description: string;
  status: "pending" | "paid" | "overdue";
  createdAt: string;
  paidAt?: string;
}
