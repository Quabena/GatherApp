import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import validateRequest from "../middleware/validateRequest.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import { eventSchema, updateEventSchema } from "../validation/eventSchemas.js";

const router = express.Router();

router.use(authenticateJWT);

router
  .route("/")
  .post(validateRequest(eventSchema), createEvent)
  .get(getEvents);

router
  .route("/:id")
  .get(getEvent)
  .patch(validateRequest(updateEventSchema), updateEvent)
  .delete(deleteEvent);

export default router;
