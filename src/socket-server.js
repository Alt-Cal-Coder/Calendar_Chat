import { Server } from "socket.io";
import db from "./db/index.js";
import { sendEmail } from "./helpers/email.js";

let io;
let users = {};
export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // You might want to restrict this in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    console.log(users)
    // Handle new user joining a group
    socket.on("joinGroup", (groupId, username, userId) => {
      console.log("joined group", groupId, username, userId)
      socket.join(groupId);
      users[socket.id] = { username, groupId, userId };
      io.to(groupId).emit("userJoined", username);
    });

    // Handle messages
    socket.on("sendMessage", async (data) => {
      const user = users[socket.id];
      console.log("user", user)
      if (user) {
        // store messages
        console.log(user)
        let message = {
          type: data.message.type,
          content: data.message.content,
          attachment: data.message.attachment,
        };

        const timeslot_id = data?.timeslot_id || null;
        const recurring_id = data?.recurring_id || null;

        // Generate the current timestamp
        let createdAt = new Date().toISOString();

        // SQL query with placeholders for values
        let query = `INSERT INTO messages (event_id, sender, rich_text_content, timeslot_id, recurring_id) VALUES (?, ?, ?, ?, ?)`;

        // Values to be inserted, passed as parameters to the query
        let values = [
          user.groupId, // eventId
          user.userId, // senderId
          JSON.stringify(message), // message (converted to a JSON string)
          timeslot_id,
          recurring_id
        ];

        // Execute the query with parameterized values
        await db.query(query, values);

        // Send message to all users in the group
        io.to(user.groupId).emit("message", {
          username: user.username,
          senderId: user.userId,
          message: {
            type: message.type,
            content: message.content,
            attachment: message.attachment,
            timeslot_id,
            recurring_id
          },
          created_at: createdAt,
        });

        // Get event details for the notification
        let eventQuery = `SELECT title FROM events WHERE uniqueEventId = ?`;
        let [eventRows] = await db.query(eventQuery, [user.groupId]);
        let eventTitle = eventRows.length > 0 ? eventRows[0].title : "Chat";
        // Get all members in this event who have email notifications enabled
        let membersQuery = `
          SELECT mc.* FROM member_contacts mc
          JOIN event_member_request emr ON mc.id = emr.member_contact_id
          WHERE emr.uniqueEventId = ? AND mc.preferred_notification = 'email' AND mc.email IS NOT NULL
        `;
        let [members] = await db.query(membersQuery, [user.groupId]);
        // Send email notifications to members with email notifications enabled
        for (const member of members) {
          // Don't send email to the sender
          console.log("member", member);
          console.log("user", user);
          if (member.id != user.userId) {
            const emailContent = `
              <h3>New Message in ${eventTitle}</h3>
              <p><strong>${user.username}</strong> sent a message:</p>
              <div style="padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
                ${message.content}
              </div>
              <p>Login to view the full conversation.</p>
            `;

            await sendEmail({
              receiver: member.email,
              subject: `New Message in ${eventTitle}`,
              text: `${user.username} sent: ${message.content}`,
              html: emailContent
            });
          }
        }
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        io.to(user.groupId).emit("userLeft", user.username);
        delete users[socket.id];
      }
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
}
