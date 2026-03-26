import React from "react";
import Link from "next/link";

interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Illustrated empty state */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full bg-[#E6FEE7] flex items-center justify-center">
          {icon ?? (
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
            >
              <circle
                cx="28"
                cy="28"
                r="28"
                fill="#CEFDCF"
              />
              <path
                d="M18 36c0-5.523 4.477-10 10-10s10 4.477 10 10"
                stroke="#08C40E"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="22"
                cy="22"
                r="3"
                fill="#3BF741"
              />
              <circle
                cx="34"
                cy="22"
                r="3"
                fill="#3BF741"
              />
              <path
                d="M28 14v4M20 18l2.8 2.8M36 18l-2.8 2.8"
                stroke="#06930A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0AF511] flex items-center justify-center shadow-md">
          <span className="text-white text-lg font-bold">!</span>
        </div>
      </div>

      <h3
        className="text-xl font-bold text-[#023103] mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="text-sm text-[#06930A] max-w-xs mb-8">{description}</p>

      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#08C40E] text-white font-semibold text-sm hover:bg-[#06930A] transition-all shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#08C40E] text-white font-semibold text-sm hover:bg-[#06930A] transition-all shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}
