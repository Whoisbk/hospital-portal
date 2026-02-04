'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle, User } from 'lucide-react'

export default function PatientRegistrationPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        medicalHistory: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // In a real app, this would make an API call to save the patient
        console.log('Registering patient:', formData)

        setIsSubmitting(false)

        // Show success and redirect
        alert('Patient registered successfully!')
        router.push('/dashboard/patients')
    }

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Patient Registration"
                description="Register a new patient in the system"
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
                                    <CardTitle>New Patient Registration</CardTitle>
                                    <CardDescription>
                                        Fill out the form below to register a new patient
                                    </CardDescription>
                                </div>
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
                                                value={formData.firstName}
                                                onChange={(e) => updateFormData('firstName', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={(e) => updateFormData('lastName', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john.doe@email.com"
                                                value={formData.email}
                                                onChange={(e) => updateFormData('email', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1-555-0123"
                                                value={formData.phone}
                                                onChange={(e) => updateFormData('phone', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="address">Address *</Label>
                                        <Textarea
                                            id="address"
                                            placeholder="123 Main St, Anytown, AT 12345"
                                            value={formData.address}
                                            onChange={(e) => updateFormData('address', e.target.value)}
                                            required
                                        />
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
                                                value={formData.emergencyContactName}
                                                onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                                            <Input
                                                id="emergencyContactPhone"
                                                type="tel"
                                                placeholder="+1-555-0124"
                                                value={formData.emergencyContactPhone}
                                                onChange={(e) => updateFormData('emergencyContactPhone', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                                            <Select
                                                value={formData.emergencyContactRelationship}
                                                onValueChange={(value) => updateFormData('emergencyContactRelationship', value)}
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
                                        </div>
                                    </div>
                                </div>

                                {/* Medical History */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Medical History</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="medicalHistory">Known Conditions, Allergies, Medications</Label>
                                        <Textarea
                                            id="medicalHistory"
                                            placeholder="List any known medical conditions, allergies, or current medications..."
                                            value={formData.medicalHistory}
                                            onChange={(e) => updateFormData('medicalHistory', e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => router.back()}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Register Patient
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
    )
} 