import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const stats = [
  { number: '200+', label: 'Agricultural plants' },
  { number: '6500+', label: 'Active Farmers', bg: 'black' },
  { number: '50k', label: 'Satisfied Clients' }
]


const AppHero = () => {
  return (
    <header
      className="layout pt-10 pb-30 bg-[linear-gradient(180deg,#E6FEE7_0%,rgba(240,254,241,0.5)_100%)] min-h-screen"
    >

      <div className='flex  items-center justify-between '>
        <section className="max-w-173.5 w-full text-center md:text-left">
          <h1 className="text-[24px] sm:text-[28px] lg:text-[2rem] text-[#023103] lg:leading-13.5 font-semibold">
            Connect Farmers to Buyers Directly.
            <span className="inline-flex md:block">Fair Prices. Fresh Produce. Secure Payments.</span>
          </h1>
          <p className="text-xl lg:text-[24px] tracking-[0.5px]">
            Eliminate middlemen exploitation and produce waste through direct connections, guaranteed escrow payments, and coordinated logistics.
          </p>

          <Link
            href={'/login'}
            className="block mt-6 p-4 rounded-full bg-[#023103]/95 text-[#6CF970] font-medium text-lg max-w-105.75 w-full text-center hover:bg-[#023103] mx-auto md:mx-0"
          >
            Get Started
          </Link>
        </section>

        <section className="hidden md:block">
          <div className='ml-37.5 w-59 h-65.5 rounded-[20px] overflow-hidden'>
            <Image
              src={'/images/farm-land-1.jpg'}
              width={236}
              height={262}
              alt='farm land.'
              className='w-full h-full  object-cover'
              loading="lazy"
            />
          </div>
          <div className='z-1 -mt-20 w-57 h-65.5 rounded-[20px] overflow-hidden'>
            <Image
              src={'/images/maize-field.jpg'}
              width={228}
              height={262}
              alt='farm land.'
              className='w-full h-full object-cover'
              loading="lazy"
            />
          </div>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center mt-12 gap-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className={cn( 'p-5 rounded-[10px] text-center space-y-5',
            stat.bg === 'black' ? 'bg-background text-foreground' : 'bg-[#F5FFF5] shadow-[0px_4px_4px_0px_#CEFDCF]'
          )}>

            <p className={cn('font-bold text-[2rem] leading-6 tracking-[0.25px]',
              stat.bg === 'black' ? 'text-white' : 'text-[#10B981]'
            )}>{stat.number}</p>
            <p className={cn('font-normal text-[24px] leading-6 tracking-[0.25px]',
              stat.bg === 'black' ? 'text-white' : 'text-[#023103]'
            )}>{stat.label}</p>
          </div>
        ))}
      </div>
    </header>
  )
}

export default AppHero