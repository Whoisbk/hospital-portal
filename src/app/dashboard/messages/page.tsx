'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    MessageSquare,
    Send,
    Plus,
    Search,
    Clock,
    CheckCircle,
    Calendar,
    AlertCircle,
} from 'lucide-react'
import { MOCK_MESSAGES, MOCK_USERS, MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS } from '@/lib/mock-data'

export default function MessagesPage() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const appointmentId = searchParams.get('appointment')

    const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
    const [messageText, setMessageText] = useState('')
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
    const [selectedRecipient, setSelectedRecipient] = useState('')
    const [newMessageText, setNewMessageText] = useState('')
    const [newMessageCategory, setNewMessageCategory] = useState<'general' | 'appointment' | 'urgent'>('general')
    const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Filter messages for current user
    const userMessages = MOCK_MESSAGES.filter(msg =>
        msg.senderId === user?.id || msg.receiverId === user?.id
    )

    // Group messages by conversation (sender/receiver pair)
    const conversations = userMessages.reduce((acc: Record<string, {
        id: string;
        otherUserId: string;
        messages: typeof MOCK_MESSAGES;
        lastMessage: typeof MOCK_MESSAGES[0];
        unreadCount: number;
    }>, message) => {
        const otherUserId = message.senderId === user?.id ? message.receiverId : message.senderId
        const key = [user?.id, otherUserId].sort().join('-')

        if (!acc[key]) {
            acc[key] = {
                id: key,
                otherUserId,
                messages: [],
                lastMessage: message,
                unreadCount: 0
            }
        }

        acc[key].messages.push(message)

        // Update last message if this one is newer
        if (new Date(message.timestamp) > new Date(acc[key].lastMessage.timestamp)) {
            acc[key].lastMessage = message
        }

        // Count unread messages (received by current user and not read)
        if (message.receiverId === user?.id && !message.read) {
            acc[key].unreadCount++
        }

        return acc
    }, {})

    const conversationList = Object.values(conversations).sort((a, b) =>
        new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    )

    // Appointment-specific messages
    const appointmentMessages = appointmentId
        ? userMessages.filter(msg => msg.appointmentId === appointmentId)
        : []

    const selectedConversationData = selectedConversation ? conversations[selectedConversation] : null
    const sortedMessages = selectedConversationData?.messages.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ) || []

    // Auto-select conversation if coming from appointment
    useEffect(() => {
        if (appointmentId && appointmentMessages.length > 0) {
            const firstMessage = appointmentMessages[0]
            const otherUserId = firstMessage.senderId === user?.id ? firstMessage.receiverId : firstMessage.senderId
            const key = [user?.id, otherUserId].sort().join('-')
            setSelectedConversation(key)
        }
    }, [appointmentId, appointmentMessages, user?.id])

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedConversationData) return

        // In a real app, this would make an API call
        console.log('Sending message:', {
            receiverId: selectedConversationData.otherUserId,
            content: messageText
        })

        alert('Message sent!')
        setMessageText('')
    }

    const handleSendNewMessage = () => {
        if (!newMessageText.trim() || !selectedRecipient) return

        // In a real app, this would make an API call
        console.log('Sending new message:', {
            receiverId: selectedRecipient,
            content: newMessageText,
            category: newMessageCategory,
            appointmentId: selectedAppointmentId || undefined,
        })

        alert('Message sent!')
        setIsNewMessageOpen(false)
        setSelectedRecipient('')
        setNewMessageText('')
        setNewMessageCategory('general')
        setSelectedAppointmentId('')
    }

    const getOtherUser = (userId: string) => {
        return MOCK_USERS.find(u => u.id === userId)
    }

    const getAppointment = (appointmentId?: string) => {
        if (!appointmentId) return null
        return MOCK_APPOINTMENTS.find(a => a.id === appointmentId)
    }

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'urgent': return 'destructive'
            case 'appointment': return 'default'
            case 'general': return 'secondary'
            default: return 'outline'
        }
    }

    const availableRecipients = MOCK_USERS.filter(u => u.id !== user?.id)

    // Get appointments for the message context selector
    const userAppointments = user?.role === 'doctor'
        ? MOCK_APPOINTMENTS.filter(apt => apt.doctorId === user.id && apt.status !== 'cancelled' && apt.status !== 'completed')
        : MOCK_APPOINTMENTS.filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed')

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Messages"
                description="Internal communication between doctors and reception"
            />

            <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="all" className="h-full flex flex-col">
                    <div className="px-6 pt-6">
                        <TabsList>
                            <TabsTrigger value="all">All Messages</TabsTrigger>
                            <TabsTrigger value="appointment">Appointment</TabsTrigger>
                            <TabsTrigger value="urgent">Urgent</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="flex-1 mt-0">
                        <div className="h-full flex">
                            {/* Conversations List */}
                            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex gap-2 mb-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder="Search conversations..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>

                                        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>New Message</DialogTitle>
                                                    <DialogDescription>
                                                        Send a message to a colleague
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="recipient">Recipient *</Label>
                                                        <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select recipient" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableRecipients.map(user => (
                                                                    <SelectItem key={user.id} value={user.id}>
                                                                        {user.name} ({user.role})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="category">Category</Label>
                                                        <Select value={newMessageCategory} onValueChange={(v: 'general' | 'appointment' | 'urgent') => setNewMessageCategory(v)}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="general">General</SelectItem>
                                                                <SelectItem value="appointment">Appointment</SelectItem>
                                                                <SelectItem value="urgent">Urgent</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {newMessageCategory === 'appointment' && (
                                                        <div className="space-y-2">
                                                            <Label htmlFor="appointment">Related Appointment (Optional)</Label>
                                                            <Select value={selectedAppointmentId} onValueChange={setSelectedAppointmentId}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select appointment" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="">None</SelectItem>
                                                                    {userAppointments.map(apt => {
                                                                        const patient = MOCK_PATIENTS.find(p => p.id === apt.patientId)
                                                                        const doctor = MOCK_DOCTORS.find(d => d.id === apt.doctorId)
                                                                        return (
                                                                            <SelectItem key={apt.id} value={apt.id}>
                                                                                {patient?.firstName} {patient?.lastName} - {doctor?.name} ({apt.date} {apt.time})
                                                                            </SelectItem>
                                                                        )
                                                                    })}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <Label htmlFor="message">Message *</Label>
                                                        <Textarea
                                                            id="message"
                                                            placeholder="Type your message..."
                                                            value={newMessageText}
                                                            onChange={(e) => setNewMessageText(e.target.value)}
                                                            className="min-h-[120px]"
                                                        />
                                                    </div>

                                                    {newMessageCategory === 'urgent' && (
                                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                                            <p className="text-sm text-red-800">
                                                                This message will be marked as urgent and requires immediate attention.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleSendNewMessage}
                                                        disabled={!selectedRecipient || !newMessageText.trim()}
                                                    >
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Send Message
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    {conversationList.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full p-6">
                                            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500 text-center">No conversations yet</p>
                                            <p className="text-gray-400 text-sm text-center mt-1">
                                                Start a new conversation using the + button
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 p-2">
                                            {conversationList.map((conversation) => {
                                                const otherUser = getOtherUser(conversation.otherUserId)
                                                const isSelected = selectedConversation === conversation.id

                                                return (
                                                    <button
                                                        key={conversation.id}
                                                        className={`w-full text-left p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                                                            }`}
                                                        onClick={() => setSelectedConversation(conversation.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                                                    {otherUser?.name.split(' ').map(n => n[0]).join('')}
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="font-medium text-sm truncate">
                                                                        {otherUser?.name}
                                                                    </h3>
                                                                    <div className="flex items-center gap-2">
                                                                        {conversation.unreadCount > 0 && (
                                                                            <Badge variant="destructive" className="text-xs">
                                                                                {conversation.unreadCount}
                                                                            </Badge>
                                                                        )}
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                                    {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                                                                    {conversation.lastMessage.content}
                                                                </p>

                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <Badge variant="outline" className="text-xs capitalize">
                                                                        {otherUser?.role}
                                                                    </Badge>
                                                                    {conversation.lastMessage.category && (
                                                                        <Badge variant={getCategoryColor(conversation.lastMessage.category)} className="text-xs">
                                                                            {conversation.lastMessage.category}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Thread */}
                            <div className="flex-1 flex flex-col">
                                {selectedConversationData ? (
                                    <>
                                        {/* Thread Header */}
                                        <div className="p-4 border-b border-gray-200 bg-white">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                                        {getOtherUser(selectedConversationData.otherUserId)?.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {getOtherUser(selectedConversationData.otherUserId)?.name}
                                                    </h3>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {getOtherUser(selectedConversationData.otherUserId)?.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {sortedMessages.map((message) => {
                                                const isOwnMessage = message.senderId === user?.id
                                                const appointment = getAppointment(message.appointmentId)

                                                return (
                                                    <div key={message.id} className="space-y-2">
                                                        {/* Appointment Context */}
                                                        {message.appointmentId && appointment && (() => {
                                                            const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId)
                                                            return (
                                                                <div className="flex justify-center">
                                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs flex items-center gap-2 max-w-md">
                                                                        <Calendar className="h-3 w-3 text-blue-600" />
                                                                        <span className="text-blue-800">
                                                                            Regarding: {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'} - {appointment.date} {appointment.time}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })()}

                                                        <div
                                                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                                                {message.category && (
                                                                    <div className={`mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                                                        <Badge variant={getCategoryColor(message.category)} className="text-xs">
                                                                            {message.category}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className={`p-3 rounded-lg ${isOwnMessage
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-100 text-gray-900'
                                                                        }`}
                                                                >
                                                                    <p className="text-sm">{message.content}</p>
                                                                </div>

                                                                <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isOwnMessage ? 'justify-end' : 'justify-start'
                                                                    }`}>
                                                                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                                                                    {isOwnMessage && (
                                                                        <span className="flex items-center gap-1">
                                                                            {message.read ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                                            {message.read ? 'Read' : 'Sent'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-4 border-t border-gray-200 bg-white">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Type a message..."
                                                    value={messageText}
                                                    onChange={(e) => setMessageText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault()
                                                            handleSendMessage()
                                                        }
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center">
                                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Select a conversation
                                            </h3>
                                            <p className="text-gray-500">
                                                Choose a conversation from the list to start messaging
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="appointment" className="flex-1 mt-0 p-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Messages</CardTitle>
                                <CardDescription>
                                    Messages related to specific appointments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">
                                    Use the &quot;All Messages&quot; tab and filter by appointment category, or create a new message with appointment context.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="urgent" className="flex-1 mt-0 p-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Urgent Messages</CardTitle>
                                <CardDescription>
                                    High-priority messages requiring immediate attention
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {userMessages.filter(msg => msg.category === 'urgent').length === 0 ? (
                                    <p className="text-sm text-gray-500">No urgent messages</p>
                                ) : (
                                    <div className="space-y-2">
                                        {userMessages
                                            .filter(msg => msg.category === 'urgent')
                                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                            .map(msg => {
                                                const otherUser = msg.senderId === user?.id
                                                    ? getOtherUser(msg.receiverId)
                                                    : getOtherUser(msg.senderId)
                                                return (
                                                    <div key={msg.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                                <span className="font-medium text-sm">{otherUser?.name}</span>
                                                            </div>
                                                            <span className="text-xs text-gray-600">
                                                                {new Date(msg.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-800">{msg.content}</p>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 
