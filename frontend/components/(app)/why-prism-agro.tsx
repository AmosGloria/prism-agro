import Image from 'next/image'

interface FeatureItem {
  text: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
}

const primaryFeature: FeatureItem = {
  text: 'Direct connection between farmers and buyers eliminates middlemen markup, ensuring fair compensation for farmers and competitive prices for buyers.',
  image: {
    src: '/images/vegetables.jpg',
    alt: 'Fresh vegetables',
    width: 514,
    height: 450,
  },
}

const secondaryFeatures: FeatureItem[] = [
  {
    text: 'Secure escrow system protects all parties, ensuring farmers get paid promptly and buyers receive their orders with full payment protection.',
    image: {
      src: '/images/grain.jpg',
      alt: 'Grains',
      width: 482,
      height: 170,
    },
  },
  {
    text: 'Time-bound listings and coordinated logistics minimize spoilage, ensuring fresh produce reaches buyers quickly and efficiently.',
    image: {
      src: '/images/tomatoes.jpg',
      alt: 'Tomatoes',
      width: 482,
      height: 170,
    },
  },
]

const WhyPrismAgro = () => {
  return (
    <section id="about" className="bg-[#F5FFF5] section layout">
      <div className="mx-auto w-full ">

        <h2 className="text-2xl font-semibold md:text-3xl">
          Why PrismAgro
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2">

          {/* Primary card — tall, full height */}
          <div className="flex flex-col">
            <p className="text-lg md:text-xl">{primaryFeature.text}</p>
            <div className="relative mt-4 w-full flex-1 overflow-hidden rounded-2xl">
              <Image
                src={primaryFeature.image.src}
                alt={primaryFeature.image.alt}
                width={primaryFeature.image.width}
                height={primaryFeature.image.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Secondary cards — stacked */}
          <div className="flex flex-col gap-8">
            {secondaryFeatures.map((feature) => (
              <div key={feature.image.alt} className="flex flex-col">
                <p className="text-lg md:text-xl">{feature.text}</p>
                <div className="relative mt-4 h-40 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={feature.image.src}
                    alt={feature.image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default WhyPrismAgro