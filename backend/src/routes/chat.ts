import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { catchErrors } from "../utils/catchErrors";
import { getConversations, getMessages, startConversation } from "../controllers/chat";

const router = Router();

router.use(authenticate);

router.get("/conversations", catchErrors(getConversations));
router.get("/messages/:conversationId", catchErrors(getMessages));
router.post("/conversations", catchErrors(startConversation));

export default router;
