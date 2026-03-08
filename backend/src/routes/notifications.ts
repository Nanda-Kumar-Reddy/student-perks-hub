import { Router } from "express";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../controllers/notification";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { paginationQuery, uuidParam } from "../validators/common";
import catchErrors from "../utils/catchErrors";

const router = Router();

router.get("/", authenticate, validate(paginationQuery, "query"), catchErrors(getMyNotifications));
router.get("/unread-count", authenticate, catchErrors(getUnreadCount));
router.patch("/:id/read", authenticate, validate(uuidParam, "params"), catchErrors(markAsRead));
router.patch("/read-all", authenticate, catchErrors(markAllAsRead));

export default router;
