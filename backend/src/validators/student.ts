/**
 * Student Feature Validators
 */
import { z } from "zod";

// ── Airport Pickup ──────────────────────────────────
export const airportPickupSchema = z.object({
  flightNumber: z.string().trim().min(1, "Flight number required").max(50),
  arrivalDate: z.string().datetime("Invalid date format"),
  arrivalTime: z.string().trim().min(1, "Arrival time required").max(20),
  airport: z.string().trim().min(1, "Airport required").max(200),
  destination: z.string().trim().min(1, "Destination required").max(500),
  passengers: z.coerce.number().int().min(1).max(20).default(1),
  notes: z.string().trim().max(1000).optional(),
});

// ── Accommodation ───────────────────────────────────
export const accommodationEnquirySchema = z.object({
  accommodationId: z.string().uuid("Invalid accommodation ID"),
  message: z.string().trim().min(1, "Message required").max(2000),
});

export const accommodationChatSchema = z.object({
  accommodationId: z.string().uuid("Invalid accommodation ID"),
  message: z.string().trim().min(1, "Message required").max(2000),
});

// ── Job Application ─────────────────────────────────
export const jobApplicationSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  coverLetter: z.string().trim().max(5000).optional(),
});

// ── Loan Application ────────────────────────────────
export const loanApplicationSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive").max(1000000),
  purpose: z.string().trim().min(1, "Purpose required").max(300),
  description: z.string().trim().max(2000).optional(),
});

// ── Consultation ────────────────────────────────────
export const consultationSchema = z.object({
  consultantId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  topic: z.string().trim().min(1, "Topic required").max(300),
  message: z.string().trim().max(2000).optional(),
  date: z.string().datetime().optional(),
  timeSlot: z.string().trim().max(50).optional(),
});

// ── Accounting ──────────────────────────────────────
export const accountingBookingSchema = z.object({
  vendorId: z.string().uuid().optional(),
  service: z.string().trim().min(1, "Service required").max(300),
  message: z.string().trim().max(2000).optional(),
  date: z.string().datetime().optional(),
  timeSlot: z.string().trim().max(50).optional(),
});

// ── Car Request ─────────────────────────────────────
export const carRequestSchema = z.object({
  carTitle: z.string().trim().min(1, "Car title required").max(300),
  vendorId: z.string().uuid().optional(),
  type: z.enum(["rent", "sale"]),
  message: z.string().trim().max(2000).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ── Event Registration ──────────────────────────────
export const eventRegistrationSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  notes: z.string().trim().max(1000).optional(),
});

// ── Certification Request ───────────────────────────
export const certificationRequestSchema = z.object({
  certificationName: z.string().trim().min(1, "Certification name required").max(300),
  notes: z.string().trim().max(1000).optional(),
});

// ── Driving License ─────────────────────────────────
export const drivingLicenseSchema = z.object({
  licenseType: z.string().trim().min(1, "License type required").max(100),
  preferredDate: z.string().datetime().optional(),
  notes: z.string().trim().max(1000).optional(),
});

// ── OTP ─────────────────────────────────────────────
export const sendOtpSchema = z.object({
  purpose: z.enum(["signup", "password_reset", "verification"]),
});

export const verifyOtpSchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
  purpose: z.enum(["signup", "password_reset", "verification"]),
});

// ── Google Login ────────────────────────────────────
export const googleLoginSchema = z.object({
  googleId: z.string().min(1, "Google ID required"),
  email: z.string().trim().email("Invalid email").max(255),
  fullName: z.string().trim().min(1, "Name required").max(200),
  avatarUrl: z.string().url().optional(),
});
