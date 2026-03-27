import Image from 'next/image'
import React from 'react'

const OAuth = () => {
  return (
    < div className="flex flex-col md:flex-row gap-3" >
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2.5 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
      >
        <Image
          src={'/images/svgs/google-icon.svg'}
          width={24}
          height={24}
          alt='Google Icon'
        />
        Continue With Google
      </button>
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2.5 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
      >
        <Image
          src={'/images/svgs/apple-icon.svg'}
          width={24}
          height={24}
          alt='Google Icon'
        />
        Continue With Apple
      </button>
    </div >
  )
}

export default OAuth