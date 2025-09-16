import { Router } from "express";
import {
  addMessagePage,
  addMessageToExistingEvent,
  createEvent,
  eventPage,
  fetchContactGroupMembers,
  getEventDetails,
  fetchContacts,
  editEventPage,
  getEventDetailsWithUniqueId,
  allEventsPage,
  editEventDetails
} from "../controller/event.js";
import { uploadMultiple } from "../middleware/multer.js";

let router = Router();

router.get("/", eventPage);
router.post("/", uploadMultiple, createEvent);
router.get("/all", allEventsPage);
router.get("/edit/:eventId", editEventPage);
router.post("/edit/:eventId", uploadMultiple, editEventDetails);

router.get("/add-message", addMessagePage);
router.post("/add-message/:id", uploadMultiple, addMessageToExistingEvent);

router.get("/fetch-contact-group-members/:id", fetchContactGroupMembers);

router.get("/fetch-contacts/:email", fetchContacts);

router.get("/:id", getEventDetails);
router.get("/uniqueEventId/:id", getEventDetailsWithUniqueId);

export default router;
