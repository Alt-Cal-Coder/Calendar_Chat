import nodemailer from "nodemailer";
import config from "../config/index.js";
import path from "path";
import hbs from "nodemailer-express-handlebars";

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: !!config.mail.secure,
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
});

const handlebarsOption = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: path.join(path.resolve(), "/src/views/layout"),
    defaultLayout: "",
    partialsDir: path.join(path.resolve(), "/src/views/partials"),
    helpers: {
      convert: (context) => {
        return typeof context === "string"
          ? context.toString()
          : typeof context === "object"
            ? JSON.stringify(context)
            : context;
      },
    },
  },
  viewPath: path.join(path.resolve(), "/src/views"),
  extName: ".hbs",
};

// transporter.use("compile", hbs(handlebarsOption));

// Function to identify Google Play ID or App Store ID
const identifyAppId = (appLink) => {
  const googlePlayRegex = /play\.google\.com\/store\/apps\/details\?id=([\w.]+)/;
  const appStoreRegex = /apps\.apple\.com\/app\/id6739428453/;

  let match;
  if ((match = appLink.match(googlePlayRegex))) {
    return { type: "Google Play", id: match[1] };
  } else if ((match = appLink.match(appStoreRegex))) {
    return { type: "App Store", id: match[1] };
  }
  return { type: "Unknown", id: null };
};

// Function to send email
const sendAppDownloadEmail = async (recipient, appLink, eventId) => {
  const appInfo = {
    id: eventId,
    type: "web app"
  };

  if (appInfo.id) {
    const universalLink = `${appLink}/${eventId}`;
    const mailOptions = {
      from: config.mail.fromEmail,
      to: recipient,
      subject: `Download the ${appInfo.type} App`,
      html: `
        <h3>Hello,</h3>
        <p>We noticed you're interested in our app! Download it now using the link below:</p>
        <a href="${universalLink}" target="_blank">Download the App</a>
        <p><strong>Event Link: ${universalLink}</strong></p>
        <p><strong>App Info:</strong></p>
        <ul>
          <li>Type: ${appInfo.type}</li>
          <li>ID: ${appInfo.id}</li>
          <li>Event ID: ${eventId}</li>
        </ul>
        <p>Best regards,</p>
        <p>Your Team</p>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  } else {
    console.error("Invalid app link provided.");
  }
};

const sendEmail = async ({ receiver, subject, text, html }) => {
  console.log("Sending email...");
  console.log("Receiver:", receiver);
  console.log("Subject:", subject);
  console.log("Text:", text);
  const mailOptions = {
    from: `${config.mail.fromName}<${config.mail.fromEmail}>`,
    to: receiver,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export { transporter, sendAppDownloadEmail, sendEmail };
