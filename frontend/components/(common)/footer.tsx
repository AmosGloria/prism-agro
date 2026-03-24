import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface FooterLinkGroup {
  heading: string
  links: { label: string; href: string }[]
}

const footerLinkGroups: FooterLinkGroup[] = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'How it works', href: '/#how-it-works' },
      // { label: 'Contact Us', href: '/#contact' },
    ],
  },
  {
    heading: 'For Users',
    links: [
      { label: 'Farmers', href: '/#farmers' },
      { label: 'Buyers', href: '/#buyers' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms and Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Dispute Resolution', href: '/dispute-resolution' },
    ],
  },
]

const contactDetails = [
  { label: 'info@prismagro.com', href: 'mailto:ope@gmail.com' },
  { label: '09032325920', href: 'tel:09032325920' },
  { label: 'Lagos, Nigeria.', href: null },
]

const Footer = () => {
  return (
    <footer className="bg-white layout section">
      <div className="mx-auto w-full ">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Image
              src="/images/svgs/prism-agro-logo.svg"
              alt="PrismAgro logo"
              width={64}
              height={64}
              className="rounded-full"
            />
            <p className="max-w-50 text-sm leading-relaxed text-gray-700">
              Connecting farmers, buyers, and logistics for fair and fresh agricultural commerce.
            </p>
          </div>

          {/* Link groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-gray-900">{group.heading}</h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-[#3EBB4A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-900">Contact information</h3>
            <ul className="flex flex-col gap-2">
              {contactDetails.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-gray-600 transition-colors hover:text-[#3EBB4A]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-600">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider + copyright */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PrismAgro. All rights reserved.
          </p>
        </div>
      </div>
    </footer >
  )
}

export default Footer