/**
 * Vendor Services Routes
 */
import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import catchErrors from "../../utils/catchErrors";
import * as vendorServicesCtrl from "../../controllers/vendor/vendorServices";

const router = Router();

// ── Public listings (for students) ───────────────────
router.get("/listings/public", authenticate, catchErrors(vendorServicesCtrl.getPublicListings));

// ── Student creates a request ────────────────────────
router.post("/requests/student", authenticate, rbac("student"), catchErrors(vendorServicesCtrl.createStudentRequest));
router.get("/requests/student/mine", authenticate, rbac("student"), catchErrors(vendorServicesCtrl.getStudentServiceRequests));

// ── Vendor-only routes ───────────────────────────────
router.use(authenticate, rbac("vendor"));

// Services
router.get("/services", catchErrors(vendorServicesCtrl.getMyServices));
router.post("/services", catchErrors(vendorServicesCtrl.addService));
router.delete("/services/:id", catchErrors(vendorServicesCtrl.removeService));
router.patch("/services/:id/toggle", catchErrors(vendorServicesCtrl.toggleService));

// Listings
router.get("/listings", catchErrors(vendorServicesCtrl.getMyListings));
router.post("/listings", catchErrors(vendorServicesCtrl.createListing));
router.put("/listings/:id", catchErrors(vendorServicesCtrl.updateListing));
router.delete("/listings/:id", catchErrors(vendorServicesCtrl.deleteListing));

// Requests
router.get("/requests", catchErrors(vendorServicesCtrl.getMyRequests));
router.get("/requests/history", catchErrors(vendorServicesCtrl.getRequestHistory));
router.post("/requests/:id/approve", catchErrors(vendorServicesCtrl.approveRequest));
router.post("/requests/:id/reject", catchErrors(vendorServicesCtrl.rejectRequest));

export default router;
