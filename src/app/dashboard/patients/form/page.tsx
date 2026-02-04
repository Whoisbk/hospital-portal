"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, User, CheckCircle } from "lucide-react";
import { Patient } from "@/types";
import { PatientDetailView } from "./components/patient-detail-view";
import { MockPatientService } from "@/lib/services/patient-service";
import Header from "@/components/layout/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isViewMode, setIsViewMode] = useState(false);

    useEffect(() => {
        if (isEditing && patientId) {
            // Fetch patient data from service
            const fetchPatient = async () => {
                try {
                    const patient = await MockPatientService.getPatientById(patientId);
                    setFormData(patient);
                    setIsViewMode(true); // Start in view mode for existing patients
                } catch (error) {
                    console.error("Error fetching patient:", error);
                    // Handle error appropriately
                }
            };

            fetchPatient();
        }
    }, [patientId, isEditing]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = "First name is required";
        }
        if (!formData.lastName?.trim()) {
            newErrors.lastName = "Last name is required";
        }
        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone?.trim()) {
            newErrors.phone = "Phone number is required";
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
        }
        if (!formData.address?.trim()) {
            newErrors.address = "Address is required";
        }
        if (!formData.emergencyContact?.name?.trim()) {
            newErrors.emergencyContactName = "Emergency contact name is required";
        }
        if (!formData.emergencyContact?.phone?.trim()) {
            newErrors.emergencyContactPhone = "Emergency contact phone is required";
        }
        if (!formData.emergencyContact?.relationship?.trim()) {
            newErrors.emergencyContactRelationship = "Emergency contact relationship is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isEditing && formData.id) {
                // Update existing patient
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
                // Create new patient
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

            // Redirect back to patients list
            router.push("/dashboard/patients");
        } catch (error) {
            console.error("Error saving patient:", error);
            // Handle error appropriately (show toast, etc.)
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleEmergencyContactChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact!,
                [field]: value,
            },
        }));

        const errorKey = `emergencyContact${field.charAt(0).toUpperCase() + field.slice(1)}`;
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: "" }));
        }
    };

    const addMedicalCondition = () => {
        if (newMedicalCondition.trim() && !formData.medicalHistory?.includes(newMedicalCondition.trim())) {
            setFormData(prev => ({
                ...prev,
                medicalHistory: [...(prev.medicalHistory || []), newMedicalCondition.trim()],
            }));
            setNewMedicalCondition("");
        }
    };

    const removeMedicalCondition = (condition: string) => {
        setFormData(prev => ({
            ...prev,
            medicalHistory: prev.medicalHistory?.filter(c => c !== condition) || [],
        }));
    };

    const handleEditMode = () => {
        setIsViewMode(false);
    };

    const handleMedicalConditionKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addMedicalCondition();
        }
    };

    // If in view mode and we have patient data, show the detail view
    if (isViewMode && formData.id) {
        return (
            <div className="container mx-auto py-6">
                <PatientDetailView
                    patient={formData as Patient}
                    onEdit={handleEditMode}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title={isEditing ? "Patient" : "New Patient"}
                description={isEditing ? "Update patient information" : "Register a new patient in the system"}
            />

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>{isEditing ? "Edit Patient" : "New Patient"}</CardTitle>
                                    <CardDescription>
                                        {isEditing ? "Update patient details below" : "Fill out the form to create a new patient"}
                                    </CardDescription>
                                </div>
                                {isEditing && (
                                    <div className="ml-auto">
                                        <Button variant="outline" onClick={() => setIsViewMode(true)}>
                                            View Details
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={formData.firstName ?? ""}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                className={errors.firstName ? "border-red-500" : ""}
                                                required
                                            />
                                            {errors.firstName && (
                                                <p className="text-sm text-red-500">{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={formData.lastName ?? ""}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                className={errors.lastName ? "border-red-500" : ""}
                                                required
                                            />
                                            {errors.lastName && (
                                                <p className="text-sm text-red-500">{errors.lastName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john.doe@email.com"
                                                value={formData.email ?? ""}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className={errors.email ? "border-red-500" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1-555-0123"
                                                value={formData.phone ?? ""}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                className={errors.phone ? "border-red-500" : ""}
                                                required
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-500">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth ?? ""}
                                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                                className={errors.dateOfBirth ? "border-red-500" : ""}
                                                required
                                            />
                                            {errors.dateOfBirth && (
                                                <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="address">Address *</Label>
                                        <Textarea
                                            id="address"
                                            placeholder="123 Main St, Anytown, AT 12345"
                                            value={formData.address ?? ""}
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                            className={errors.address ? "border-red-500" : ""}
                                            required
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="emergencyContactName">Contact Name *</Label>
                                            <Input
                                                id="emergencyContactName"
                                                type="text"
                                                placeholder="Jane Doe"
                                                value={formData.emergencyContact?.name ?? ""}
                                                onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                                                className={errors.emergencyContactName ? "border-red-500" : ""}
                                                required
                                            />
                                            {errors.emergencyContactName && (
                                                <p className="text-sm text-red-500">{errors.emergencyContactName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                                            <Input
                                                id="emergencyContactPhone"
                                                type="tel"
                                                placeholder="+1-555-0124"
                                                value={formData.emergencyContact?.phone ?? ""}
                                                onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                                                className={errors.emergencyContactPhone ? "border-red-500" : ""}
                                                required
                                            />
                                            {errors.emergencyContactPhone && (
                                                <p className="text-sm text-red-500">{errors.emergencyContactPhone}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                                            <Select
                                                value={formData.emergencyContact?.relationship ?? ""}
                                                onValueChange={(value) => handleEmergencyContactChange("relationship", value)}
                                            >
                                                <SelectTrigger>
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
                                                <p className="text-sm text-red-500">{errors.emergencyContactRelationship}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Medical History */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Medical History</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="medicalCondition">Known Conditions, Allergies, Medications</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="medicalCondition"
                                                value={newMedicalCondition}
                                                onChange={(e) => setNewMedicalCondition(e.target.value)}
                                                placeholder="Enter medical condition"
                                                onKeyDown={handleMedicalConditionKeyDown}
                                            />
                                            <Button type="button" variant="outline" size="sm" onClick={addMedicalCondition} className="flex items-center gap-2">
                                                <Plus className="h-4 w-4" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>

                                    {formData.medicalHistory && formData.medicalHistory.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.medicalHistory.map((condition) => (
                                                <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                                                    {condition}
                                                    <button type="button" onClick={() => removeMedicalCondition(condition)} className="ml-1 hover:text-red-500">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Buttons */}
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
                                                {isEditing ? "Update Patient" : "Create Patient"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 