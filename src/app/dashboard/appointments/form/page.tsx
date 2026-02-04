"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, User, CheckCircle, Trash2, Stethoscope } from "lucide-react";
import { Appointment, Patient } from "@/types";
import { MOCK_PATIENTS, MOCK_DOCTORS } from "@/lib/mock-data";
import { MockAppointmentService, CreateAppointmentData } from "@/lib/services/appointment-service";

export default function AppointmentFormPage() {
    const router = useRouter();
    const params = useSearchParams();
    const { user } = useAuth();
    const appointmentId = params.get("id");
    const preselectedPatientId = params.get("patient");
    const isEditing = Boolean(appointmentId);

    const [formData, setFormData] = useState<Partial<Appointment>>({
        patientId: preselectedPatientId ?? "",
        doctorId: "",
        date: "",
        time: "",
        type: "consultation",
        status: "pending",
        visitReason: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const patients = useMemo<Patient[]>(() => MOCK_PATIENTS, []);
    const doctors = useMemo(() => MOCK_DOCTORS, []);

    useEffect(() => {
        if (!isEditing || !appointmentId) return;

        const fetchAppointment = async () => {
            try {
                const data = await MockAppointmentService.getAppointmentById(appointmentId);
                setFormData(data);
            } catch (e) {
                console.error(e);
            }
        };

        fetchAppointment();
    }, [isEditing, appointmentId]);

    const validate = () => {
        const next: Record<string, string> = {};
        if (!formData.patientId?.trim()) next.patientId = "Patient is required";
        if (!formData.doctorId?.trim()) next.doctorId = "Doctor is required";
        if (!formData.date?.trim()) next.date = "Date is required";
        if (!formData.time?.trim()) next.time = "Time is required";
        if (!formData.type?.trim()) next.type = "Type is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (field: keyof Appointment, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const selectedPatient = patients.find((p) => p.id === formData.patientId);
            const patientName = selectedPatient
                ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                : undefined;

            if (isEditing && formData.id) {
                await MockAppointmentService.updateAppointment({
                    id: formData.id,
                    patientId: formData.patientId!,
                    patientName,
                    doctorId: formData.doctorId!,
                    date: formData.date!,
                    time: formData.time!,
                    type: formData.type as Appointment["type"],
                    visitReason: formData.visitReason,
                    notes: formData.notes ?? "",
                    status: formData.status as Appointment["status"],
                });
            } else {
                await MockAppointmentService.createAppointment({
                    patientId: formData.patientId!,
                    patientName,
                    doctorId: formData.doctorId!,
                    date: formData.date!,
                    time: formData.time!,
                    type: formData.type as Appointment["type"],
                    visitReason: formData.visitReason,
                    notes: formData.notes ?? "",
                });
            }
            router.push("/dashboard/appointments");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) return;
        if (!confirm("Are you sure you want to delete this appointment?")) return;
        setIsDeleting(true);
        try {
            await MockAppointmentService.deleteAppointment(formData.id);
            router.push("/dashboard/appointments");
        } catch (e) {
            console.error(e);
            setIsDeleting(false);
        }
    };

    const selectedPatient = patients.find((p) => p.id === formData.patientId);
    const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

    // Only allow reception to create/edit appointments
    if (user?.role !== "receptionist" && user?.role !== "admin") {
        return (
            <div className="flex flex-col h-full">
                <Header
                    title="Access Denied"
                    description="You don't have permission to access this page"
                />
                <div className="flex-1 flex items-center justify-center">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-gray-600">Only reception staff can create or edit appointments.</p>
                            <Button onClick={() => router.back()} className="mt-4">
                                Go Back
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title={isEditing ? "Edit Appointment" : "New Appointment"}
                description={isEditing ? "Update appointment details" : "Schedule a new patient appointment"}
            />

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>{isEditing ? "Edit Appointment" : "New Appointment"}</CardTitle>
                                    <CardDescription>
                                        {isEditing ? "Adjust appointment information" : "Fill out the form to schedule an appointment"}
                                    </CardDescription>
                                </div>
                                {isEditing && (
                                    <div className="ml-auto">
                                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Appointment Details */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="patient" className="text-sm font-medium">Patient *</label>
                                            <Select value={formData.patientId ?? ""} onValueChange={(v) => handleChange("patientId", v)}>
                                                <SelectTrigger id="patient">
                                                    <SelectValue placeholder="Select patient" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {patients.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.firstName} {p.lastName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.patientId && <p className="text-sm text-red-500">{errors.patientId}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="doctor" className="text-sm font-medium">Doctor *</label>
                                            <Select value={formData.doctorId ?? ""} onValueChange={(v) => handleChange("doctorId", v)}>
                                                <SelectTrigger id="doctor">
                                                    <SelectValue placeholder="Select doctor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {doctors.map((d) => (
                                                        <SelectItem key={d.id} value={d.id}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{d.name}</span>
                                                                {d.specialization && (
                                                                    <span className="text-xs text-gray-500">
                                                                        ({d.specialization})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.doctorId && <p className="text-sm text-red-500">{errors.doctorId}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="date" className="text-sm font-medium">Date *</label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={formData.date ?? ""}
                                                onChange={(e) => handleChange("date", e.target.value)}
                                            />
                                            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="time" className="text-sm font-medium">Time *</label>
                                            <Input
                                                id="time"
                                                type="time"
                                                value={formData.time ?? ""}
                                                onChange={(e) => handleChange("time", e.target.value)}
                                            />
                                            {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="type" className="text-sm font-medium">Appointment Type *</label>
                                            <Select value={formData.type ?? "consultation"} onValueChange={(v) => handleChange("type", v)}>
                                                <SelectTrigger id="type">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="consultation">Consultation</SelectItem>
                                                    <SelectItem value="follow-up">Follow-up</SelectItem>
                                                    <SelectItem value="emergency">Emergency</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <label htmlFor="visitReason" className="text-sm font-medium">Visit Reason</label>
                                        <Input
                                            id="visitReason"
                                            placeholder="e.g., Annual checkup, Follow-up on test results"
                                            value={formData.visitReason ?? ""}
                                            onChange={(e) => handleChange("visitReason", e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500">Brief description of the visit purpose</p>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <label htmlFor="notes" className="text-sm font-medium">Internal Notes</label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Add any additional notes (internal only)..."
                                            value={formData.notes ?? ""}
                                            onChange={(e) => handleChange("notes", e.target.value)}
                                            className="min-h-[90px]"
                                        />
                                        <p className="text-xs text-gray-500">
                                            These notes are for internal use only and not visible to patients
                                        </p>
                                    </div>
                                </div>

                                {/* Status (only when editing) */}
                                {isEditing && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Status</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="status" className="text-sm font-medium">Appointment Status</label>
                                                <Select value={formData.status ?? "pending"} onValueChange={(v) => handleChange("status", v)}>
                                                    <SelectTrigger id="status">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        {formData.status === "cancelled" && formData.cancelReason && (
                                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm font-medium text-red-800">Cancellation Reason:</p>
                                                <p className="text-sm text-red-700 mt-1">{formData.cancelReason}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Submit */}
                                <div className="flex gap-4 pt-2">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                {isEditing ? "Update Appointment" : "Create Appointment"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Quick Summary */}
                    {(selectedPatient || selectedDoctor) && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedPatient && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Patient Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {selectedPatient.firstName} {selectedPatient.lastName}
                                            </p>
                                            <p className="text-xs text-gray-600">{selectedPatient.phone}</p>
                                            <p className="text-xs text-gray-600">{selectedPatient.email}</p>
                                        </div>
                                        {selectedPatient.medicalHistory.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-1">
                                                    Medical History:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedPatient.medicalHistory.map((condition) => (
                                                        <Badge key={condition} variant="secondary" className="text-xs">
                                                            {condition}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {selectedDoctor && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4" />
                                            Doctor Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <p className="text-sm font-medium">{selectedDoctor.name}</p>
                                        {selectedDoctor.specialization && (
                                            <p className="text-xs text-gray-600">
                                                Specialization: {selectedDoctor.specialization}
                                            </p>
                                        )}
                                        {selectedDoctor.department && (
                                            <p className="text-xs text-gray-600">
                                                Department: {selectedDoctor.department}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-600">{selectedDoctor.email}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}