'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  CalendarClock,
  MessageSquare,
  Play,
  Square,
  Eye,
  CircleDot,
  Stethoscope,
  FlaskConical,
  HeartPulse,
  RefreshCw,
} from 'lucide-react'
import type { Appointment, Patient, Doctor } from '@/lib/mock-data'

interface AppointmentsTableProps {
  appointments: Appointment[]
  patients: Patient[]
  doctors: Doctor[]
  userRole?: string
  userId?: string
  loading?: boolean
  showDateColumn?: boolean
  onConfirm?: (id: string) => void
  onStartSession?: (id: string) => void
  onEndSession?: (id: string) => void
  onReschedule?: (id: string, date: string, time: string) => void
  onCancel?: (id: string) => void
}

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  completed: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  confirmed: {
    dot: 'bg-sky-500',
    bg: 'bg-sky-500/10',
    text: 'text-sky-700 dark:text-sky-400',
  },
  'in-progress': {
    dot: 'bg-amber-500 animate-pulse',
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
  },
  pending: {
    dot: 'bg-muted-foreground/50',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
  },
  cancelled: {
    dot: 'bg-destructive',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
  },
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'consultation':
      return <Stethoscope className="size-3.5" />
    case 'follow-up':
      return <RefreshCw className="size-3.5" />
    case 'check-up':
      return <HeartPulse className="size-3.5" />
    case 'lab-review':
      return <FlaskConical className="size-3.5" />
    default:
      return <CircleDot className="size-3.5" />
  }
}

const avatarColors = [
  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
]

function getAvatarColor(id: string) {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[hash % avatarColors.length]
}

export function AppointmentsTable({
  appointments,
  patients,
  doctors,
  userRole,
  loading,
  showDateColumn = false,
  onConfirm,
  onStartSession,
  onEndSession,
  onReschedule,
  onCancel,
}: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <CalendarClock className="size-6 text-muted-foreground" />
        </div>
        <p className="text-foreground font-semibold text-base mb-1">No appointments found</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or date range to find what you are looking for.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/60">
          {showDateColumn && (
            <TableHead className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium pl-4">
              Date
            </TableHead>
          )}
          <TableHead className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium pl-4">
            Time
          </TableHead>
          <TableHead className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium">
            Patient
          </TableHead>
          <TableHead className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium">
            Doctor
          </TableHead>
          <TableHead className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium">
            Type
          </TableHead>

          <TableHead className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium">
            Status
          </TableHead>
          <TableHead className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-medium text-right pr-4">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => {
          const patient = patients.find((p) => p.id === appointment.patientId)
          const doctor = doctors.find((d) => d.id === appointment.doctorId)
          const initials = patient
            ? `${patient.firstName[0]}${patient.lastName[0]}`
            : '??'
          const status = statusConfig[appointment.status] ?? statusConfig.pending

          const canModify =
            appointment.status !== 'cancelled' &&
            appointment.status !== 'completed' &&
            appointment.status !== 'in-progress'

          return (
            <TableRow
              key={appointment.id}
              className="group border-border/40 hover:bg-muted/40 transition-colors duration-150"
            >
              {showDateColumn && (
                <TableCell className="font-medium text-sm text-foreground pl-4">
                  {new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
              )}
              <TableCell className="pl-4">
                <span className="inline-flex items-center gap-2 text-sm tabular-nums font-medium text-foreground">
                  <Clock className="size-3.5 text-muted-foreground/60" />
                  {appointment.time}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 rounded-xl border-0 shadow-sm">
                    <AvatarFallback className={`rounded-xl text-xs font-semibold ${getAvatarColor(appointment.patientId)}`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">
                      {patient?.firstName} {patient?.lastName}
                    </div>
                    
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <div className="font-medium text-sm text-foreground truncate">{doctor?.name}</div>
                  {doctor?.specialization && (
                    <div className="text-xs text-muted-foreground/70 truncate">
                      {doctor.specialization}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground capitalize">
                  <span className="text-foreground/50">{getTypeIcon(appointment.type)}</span>
                  {appointment.type.replace('-', ' ')}
                </div>
              </TableCell>
              
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}
                >
                  <span className={`size-1.5 rounded-full ${status.dot}`} />
                  {appointment.status.replace('-', ' ')}
                </span>
              </TableCell>
              <TableCell className="text-right pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem className="gap-2 rounded-lg">
                      <Eye className="size-4" />
                      View Details
                    </DropdownMenuItem>

                    {userRole === 'doctor' &&
                      appointment.status === 'pending' &&
                      onConfirm && (
                        <DropdownMenuItem
                          className="gap-2 text-sky-600 rounded-lg"
                          onClick={() => onConfirm(appointment.id)}
                          disabled={loading}
                        >
                          <CheckCircle2 className="size-4" />
                          Accept
                        </DropdownMenuItem>
                      )}

                    {userRole === 'doctor' &&
                      appointment.status === 'confirmed' &&
                      onStartSession && (
                        <DropdownMenuItem
                          className="gap-2 text-primary rounded-lg"
                          onClick={() => onStartSession(appointment.id)}
                          disabled={loading}
                        >
                          <Play className="size-4" />
                          Start Session
                        </DropdownMenuItem>
                      )}

                    {userRole === 'doctor' &&
                      appointment.status === 'in-progress' &&
                      onEndSession && (
                        <DropdownMenuItem
                          className="gap-2 text-emerald-600 rounded-lg"
                          onClick={() => onEndSession(appointment.id)}
                          disabled={loading}
                        >
                          <Square className="size-4" />
                          End Session
                        </DropdownMenuItem>
                      )}

                    {userRole === 'receptionist' && (
                      <DropdownMenuItem className="gap-2 rounded-lg" asChild>
                        <a href={`/dashboard/messages?appointment=${appointment.id}`}>
                          <MessageSquare className="size-4" />
                          Message
                        </a>
                      </DropdownMenuItem>
                    )}

                    {canModify && onReschedule && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 rounded-lg"
                          onClick={() =>
                            onReschedule(
                              appointment.id,
                              appointment.date,
                              appointment.time
                            )
                          }
                        >
                          <CalendarClock className="size-4" />
                          Reschedule
                        </DropdownMenuItem>
                      </>
                    )}

                    {canModify && onCancel && (
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive rounded-lg"
                        onClick={() => onCancel(appointment.id)}
                      >
                        <XCircle className="size-4" />
                        Cancel
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
