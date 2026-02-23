'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import Header from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Plus,
  AlertCircle,
  CalendarClock,
  Calendar,
  Clock,
  CheckCircle,
  Users,
} from 'lucide-react'
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS } from '@/lib/mock-data'
import { MockAppointmentService } from '@/lib/services/appointment-service'
import { AppointmentsTable } from '@/components/appointments/appointments-table'


export default function AppointmentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('all')
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredAppointments = useMemo(() => {
    return MOCK_APPOINTMENTS.filter((appointment) => {
      const patient = MOCK_PATIENTS.find((p) => p.id === appointment.patientId)
      const patientName =
        `${patient?.firstName} ${patient?.lastName}`.toLowerCase()

      const matchesSearch =
        searchTerm === '' || patientName.includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || appointment.status === statusFilter
      const matchesDate =
        selectedDate === '' || appointment.date === selectedDate
      const matchesDoctor =
        doctorFilter === 'all' || appointment.doctorId === doctorFilter

      if (user?.role === 'doctor') {
        return (
          appointment.doctorId === user.id &&
          matchesSearch &&
          matchesStatus &&
          matchesDate
        )
      }

      return matchesSearch && matchesStatus && matchesDate && matchesDoctor
    })
  }, [searchTerm, statusFilter, selectedDate, doctorFilter, user])

  const todayAppointments = filteredAppointments.filter(
    (apt) => apt.date === '2026-02-04'
  )
  const upcomingAppointments = filteredAppointments.filter(
    (apt) => apt.date > '2026-02-04'
  )
  const pastAppointments = filteredAppointments.filter(
    (apt) => apt.date < '2026-02-04'
  )

  const stats = useMemo(() => {
    const all = MOCK_APPOINTMENTS
    return {
      total: all.length,
      today: all.filter((a) => a.date === '2026-02-04').length,
      pending: all.filter((a) => a.status === 'pending').length,
      confirmed: all.filter((a) => a.status === 'confirmed').length,
    }
  }, [])

  const handleConfirm = async (appointmentId: string) => {
    setLoading(true)
    try {
      await MockAppointmentService.confirmAppointment(appointmentId)
    } finally {
      setLoading(false)
    }
  }

  const handleStartSession = async (appointmentId: string) => {
    setLoading(true)
    try {
      await MockAppointmentService.startSession(appointmentId)
    } finally {
      setLoading(false)
    }
  }

  const handleEndSession = async (appointmentId: string) => {
    setLoading(true)
    try {
      await MockAppointmentService.endSession(appointmentId)
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
      setIsRescheduleOpen(false)
      setSelectedAppointment(null)
      setRescheduleDate('')
      setRescheduleTime('')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedAppointment) return
    setLoading(true)
    try {
      await MockAppointmentService.cancelAppointment(
        selectedAppointment,
        cancelReason
      )
      setIsCancelOpen(false)
      setSelectedAppointment(null)
      setCancelReason('')
    } finally {
      setLoading(false)
    }
  }

  const openRescheduleDialog = (
    appointmentId: string,
    currentDate: string,
    currentTime: string
  ) => {
    setSelectedAppointment(appointmentId)
    setRescheduleDate(currentDate)
    setRescheduleTime(currentTime)
    setIsRescheduleOpen(true)
  }

  const openCancelDialog = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setIsCancelOpen(true)
  }

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    selectedDate !== '' ||
    doctorFilter !== 'all'

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setSelectedDate('')
    setDoctorFilter('all')
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title={user?.role === 'doctor' ? 'My Appointments' : 'Appointments'}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Filters */}
        <Card className="mb-6 border-border">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    placeholder="Search by patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-border bg-background"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-44 border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {user?.role === 'receptionist' && (
                  <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                    <SelectTrigger className="w-full lg:w-48 border-border">
                      <Users className="size-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Doctor" />
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
                  className="w-full lg:w-44 border-border"
                />

                {user?.role === 'receptionist' && (
                  <Button className="gap-2 shrink-0" asChild>
                    <a href="/dashboard/appointments/form">
                      <Plus className="size-4" />
                      New Appointment
                    </a>
                  </Button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {filteredAppointments.length} result
                    {filteredAppointments.length !== 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border overflow-hidden">
          <CardContent className="p-0">
            <AppointmentsTable
              appointments={todayAppointments}
              patients={MOCK_PATIENTS}
              doctors={MOCK_DOCTORS}
              userRole={user?.role}
              userId={user?.id}
              loading={loading}
              onConfirm={handleConfirm}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onReschedule={openRescheduleDialog}
              onCancel={openCancelDialog}
            />
          </CardContent>
        </Card>


      </div>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for this appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-time">New Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="border-border"
              />
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-sky-200 bg-sky-50 p-3">
              <AlertCircle className="size-4 text-sky-600 mt-0.5 shrink-0" />
              <p className="text-sm text-sky-800">
                The appointment status will be reset to &quot;Pending&quot; after
                rescheduling.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRescheduleOpen(false)}
            >
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancellation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation Reason</Label>
              <Textarea
                id="cancel-reason"
                placeholder="e.g., Patient requested cancellation, Doctor unavailable..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px] border-border"
              />
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-800">
                This action cannot be undone. The appointment will be marked as
                cancelled.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelOpen(false)}
            >
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
