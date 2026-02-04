import { Appointment } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export interface CreateAppointmentData {
  patientId: string;
  patientName?: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: Appointment["type"];
  visitReason?: string;
  notes?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  id: string;
  status?: Appointment["status"];
  cancelReason?: string;
}

export interface RescheduleAppointmentData {
  id: string;
  date: string;
  time: string;
  notes?: string;
}

export class AppointmentService {
  static async getAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    if (!response.ok) throw new Error("Failed to fetch appointments");
    return response.json();
  }

  static async getAppointmentById(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`);
    if (!response.ok) throw new Error("Failed to fetch appointment");
    return response.json();
  }

  static async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/appointments/doctor/${doctorId}`);
    if (!response.ok) throw new Error("Failed to fetch doctor appointments");
    return response.json();
  }

  static async createAppointment(
    data: CreateAppointmentData
  ): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create appointment");
    return response.json();
  }

  static async updateAppointment(
    data: UpdateAppointmentData
  ): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update appointment");
    return response.json();
  }

  static async confirmAppointment(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to confirm appointment");
    return response.json();
  }

  static async rescheduleAppointment(
    data: RescheduleAppointmentData
  ): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${data.id}/reschedule`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to reschedule appointment");
    return response.json();
  }

  static async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error("Failed to cancel appointment");
    return response.json();
  }

  static async deleteAppointment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete appointment");
  }

  static async startSession(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/start-session`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to start session");
    return response.json();
  }

  static async endSession(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/end-session`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to end session");
    return response.json();
  }
}

export class MockAppointmentService {
  static async getAppointmentById(id: string): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 300));
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return {
      id,
      patientId: "1",
      patientName: "John Doe",
      doctorId: "2",
      date: `${yyyy}-${mm}-${dd}`,
      time: "12:00",
      type: "consultation",
      status: "pending",
      visitReason: "General checkup",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async createAppointment(
    data: CreateAppointmentData
  ): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 700));
    return {
      id: Math.random().toString(36).slice(2),
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async updateAppointment(
    data: UpdateAppointmentData
  ): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 700));
    return {
      id: data.id,
      patientId: data.patientId ?? "1",
      patientName: data.patientName,
      doctorId: data.doctorId ?? "2",
      date: data.date ?? new Date().toISOString().slice(0, 10),
      time: data.time ?? "09:00",
      type: (data.type as Appointment["type"]) ?? "consultation",
      status: (data.status as Appointment["status"]) ?? "pending",
      visitReason: data.visitReason,
      notes: data.notes ?? "",
      cancelReason: data.cancelReason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async confirmAppointment(id: string): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 500));
    return this.updateAppointment({ id, status: "confirmed" });
  }

  static async rescheduleAppointment(
    data: RescheduleAppointmentData
  ): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 700));
    return this.updateAppointment({
      id: data.id,
      date: data.date,
      time: data.time,
      notes: data.notes,
      status: "pending",
    });
  }

  static async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 500));
    return this.updateAppointment({
      id,
      status: "cancelled",
      cancelReason: reason,
    });
  }

  static async deleteAppointment(_id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
  }

  static async startSession(id: string): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 500));
    return this.updateAppointment({
      id,
      status: "in-progress",
    });
  }

  static async endSession(id: string): Promise<Appointment> {
    await new Promise((r) => setTimeout(r, 500));
    return this.updateAppointment({
      id,
      status: "completed",
    });
  }
}
