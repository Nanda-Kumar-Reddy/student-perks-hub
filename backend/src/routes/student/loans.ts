import { Router } from "express";
import { applyForLoan, getMyLoanApplications } from "../../controllers/student/loan";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import { loanApplicationSchema } from "../../validators/student/student";
import { paginationQuery } from "../../validators/common";
import catchErrors from "../../utils/catchErrors";

const router = Router();

router.post("/apply", authenticate, rbac("student"), validate(loanApplicationSchema), catchErrors(applyForLoan));
router.get("/my-applications", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyLoanApplications));

export default router;
