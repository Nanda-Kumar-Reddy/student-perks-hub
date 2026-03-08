import { Router } from "express";
import { getMyProfile, updateMyProfile, listProfiles } from "../controllers/profiles";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { updateProfileSchema, paginationQuery } from "../validators/common";
import catchErrors from "../utils/catchErrors";

const router = Router();

// Authenticated user routes
router.get("/me", authenticate, catchErrors(getMyProfile));
router.patch("/me", authenticate, validate(updateProfileSchema), catchErrors(updateMyProfile));

// Admin routes
router.get("/", authenticate, rbac("admin"), validate(paginationQuery, "query"), catchErrors(listProfiles));

export default router;
