'use client'

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Banknote,
  ClipboardCheck,
  CornerDownLeft,
  LayoutDashboard,
  LucideIcon,
  Truck,
  UserPlus,
} from 'lucide-react'
import React from 'react'

interface Step {
  id: number
  icon: LucideIcon
  title: string
  description: string
  highlight: boolean
}

const steps: Step[] = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Register & Verify',
    description:
      'Complete KYC verification with NIN integration for trusted marketplace participation',
    highlight: false,
  },
  {
    id: 2,
    icon: LayoutDashboard,
    title: 'List or Browse',
    description:
      'Farmers list fresh produce with photos and pricing, buyers search the marketplace',
    highlight: true,
  },
  {
    id: 3,
    icon: ClipboardCheck,
    title: 'Place Order',
    description:
      'Buyers place orders with secure escrow payment protection for all parties',
    highlight: false,
  },
  {
    id: 4,
    icon: Banknote,
    title: 'Confirm & Release Payment',
    description:
      'Buyer confirms receipt, payment automatically released to farmer and logistics',
    highlight: false,
  },
  {
    id: 5,
    icon: Truck,
    title: 'Coordinate Delivery',
    description:
      'Logistics partners pick up and deliver with real-time tracking for transparency',
    highlight: true,
  },
]

const StepCard = ({ step }: { step: Step }) => {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-[20px] p-6 text-center transition-all duration-300 ${step.highlight
        ? 'bg-[#3EBB4A] text-white'
        : 'bg-[#1A1A1A] text-white'
        }`}
    >
      <div className="flex h-16 w-16 items-center justify-center">
        <step.icon size={32} />
      </div>
      <h3 className="text-lg md:text-xl font-semibold">{step.title}</h3>
      <p className="text-sm md:text-base opacity-80">{step.description}</p>
    </div>
  )
}

const SimpleSecureProcess = () => {
  const row1 = steps.slice(0, 3)
  const row2 = steps.slice(3, 5)

  return (
    <section
      id='how-it-works'
      className="bg-white section layout"
    >
      <div className="mx-auto w-full max-w-265.5 px-4 py-16">
        <h2 className="text-center text-2xl font-semibold md:text-3xl">
          Simple, Secure Process
        </h2>

        <div className="mt-12 flex flex-col gap-10">

          {/* ROW 1 */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {row1.map((step, index) => (
              <React.Fragment key={step.id}>

                <div className="w-full md:flex-1">
                  <StepCard step={step} />
                </div>

                {/* Arrow (only desktop) */}
                {index < row1.length - 1 && (
                  <ArrowRight className="hidden md:block shrink-0 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* DOWN ARROW */}
          <div className="hidden md:flex justify-end pr-[10%]">
            <ArrowDown className="text-gray-400" />
          </div>

          {/* ROW 2 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:px-[calc(100%/6)]">
            {row2.map((step, index) => (
              <React.Fragment key={step.id}>

                <div className="w-full md:flex-1">
                  <StepCard step={step} />
                </div>

                {/* Arrow (only desktop) */}
                {index < row2.length - 1 && (
                  <ArrowLeft className="hidden md:block shrink-0 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default SimpleSecureProcess