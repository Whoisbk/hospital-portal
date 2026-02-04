import { Patient } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Phone, Mail, MapPin, User, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockPatientService } from "@/lib/services/patient-service";

interface PatientDetailViewProps {
    readonly patient: Patient;
    readonly onEdit: () => void;
}

export function PatientDetailView({ patient, onEdit }: PatientDetailViewProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        try {
            await MockPatientService.deletePatient(patient.id);
            router.push("/dashboard/patients");
        } catch (error) {
            console.error("Error deleting patient:", error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with patient info and edit button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                            {patient.firstName[0]}{patient.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {patient.firstName} {patient.lastName}
                        </h1>
                        <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onEdit} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Patient
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic patient details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="font-medium">{formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years)</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{patient.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{patient.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{patient.address}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medical History */}
            <Card>
                <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                    <CardDescription>Relevant medical conditions and history</CardDescription>
                </CardHeader>
                <CardContent>
                    {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {patient.medicalHistory.map((condition) => (
                                <Badge key={condition} variant="secondary">
                                    {condition}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No medical conditions recorded</p>
                    )}
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
                <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                    <CardDescription>Contact information for emergency situations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="font-medium">{patient.emergencyContact.name}</p>
                            <p className="text-sm text-gray-500">{patient.emergencyContact.relationship}</p>
                            <p className="text-sm text-gray-500">{patient.emergencyContact.phone}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>Record creation and update timestamps</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">{formatDate(patient.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Last Updated</p>
                            <p className="font-medium">{formatDate(patient.updatedAt)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/patients")}
                >
                    Back to Patients
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <a href={`/dashboard/appointments?patient=${patient.id}`}>
                            Schedule Appointment
                        </a>
                    </Button>
                    <Button asChild>
                        <a href={`/dashboard/consultations?patient=${patient.id}`}>
                            View Medical Records
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
} 