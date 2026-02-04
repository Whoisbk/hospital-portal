'use client'

import { useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import { Appointment } from '@/types'
import { MOCK_PATIENTS, MOCK_DOCTORS } from '@/lib/mock-data'

interface AppointmentsCalendarProps {
  appointments: Appointment[]
  view: 'week' | 'day'
  onEventClick?: (appointment: Appointment) => void
}

export function AppointmentsCalendar({ appointments, view, onEventClick }: AppointmentsCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)

  // Transform appointments into FullCalendar events
  const events = appointments.map((appointment) => {
    const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
    const doctor = MOCK_DOCTORS.find(d => d.id === appointment.doctorId)
    
    // Combine date and time for proper datetime
    const startDateTime = `${appointment.date}T${appointment.time}`
    
    // Calculate end time (default 30 minutes duration)
    const [hours, minutes] = appointment.time.split(':').map(Number)
    const endMinutes = minutes + 30
    const endHours = hours + Math.floor(endMinutes / 60)
    const finalMinutes = endMinutes % 60
    const endTime = `${String(endHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`
    const endDateTime = `${appointment.date}T${endTime}`

    // Color based on status
    let backgroundColor = '#3b82f6' // blue for confirmed
    let borderColor = '#2563eb'
    
    switch (appointment.status) {
      case 'pending':
        backgroundColor = '#f59e0b' // amber
        borderColor = '#d97706'
        break
      case 'confirmed':
        backgroundColor = '#3b82f6' // blue
        borderColor = '#2563eb'
        break
      case 'in-progress':
        backgroundColor = '#8b5cf6' // purple
        borderColor = '#7c3aed'
        break
      case 'completed':
        backgroundColor = '#10b981' // green
        borderColor = '#059669'
        break
      case 'cancelled':
        backgroundColor = '#ef4444' // red
        borderColor = '#dc2626'
        break
    }

    return {
      id: appointment.id,
      title: `${patient?.firstName} ${patient?.lastName}`,
      start: startDateTime,
      end: endDateTime,
      backgroundColor,
      borderColor,
      extendedProps: {
        appointment,
        patientName: `${patient?.firstName} ${patient?.lastName}`,
        patientPhone: patient?.phone,
        doctorName: doctor?.name,
        doctorSpecialization: doctor?.specialization,
        visitReason: appointment.visitReason,
        status: appointment.status,
        type: appointment.type,
      }
    }
  })

  const handleEventClick = (info: EventClickArg) => {
    if (onEventClick && info.event.extendedProps.appointment) {
      onEventClick(info.event.extendedProps.appointment as Appointment)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #e5e7eb;
        }
        
        .fc-col-header-cell {
          background-color: #f9fafb;
          font-weight: 600;
          padding: 12px 4px;
        }
        
        .fc-timegrid-slot {
          height: 3rem;
        }
        
        .fc-event {
          cursor: pointer;
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.875rem;
        }
        
        .fc-event:hover {
          opacity: 0.9;
        }
        
        .fc-event-title {
          font-weight: 600;
        }
        
        .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700;
        }
        
        .fc-button {
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
          text-transform: capitalize;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .fc-button:hover {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
        }
        
        .fc-button-active {
          background-color: #1d4ed8 !important;
          border-color: #1d4ed8 !important;
        }
        
        .fc-timegrid-event {
          border-radius: 4px;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        
        .fc-timegrid-event-harness {
          margin-right: 2px;
        }
        
        .fc-scrollgrid {
          border-color: #e5e7eb;
        }
        
        .fc-timegrid-slot-label {
          border-color: #e5e7eb;
        }
        
        .fc-timegrid-axis {
          border-color: #e5e7eb;
        }
        
        .fc-daygrid-day-frame {
          cursor: pointer;
        }
        
        .fc-v-event {
          background-color: inherit;
        }
      `}</style>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView={view === 'week' ? 'timeGridWeek' : 'timeGridDay'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: view === 'week' ? 'timeGridWeek' : 'timeGridDay'
        }}
        events={events}
        eventClick={handleEventClick}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        height="auto"
        nowIndicator={true}
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        eventContent={(arg) => {
          return (
            <div className="p-1 overflow-hidden">
              <div className="font-semibold text-xs truncate">
                {arg.event.title}
              </div>
              <div className="text-xs opacity-90 truncate">
                {arg.event.extendedProps.visitReason || arg.event.extendedProps.type}
              </div>
            </div>
          )
        }}
        eventMouseEnter={(info) => {
          info.el.style.opacity = '0.9'
        }}
        eventMouseLeave={(info) => {
          info.el.style.opacity = '1'
        }}
      />
    </div>
  )
}
