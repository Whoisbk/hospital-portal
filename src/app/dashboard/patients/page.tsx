'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import Header from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, User, Phone, Mail, Calendar, MapPin, Plus } from 'lucide-react'
import { MOCK_PATIENTS } from '@/lib/mock-data'

export default function PatientsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = MOCK_PATIENTS.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const email = patient.email.toLowerCase()
    const phone = patient.phone.toLowerCase()

    return fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase())
  })

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Patients"
        description={user?.role === 'doctor' ? "View patient records and medical history" : "Manage patient information and records"}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {user?.role === 'receptionist' && (
            <Button className="flex items-center gap-2" asChild>
              <a href="/dashboard/patients/form">
                <Plus className="h-4 w-4" />
                Add New Patient
              </a>
            </Button>
          )}
        </div>

        {/* Patients Table */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No patients found matching your search' : 'No patients registered'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>
                Manage patient information and medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Medical History</TableHead>
                    <TableHead>Emergency Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {patient.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {calculateAge(patient.dateOfBirth)} years
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-[150px]">{patient.address}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {patient.medicalHistory.slice(0, 2).map((condition) => (
                              <Badge key={condition} variant="secondary" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                            {patient.medicalHistory.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{patient.medicalHistory.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{patient.emergencyContact.name}</div>
                          <div className="text-gray-500">
                            {patient.emergencyContact.relationship}
                          </div>
                          <div className="text-gray-500">{patient.emergencyContact.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" asChild>
                            <a href={`/dashboard/patients/form?id=${patient.id}`}>
                              View Details
                            </a>
                          </Button>

                          {user?.role === 'doctor' && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`/dashboard/consultations?patient=${patient.id}`}>
                                Add Notes
                              </a>
                            </Button>
                          )}

                          {user?.role === 'receptionist' && (
                            <>
                              <Button size="sm" variant="outline" asChild>
                                <a href={`/dashboard/appointments?patient=${patient.id}`}>
                                  Schedule
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={`/dashboard/patients/form?id=${patient.id}`}>
                                  Edit
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{MOCK_PATIENTS.length}</div>
              <p className="text-xs text-gray-500">Registered in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">2</div>
              <p className="text-xs text-gray-500">Recently registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">With Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_PATIENTS.filter(p => p.medicalHistory.length > 0).length}
              </div>
              <p className="text-xs text-gray-500">Have medical history</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 