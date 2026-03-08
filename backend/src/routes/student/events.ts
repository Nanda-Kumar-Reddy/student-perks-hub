import { Router } from "express";
import { registerForEvent, getMyEventRegistrations } from "../controllers/event";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { eventRegistrationSchema } from "../validators/student";
import { paginationQuery } from "../validators/common";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.post("/register", authenticate, rbac("student"), validate(eventRegistrationSchema), catchErrors(registerForEvent));
router.get("/my-registrations", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyEventRegistrations));

export default router;
