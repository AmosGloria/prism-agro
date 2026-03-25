// User & Auth
export type UserRole = "buyer" | "farmer" | "logistics" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  walletBalance: number;
  ninVerified: boolean;
  createdAt: string;
}

// Listings / Produce
export type CropType =
  | "Tomato"
  | "Yam"
  | "Cassava"
  | "Maize"
  | "Rice"
  | "Pepper"
  | "Onion"
  | "Plantain"
  | "Carrot"
  | "Cabbage";

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropType: CropType;
  variety?: string;
  quantity: number; // kg
  pricePerKg: number; // NGN
  location: string;
  state: string;
  harvestTime: string; // ISO timestamp
  currentFreshness: number; // 0-100
  imageUrl?: string;
  status: "AVAILABLE" | "SOLD" | "EXPIRED";
  description?: string;
  createdAt: string;
}

// Orders ───
export type OrderStatus =
  | "PENDING"
  | "PAYMENT_HELD"
  | "IN_TRANSIT"
  | "SHIPPED"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED";

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  logisticsId?: string;
  logisticsName?: string;
  listingId: string;
  cropType: CropType;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  releaseCode?: string; // 6-digit
  pickupAddress: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

// Disputes 
export interface Dispute {
  id: string;
  orderId: string;
  buyerId: string;
  reason: string;
  photoUrl?: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  createdAt: string;
}

// Payments / Escrow 
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: "HELD" | "RELEASED" | "REFUNDED" | "DISPUTED";
  createdAt: string;
  releasedAt?: string;
}

// Sidebar Config 
export interface SidebarLink {
  label: string;
  href: string;
  icon: string; // lucide icon name
  badge?: number; // notification count
}

export interface SidebarConfig {
  role: UserRole;
  links: SidebarLink[];
  accentColor?: string;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FormData {
  cropType: CropType | "";
  variety: string;
  quantity: string;
  pricePerKg: string;
  location: string;
  state: string;
  harvestTime: string;
  description: string;
}

export interface DisputeCase {
  id: string;
  orderId: string;
  buyerName: string;
  farmerName: string;
  cropType: string;
  amount: number;
  reason: string;
  photoUrl?: string;
  createdAt: string;
  status: 'OPEN' | 'RESOLVED_BUYER' | 'RESOLVED_FARMER';
}