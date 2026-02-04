'use client'

import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Calendar,
    Users,
    FileText,
    MessageSquare,
    CreditCard,
    Stethoscope,
    TestTube,
    ClipboardList,
    Settings,
    LogOut,
    UserPlus,
    Search
} from 'lucide-react'

interface SidebarProps {
    className?: string
}

export default function Sidebar({ className }: SidebarProps) {
    const { user, logout } = useAuth()

      const receptionistItems = [
    { icon: UserPlus, label: 'Patient Registration', href: '/dashboard/patients/register' },
    { icon: Calendar, label: 'Appointments', href: '/dashboard/appointments' },
    { icon: Users, label: 'Patients', href: '/dashboard/patients' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
  ]

  const doctorItems = [
    { icon: Calendar, label: 'Today\'s Appointments', href: '/dashboard/appointments' },
    { icon: Users, label: 'Patient Records', href: '/dashboard/patients' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
  ]

    const navigationItems = user?.role === 'receptionist' ? receptionistItems : doctorItems

    return (
        <div className={cn("flex flex-col h-full bg-white border-r border-gray-200", className)}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Hospital Portal</h1>
                        <p className="text-sm text-gray-500 capitalize">{user?.role} Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navigationItems.map((item) => (
                        <li key={item.href}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 h-12 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                asChild
                            >
                                <a href={item.href}>
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </a>
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-10 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        asChild
                    >
                        <a href="/dashboard/settings">
                            <Settings className="h-4 w-4" />
                            Settings
                        </a>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-10 text-gray-700 hover:text-red-600 hover:bg-red-50"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
} 