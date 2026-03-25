"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  ShoppingBag,
  Truck,
  ClipboardList,
  ShieldAlert,
  LayoutDashboard,
  Sprout,
  PlusCircle,
  PackageCheck,
  Settings,
  Package,
  Route,
  Banknote,
  Users,
  BookOpen,
  Vault,
  Gavel,
  X,
} from "lucide-react";
import type { SidebarLink, UserRole } from "@/types";
import Image from "next/image";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Store,
  ShoppingBag,
  Truck,
  ClipboardList,
  ShieldAlert,
  LayoutDashboard,
  Sprout,
  PlusCircle,
  PackageCheck,
  Settings,
  Package,
  Route,
  Banknote,
  Users,
  BookOpen,
  Vault,
  Gavel,
};

interface SidebarProps {
  links: SidebarLink[];
  role: UserRole;
  open: boolean;
  onClose: () => void;
  userName?: string;
}

const ROLE_ACCENT: Record<
  UserRole,
  {
    bg: string;
    text: string;
    activeBg: string;
    activeText: string;
    hover: string;
    logo: string;
  }
> = {
  buyer: {
    bg: "#F5FFF5",
    text: "#046207",
    activeBg: "#023103",
    activeText: "#FFFFFF",
    hover: "#E6FEE7",
    logo: "#08C40E",
  },
  farmer: {
    bg: "#F5FFF5",
    text: "#046207",
    activeBg: "#023103",
    activeText: "#FFFFFF",
    hover: "#E6FEE7",
    logo: "#08C40E",
  },
  logistics: {
    bg: "#F5FFF5",
    text: "#046207",
    activeBg: "#023103",
    activeText: "#FFFFFF",
    hover: "#E6FEE7",
    logo: "#08C40E",
  },
  admin: {
    bg: "#0A0F1E",
    text: "#9CA3AF",
    activeBg: "#1E40AF",
    activeText: "#FFFFFF",
    hover: "#111827",
    logo: "#3B82F6",
  },
};

export function Sidebar({
  links,
  role,
  open,
  onClose,
  userName,
}: SidebarProps) {
  const pathname = usePathname();
  const accent = ROLE_ACCENT[role];

  const sidebarContent = (
    <nav
      className="flex flex-col h-full border-r-2 border-neutral-500"
      style={{ backgroundColor: accent.bg, width: "var(--sidebar-width)" }}
    >
      {/* Role badge */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          borderBottom: `1px solid ${role === "admin" ? "#1F2937" : "#CEFDCF"}`,
        }}
      >
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src={"/images/svgs/prism-agro-logo.svg"}
              width={50}
              height={50}
              alt="Logo"
            />
          </Link>
          <div>
            <p
              className="text-[10px] uppercase tracking-widest font-semibold mb-0.5"
              style={{ color: role === "admin" ? "#6B7280" : "#9DFBA0" }}
            >
              {role} portal
            </p>
            <p
              className="text-sm font-bold truncate max-w-[150px]"
              style={{
                fontFamily: "var(--font-display)",
                color: role === "admin" ? "white" : "#023103",
              }}
            >
              {userName ?? "Welcome"}
            </p>
          </div>
        </div>
        {/* Close on mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-black/10 transition-colors"
          style={{ color: accent.text }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Links */}
      <ul className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = ICON_MAP[link.icon] ?? Store;
          const isActive =
            pathname === link.href || pathname?.startsWith(link.href + "/");

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
                style={{
                  backgroundColor: isActive ? accent.activeBg : "transparent",
                  color: isActive ? accent.activeText : accent.text,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      accent.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                <Icon
                  size={18}
                  className="shrink-0 transition-transform group-hover:scale-110"
                />
                <span className="flex-1">{link.label}</span>
                {link.badge ? (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.2)"
                        : accent.logo,
                      color: isActive ? "white" : "white",
                    }}
                  >
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom branding */}
      <div
        className="px-5 py-4"
        style={{
          borderTop: `1px solid ${role === "admin" ? "#1F2937" : "#CEFDCF"}`,
        }}
      >
        <p
          className="text-[10px]"
          style={{ color: role === "admin" ? "#4B5563" : "#9DFBA0" }}
        >
          Powered by <span className="font-semibold">PrismAgro Escrow</span>
        </p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <aside className="hidden md:flex shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile: drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full shadow-2xl animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
