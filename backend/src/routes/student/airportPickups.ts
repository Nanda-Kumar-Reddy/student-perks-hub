import { Router } from "express";
import { createAirportPickup, getMyAirportPickups } from "../../controllers/student/airportPickup";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import { airportPickupSchema } from "../../validators/student/student";
import { paginationQuery } from "../../validators/common";
import catchErrors from "../../utils/catchErrors";

const router = Router();

router.post("/", authenticate, rbac("student"), validate(airportPickupSchema), catchErrors(createAirportPickup));
router.get("/my-requests", authenticate, rbac("student"), validate(paginationQuery, "query"), catchErrors(getMyAirportPickups));

export default router;
