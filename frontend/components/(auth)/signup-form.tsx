'use client'

import Link from 'next/link'
import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useSignupForm } from '@/hooks/useSignupForm'
import Image from 'next/image'
import Field from '../(common)/fieled'
import OAuth from '../(common)/oauth'

const SignupForm = () => {
  const { form, isLoading, serverError, onSubmit } = useSignupForm()
  const { register, formState: { errors } } = form
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const inputClass = (hasError: boolean) =>
    [
      'w-full py-3.5 pl-11 pr-4 text-sm text-gray-900 bg-white border rounded-xl outline-none',
      'transition-[border-color,box-shadow] duration-200 placeholder:text-gray-300',
      'focus:border-[#3EBB4A] focus:ring-2 focus:ring-[#3EBB4A]/20',
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-200',
    ].join(' ')

  return (
    <div className="min-h-screen layout flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-3xl px-9 py-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
            Welcome👋! Let&apos;s Get Started
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Kindly fill in your correct details to create a free account.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">

          {/* Server error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Name */}
          <Field id="fullName" label="Name" icon={<User size={18} />} error={errors.fullName?.message}>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              {...register('fullName')}
              className={inputClass(!!errors.fullName)}
            />
          </Field>

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
              autoComplete="new-password"
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

          {/* Confirm password */}
          <Field id="confirmPassword" label="Confirm Password" icon={<Lock size={18} />} error={errors.confirmPassword?.message}>
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              className={`${inputClass(!!errors.confirmPassword)} !pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              aria-label="Toggle confirm password visibility"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1.5 w-full py-3.5 rounded-full bg-[#3EBB4A] text-white text-sm font-bold
              tracking-wide transition-[opacity,transform] duration-150
              hover:opacity-90 hover:-translate-y-px active:translate-y-0
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />
            Or
            <span className="flex-1 h-px bg-gray-200" />
          </div>
          {/* Social buttons */}
          <OAuth />

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500 mt-1">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#3EBB4A] hover:underline">
              Log In
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default SignupForm