'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'

const trustFeatures = [
  'Secure Escrow Payments via Interswitch/Quickteller',
  'KYC Verification with NIN Integration',
  'Real-Time Order and Delivery Tracking',
  'Fair Dispute Resolution by Admin Team',
]

const TrustAndTransparency = () => {
  return (
    <section
      id='buyers'
      className="bg-white layout section"
    >
      <div className="mx-auto w-full max-w-265.5">
        <div className="flex flex-col items-center gap-29.75 md:flex-row">

          {/* Stacked Images */}
          <div className="relative h-120 w-full max-w-110 shrink-0">
            {/* Back image — vegetables */}
            <div className="absolute right-0 top-0 h-80 w-65 overflow-hidden rounded-[20px] shadow-lg">
              <Image
                src="/images/vegetables-basket.jpg"
                alt="Fresh vegetables in a basket"
                width={305}
                height={401}
                className="object-cover"
              />
            </div>

            {/* Front image — wheat field */}
            <div className="absolute bottom-0 left-0 h-90 w-65 overflow-hidden rounded-[20px] shadow-xl">
              <Image
                src="/images/wheat-field.jpg"
                alt="Golden wheat field"
                width={305}
                height={401}
                className="object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Built on Trust and Transparency
            </h2>

            <ul className="flex flex-col gap-4">
              {trustFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#08C80E]">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-base text-gray-800 md:text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login/farmer"
                className="rounded-full bg-[#08C80E] px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
              >
                Login as a Farmer
              </Link>
              <Link
                href="/login/consumer"
                className="rounded-full border border-[#08C80E] px-8 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-[#08C80E] hover:text-white"
              >
                Login as a Consumer
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default TrustAndTransparency