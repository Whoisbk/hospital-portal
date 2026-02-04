'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import Header from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    Plus,
    Pill,
    Calendar,
    User,
    Search,
    FileText,
    Clock,
    CheckCircle
} from 'lucide-react'
import { MOCK_PRESCRIPTIONS, MOCK_PATIENTS, MOCK_APPOINTMENTS } from '@/lib/mock-data'

export default function PrescriptionsPage() {
    const { user } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState('')
    const [selectedAppointment, setSelectedAppointment] = useState('')
    const [medications, setMedications] = useState([{
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    }])

    const filteredPrescriptions = MOCK_PRESCRIPTIONS.filter(prescription => {
        const patient = MOCK_PATIENTS.find(p => p.id === prescription.patientId)
        const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : ''

        return patientName.includes(searchTerm.toLowerCase())
    })

    const availableAppointments = MOCK_APPOINTMENTS.filter(apt =>
        apt.doctorId === user?.id && apt.status === 'in-progress'
    )

    const addMedication = () => {
        setMedications([...medications, {
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        }])
    }

    const removeMedication = (index: number) => {
        if (medications.length > 1) {
            setMedications(medications.filter((_, i) => i !== index))
        }
    }

    const updateMedication = (index: number, field: string, value: string) => {
        const updated = medications.map((med, i) =>
            i === index ? { ...med, [field]: value } : med
        )
        setMedications(updated)
    }

    const handleCreatePrescription = () => {
        // In a real app, this would make an API call
        console.log('Creating prescription:', {
            patientId: selectedPatient,
            appointmentId: selectedAppointment,
            medications: medications.filter(med => med.name && med.dosage)
        })

        alert('Prescription created successfully!')
        setIsNewPrescriptionOpen(false)
        setSelectedPatient('')
        setSelectedAppointment('')
        setMedications([{
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        }])
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Prescriptions"
                description="Manage and create patient prescriptions"
            />

            <div className="flex-1 overflow-auto p-6">
                {/* Action Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by patient name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                New Prescription
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Prescription</DialogTitle>
                                <DialogDescription>
                                    Add medications for a patient consultation
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Patient and Appointment Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="patient">Patient</Label>
                                        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select patient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MOCK_PATIENTS.map(patient => (
                                                    <SelectItem key={patient.id} value={patient.id}>
                                                        {patient.firstName} {patient.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="appointment">Related Appointment</Label>
                                        <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select appointment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableAppointments.map(apt => {
                                                    const patient = MOCK_PATIENTS.find(p => p.id === apt.patientId)
                                                    return (
                                                        <SelectItem key={apt.id} value={apt.id}>
                                                            {patient?.firstName} {patient?.lastName} - {apt.date} {apt.time}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Medications */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <Label className="text-lg font-semibold">Medications</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Medication
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {medications.map((medication, index) => (
                                            <Card key={index}>
                                                <CardContent className="p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`name-${index}`}>Medication Name</Label>
                                                            <Input
                                                                id={`name-${index}`}
                                                                placeholder="e.g., Lisinopril"
                                                                value={medication.name}
                                                                onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                                                            <Input
                                                                id={`dosage-${index}`}
                                                                placeholder="e.g., 10mg"
                                                                value={medication.dosage}
                                                                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                                                            <Select
                                                                value={medication.frequency}
                                                                onValueChange={(value) => updateMedication(index, 'frequency', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select frequency" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Once daily">Once daily</SelectItem>
                                                                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                                                                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                                                                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                                                                    <SelectItem value="As needed">As needed</SelectItem>
                                                                    <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                                                                    <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                                                                    <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`duration-${index}`}>Duration</Label>
                                                            <Select
                                                                value={medication.duration}
                                                                onValueChange={(value) => updateMedication(index, 'duration', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select duration" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="7 days">7 days</SelectItem>
                                                                    <SelectItem value="10 days">10 days</SelectItem>
                                                                    <SelectItem value="14 days">14 days</SelectItem>
                                                                    <SelectItem value="30 days">30 days</SelectItem>
                                                                    <SelectItem value="60 days">60 days</SelectItem>
                                                                    <SelectItem value="90 days">90 days</SelectItem>
                                                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 space-y-2">
                                                        <Label htmlFor={`instructions-${index}`}>Special Instructions</Label>
                                                        <Textarea
                                                            id={`instructions-${index}`}
                                                            placeholder="e.g., Take with food, avoid alcohol..."
                                                            value={medication.instructions}
                                                            onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                                                            className="min-h-[60px]"
                                                        />
                                                    </div>

                                                    {medications.length > 1 && (
                                                        <div className="mt-4 flex justify-end">
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => removeMedication(index)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreatePrescription}
                                    disabled={!selectedPatient || medications.filter(med => med.name && med.dosage).length === 0}
                                >
                                    Create Prescription
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Prescriptions List */}
                <div className="grid gap-4">
                    {filteredPrescriptions.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Pill className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    {searchTerm ? 'No prescriptions found matching your search' : 'No prescriptions created yet'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredPrescriptions.map((prescription) => {
                            const patient = MOCK_PATIENTS.find(p => p.id === prescription.patientId)
                            const appointment = MOCK_APPOINTMENTS.find(a => a.id === prescription.appointmentId)

                            return (
                                <Card key={prescription.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                                    <Pill className="h-6 w-6 text-blue-600" />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold">
                                                        {patient?.firstName} {patient?.lastName}
                                                    </h3>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(prescription.createdAt).toLocaleDateString()}
                                                        </span>
                                                        {appointment && (
                                                            <span>Appointment: {appointment.date} {appointment.time}</span>
                                                        )}
                                                        <span>{prescription.medications.length} medication(s)</span>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h4 className="font-medium mb-2">Prescribed Medications:</h4>
                                                        <div className="space-y-2">
                                                            {prescription.medications.map((medication, index) => (
                                                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="font-medium">{medication.name}</span>
                                                                        <Badge variant="outline">{medication.dosage}</Badge>
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        <span className="mr-4">Frequency: {medication.frequency}</span>
                                                                        <span>Duration: {medication.duration}</span>
                                                                    </div>
                                                                    {medication.instructions && (
                                                                        <p className="text-sm text-gray-600 mt-1">
                                                                            Instructions: {medication.instructions}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Button size="sm" variant="outline">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Print
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    )}
                </div>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Total Prescriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{MOCK_PRESCRIPTIONS.length}</div>
                            <p className="text-xs text-gray-500">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">1</div>
                            <p className="text-xs text-gray-500">Prescriptions issued</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Total Medications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {MOCK_PRESCRIPTIONS.reduce((total, p) => total + p.medications.length, 0)}
                            </div>
                            <p className="text-xs text-gray-500">Prescribed</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 