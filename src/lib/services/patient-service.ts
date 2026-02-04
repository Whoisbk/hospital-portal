import { Patient } from "@/types";

// In a real application, these would be actual API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface CreatePatientData {
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
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

export class PatientService {
  static async getPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`);
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  }

  static async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch patient");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  }

  static async createPatient(data: CreatePatientData): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  }

  static async updatePatient(data: UpdatePatientData): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  }

  static async deletePatient(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  }

  static async searchPatients(query: string): Promise<Patient[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/patients/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to search patients");
      }
      return await response.json();
    } catch (error) {
      console.error("Error searching patients:", error);
      throw error;
    }
  }
}

// Mock implementation for development/testing
export class MockPatientService {
  static async getPatients(): Promise<Patient[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  }

  static async getPatientById(id: string): Promise<Patient> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Return mock data for now
    return {
      id,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      dateOfBirth: "1985-03-15",
      address: "123 Main St, Anytown, AT 12345",
      medicalHistory: ["Hypertension", "Type 2 Diabetes"],
      emergencyContact: {
        name: "Jane Doe",
        phone: "+1-555-0124",
        relationship: "Spouse",
      },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-07-20T14:30:00Z",
    };
  }

  static async createPatient(data: CreatePatientData): Promise<Patient> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async updatePatient(data: UpdatePatientData): Promise<Patient> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...data,
      updatedAt: new Date().toISOString(),
    } as Patient;
  }

  static async deletePatient(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  static async searchPatients(query: string): Promise<Patient[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  }
}
