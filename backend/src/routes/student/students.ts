import { Router } from "express";
import { getMyBookings, getMyRequests } from "../controllers/studentDashboard";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { paginationQuery } from "../validators/common";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.get("/my-bookings", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyBookings));
router.get("/my-requests", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyRequests));

export default router;
