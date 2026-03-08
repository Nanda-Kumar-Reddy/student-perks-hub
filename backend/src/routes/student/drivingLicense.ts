import { Router } from "express";
import { bookDrivingLicense, getMyDrivingLicenseBookings } from "../../controllers/student/drivingLicense";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import { drivingLicenseSchema } from "../../validators/student/student";
import { paginationQuery } from "../../validators/common";
import catchErrors from "../../utils/catchErrors";

const router = Router();

router.post("/book", authenticate, rbac("student"), validate(drivingLicenseSchema), catchErrors(bookDrivingLicense));
router.get("/my-bookings", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyDrivingLicenseBookings));

export default router;
