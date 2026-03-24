'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Menu } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Farmers', href: '/#farmers' },
  { label: 'Buyers', href: '/#buyers' },
]

const getHashFromHref = (href: string) => href.split('#')[1] ?? null

const Navbar = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  // Required for createPortal SSR safety
  useEffect(() => { setMounted(true) }, [])

  // Close menu on route change
  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  // Close menu on Escape key
  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen, closeMenu])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    document.body.style.touchAction = isMenuOpen ? 'none' : ''
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isMenuOpen])

  // Scrollspy
  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => getHashFromHref(l.href))
      .filter(Boolean) as string[]

    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveHash(id) },
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
      )
      observer.observe(el)
      return observer
    })

    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    const hash = getHashFromHref(href)
    if (!hash) return
    e.preventDefault()
    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveHash(hash)
    }
    closeMenu()
  }, [closeMenu])

  const isActive = (href: string) => {
    const hash = getHashFromHref(href)
    if (!hash) return pathname === '/' && !activeHash
    return activeHash === hash
  }

  const linkClass = (href: string) =>
    `relative text-sm font-medium transition-colors hover:text-[#3EBB4A]
    after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
    after:bg-[#3EBB4A] after:transition-all hover:after:w-full
    ${isActive(href) ? 'text-[#3EBB4A] after:w-full' : 'text-white'}`

  const mobileLinkClass = (href: string) =>
    `block rounded-lg px-3 py-3 text-sm transition-colors hover:bg-white/5
    ${isActive(href) ? 'text-[#3EBB4A]' : 'text-white'}`

  const mobileMenu = (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-999 bg-black/60 transition-opacity duration-300 md:hidden
          ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed right-0 top-0 z-1000 flex h-full w-[80%] max-w-sm flex-col
          bg-[#0D0D0D] shadow-2xl transition-transform duration-300 ease-in-out md:hidden
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-end border-b border-white/10 px-4 py-4">
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="text-white transition-colors hover:text-[#3EBB4A]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav links */}
        <ul className="flex flex-col gap-1 px-4 py-6" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={mobileLinkClass(link.href)}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="mt-auto flex flex-col gap-3 px-4 pb-8">
          <Link
            href="/login"
            onClick={closeMenu}
            className="rounded-full border border-[#3EBB4A] px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#3EBB4A]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={closeMenu}
            className="rounded-full bg-[#3EBB4A] px-5 py-3 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0D0D0D]/80 backdrop-blur-md">
        <nav
          className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" onClick={closeMenu} aria-label="PrismAgro home">
            <Image
              src="/images/svgs/prism-agro-logo.svg"
              alt="PrismAgro"
              width={36}
              height={36}
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-8 md:flex" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={linkClass(link.href)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-[#3EBB4A] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3EBB4A]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#3EBB4A] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={toggleMenu}
            className="text-white md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* Portal renders overlay + drawer directly into <body>, outside <header> */}
      {mounted && createPortal(mobileMenu, document.body)}
    </>
  )
}

export default Navbar