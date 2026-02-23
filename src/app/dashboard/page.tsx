'use client'

import { useAuth } from '@/lib/auth'
import Header from '@/components/layout/header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
  UserPlus,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from '@/lib/mock-data'
import Link from 'next/link'

function AppointmentItem({ appointment }: { appointment: typeof MOCK_APPOINTMENTS[0] }) {
  const patient = MOCK_PATIENTS.find((p) => p.id === appointment.patientId)
  const initials = patient ? `${patient.firstName[0]}${patient.lastName[0]}` : '??'

  const statusConfig: Record<
    'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled',
    { variant: 'default' | 'outline' | 'destructive'; className: string }
  > = {
    completed: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
    'in-progress': { variant: 'default', className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10' },
    pending: { variant: 'outline', className: 'text-muted-foreground' },
    confirmed: { variant: 'outline', className: 'text-muted-foreground' },
    cancelled: { variant: 'destructive', className: '' },
  }

  const config = statusConfig[appointment.status]

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:bg-accent/50">
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {patient?.firstName} {patient?.lastName}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {appointment.time} &middot; {appointment.type}
        </p>
      </div>
      <Badge variant={config.variant} className={config.className}>
        {appointment.status}
      </Badge>
    </div>
  )
}

function QuickActionButton({
  href,
  icon: Icon,
  label,
  description,
  primary = false,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  primary?: boolean
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md cursor-pointer ${
          primary
            ? 'bg-primary text-primary-foreground border-primary hover:opacity-90'
            : 'bg-card border-border/50 hover:bg-accent/50'
        }`}
      >
        <div
          className={`flex items-center justify-center size-10 rounded-lg ${
            primary ? 'bg-primary-foreground/20' : 'bg-primary/10'
          }`}
        >
          <Icon className={`size-5 ${primary ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${primary ? 'text-primary-foreground' : 'text-foreground'}`}>
            {label}
          </p>
          <p className={`text-xs mt-0.5 ${primary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {description}
          </p>
        </div>
        <ArrowRight className={`size-4 ${primary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`} />
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const todayDate = '2026-02-04'
  const todayAppointments = MOCK_APPOINTMENTS.filter(
    (apt) => apt.date === todayDate && (user?.role !== 'doctor' || apt.doctorId === user?.id)
  )

  const completedCount = todayAppointments.filter((a) => a.status === 'completed').length
  const totalToday = todayAppointments.length
  const progressPercent = totalToday > 0 ? (completedCount / totalToday) * 100 : 0

  const totalPatients = MOCK_PATIENTS.length
  const isReceptionist = user?.role === 'receptionist'

  const pageTitle = isReceptionist ? 'Receptionist Dashboard' : 'Doctor Dashboard'

  return (
    <div className="flex flex-col h-full">
      <Header title={pageTitle} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
          {/* Greeting */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {"Here's an overview of your day. You have"} {totalToday} {"appointments today."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={isReceptionist ? 'Total Patients' : "Today's Patients"}
              value={isReceptionist ? totalPatients : totalToday}
              subtitle={isReceptionist ? '+2 from last week' : `${completedCount} completed`}
              icon={Users}
              trend="up"
            />
            <StatCard
              title="Appointments Today"
              value={totalToday}
              subtitle={`${totalToday - completedCount} remaining`}
              icon={Calendar}
              trend="neutral"
            />
            <StatCard
              title="Messages"
              value={2}
              subtitle="Unread conversations"
              icon={MessageSquare}
              trend="neutral"
            />
            <StatCard
              title="Completion Rate"
              value={`${Math.round(progressPercent)}%`}
              subtitle="Of today's schedule"
              icon={TrendingUp}
              trend={progressPercent > 50 ? 'up' : 'neutral'}
            />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule - takes 2 columns */}
            <Card className="lg:col-span-2 border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground text-lg">{"Today's Schedule"}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      Your appointments for today
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild className="text-foreground border-border hover:bg-accent">
                    <Link href="/dashboard/appointments">
                      View All
                      <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
                {/* Progress */}
                <div className="flex items-center gap-3 mt-3">
                  <Progress value={progressPercent} className="flex-1 h-2" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {completedCount}/{totalToday} done
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {todayAppointments.map((appointment) => (
                    <AppointmentItem key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground text-lg">Quick Actions</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {isReceptionist ? (
                    <>
                      <QuickActionButton
                        href="/dashboard/patients/register"
                        icon={UserPlus}
                        label="Register Patient"
                        description="Add a new patient record"
                        primary
                      />
                      <QuickActionButton
                        href="/dashboard/appointments"
                        icon={Calendar}
                        label="Schedule Appointment"
                        description="Book a new appointment"
                      />
                      <QuickActionButton
                        href="/dashboard/patients"
                        icon={Users}
                        label="View Patients"
                        description="Browse all patient records"
                      />
                      <QuickActionButton
                        href="/dashboard/messages"
                        icon={MessageSquare}
                        label="Messages"
                        description="View conversations"
                      />
                    </>
                  ) : (
                    <>
                      <QuickActionButton
                        href="/dashboard/appointments"
                        icon={Calendar}
                        label="View Appointments"
                        description="Manage your schedule"
                        primary
                      />
                      <QuickActionButton
                        href="/dashboard/patients"
                        icon={Users}
                        label="Patient Records"
                        description="Access medical records"
                      />
                      <QuickActionButton
                        href="/dashboard/messages"
                        icon={MessageSquare}
                        label="Messages"
                        description="View conversations"
                      />
                      <QuickActionButton
                        href="/dashboard"
                        icon={Activity}
                        label="Activity Log"
                        description="Recent activity"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Patients */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground text-lg">Recent Patients</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Patients who visited recently
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="text-foreground border-border hover:bg-accent">
                  <Link href="/dashboard/patients">
                    View All
                    <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MOCK_PATIENTS.slice(0, 3).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {patient.firstName} {patient.lastName}
                      </p>
                      
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
