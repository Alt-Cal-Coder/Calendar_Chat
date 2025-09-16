import { Router } from "express";
import { 
  eventGroupChat, 
  getUserEvents, 
  eventCalendarView, 
  eventsCalendarView,
  getEventsByDate 
} from "../controller/chat.js";

const router = Router();


router.get("/user-events/:userId", getUserEvents);
router.get("/calendar/:eventId/:userId", eventCalendarView);
router.get("/events-calendar/:userId", eventsCalendarView);
router.get("/events-by-date/:date/:userId", getEventsByDate); // New route for fetching events by date
router.get("/:eventId/:userId", eventGroupChat);

export default router;
