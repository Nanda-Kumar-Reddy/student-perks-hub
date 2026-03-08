import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  listAllBookings,
} from "../controllers/bookings";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { createBookingSchema, updateBookingStatusSchema, paginationQuery, uuidParam } from "../validators/common";

const router = Router();

// Student routes
router.post("/", authenticate, validate(createBookingSchema), createBooking);
router.get("/mine", authenticate, validate(paginationQuery, "query"), getMyBookings);
router.get("/:id", authenticate, validate(uuidParam, "params"), getBooking);
router.patch("/:id/cancel", authenticate, validate(uuidParam, "params"), cancelBooking);

// Vendor/Admin routes
router.patch("/:id/status", authenticate, rbac("vendor", "admin"), validate(uuidParam, "params"), validate(updateBookingStatusSchema), updateBookingStatus);

// Admin routes
router.get("/", authenticate, rbac("admin"), validate(paginationQuery, "query"), listAllBookings);

export default router;
