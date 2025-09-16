import { logger } from '../helpers/logger.js';
import db from "../db/index.js";

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if(!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required"
      });
    }
  
    let user = {};
    
    // First check member_contacts table
    let users_query = `SELECT * FROM member_contacts WHERE member_id = ?`;
    let [results] = await db.query(users_query, [userId]);
    
    if (results.length > 0) {
      user = results[0];
    } else {
      // If not found in member_contacts, check u_user table
      let u_user_query = `SELECT * FROM u_user WHERE u_user_id = ?`;
      
      let [u_user_results] = await db.query(u_user_query, [userId]);
      
      if (u_user_results.length > 0) {
        user = u_user_results[0];
      }
    }
  
    res.send({
      success: true,
      user
    });
  } catch(err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to get user info",
    });
  }
}


export const changeNotificationPrefences = async (req, res) => {
  try {
      const { id } = req.params;
      const { preferred_notification, contact_info } = req.body;

      if (!preferred_notification) {
          return res.status(400).json({ success: false, message: "Preferred notification is required." });
      }

      // Validate the contact info based on preference type
      if (preferred_notification === 'email' && contact_info) {
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(contact_info)) {
              return res.status(400).json({ success: false, message: "Invalid email format." });
          }
      }

      // Update query with contact info
      let updateQuery = '';
      let queryParams = [];

      if (preferred_notification === 'email' && contact_info) {
          updateQuery = `UPDATE member_contacts SET preferred_notification = ?, email = ? WHERE member_id = ?`;
          queryParams = [preferred_notification, contact_info, parseInt(id)];
      } else if (preferred_notification === 'sms' && contact_info) {
          updateQuery = `UPDATE member_contacts SET preferred_notification = ?, mobile = ? WHERE member_id = ?`;
          queryParams = [preferred_notification, contact_info, parseInt(id)];
      } else {
          updateQuery = `UPDATE member_contacts SET preferred_notification = ? WHERE member_id = ?`;
          queryParams = [preferred_notification, parseInt(id)];
      }

      let [result] = await db.query(updateQuery, queryParams);

      if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "Member not found." });
      }

      return res.status(200).json({ success: true, message: "Notification preferences updated successfully." });
  } catch (err) {
      logger.error(err);
      res.status(500).json({
          success: false,
          message: "Failed to update notification preferences",
      });
  }
}
