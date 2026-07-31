export type AppRole = "student" | "vendor" | "admin";

export type ServiceType =
  | "ACCOMMODATION"
  | "CAR_RENT_SALE"
  | "CONSULTATIONS"
  | "ACCOUNTING"
  | "DRIVING_LICENCE"
  | "LOANS"
  | "AIRPORT_PICKUP"
  | "CERTIFICATIONS"
  | "EVENTS"
  | "JOBS";

export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled"
  | "refunded"
  | "partially_refunded";

export type CommunityTaskStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "FLAGGED"
  | "FILLED"
  | "CANCELLED"
  | "COMPLETED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: AppRole;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

export interface AuthSession {
  user: AppUser;
  accessToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  status: number;
  body?: unknown;
}

export interface VendorProfile {
  id: string;
  userId: string;
  businessName: string;
  phone?: string;
  address?: string;
  category?: string;
  about?: string;
  certifications?: string[];
  qualifications?: string[];
  expertise?: string[];
}

export interface VendorListing {
  id: string;
  vendorServiceId: string;
  vendorId: string;
  serviceType: ServiceType;
  title: string;
  description?: string;
  price?: number;
  imageUrls: string[];
  metadata?: Record<string, unknown>;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VendorRequest {
  id: string;
  listingId?: string;
  vendorId: string;
  studentId: string;
  serviceType: ServiceType;
  message?: string;
  status: RequestStatus;
  rejectReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationItem {
  id: string;
  otherUser: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  online?: boolean;
  role?: AppRole;
  businessName?: string;
  category?: string;
  rating?: number;
  address?: string;
  phone?: string;
  email?: string;
    about?: string;
  };
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageText: string;
  createdAt: string;
  isRead: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface CommunityTask {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  payment: number;
  status: CommunityTaskStatus;
  requiresExperience: boolean;
  requiresTransport: boolean;
  requiresPoliceCheck: boolean;
  requiresChildrenCheck: boolean;
  requiresFirstAid: boolean;
  showPhonePublicly: boolean;
  chatThroughApp: boolean;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  applications?: TaskApplication[];
  messages?: TaskMessage[];
  user?: { id: string; fullName: string; avatarUrl?: string };
}

export interface TaskApplication {
  id: string;
  taskId: string;
  userId: string;
  message?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; fullName: string; avatarUrl?: string };
}

export interface TaskMessage {
  id: string;
  taskId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: { id: string; fullName: string; avatarUrl?: string };
}

export interface Coupon {
  id: string;
  vendorId: string;
  templateType: string;
  couponTitle: string;
  discountValue: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  vendorId?: string;
  bookingId?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
  stripeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  refundedAmount?: number;
  createdAt: string;
  updatedAt: string;
}
