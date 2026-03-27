'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';

// Animated falling produce
const PRODUCE = ['🍅', '🥔', '🌶️', '🌽', '🥬', '🧅', '🍌', '🥕', '🌿', '🍚'];

function FallingEmoji({ emoji, delay, left }: { emoji: string; delay: number; left: number }) {
  return (
    <span
      className="fixed text-2xl pointer-events-none select-none"
      style={{
        left: `${left}%`,
        top: '-2rem',
        animation: `fall 4s linear ${delay}s infinite`,
        opacity: 0.25,
      }}
    >
      {emoji}
    </span>
  );
}

export default function NotFound() {
  const router = useRouter();
  const [items] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      emoji: PRODUCE[i % PRODUCE.length],
      delay: Math.random() * 3,
      left: Math.random() * 95,
    }))
  );
  const [count, setCount] = useState(5);

  // Auto-redirect countdown
  useEffect(() => {
    if (count <= 0) { router.push('/buyer/marketplace'); return; }
    const id = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [count, router]);

  return (
    <>
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-2rem) rotate(0deg);   opacity: 0;    }
          10%  { opacity: 0.25; }
          90%  { opacity: 0.25; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0;    }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes grow {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.08) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Falling produce background */}
      {items.map((item, i) => (
        <FallingEmoji key={i} {...item} />
      ))}

      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F0FEF1 0%, #E6FEE7 60%, #CEFDCF 100%)' }}
      >
        {/* Blob decorations */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 -translate-y-1/3 translate-x-1/3"
          style={{ background: '#08C40E' }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 translate-y-1/3 -translate-x-1/3"
          style={{ background: '#046207' }} />

        {/* Main card */}
        <div
          className="relative bg-white rounded-3xl p-10 text-center max-w-md w-full"
          style={{
            border: '1px solid #CEFDCF',
            boxShadow: '0 24px 64px rgba(2,49,3,0.12)',
            animation: 'slideUp .5s ease both',
          }}
        >
          {/* Big floating emoji */}
          <div
            className="text-8xl mb-6 block"
            style={{ animation: 'float 3s ease-in-out infinite, grow .6s ease both' }}
          >
            🌾
          </div>

          {/* 404 */}
          <div
            className="text-8xl font-black mb-2 leading-none"
            style={{
              fontFamily: 'var(--font-display, Syne, sans-serif)',
              background: 'linear-gradient(135deg, #023103, #08C40E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'slideUp .5s .1s ease both',
              opacity: 0,
            }}
          >
            404
          </div>

          <h1
            className="text-xl font-bold text-[#023103] mb-2"
            style={{
              fontFamily: 'var(--font-display, Syne, sans-serif)',
              animation: 'slideUp .5s .2s ease both',
              opacity: 0,
            }}
          >
            Harvest not found
          </h1>

          <p
            className="text-sm text-[#06930A] mb-8 leading-relaxed"
            style={{ animation: 'slideUp .5s .3s ease both', opacity: 0 }}
          >
            Looks like this page was picked before you got here — or it never grew in the first place.
          </p>

          {/* Countdown bar */}
          <div
            className="mb-8"
            style={{ animation: 'slideUp .5s .35s ease both', opacity: 0 }}
          >
            <div className="flex items-center justify-between text-xs text-[#9DFBA0] mb-2">
              <span>Redirecting to Marketplace…</span>
              <span className="font-bold text-[#08C40E]">{count}s</span>
            </div>
            <div className="h-1.5 bg-[#E6FEE7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#08C40E] rounded-full transition-all duration-1000"
                style={{ width: `${(count / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex gap-3"
            style={{ animation: 'slideUp .5s .4s ease both', opacity: 0 }}
          >
            <button
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#CEFDCF] text-[#046207] font-semibold text-sm hover:bg-[#F0FEF1] transition-all"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <Link
              href="/buyer/marketplace"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm hover:bg-[#06930A] transition-all"
              style={{
                background: '#08C40E',
                boxShadow: '0 4px 16px rgba(8,196,14,0.3)',
                fontFamily: 'var(--font-display, Syne, sans-serif)',
              }}
            >
              <Home size={16} /> Marketplace
            </Link>
          </div>

          {/* Quick links */}
          <div
            className="mt-6 pt-5 border-t border-[#F0FEF1]"
            style={{ animation: 'slideUp .5s .5s ease both', opacity: 0 }}
          >
            <p className="text-xs text-[#9DFBA0] mb-3 font-medium">Quick links</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: '🛒 Marketplace', href: '/buyer/marketplace' },
                { label: '📦 My Orders', href: '/buyer/orders' },
                { label: '🌾 Farmer Hub', href: '/farmer/dashboard' },
                { label: '🛡 Admin', href: '/admin/disputes' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: '#F0FEF1',
                    color: '#046207',
                    border: '1px solid #CEFDCF',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#E6FEE7';
                    (e.currentTarget as HTMLElement).style.borderColor = '#9DFBA0';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '#F0FEF1';
                    (e.currentTarget as HTMLElement).style.borderColor = '#CEFDCF';
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          className="mt-8 text-xs text-[#6CF970]"
          style={{ animation: 'slideUp .5s .6s ease both', opacity: 0 }}
        >
          Protected by <span className="font-semibold text-[#08C40E]">PrismAgro Escrow Vault</span>
        </p>
      </div>
    </>
  );
}