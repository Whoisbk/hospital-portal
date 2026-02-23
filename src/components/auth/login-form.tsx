'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertCircle,
  Stethoscope,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Clock,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import LoginImage from '../../../public/images/medical-hero.jpg'
export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(email, password)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password. Try the demo credentials below.')
    }
  }

  const fillDemo = (type: 'doctor' | 'receptionist') => {
    if (type === 'doctor') {
      setEmail('doctor@hospital.com')
    } else {
      setEmail('receptionist@hospital.com')
    }
    setPassword('password123')
    setError('')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero image + branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden lg:flex lg:w-[55%]">
        <Image
          src={LoginImage}
          alt="Modern hospital interior"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40" />

        {/* Content over the image */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20 backdrop-blur-sm">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">
              MediCare
            </span>
          </div>

          {/* Hero text */}
          <div className="max-w-lg">
            <h1 className="text-balance text-4xl leading-tight font-bold tracking-tight text-primary-foreground">
              Streamline your healthcare management
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/80">
              Access patient records, manage appointments, and coordinate care
              all from one unified dashboard.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
              <Users className="h-4 w-4" />
              <span>Multi-role Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center bg-card px-6 py-12 lg:w-[45%] lg:px-16">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-card-foreground">
            MediCare
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your hospital portal account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-background"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10 bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="mt-1 h-11 w-full gap-2 text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                Demo accounts
              </span>
            </div>
          </div>

          {/* Demo credential buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => fillDemo('doctor')}
              className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">
                  Doctor Account
                </p>
                <p className="text-xs text-muted-foreground">
                  doctor@hospital.com
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>

            <button
              type="button"
              onClick={() => fillDemo('receptionist')}
              className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">
                  Receptionist Account
                </p>
                <p className="text-xs text-muted-foreground">
                  receptionist@hospital.com
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Password for all demo accounts: <span className="font-mono font-medium text-card-foreground">password123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
