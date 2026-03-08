/**
 * Admin Routes — protected by JWT + admin RBAC
 */
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import catchErrors from "../utils/catchErrors";
import * as adminController from "../controllers/admin";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, rbac("admin"));

// ── Dashboard ──────────────────────────────────────
router.get("/dashboard", catchErrors(adminController.getDashboard));

// ── Users Management ───────────────────────────────
router.get("/users", catchErrors(adminController.getUsers));

// ── Vendors Management ─────────────────────────────
router.get("/vendors", catchErrors(adminController.getVendors));
router.patch("/vendors/:id/approve", catchErrors(adminController.approveVendor));
router.patch("/vendors/:id/reject", catchErrors(adminController.rejectVendor));

// ── Transactions ───────────────────────────────────
router.get("/transactions", catchErrors(adminController.getTransactions));

// ── Analytics ──────────────────────────────────────
router.get("/analysis/revenue", catchErrors(adminController.getRevenueAnalytics));
router.get("/analysis/users", catchErrors(adminController.getUserAnalytics));
router.get("/analysis/vendors", catchErrors(adminController.getVendorAnalytics));
router.get("/analysis/category-distribution", catchErrors(adminController.getCategoryDistribution));

export default router;
