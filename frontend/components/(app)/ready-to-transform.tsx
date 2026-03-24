import Link from 'next/link'
import React from 'react'

const ReadyToTransform = () => {
  return (
    <section className="bg-[linear-gradient(180deg,#E6FEE7_0%,rgba(240,254,241,0.5)_100%)] layout section">
      <div className="mx-auto w-full max-w-265.5 px-4 lg:px-27.25">
        <div className="flex flex-col items-center gap-6 text-center">

          <h2 className="text-3xl font-semibold md:text-4xl">
            Ready to Transform Agricultural Commerce
          </h2>

          <p className="text-base text-gray-700 md:text-lg">
            Join thousands connecting for fair, fresh, and secure trade
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login/farmer"
              className="rounded-full bg-[#3EBB4A] px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Login as a Farmer
            </Link>
            <Link
              href="/login/consumer"
              className="rounded-full border border-[#3EBB4A] px-8 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-[#3EBB4A] hover:text-white"
            >
              Login as a Consumer
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            No hidden fees. Secure transactions. Get started in minutes.
          </p>

        </div>
      </div>
    </section>
  )
}

export default ReadyToTransform