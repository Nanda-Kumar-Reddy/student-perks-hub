import { Router } from "express";
import { createChat, createEnquiry, getMyEnquiries } from "../../controllers/student/accommodation";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import { accommodationChatSchema, accommodationEnquirySchema } from "../../validators/student/student";
import { paginationQuery } from "../../validators/common";
import catchErrors from "../../utils/catchErrors";

const router = Router();

router.post("/chat", authenticate, rbac("student"), validate(accommodationChatSchema), catchErrors(createChat));
router.post("/enquiry", authenticate, rbac("student"), validate(accommodationEnquirySchema), catchErrors(createEnquiry));
router.get("/my-enquiries", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyEnquiries));

export default router;
