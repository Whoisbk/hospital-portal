'use client'

import { useAuth } from '@/lib/auth'
import Header from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Calendar, 
  ClipboardList,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from '@/lib/mock-data'

export default function DashboardPage() {
    const { user } = useAuth()

      const todayAppointments = MOCK_APPOINTMENTS.filter(apt => {
    const today = new Date().toISOString().split('T')[0]
    return apt.date === '2024-07-22' // Using mock date for demo
  })

  const totalPatients = MOCK_PATIENTS.length

    if (user?.role === 'receptionist') {
        return (
            <div className="flex flex-col h-full">
                <Header
                    title="Receptionist Dashboard"
                    description="Manage patients, appointments, and billing"
                />

                <div className="flex-1 overflow-auto p-6">
                              {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  3 scheduled, 1 in progress
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Unread conversations
                </p>
              </CardContent>
            </Card>
          </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upcoming Appointments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Today&apos;s Appointments</CardTitle>
                                <CardDescription>Manage and track patient appointments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {todayAppointments.map((appointment) => {
                                        const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
                                        return (
                                            <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                                        <Clock className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
                                                        <p className="text-sm text-gray-500">{appointment.time} - {appointment.type}</p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={appointment.status === 'completed' ? 'default' :
                                                        appointment.status === 'in-progress' ? 'secondary' : 'outline'}
                                                >
                                                    {appointment.status}
                                                </Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                                <Button className="w-full mt-4" asChild>
                                    <a href="/dashboard/appointments">View All Appointments</a>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks and shortcuts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col gap-2" asChild>
                    <a href="/dashboard/patients/register">
                      <Users className="h-6 w-6" />
                      Register Patient
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <a href="/dashboard/appointments">
                      <Calendar className="h-6 w-6" />
                      Schedule Appointment
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <a href="/dashboard/patients">
                      <Users className="h-6 w-6" />
                      View Patients
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <a href="/dashboard/messages">
                      <MessageSquare className="h-6 w-6" />
                      Messages
                    </a>
                  </Button>
                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Doctor Dashboard
    return (
        <div className="flex flex-col h-full">
            <Header
                title="Doctor Dashboard"
                description="Manage patients, consultations, and medical records"
            />

            <div className="flex-1 overflow-auto p-6">
                        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                1 completed, 2 pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                In your care
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Unread conversations
              </p>
            </CardContent>
          </Card>
        </div>

                {/* Today's Schedule and Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Today's Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Today&apos;s Schedule</CardTitle>
                            <CardDescription>Your appointments for today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {todayAppointments.map((appointment) => {
                                    const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
                                    return (
                                        <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                                    <Clock className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
                                                    <p className="text-sm text-gray-500">{appointment.time} - {appointment.notes}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={appointment.status === 'completed' ? 'default' :
                                                    appointment.status === 'in-progress' ? 'secondary' : 'outline'}
                                            >
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    )
                                })}
                            </div>
                            <Button className="w-full mt-4" asChild>
                                <a href="/dashboard/appointments">View All Appointments</a>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common medical tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2" asChild>
                  <a href="/dashboard/appointments">
                    <Calendar className="h-6 w-6" />
                    View Appointments
                  </a>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                  <a href="/dashboard/patients">
                    <Users className="h-6 w-6" />
                    Patient Records
                  </a>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                  <a href="/dashboard/messages">
                    <MessageSquare className="h-6 w-6" />
                    Messages
                  </a>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                  <a href="/dashboard">
                    <ClipboardList className="h-6 w-6" />
                    Dashboard
                  </a>
                </Button>
              </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 