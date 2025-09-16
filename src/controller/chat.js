import db from "../db/index.js";

export async function eventGroupChat(req, res) {
  const render = req.query?.render === "false" ? false : true;
  const timeslot_id = req.query?.timeslot_id || "null";
  const recurring_id = req.query?.recurring_id || "null";

  let eventId = req.params.eventId;
  let userId = req.params.userId || "";

  let query = `SELECT id,title FROM events WHERE uniqueEventId = ?`;
  let memberQuery = `SELECT * FROM member_contacts WHERE id = ?`;

  try {
    let [rows] = await db.query(query, [eventId]);
    let [members] = await db.query(memberQuery, [userId]);
    console.log("UserID", userId);
    
    if (!rows?.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event not found",
      });
    }

    if (!members?.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Member not found",
      });
    }

    let title = rows[0].title;
    let memberId = members[0].id;
    let name = members[0].display_name;

    // Update the event_member_request to mark as accepted
    let updateQuery = `UPDATE event_member_request SET accept = 1, accepted_on = ? WHERE member_contact_id = ?`;
    await db.query(updateQuery, [new Date(), memberId, eventId]);

    // Construct message query based on conditions
    let messagesQuery = `
      SELECT 
        em.id, em.event_id, em.rich_text_content AS message, em.created_at, 
        mc.display_name AS username, mc.id AS senderId 
      FROM messages em 
      JOIN member_contacts mc ON em.sender = mc.id 
      WHERE em.event_id = ?`;

    let queryParams = [eventId];

    if (timeslot_id !== "null" && recurring_id !== "null") {
      messagesQuery += ` AND em.timeslot_id = ? AND em.recurring_id = ?`;
      queryParams.push(timeslot_id, recurring_id);
    } else if (timeslot_id !== "null") {
      messagesQuery += ` AND em.timeslot_id = ?`;
      queryParams.push(timeslot_id);
    } else if (timeslot_id === "null" && recurring_id === "null") {
      messagesQuery += ` AND em.timeslot_id IS NULL AND em.recurring_id IS NULL`;
    }

    messagesQuery += ` ORDER BY em.created_at`;

    let [result] = await db.query(messagesQuery, queryParams);
    console.log("Messages query result:", result);
    
    // Parse the rich_text_content for each message
    const parsedMessages = result.map(message => {
      try {
        // Check if message.message is a string before parsing
        if (message.message && typeof message.message === 'string') {
          message.message = JSON.parse(message.message);
        }
        return message;
      } catch (error) {
        console.error("Error parsing message:", error);
        // If parsing fails, keep the original message
        return message;
      }
    });

    if (!render) {
      return res.json({
        eventId,
        userId,
        groupName: title,
        userName: name,
        initialMessages: JSON.stringify(parsedMessages),
      });
    }
    
    // Render the chat view with the parsed messages
    return res.render("chat", {
      title: "Group Chat",
      eventId,
      userId,
      groupName: title,
      userName: name,
      initialMessages: JSON.stringify(parsedMessages),
      layout: false,
    });
  } catch (error) {
    console.error("Error in eventGroupChat:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getUserEvents(req, res) {
  try {
    const userId = req.params.userId;
    
    // First, get the user's email to identify them as a creator
    const userQuery = `SELECT email FROM member_contacts WHERE member_id = ?`;
    const [userRows] = await db.query(userQuery, [userId]);
    
    if (!userRows?.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User not found",
      });
    }
    
    const userEmail = userRows[0].email;
    
    // Get events created by this user
    const eventsQuery = `
      SELECT uniqueEventId, title 
      FROM events 
      WHERE email = ? 
      ORDER BY created_at DESC
    `;
    
    const [events] = await db.query(eventsQuery, [userEmail]);
    
    return res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
}

