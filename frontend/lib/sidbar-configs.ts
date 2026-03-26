import type { SidebarConfig } from "@/types";

export const SIDEBAR_CONFIGS: Record<string, SidebarConfig> = {
  buyer: {
    role: "buyer",
    links: [
      { label: "Marketplace", href: "/buyer/marketplace", icon: "Store" },
      { label: "My Orders", href: "/buyer/orders", icon: "ShoppingBag" },
      { label: "Track Shipments", href: "/buyer/track", icon: "Truck" },
      { label: "Order History", href: "/buyer/history", icon: "ClipboardList" },
      { label: "Dispute Center", href: "/buyer/dispute", icon: "ShieldAlert" },
    ],
  },
  farmer: {
    role: "farmer",
    links: [
      {
        label: "Dashboard",
        href: "/farmer/",
        icon: "LayoutDashboard",
      },
      { label: "My Produce", href: "/farmer/inventory", icon: "Sprout" },
      { label: "Add Listing", href: "/farmer/add", icon: "PlusCircle" },
      { label: "Order History", href: "/farmer/orders", icon: "PackageCheck" },
      { label: "Settings", href: "/farmer/settings", icon: "Settings" },
    ],
  },
  logistics: {
    role: "logistics",
    links: [
      { label: "Available Loads", href: "/logistics/loads", icon: "Package" },
      {
        label: "Active Shipments",
        href: "/logistics/shipments",
        icon: "Truck",
      },
      { label: "Route History", href: "/logistics/history", icon: "Route" },
      { label: "Earnings", href: "/logistics/earnings", icon: "Banknote" },
      { label: "Settings", href: "/logistics/settings", icon: "Settings" },
    ],
  },
  admin: {
    role: "admin",
    links: [
      { label: "User Directory", href: "/admin/users", icon: "Users" },
      { label: "Order Ledger", href: "/admin/orders", icon: "BookOpen" },
      { label: "Escrow Audit", href: "/admin/escrow", icon: "Vault" },
      { label: "Dispute Resolution", href: "/admin/disputes", icon: "Gavel" },
    ],
  },
};
