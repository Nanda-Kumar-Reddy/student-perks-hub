/**
 * Admin Approval Routes
 */
import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import catchErrors from "../../utils/catchErrors";
import * as approvalCtrl from "../../controllers/admin/adminApprovals";

const router = Router();

router.use(authenticate, rbac("admin"));

// Approvals
router.get("/approvals", catchErrors(approvalCtrl.getPendingApprovals));
router.post("/approvals/:id/approve", catchErrors(approvalCtrl.approveAction));
router.post("/approvals/:id/reject", catchErrors(approvalCtrl.rejectAction));
router.get("/approvals/history", catchErrors(approvalCtrl.getApprovalHistory));

// Vendor details
router.get("/vendors/:id/details", catchErrors(approvalCtrl.getVendorDetails));

// Vendor service control
router.post("/vendors/services/add", catchErrors(approvalCtrl.addServiceForVendor));
router.post("/vendors/services/remove", catchErrors(approvalCtrl.removeServiceForVendor));

export default router;
