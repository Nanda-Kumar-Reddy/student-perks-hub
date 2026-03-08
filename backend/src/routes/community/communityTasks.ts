import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import { validate } from "../../middleware/validate";
import {
  createCommunityTaskSchema,
  applyForTaskSchema,
  sendTaskMessageSchema,
  adminTaskActionSchema,
  adminEditTaskSchema,
  taskSearchQuery,
} from "../../validators/community";
import {
  createTask,
  listTasks,
  getTaskById,
  getMyTasks,
  applyForTask,
  updateTaskStatus,
  sendMessage,
  getMessages,
  getPendingTasks,
  approveTask,
  rejectTask,
  flagTask,
  editTask,
} from "../../controllers/community/communityTask";
import catchErrors from "../../utils/catchErrors";

const router = Router();

// ── Public (approved tasks) ─────────────────────────
router.get("/", validate(taskSearchQuery, "query"), catchErrors(listTasks));
router.get("/:id", catchErrors(getTaskById));

// ── Authenticated user routes ───────────────────────
router.post("/", authenticate, validate(createCommunityTaskSchema), catchErrors(createTask));
router.get("/user/my-posts", authenticate, catchErrors(getMyTasks));
router.post("/:id/apply", authenticate, validate(applyForTaskSchema), catchErrors(applyForTask));
router.patch("/:id/status", authenticate, catchErrors(updateTaskStatus));
router.post("/:id/messages", authenticate, validate(sendTaskMessageSchema), catchErrors(sendMessage));
router.get("/:id/messages", authenticate, catchErrors(getMessages));

// ── Admin routes ────────────────────────────────────
router.get("/admin/pending", authenticate, rbac("admin"), catchErrors(getPendingTasks));
router.post("/admin/:id/approve", authenticate, rbac("admin"), validate(adminTaskActionSchema), catchErrors(approveTask));
router.post("/admin/:id/reject", authenticate, rbac("admin"), validate(adminTaskActionSchema), catchErrors(rejectTask));
router.post("/admin/:id/flag", authenticate, rbac("admin"), validate(adminTaskActionSchema), catchErrors(flagTask));

export default router;
