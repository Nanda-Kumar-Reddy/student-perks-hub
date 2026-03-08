import { Router } from "express";
import { createCarRequest, getMyCarRequests } from "../../controllers/student/car";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import { carRequestSchema } from "../../validators/student/student";
import { paginationQuery } from "../../validators/common";
import catchErrors from "../../utils/catchErrors";

const router = Router();

router.post("/request", authenticate, rbac("student"), validate(carRequestSchema), catchErrors(createCarRequest));
router.get("/my-requests", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyCarRequests));

export default router;
