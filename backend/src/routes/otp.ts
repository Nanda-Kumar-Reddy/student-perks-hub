import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otp";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { sendOtpSchema, verifyOtpSchema } from "../validators/student";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.post("/send", authenticate, validate(sendOtpSchema), catchErrors(sendOtp));
router.post("/verify", authenticate, validate(verifyOtpSchema), catchErrors(verifyOtp));

export default router;
