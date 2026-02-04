'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes
const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'receptionist@hospital.com',
        role: 'receptionist',
        department: 'Front Desk',
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        email: 'doctor@hospital.com',
        role: 'doctor',
        specialization: 'General Practice',
        department: 'Internal Medicine',
    },
    {
        id: '3',
        name: 'Dr. Sarah Williams',
        email: 'sarah.williams@hospital.com',
        role: 'doctor',
        specialization: 'Cardiology',
        department: 'Cardiology',
    },
    {
        id: '4',
        name: 'Dr. James Brown',
        email: 'james.brown@hospital.com',
        role: 'doctor',
        specialization: 'Pediatrics',
        department: 'Pediatrics',
    },
    {
        id: '5',
        name: 'Emma Davis',
        email: 'emma.davis@hospital.com',
        role: 'receptionist',
        department: 'Front Desk',
    },
    {
        id: '6',
        name: 'Admin User',
        email: 'admin@hospital.com',
        role: 'admin',
        department: 'Administration',
    },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('hospital-user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)

        // Mock authentication - in real app, this would be an API call
        const foundUser = MOCK_USERS.find(u => u.email === email)
        if (foundUser && password === 'password123') {
            setUser(foundUser)
            localStorage.setItem('hospital-user', JSON.stringify(foundUser))
            setIsLoading(false)
            return true
        }

        setIsLoading(false)
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('hospital-user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 