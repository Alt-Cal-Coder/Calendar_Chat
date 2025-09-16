import { Router } from "express";
import eventRouter from "./event.js";
import chatRouter from "./chat.js";
import invoiceRouter from "./invoice.js";
import locationRouter from "./location.js";
import userRouter from "./user.js";
import db from "../db/index.js";
import { sendAppDownloadEmail } from "../helpers/email.js";
import { sendSms } from "../helpers/twillio.js";
let router = Router();
//fetch all event 
router.get('/event/list', async (req, res, next) => {
    try {
          const messageContent = `\n\nYou are invited to this event. Please RSVP.\n\nClick here to confirm and join chat: Test Message`;
            //  const response = await sendSms("+923224512868", messageContent);
            //  console.log(response)
        const creatorId = req.cookies?.creatorId;
        
        if (!creatorId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: No creator ID found"
            });
        }
        
        // Query the database - only get events for this creator
        const [events] = await db.query(`
        SELECT 
          id, uniqueEventId, uniqueCreatorId, calendar_id, 
          title, email, name, uniqueLink, address, message, icsDetails 
        FROM events WHERE uniqueCreatorId = ?
      `,[creatorId]);

        // Parse the 'address' field if needed
        // const parsedEvents = events.map(event => ({
        //     ...event,
        //     address: JSON.parse(event.address) // Assuming 'address' is stored as JSON in the database
        // }));

        // Iterate over events to send emails(testing purpose)
        for (const event of events) {
            const recipient = event.email; // Assuming 'email' is the recipient's email
            const appLink = `${process.env.BASE_URL}/event`;
            const eventId = event.uniqueEventId; // Use the uniqueEventId from the event

            // Send email for each event
            try {
                
                await sendAppDownloadEmail(recipient, appLink, eventId);
                console.log(`Email sent successfully for Event ID: ${eventId}`);
            } catch (emailError) {
                console.error(`Failed to send email for Event ID: ${eventId}`, emailError);
            }
        }

        // Render the list view
        res.render('list', {
            title: "Event Lists",
            events: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        next(error); // Forward the error to the error handler
    }
});

router.get('/the-event/:id', async (req, res, next) => {
    try {
        const eventId = req.params.id; // Get the event ID from the URL
        const baseUrl = process.env.BASE_URL || 'http://localhost';
        const port = process.env.PORT || 3002;
        const fullBaseUrl = `${baseUrl}:${port}`;

        // Query the database to fetch the specific event
        const [[event]] = await db.query(`
            SELECT 
                id, uniqueEventId, uniqueCreatorId, calendar_id, 
                title, email, name, uniqueLink, address, message, icsDetails 
            FROM events
            WHERE uniqueEventId = ?
        `, [eventId]);

        if (!event) {
            // If no event is found, return a 404 response
            return res.status(404).render('404', { message: "Event not found" });
        }

        // Render the single-event template with the event data
        res.render('single-event', { 
            event: event,
            baseUrl: fullBaseUrl
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        next(error); // Forward the error to the error handler
    }
});
router.use("/event", eventRouter);
router.use("/chat", chatRouter);
router.use("/user", userRouter);
router.use("/invoice", invoiceRouter);
router.use("/location", locationRouter);

export default router;
