import { Router } from "express";
import { requestCertification, getMyCertificationRequests } from "../controllers/certification";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { certificationRequestSchema } from "../validators/student";
import { paginationQuery } from "../validators/common";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.post("/request", authenticate, rbac("student"), validate(certificationRequestSchema), catchErrors(requestCertification));
router.get("/my-requests", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyCertificationRequests));

export default router;