export async function eventCalendarView(req, res) {
  try {
    const eventId = req.params.eventId;
    const userId = req.params.userId || "";

    // Validate parameters
    if (!eventId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event ID is required",
      });
    }

    // Get event details
    let query = `SELECT id, title FROM events WHERE uniqueEventId = ?`;
    let [rows] = await db.query(query, [eventId]);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Event not found",
      });
    }
    
    const title = rows[0].title;
    let name = "Guest";
    
    // Get user details if userId is provided
    if (userId) {
      let memberQuery = `SELECT * FROM member_contacts WHERE id = ?`;
      let [memberRows] = await db.query(memberQuery, [userId]);
      if (memberRows && memberRows.length > 0) {
        name = memberRows[0].name || memberRows[0].display_name;
      }
    }
    
    // Get messages for this event - using the correct table name 'messages'
    let messagesQuery = `
      SELECT m.id, m.event_id, m.rich_text_content AS message, m.created_at, 
             mc.display_name AS username, m.sender AS senderId 
      FROM messages m
      JOIN member_contacts mc ON m.sender = mc.id
      WHERE m.event_id = ?
      ORDER BY m.created_at
    `;
    
    let [result] = await db.query(messagesQuery, [eventId]);
    
    // Parse the message content for each message
    const parsedMessages = result.map(message => {
      try {
        // Check if message.message is a string before parsing
        if (message.message && typeof message.message === 'string') {
          message.message = JSON.parse(message.message);
        }
        return message;
      } catch (error) {
        console.error("Error parsing message:", error);
        // If parsing fails, keep the original message
        return message;
      }
    });
    
    // Log for debugging
    console.log(`Rendering calendar view for event ${eventId}, user ${userId}`);
    
    // Render the calendar view with the parsed messages
    return res.render("chat-calendar", {
      title: "Chat Calendar View",
      eventId,
      userId,
      groupName: title,
      userName: name,
      initialMessages: JSON.stringify(parsedMessages),
      layout: false,
    });
  } catch (error) {
    console.error("Error in eventCalendarView:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

export async function eventsCalendarView(req, res) {
  try {
    const userId = req.params.userId || req.cookies?.creatorId || "";

    // Validate parameters
    if (!userId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User ID is required",
      });
    }

    // Get events for this user - just get the dates to highlight in the calendar
    let datesQuery = `
      SELECT DATE(created_at) as event_date, COUNT(*) as event_count
      FROM events
      WHERE uniqueCreatorId = ?
      GROUP BY DATE(created_at)
      ORDER BY event_date DESC
    `;
    
    let [eventDates] = await db.query(datesQuery, [userId]);
    
    console.log(`Found events on ${eventDates.length} different dates for user ${userId}`);
    
    // Create a map of dates with events
    const datesWithEvents = {};
    eventDates.forEach(dateInfo => {
      const dateStr = new Date(dateInfo.event_date).toISOString().split('T')[0];
      datesWithEvents[dateStr] = dateInfo.event_count;
    });
    
    // Render the events calendar view with dates that have events
    return res.render("event-calendar", {
      title: "Event Calendar",
      userId,
      initialEvents: JSON.stringify(datesWithEvents),
      layout: false,
    });
  } catch (error) {
    console.error("Error in eventsCalendarView:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

export async function getEventsByDate(req, res) {
  try {
    const { date, userId } = req.params;
    
    // Validate date format
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD" });
    }
    
    // Get start and end of the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Format dates for MySQL query
    const startDateStr = startDate.toISOString().slice(0, 19).replace('T', ' ');
    const endDateStr = endDate.toISOString().slice(0, 19).replace('T', ' ');
    
    // Get events for this date
    const query = `
      SELECT e.*, mc.display_name as name, mc.email, mc.id as creatorId
      FROM events e
      LEFT JOIN member_contacts mc ON e.uniqueCreatorId = mc.id
      WHERE e.created_at BETWEEN ? AND ?
      ORDER BY e.created_at DESC
    `;
    
    const [events] = await db.query(query, [startDateStr, endDateStr]);
    
    // For each event, get the messages
    const eventsWithMessages = await Promise.all(events.map(async (event) => {
      try {
        // Get messages for this event
        const messagesQuery = `
          SELECT m.*, mc.display_name AS username
          FROM messages m
          JOIN member_contacts mc ON m.sender = mc.id
          WHERE m.event_id = ?
          ORDER BY m.created_at DESC
          LIMIT 10
        `;
        
        const [messages] = await db.query(messagesQuery, [event.uniqueEventId]);
        
        // Process messages
        const processedMessages = messages.map(msg => {
          try {
            let messageContent = "No message content";
            
            if (msg.rich_text_content) {
              try {
                // Parse the rich_text_content
                let parsed;
                if (typeof msg.rich_text_content === 'string') {
                  parsed = JSON.parse(msg.rich_text_content);
                } else {
                  parsed = msg.rich_text_content;
                }
                
                // Check if parsed has a content property
                if (parsed && typeof parsed.content === 'string') {
                  // Decode URL-encoded content
                  messageContent = decodeURIComponent(parsed.content);
                } else {
                  // If no content property, stringify the object
                  messageContent = "Message content unavailable";
                }
              } catch (e) {
                console.error("Error parsing rich_text_content:", e);
                messageContent = "Error parsing message";
              }
            } else if (msg.message) {
              // Handle message field if rich_text_content is not available
              if (typeof msg.message === 'string') {
                messageContent = msg.message;
              } else {
                messageContent = "Message content unavailable";
              }
            }
            
            return {
              ...msg,
              processedContent: messageContent
            };
          } catch (msgError) {
            console.error("Error processing message:", msgError);
            return {
              ...msg,
              processedContent: "Error processing message"
            };
          }
        });
        
        return {
          ...event,
          messages: processedMessages
        };
      } catch (eventError) {
        return {
          ...event,
          messages: []
        };
      }
    }));
    
    return res.json({ success: true, events: eventsWithMessages });
    
  } catch (error) {
    console.error("Error getting events by date:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
}

