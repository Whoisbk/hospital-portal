"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User,
    CheckCircle,
    Trash2,
    AlertCircle,
    ArrowLeft,
    Phone,
    Activity,
    X,
    Plus,
    UserPlus,
} from "lucide-react";
import { Patient } from "@/types";
import { PatientDetailView } from "./components/patient-detail-view";
import { MockPatientService } from "@/lib/services/patient-service";
import Header from "@/components/layout/header";

export default function PatientFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get("id");
    const isEditing = !!patientId;

    const [formData, setFormData] = useState<Partial<Patient>>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        medicalHistory: [],
        emergencyContact: {
            name: "",
            phone: "",
            relationship: "",
        },
    });

    const [newMedicalCondition, setNewMedicalCondition] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        if (isEditing && patientId) {
            const fetchPatient = async () => {
                try {
                    const patient = await MockPatientService.getPatientById(patientId);
                    setFormData(patient);
                    setIsViewMode(true);
                } catch (error) {
                    console.error("Error fetching patient:", error);
                }
            };
            fetchPatient();
        }
    }, [patientId, isEditing]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.address?.trim()) newErrors.address = "Address is required";
        if (!formData.emergencyContact?.name?.trim()) newErrors.emergencyContactName = "Contact name is required";
        if (!formData.emergencyContact?.phone?.trim()) newErrors.emergencyContactPhone = "Contact phone is required";
        if (!formData.emergencyContact?.relationship?.trim()) newErrors.emergencyContactRelationship = "Relationship is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            if (isEditing && formData.id) {
                await MockPatientService.updatePatient({
                    id: formData.id,
                    firstName: formData.firstName!,
                    lastName: formData.lastName!,
                    email: formData.email!,
                    phone: formData.phone!,
                    dateOfBirth: formData.dateOfBirth!,
                    address: formData.address!,
                    medicalHistory: formData.medicalHistory ?? [],
                    emergencyContact: formData.emergencyContact!,
                });
            } else {
                await MockPatientService.createPatient({
                    firstName: formData.firstName!,
                    lastName: formData.lastName!,
                    email: formData.email!,
                    phone: formData.phone!,
                    dateOfBirth: formData.dateOfBirth!,
                    address: formData.address!,
                    medicalHistory: formData.medicalHistory ?? [],
                    emergencyContact: formData.emergencyContact!,
                });
            }
            router.push("/dashboard/patients");
        } catch (error) {
            console.error("Error saving patient:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) return;
        if (!confirm("Are you sure you want to delete this patient?")) return;
        setIsDeleting(true);
        try {
            await MockPatientService.deletePatient(formData.id);
            router.push("/dashboard/patients");
        } catch (error) {
            console.error("Error deleting patient:", error);
            setIsDeleting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleEmergencyContactChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContact: { ...prev.emergencyContact!, [field]: value },
        }));
        const errorKey = `emergencyContact${field.charAt(0).toUpperCase() + field.slice(1)}`;
        if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    };

    const addMedicalCondition = () => {
        if (newMedicalCondition.trim() && !formData.medicalHistory?.includes(newMedicalCondition.trim())) {
            setFormData((prev) => ({
                ...prev,
                medicalHistory: [...(prev.medicalHistory || []), newMedicalCondition.trim()],
            }));
            setNewMedicalCondition("");
        }
    };

    const removeMedicalCondition = (condition: string) => {
        setFormData((prev) => ({
            ...prev,
            medicalHistory: prev.medicalHistory?.filter((c) => c !== condition) || [],
        }));
    };

    const handleMedicalConditionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addMedicalCondition();
        }
    };

    if (isViewMode && formData.id) {
        return (
            <div className="container mx-auto py-6">
                <PatientDetailView
                    patient={formData as Patient}
                    onEdit={() => setIsViewMode(false)}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-muted/30">
            <Header
                title={isEditing ? "Edit Patient" : "New Patient"}
                description={isEditing ? "Update patient information" : "Register a new patient in the system"}
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
                                            <UserPlus className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {isEditing ? "Edit Patient" : "Register Patient"}
                                            </CardTitle>
                                            <CardDescription>
                                                {isEditing
                                                    ? "Modify existing patient details"
                                                    : "Fill in the details to register a new patient"}
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
                                    {/* Personal Information */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                                Personal Information
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">
                                                    First Name <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    value={formData.firstName ?? ""}
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                    className={errors.firstName ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.firstName && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.firstName}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">
                                                    Last Name <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Doe"
                                                    value={formData.lastName ?? ""}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                    className={errors.lastName ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.lastName && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.lastName}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john.doe@email.com"
                                                    value={formData.email ?? ""}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    className={errors.email ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.email && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">
                                                    Phone Number <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+1-555-0123"
                                                    value={formData.phone ?? ""}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    className={errors.phone ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.phone && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth">
                                                    Date of Birth <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="dateOfBirth"
                                                    type="date"
                                                    value={formData.dateOfBirth ?? ""}
                                                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                                    className={errors.dateOfBirth ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.dateOfBirth && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.dateOfBirth}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-5">
                                            <Label htmlFor="address">
                                                Address <span className="text-destructive">*</span>
                                            </Label>
                                            <Textarea
                                                id="address"
                                                placeholder="123 Main St, Anytown, AT 12345"
                                                value={formData.address ?? ""}
                                                onChange={(e) => handleInputChange("address", e.target.value)}
                                                className={`resize-none min-h-[80px] ${errors.address ? "border-destructive ring-destructive/20" : ""}`}
                                            />
                                            {errors.address && (
                                                <p className="text-xs text-destructive flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    <Separator />

                                    {/* Emergency Contact */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                                Emergency Contact
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="emergencyContactName">
                                                    Contact Name <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="emergencyContactName"
                                                    placeholder="Jane Doe"
                                                    value={formData.emergencyContact?.name ?? ""}
                                                    onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                                                    className={errors.emergencyContactName ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.emergencyContactName && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.emergencyContactName}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="emergencyContactPhone">
                                                    Contact Phone <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="emergencyContactPhone"
                                                    type="tel"
                                                    placeholder="+1-555-0124"
                                                    value={formData.emergencyContact?.phone ?? ""}
                                                    onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                                                    className={errors.emergencyContactPhone ? "border-destructive ring-destructive/20" : ""}
                                                />
                                                {errors.emergencyContactPhone && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.emergencyContactPhone}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="emergencyContactRelationship">
                                                    Relationship <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.emergencyContact?.relationship ?? ""}
                                                    onValueChange={(v) => handleEmergencyContactChange("relationship", v)}
                                                >
                                                    <SelectTrigger
                                                        id="emergencyContactRelationship"
                                                        className={errors.emergencyContactRelationship ? "border-destructive ring-destructive/20" : ""}
                                                    >
                                                        <SelectValue placeholder="Select relationship" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="spouse">Spouse</SelectItem>
                                                        <SelectItem value="parent">Parent</SelectItem>
                                                        <SelectItem value="child">Child</SelectItem>
                                                        <SelectItem value="sibling">Sibling</SelectItem>
                                                        <SelectItem value="friend">Friend</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.emergencyContactRelationship && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.emergencyContactRelationship}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    <Separator />

                                    {/* Medical History */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                                Medical History
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="medicalCondition">
                                                    Known Conditions, Allergies & Medications
                                                </Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="medicalCondition"
                                                        value={newMedicalCondition}
                                                        onChange={(e) => setNewMedicalCondition(e.target.value)}
                                                        placeholder="e.g., Hypertension, Penicillin allergy"
                                                        onKeyDown={handleMedicalConditionKeyDown}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={addMedicalCondition}
                                                        className="shrink-0 flex items-center gap-1.5"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Add
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Press Enter or click Add to include each condition
                                                </p>
                                            </div>

                                            {formData.medicalHistory && formData.medicalHistory.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {formData.medicalHistory.map((condition) => (
                                                        <Badge
                                                            key={condition}
                                                            variant="secondary"
                                                            className="flex items-center gap-1 text-xs font-normal pr-1"
                                                        >
                                                            {condition}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMedicalCondition(condition)}
                                                                className="ml-0.5 rounded hover:text-destructive transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </section>

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
                                                    {isEditing ? "Update Patient" : "Register Patient"}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Emergency Contact Preview */}
                        {formData.emergencyContact?.name && (
                            <Card className="shadow-sm border-border/60">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                                            <Phone className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        Emergency Contact
                                    </CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 space-y-2">
                                    <p className="text-sm font-semibold text-foreground">
                                        {formData.emergencyContact.name}
                                    </p>
                                    {formData.emergencyContact.phone && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Phone className="h-3 w-3" />
                                            <span>{formData.emergencyContact.phone}</span>
                                        </div>
                                    )}
                                    {formData.emergencyContact.relationship && (
                                        <Badge variant="outline" className="text-xs font-normal capitalize">
                                            {formData.emergencyContact.relationship}
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
