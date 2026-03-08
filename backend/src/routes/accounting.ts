import { Router } from "express";
import { bookAccounting, getMyAccountingBookings } from "../controllers/accounting";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { accountingBookingSchema } from "../validators/student";
import { paginationQuery } from "../validators/common";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.post("/book", authenticate, rbac("student"), validate(accountingBookingSchema), catchErrors(bookAccounting));
router.get("/my-bookings", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyAccountingBookings));

export default router;
