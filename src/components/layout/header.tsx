'use client'

import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, MessageSquare } from 'lucide-react'

interface HeaderProps {
    title: string
    description?: string
}

export default function Header({ title, description }: HeaderProps) {
    const { user } = useAuth()

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {description && (
                        <p className="text-gray-600 mt-1">{description}</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5" />
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            3
                        </Badge>
                    </Button>

                    {/* Messages */}
                    <Button variant="ghost" size="sm" className="relative">
                        <MessageSquare className="h-5 w-5" />
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            2
                        </Badge>
                    </Button>

                    {/* User role badge */}
                    <Badge variant="secondary" className="capitalize">
                        {user?.role}
                    </Badge>
                </div>
            </div>
        </header>
    )
} 