"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar as CalendarIcon,
    User,
    CheckCircle,
    Trash2,
    Stethoscope,
    Clock,
    FileText,
    AlertCircle,
    ArrowLeft,
    Phone,
    Mail,
    Activity,
} from "lucide-react";
import { Appointment } from "@/types";
import { MOCK_PATIENTS, MOCK_DOCTORS } from "@/lib/mock-data";
import { MockAppointmentService } from "@/lib/services/appointment-service";

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

    const patients = useMemo(() => MOCK_PATIENTS , []);
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
                <div className="flex-1 flex items-center justify-center p-6">
                    <Card className="max-w-md w-full border-destructive/20">
                        <CardContent className="pt-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                            </div>
                            <p className="text-muted-foreground">
                                Only reception staff can create or edit appointments.
                            </p>
                            <Button onClick={() => router.back()} variant="outline" className="mt-6">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-muted/30">
            <Header
                title={isEditing ? "Edit Appointment" : "New Appointment"}
                description={isEditing ? "Update appointment details" : "Schedule a new patient appointment"}
            />

            <div className="flex-1 overflow-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-sm border-border/60">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <CalendarIcon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {isEditing ? "Edit Appointment" : "Schedule Appointment"}
                                            </CardTitle>
                                            <CardDescription>
                                                {isEditing
                                                    ? "Modify existing appointment details"
                                                    : "Fill in the details to book a new appointment"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1.5" />
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>

                            <Separator />

                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Patient & Doctor Selection */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                                Patient & Doctor
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="patient">
                                                    Patient <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.patientId ?? ""}
                                                    onValueChange={(v) => handleChange("patientId", v)}
                                                >
                                                    <SelectTrigger
                                                        id="patient"
                                                        className={errors.patientId ? "border-destructive ring-destructive/20" : ""}
                                                    >
                                                        <SelectValue placeholder="Search or select patient..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {patients.map((p) => (
                                                            <SelectItem key={p.id} value={p.id}>
                                                                <span className="font-medium">
                                                                    {p.firstName} {p.lastName}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.patientId && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.patientId}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="doctor">
                                                    Doctor <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.doctorId ?? ""}
                                                    onValueChange={(v) => handleChange("doctorId", v)}
                                                >
                                                    <SelectTrigger
                                                        id="doctor"
                                                        className={errors.doctorId ? "border-destructive ring-destructive/20" : ""}
                                                    >
                                                        <SelectValue placeholder="Select attending doctor..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {doctors.map((d) => (
                                                            <SelectItem key={d.id} value={d.id}>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">{d.name}</span>
                                                                    {d.specialization && (
                                                                        <span className="text-xs text-muted-foreground">
                                                                            &middot; {d.specialization}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.doctorId && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.doctorId}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    <Separator />

                                    {/* Date, Time & Type */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                                Schedule & Type
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="date">
                                                    Date <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={formData.date ?? ""}
                                                    onChange={(e) => handleChange("date", e.target.value)}
                                                    className={errors.date ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.date && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.date}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="time">
                                                    Time <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="time"
                                                    type="time"
                                                    value={formData.time ?? ""}
                                                    onChange={(e) => handleChange("time", e.target.value)}
                                                    className={errors.time ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.time && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.time}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="type">
                                                    Type <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.type ?? "consultation"}
                                                    onValueChange={(v) => handleChange("type", v)}
                                                >
                                                    <SelectTrigger
                                                        id="type"
                                                        className={errors.type ? "border-destructive ring-destructive/20" : ""}
                                                    >
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="consultation">Consultation</SelectItem>
                                                        <SelectItem value="follow-up">Follow-up</SelectItem>
                                                        <SelectItem value="emergency">Emergency</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.type && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.type}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    <Separator />

                                    {/* Visit Details */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                                Visit Details
                                            </h3>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="visitReason">Visit Reason</Label>
                                                <Input
                                                    id="visitReason"
                                                    placeholder="e.g., Annual checkup, Follow-up on test results"
                                                    value={formData.visitReason ?? ""}
                                                    onChange={(e) => handleChange("visitReason", e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Brief description of why the patient is visiting
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="notes">Internal Notes</Label>
                                                <Textarea
                                                    id="notes"
                                                    placeholder="Add any additional notes for internal reference..."
                                                    value={formData.notes ?? ""}
                                                    onChange={(e) => handleChange("notes", e.target.value)}
                                                    className="min-h-[100px] resize-none"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    These notes are for internal use only and not visible to patients
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Status (only when editing) */}
                                    {isEditing && (
                                        <>
                                            <Separator />
                                            <section>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                                        Status
                                                    </h3>
                                                </div>
                                                <div className="max-w-xs">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="status">Appointment Status</Label>
                                                        <Select
                                                            value={formData.status ?? "pending"}
                                                            onValueChange={(v) => handleChange("status", v)}
                                                        >
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
                                                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                                                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium text-destructive">
                                                                Cancellation Reason
                                                            </p>
                                                            <p className="text-sm text-destructive/80 mt-1">
                                                                {formData.cancelReason}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </section>
                                        </>
                                    )}

                                    {/* Actions */}
                                    <Separator />
                                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="sm:flex-1"
                                            onClick={() => router.back()}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="sm:flex-1"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    {isEditing ? "Update Appointment" : "Schedule Appointment"}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Summary Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Patient Summary */}
                        {selectedPatient ? (
                            <Card className="shadow-sm border-border/60">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                                            <User className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        Patient Summary
                                    </CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {selectedPatient.firstName} {selectedPatient.lastName}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Phone className="h-3 w-3" />
                                            <span>{selectedPatient.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            <span>{selectedPatient.email}</span>
                                        </div>
                                    </div>
                                    {selectedPatient.medicalHistory.length > 0 && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                                    Medical History
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedPatient.medicalHistory.map((condition) => (
                                                        <Badge
                                                            key={condition}
                                                            variant="secondary"
                                                            className="text-xs font-normal"
                                                        >
                                                            {condition}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-sm border-dashed border-border/60">
                                <CardContent className="py-8 text-center">
                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Select a patient to see their summary
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Doctor Summary */}
                        {selectedDoctor ? (
                            <Card className="shadow-sm border-border/60">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                                            <Stethoscope className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        Doctor Information
                                    </CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 space-y-3">
                                    <p className="text-sm font-semibold text-foreground">{selectedDoctor.name}</p>
                                    <div className="space-y-2">
                                        {selectedDoctor.specialization && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Activity className="h-3 w-3" />
                                                <span>{selectedDoctor.specialization}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            <span>{selectedDoctor.email}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-sm border-dashed border-border/60">
                                <CardContent className="py-8 text-center">
                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <Stethoscope className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Select a doctor to see their details
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
