import { Router } from "express";
import { applyForJob, getMyApplications } from "../controllers/jobApplication";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { jobApplicationSchema } from "../validators/student";
import { paginationQuery } from "../validators/common";
import { upload } from "../middleware/upload";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.post("/apply", authenticate, rbac("student"), upload.single("resume"), validate(jobApplicationSchema), catchErrors(applyForJob));
router.get("/my-applications", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyApplications));

export default router;
