import { Router } from "express";
import authRoutes from "./auth";
import otpRoutes from "./otp";
import profileRoutes from "./profiles";
import bookingRoutes from "./bookings";
import airportPickupRoutes from "./airportPickups";
import accommodationRoutes from "./accommodations";
import jobRoutes from "./jobs";
import loanRoutes from "./loans";
import consultationRoutes from "./consultations";
import accountingRoutes from "./accounting";
import carRoutes from "./cars";
import eventRoutes from "./events";
import certificationRoutes from "./certifications";
import drivingLicenseRoutes from "./drivingLicense";
import notificationRoutes from "./notifications";
import studentRoutes from "./students";
import adminRoutes from "./admin";
import vendorRoutes from "./vendor";

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

// ── Legacy ──────────────────────────────────────────
router.use("/bookings", bookingRoutes);

// ── Health Check ────────────────────────────────────
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
