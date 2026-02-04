'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import Header from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Plus, 
  CheckCircle, 
  XCircle, 
  CalendarClock, 
  MessageSquare, 
  AlertCircle,
  List,
  CalendarDays
} from 'lucide-react'
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS } from '@/lib/mock-data'
import { MockAppointmentService } from '@/lib/services/appointment-service'
import { AppointmentsCalendar } from '@/components/appointments/appointments-calendar'

type ViewMode = 'list' | 'calendar'
type CalendarView = 'week' | 'day'

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [calendarView, setCalendarView] = useState<CalendarView>('week')
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredAppointments = MOCK_APPOINTMENTS.filter(appointment => {
    const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
    const patientName = `${patient?.firstName} ${patient?.lastName}`.toLowerCase()

    const matchesSearch = searchTerm === '' || patientName.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    const matchesDate = selectedDate === '' || appointment.date === selectedDate
    const matchesDoctor = doctorFilter === 'all' || appointment.doctorId === doctorFilter

    // For doctors, only show their appointments
    if (user?.role === 'doctor') {
      return appointment.doctorId === user.id && matchesSearch && matchesStatus && matchesDate
    }

    return matchesSearch && matchesStatus && matchesDate && matchesDoctor
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'confirmed': return 'default'
      case 'in-progress': return 'default'
      case 'pending': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />
      case 'confirmed': return <CheckCircle className="h-3 w-3" />
      case 'in-progress': return <Clock className="h-3 w-3" />
      case 'pending': return <Clock className="h-3 w-3" />
      case 'cancelled': return <XCircle className="h-3 w-3" />
      default: return null
    }
  }

  const handleConfirm = async (appointmentId: string) => {
    setLoading(true)
    try {
      await MockAppointmentService.confirmAppointment(appointmentId)
      alert('Appointment confirmed!')
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert('Failed to confirm appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleStartSession = async (appointmentId: string) => {
    setLoading(true)
    try {
      await MockAppointmentService.startSession(appointmentId)
      alert('Session started!')
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert('Failed to start session')
    } finally {
      setLoading(false)
    }
  }

  const handleEndSession = async (appointmentId: string) => {
    setLoading(true)
    try {
      await MockAppointmentService.endSession(appointmentId)
      alert('Session completed!')
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert('Failed to end session')
    } finally {
      setLoading(false)
    }
  }

  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return
    setLoading(true)
    try {
      await MockAppointmentService.rescheduleAppointment({
        id: selectedAppointment,
        date: rescheduleDate,
        time: rescheduleTime,
      })
      alert('Appointment rescheduled!')
      setIsRescheduleOpen(false)
      setSelectedAppointment(null)
      setRescheduleDate('')
      setRescheduleTime('')
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert('Failed to reschedule appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedAppointment) return
    setLoading(true)
    try {
      await MockAppointmentService.cancelAppointment(selectedAppointment, cancelReason)
      alert('Appointment cancelled')
      setIsCancelOpen(false)
      setSelectedAppointment(null)
      setCancelReason('')
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert('Failed to cancel appointment')
    } finally {
      setLoading(false)
    }
  }

  const openRescheduleDialog = (appointmentId: string, currentDate: string, currentTime: string) => {
    setSelectedAppointment(appointmentId)
    setRescheduleDate(currentDate)
    setRescheduleTime(currentTime)
    setIsRescheduleOpen(true)
  }

  const openCancelDialog = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setIsCancelOpen(true)
  }

  const todayAppointments = filteredAppointments.filter(apt => apt.date === '2026-02-04')
  const upcomingAppointments = filteredAppointments.filter(apt => apt.date > '2026-02-04')
  const pastAppointments = filteredAppointments.filter(apt => apt.date < '2026-02-04')

  return (
    <div className="flex flex-col h-full">
      <Header
        title={user?.role === 'doctor' ? "My Appointments" : "Appointments Management"}
        description={user?.role === 'doctor' ? "View and manage your patient appointments" : "Schedule and manage all patient appointments"}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Action Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {user?.role === 'receptionist' && (
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {MOCK_DOCTORS.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-[180px]"
            />

            {user?.role === 'receptionist' && (
              <Button className="flex items-center gap-2" asChild>
                <a href="/dashboard/appointments/form">
                  <Plus className="h-4 w-4" />
                  New Appointment
                </a>
              </Button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                List
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                Calendar
              </Button>
            </div>

            {viewMode === 'calendar' && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={calendarView === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('day')}
                >
                  Day
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appointments Calendar</CardTitle>
                    <CardDescription>
                      {user?.role === 'doctor' ? 'Your scheduled appointments' : 'All appointments'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-amber-500"></div>
                        <span>Pending</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span>Confirmed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-purple-500"></div>
                        <span>In Progress</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-green-500"></div>
                        <span>Completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-red-500"></div>
                        <span>Cancelled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AppointmentsCalendar
                  appointments={filteredAppointments}
                  view={calendarView}
                  onEventClick={(appointment) => {
                    const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
                    const doctor = MOCK_DOCTORS.find(d => d.id === appointment.doctorId)
                    alert(`Appointment Details:\n\nPatient: ${patient?.firstName} ${patient?.lastName}\nDoctor: ${doctor?.name}\nTime: ${appointment.time}\nReason: ${appointment.visitReason || appointment.type}\nStatus: ${appointment.status}`)
                  }}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          /* List View - Appointments Tabs */
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today ({todayAppointments.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {todayAppointments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No appointments scheduled for today</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Today&apos;s Appointments</CardTitle>
                    <CardDescription>
                      Manage today&apos;s patient appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Visit Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {todayAppointments.map((appointment) => {
                          const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
                          const doctor = MOCK_DOCTORS.find(d => d.id === appointment.doctorId)
                          return (
                            <TableRow key={appointment.id}>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">{appointment.time}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <User className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {patient?.firstName} {patient?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {patient?.phone}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{doctor?.name}</div>
                                  {doctor?.specialization && (
                                    <div className="text-xs text-gray-500">{doctor.specialization}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {appointment.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px] truncate">
                                  {appointment.visitReason ?? '-'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(appointment.status)} className="flex items-center gap-1 w-fit">
                                  {getStatusIcon(appointment.status)}
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {user?.role === 'doctor' && appointment.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleConfirm(appointment.id)}
                                      disabled={loading}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Accept
                                    </Button>
                                  )}

                                  {user?.role === 'doctor' && appointment.status === 'confirmed' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleStartSession(appointment.id)}
                                      disabled={loading}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Clock className="h-4 w-4 mr-1" />
                                      Start Session
                                    </Button>
                                  )}

                                  {user?.role === 'doctor' && appointment.status === 'in-progress' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleEndSession(appointment.id)}
                                      disabled={loading}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      End Session
                                    </Button>
                                  )}

                                  {(user?.role === 'doctor' || user?.role === 'receptionist') && appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'in-progress' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openCancelDialog(appointment.id)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  )}

                                  {user?.role === 'receptionist' && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={`/dashboard/messages?appointment=${appointment.id}`}>
                                        <MessageSquare className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Future scheduled appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Visit Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingAppointments.map((appointment) => {
                          const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
                          const doctor = MOCK_DOCTORS.find(d => d.id === appointment.doctorId)
                          return (
                            <TableRow key={appointment.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{appointment.date}</div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {appointment.time}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                    <User className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {patient?.firstName} {patient?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {patient?.phone}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{doctor?.name}</div>
                                  {doctor?.specialization && (
                                    <div className="text-xs text-gray-500">{doctor.specialization}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {appointment.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px] truncate">
                                  {appointment.visitReason ?? '-'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(appointment.status)} className="flex items-center gap-1 w-fit">
                                  {getStatusIcon(appointment.status)}
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {user?.role === 'doctor' && appointment.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleConfirm(appointment.id)}
                                      disabled={loading}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Accept
                                    </Button>
                                  )}

                                  {user?.role === 'receptionist' && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={`/dashboard/appointments/form?id=${appointment.id}`}>
                                        Edit
                                      </a>
                                    </Button>
                                  )}

                                  {(user?.role === 'doctor' || user?.role === 'receptionist') && appointment.status !== 'in-progress' && appointment.status !== 'completed' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openRescheduleDialog(appointment.id, appointment.date, appointment.time)}
                                    >
                                      <CalendarClock className="h-4 w-4 mr-1" />
                                      Reschedule
                                    </Button>
                                  )}

                                  {(user?.role === 'doctor' || user?.role === 'receptionist') && appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'in-progress' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openCancelDialog(appointment.id)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No past appointments</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Past Appointments</CardTitle>
                    <CardDescription>
                      Completed and cancelled appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Visit Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastAppointments.map((appointment) => {
                          const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
                          const doctor = MOCK_DOCTORS.find(d => d.id === appointment.doctorId)
                          return (
                            <TableRow key={appointment.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{appointment.date}</div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {appointment.time}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                    <User className="h-4 w-4 text-gray-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {patient?.firstName} {patient?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {patient?.phone}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{doctor?.name}</div>
                                  {doctor?.specialization && (
                                    <div className="text-xs text-gray-500">{doctor.specialization}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {appointment.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px] truncate">
                                  {appointment.visitReason ?? '-'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(appointment.status)} className="flex items-center gap-1 w-fit">
                                  {getStatusIcon(appointment.status)}
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {user?.role === 'receptionist' && (
                                    <Button size="sm" variant="outline">
                                      View Details
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for this appointment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule-time">New Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-800">
                The appointment status will be reset to &quot;Pending&quot; after rescheduling.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={!rescheduleDate || !rescheduleTime || loading}
            >
              {loading ? 'Rescheduling...' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancellation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation Reason</Label>
              <Textarea
                id="cancel-reason"
                placeholder="e.g., Patient requested cancellation, Doctor unavailable..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">
                This action cannot be undone. The appointment will be marked as cancelled.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Cancel Appointment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
