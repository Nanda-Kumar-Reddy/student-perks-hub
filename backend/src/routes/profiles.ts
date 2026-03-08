import { Router } from "express";
import { getMyProfile, updateMyProfile, listProfiles } from "../controllers/profiles";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { updateProfileSchema, paginationQuery } from "../validators/common";

const router = Router();

// Authenticated user routes
router.get("/me", authenticate, getMyProfile);
router.patch("/me", authenticate, validate(updateProfileSchema), updateMyProfile);

// Admin routes
router.get("/", authenticate, rbac("admin"), validate(paginationQuery, "query"), listProfiles);

export default router;
