import { Router } from "express";
import { bookConsultation, getMyConsultations } from "../../controllers/student/consultation";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import { consultationSchema } from "../../validators/student/student";
import { paginationQuery } from "../../validators/common";
import catchErrors from "../../utils/catchErrors";

const router = Router();

router.post("/book", authenticate, rbac("student"), validate(consultationSchema), catchErrors(bookConsultation));
router.get("/my-bookings", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyConsultations));

export default router;
