'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useLoginForm } from '@/hooks/useLoginForm'
import OAuth from '../(common)/oauth'
import Field from '../(common)/fieled'

const DEMO_ACCOUNTS = [
  { email: 'buyer@farm.ng', role: 'Buyer', emoji: '🛒', color: '#08C40E' },
  { email: 'farmer@farm.ng', role: 'Farmer', emoji: '🌾', color: '#046207' },
  { email: 'logistics@farm.ng', role: 'Logistics', emoji: '🚚', color: '#3B82F6' },
  { email: 'admin@farm.ng', role: 'Admin', emoji: '🛡', color: '#8B5CF6' },
];

const LoginForm = () => {
  const { form, isLoading, serverError, onSubmit } = useLoginForm()
  const { register, formState: { errors } } = form
  const [showPassword, setShowPassword] = useState(false)

  const inputClass = (hasError: boolean) =>
    [
      'w-full py-3.5 pl-11 pr-4 text-sm text-gray-900 bg-white border rounded-xl outline-none',
      'transition-[border-color,box-shadow] duration-200 placeholder:text-gray-300',
      'focus:border-[#3EBB4A] focus:ring-2 focus:ring-[#3EBB4A]/20',
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-200',
    ].join(' ')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-[480px] bg-white rounded-3xl px-9 py-10 shadow-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
            Welcome Back👋!
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Kindly fill in your details to sign in to your account.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">

          {/* Server error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Email */}
          <Field id="email" label="Email" icon={<Mail size={18} />} error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register('email')}
              className={inputClass(!!errors.email)}
            />
          </Field>

          {/* Password */}
          <Field id="password" label="Password" icon={<Lock size={18} />} error={errors.password?.message}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password')}
              className={`${inputClass(!!errors.password)} !pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label="Toggle password visibility"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </Field>

          {/* Forgot password */}
          <div className="flex justify-end -mt-2">
            <Link href="/forgot-password" className="text-xs font-semibold text-[#3EBB4A] hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  form.setValue('email', acc.email)
                  form.setValue('password', 'password123') // default demo password
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs hover:bg-gray-50 transition"
              >
                <span>{acc.emoji}</span>
                <span className="font-medium">{acc.role}</span>
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1.5 w-full py-3.5 rounded-full bg-[#3EBB4A] text-white text-sm font-bold
              tracking-wide transition-[opacity,transform] duration-150
              hover:opacity-90 hover:-translate-y-px active:translate-y-0
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />
            Or
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons */}
          <OAuth />

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-1">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-[#3EBB4A] hover:underline">
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default LoginForm