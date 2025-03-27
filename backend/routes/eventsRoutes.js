import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  likeEvent,
  unlikeEvent,
  getEventReviews,
  addEventReview,
  getRegisteredEvents,
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

// Registration routes
router.post("/:id/register", registerForEvent);
router.post("/:id/unregister", unregisterFromEvent);

// Like routes
router.post("/:id/like", likeEvent);
router.post("/:id/unlike", unlikeEvent);

// Review routes
router.get("/:id/reviews", getEventReviews);
router.post("/:id/reviews", addEventReview);

// User's registered events
router.get("/user/registered", getRegisteredEvents);

export default router;
