import { Router } from "express";
import authRoutes from "./auth";
import otpRoutes from "./otp";
import profileRoutes from "./profiles";
import bookingRoutes from "./bookings";
import notificationRoutes from "./notifications";

// Student feature routes
import airportPickupRoutes from "./student/airportPickups";
import accommodationRoutes from "./student/accommodations";
import jobRoutes from "./student/jobs";
import loanRoutes from "./student/loans";
import consultationRoutes from "./student/consultations";
import accountingRoutes from "./student/accounting";
import carRoutes from "./student/cars";
import eventRoutes from "./student/events";
import certificationRoutes from "./student/certifications";
import drivingLicenseRoutes from "./student/drivingLicense";
import studentRoutes from "./student/students";

// Admin routes
import adminRoutes from "./admin/admin";

// Vendor routes
import vendorRoutes from "./vendor/vendor";

// Community routes
import communityRoutes from "./community/communityTasks";

// Chat routes
import chatRoutes from "./chat";

// Payment routes
import paymentRoutes from "./payment";

const router = Router();

// ── Auth & OTP ──────────────────────────────────────
router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);

// ── User ────────────────────────────────────────────
router.use("/profiles", profileRoutes);
router.use("/notifications", notificationRoutes);

// ── Student Features ────────────────────────────────
router.use("/airport-pickups", airportPickupRoutes);
router.use("/accommodations", accommodationRoutes);
router.use("/jobs", jobRoutes);
router.use("/loans", loanRoutes);
router.use("/consultations", consultationRoutes);
router.use("/accounting", accountingRoutes);
router.use("/cars", carRoutes);
router.use("/events", eventRoutes);
router.use("/certifications", certificationRoutes);
router.use("/driving-license", drivingLicenseRoutes);
router.use("/students", studentRoutes);

// ── Admin Portal ────────────────────────────────────
router.use("/admin", adminRoutes);

// ── Vendor Portal ──────────────────────────────────
router.use("/vendor", vendorRoutes);

// ── Community Tasks ────────────────────────────────
router.use("/community/tasks", communityRoutes);

// ── Chat ────────────────────────────────────────────
router.use("/chat", chatRoutes);

// ── Payments ────────────────────────────────────────
router.use("/payments", paymentRoutes);

// ── Legacy ──────────────────────────────────────────
router.use("/bookings", bookingRoutes);

// ── Health Check ────────────────────────────────────
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
