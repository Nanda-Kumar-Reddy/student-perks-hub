/**
 * Admin Routes — protected by JWT + admin RBAC
 */
import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import catchErrors from "../../utils/catchErrors";
import * as adminController from "../../controllers/admin/admin";
import * as adminApprovalController from "../../controllers/admin/adminApprovalController";

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

// ── Vendor Details & Service Management ────────────
router.get("/vendors/:id/details", catchErrors(adminApprovalController.getVendorDetails));
router.post("/vendors/:id/services", catchErrors(adminApprovalController.addVendorService));
router.delete("/vendors/:id/services/:serviceId", catchErrors(adminApprovalController.removeVendorService));

// ── Approvals (Global) ────────────────────────────
router.get("/approvals", catchErrors(adminApprovalController.getPendingApprovals));
router.post("/approvals/:id/approve", catchErrors(adminApprovalController.approveItem));
router.post("/approvals/:id/reject", catchErrors(adminApprovalController.rejectItem));

// ── Transactions ───────────────────────────────────
router.get("/transactions", catchErrors(adminController.getTransactions));

// ── Analytics ──────────────────────────────────────
router.get("/analysis/revenue", catchErrors(adminController.getRevenueAnalytics));
router.get("/analysis/users", catchErrors(adminController.getUserAnalytics));
router.get("/analysis/vendors", catchErrors(adminController.getVendorAnalytics));
router.get("/analysis/category-distribution", catchErrors(adminController.getCategoryDistribution));

export default router;
