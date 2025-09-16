import twilio from "twilio";
import config from "../config/index.js";
import { logger } from "./logger.js";


// Your Twilio credentials
const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;
const client = twilio(accountSid, authToken);

export const sendSms = async (to, body) => {
  try {
    console.log("Sending SMS to", to, "with body", body);
    console.log("client", client)
    const message = await client.messages.create({
      body: body,
      from: config.twilio.accountMobileNo, // Your Twilio phone number
      to: to,
    });
    logger.info(`Message sent to ${to} with SID: ${message.sid}`);
    return true;
  } catch (error) {
    logger.error(`Error sending SMS to ${to}:`, error);
    return false;
  }
};

const sendBatchSms = async (recipients) => {
  await Promise.all(
    recipients.map(async (recipient) => {
      await sendSms(recipient.to, recipient.body);
    })
  );
};

