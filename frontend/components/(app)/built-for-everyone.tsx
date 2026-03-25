import Image from 'next/image'
import React from 'react'

interface FeatureCard {
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  title: string
  description: string[]
  reversed?: boolean
}

const featureCards: FeatureCard[] = [
  {
    image: {
      src: '/images/svgs/man-harvest-tomato.jpg',
      alt: 'Man harvesting tomatoes',
      width: 506,
      height: 287,
    },
    title: 'Sell Direct, Earn More',
    description: [
      'List produce with photos and pricing',
      'Receive payment within days, not weeks',
      'Access broader markets beyond local intermediaries',
      'Track earnings and successful deliveries'
    ],
  },
  {
    image: {
      src: '/images/svgs/business-meeting.jpg',
      alt: 'Business discussion',
      width: 506,
      height: 287,
    },
    title: 'Fresh Produce, Transparent Pricing',
    description: [
      'Browse verified fresh produce with harvest dates',
      'Join group buying for bulk discounts',
      'Track deliveries in real-time'
    ],
    reversed: true,
  },
]

interface FeatureCardProps {
  card: FeatureCard
}

const FeatureCardRow = ({ card }: FeatureCardProps) => {
  const { image, title, description, reversed } = card

  return (
    <div
      className={`flex flex-col items-center gap-10 md:flex-row ${reversed ? 'md:flex-row-reverse' : ''
        }`}
    >
      <div className="w-full max-w-126.5 overflow-hidden rounded-[20px]">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="max-w-xl">
        <h3 className="text-xl font-semibold md:text-2xl">{title}</h3>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-base text-gray-600 md:text-lg">
          {description.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const BuiltForEveryone = () => {
  return (
    <section 
      id='farmers'
    className="bg-[#F5F5F5] py-16"
    >
      <div className="mx-auto w-full max-w-265.5 px-4 lg:px-20">
        <h2 className="text-center text-2xl font-semibold md:text-3xl">
          Built for Everyone in Agricultural Commerce
        </h2>

        <div className="mt-12 flex flex-col gap-17.5">
          {featureCards.map((card) => (
            <FeatureCardRow key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BuiltForEveryone