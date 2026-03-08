import { Router } from "express";
import authRoutes from "./auth";
import profileRoutes from "./profiles";
import bookingRoutes from "./bookings";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/bookings", bookingRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
