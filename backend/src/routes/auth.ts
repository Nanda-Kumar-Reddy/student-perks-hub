import { Router } from "express";
import { signup, login, googleLogin, refresh, logout, me, forgotPassword, resetPassword, changePassword } from "../controllers/auth";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../validators/auth";
import { googleLoginSchema } from "../validators/student/student";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.post("/signup", authLimiter, validate(signupSchema), catchErrors(signup));
router.post("/login", authLimiter, validate(loginSchema), catchErrors(login));
router.post("/google-login", authLimiter, validate(googleLoginSchema), catchErrors(googleLogin));
router.post("/refresh", catchErrors(refresh));
router.post("/logout", authenticate, catchErrors(logout));
router.get("/me", authenticate, catchErrors(me));
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), catchErrors(forgotPassword));
router.post("/reset-password", validate(resetPasswordSchema), catchErrors(resetPassword));
router.post("/change-password", authenticate, validate(changePasswordSchema), catchErrors(changePassword));

export default router;
