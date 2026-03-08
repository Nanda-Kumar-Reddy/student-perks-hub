import { Router } from "express";
import { signup, login, googleLogin, refresh, logout, me } from "../controllers/auth";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import { signupSchema, loginSchema } from "../validators/auth";
import { googleLoginSchema } from "../validators/student/student";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.post("/signup", authLimiter, validate(signupSchema), catchErrors(signup));
router.post("/login", authLimiter, validate(loginSchema), catchErrors(login));
router.post("/google-login", authLimiter, validate(googleLoginSchema), catchErrors(googleLogin));
router.post("/refresh", catchErrors(refresh));
router.post("/logout", authenticate, catchErrors(logout));
router.get("/me", authenticate, catchErrors(me));

export default router;
