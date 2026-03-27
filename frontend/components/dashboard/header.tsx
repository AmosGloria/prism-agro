"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavbarProps {
  userName?: string;
  walletBalance?: number;
  role?: string;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function DashboardNavbar({
  userName = "User",
  walletBalance,
  role = "buyer",
  onMenuToggle,
  menuOpen,
  searchPlaceholder = "Search produce, locations…",
  onSearch,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isAdmin = role === "admin";

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-10.25!"
      style={{
        height: "var(--navbar-height)",
        backgroundColor: isAdmin ? "var(--admin-surface)" : "var(--surface)",
        borderBottom: `1px solid ${isAdmin ? "var(--admin-border)" : "var(--border-light)"}`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left: Logo + hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-[#E6FEE7] transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isAdmin && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-semibold">
            Admin Mode
          </span>
        )}
      </div>

      {/* Center: Search */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex flex-1 max-w-md mx-6"
      >
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06930A]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all"
            style={
              {
                backgroundColor: isAdmin
                  ? "var(--admin-bg)"
                  : "var(--bg-subtle)",
                borderColor: isAdmin
                  ? "var(--admin-border)"
                  : "var(--border-light)",
                color: isAdmin ? "white" : "var(--text-primary)",
                "--tw-ring-color": "var(--accent-primary)",
              } as React.CSSProperties
            }
          />
        </div>
      </form>

      {/* Right: Wallet + Avatar */}
      <div className="flex items-center gap-3">
        {/* Wallet balance (non-admin) */}
        {!isAdmin && walletBalance !== undefined && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E6FEE7] border border-[#CEFDCF]">
            <Wallet
              size={14}
              className="text-[#08C40E]"
            />
            <span className="text-xs font-semibold text-[#046207]">
              ₦{walletBalance.toLocaleString()}
            </span>
          </div>
        )}

        {/* Avatar dropdown */}
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 rounded-md transition-colors"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{
                backgroundColor: isAdmin ? "#3B82F6" : "var(--brand-700)",
              }}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p
                className="text-xs font-semibold leading-tight"
                style={{ color: isAdmin ? "white" : "var(--text-primary)" }}
              >
                {userName}
              </p>
              <p
                className="text-[10px] capitalize"
                style={{ color: isAdmin ? "#9CA3AF" : "var(--text-muted)" }}
              >
                {role}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`hidden sm:block transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              style={{ color: isAdmin ? "#9CA3AF" : "var(--text-muted)" }}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-xl overflow-hidden z-50 animate-fade-up"
              style={{
                backgroundColor: isAdmin
                  ? "var(--admin-surface)"
                  : "var(--surface)",
                border: `1px solid ${isAdmin ? "var(--admin-border)" : "var(--border-light)"}`,
              }}
            >
              <Link
                href={`/${role}/profile`}
                className={cn("flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#F0FEF1]  transition-colors",
                  isAdmin ? "text-white hover:text-black" : "text-(--text-primary)"
                )}
                onClick={() => setDropdownOpen(false)}
              >
                <User
                  size={16}
                  className="text-[#06930A]"
                />
                Profile
              </Link>
              <div
                style={{
                  borderTop: `1px solid ${isAdmin ? "var(--admin-border)" : "var(--border-light)"}`,
                }}
              />
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header >
  );
}
