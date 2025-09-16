import moment from "moment";
import db from "../db/index.js";
import {
  createICSAndJSONFile,
  generateICS,
  updateIcsFile,
} from "../helpers/common.js";
import config from "../config/index.js";
import { sendSms } from "../helpers/twillio.js";
import { getIO } from '../socket-server.js';
import { logger } from '../helpers/logger.js';
import crypto from "crypto";
import { sendEmail } from '../helpers/email.js';

const createEventData = ({
  uniqueMembers,
  title,
  address,
  org_mail,
  org_name,
  eventId,
  calendar_id,
  creatorId,
  timeSlots,
  extra,
  eventEmail,
  eventLocation,
  website
}) => {
  const attendees = uniqueMembers.map((member) => ({
    name: member.name,
    email: member.email,
    mobile: member.mobile ? member.mobile : "NA",
    rsvp: true,
    partstat: "NOT-ACCEPTED",
    role: "REQ-PARTICIPANT",
    cutype: "GROUP",
  }));

  const modified_date = moment(new Date()).format("YYYY-MM-DD H:mm:ss");

  timeSlots = timeSlots.map((timeSlot) => {
    const { type } = timeSlot;
    if (type === 1) {
      const { startDate, endDate, startTime, endTime } = timeSlot;
      const start_time = startTime ? startTime.replace(/:/g, "") : "0000";
      const end_time = endTime ? endTime.replace(/:/g, "") : "2359";
      const start_event = startDate
        ? `${moment(startDate).format("YYYYMMDD")}T${start_time}Z`
        : null;
      const end_event = endDate
        ? `${moment(endDate).format("YYYYMMDD")}T${end_time}Z`
        : null;
      return {
        type,
        start: start_event,
        end: end_event,
        slotName: timeSlot.slotName,
      };
    } else {
      const { startDate, endDate, weekdays, startTime, endTime } = timeSlot;
      const start_time = startTime ? startTime.replace(/:/g, "") : "0000";
      const end_time = endTime ? endTime.replace(/:/g, "") : "2359";
      let start = startDate
        ? `${moment(startDate).format("YYYYMMDD")}T${start_time}Z`
        : null;
      let end = endDate
        ? `${moment(endDate).format("YYYYMMDD")}T${end_time}Z`
        : null;
      return {
        type,
        start: start,
        end: end,
        slotName: timeSlot.slotName,
        weekdays,
      };
    }
  });

  const modified_date_event = moment(modified_date)
    .utc()
    .format("YYYYMMDDTHHmmss[Z]");

  const event = {
    eventEmail,
    eventLocation,
    website,
    timeSlots,
    summary: title,
    title: title,
    description: "",
    location: Object.values(address).join(", "),
    attendees: attendees,
    lastModified: `${modified_date_event}`,
    mail: org_mail,
    name: org_name,
    uniqueEventId: eventId,
    status: "CONFIRMED",
    calendar_id: calendar_id,
    creatorId: creatorId,
    extra: extra,
  };

  return {
    attendees,
    event,
    modified_date,
  };
};

const createUserInUUserTable = async (body) => {
  const { name, email, mobile } = body;

  let firstName = name.split(" ")[0];
  let lastName = name.split(" ")[1];
  let uniqueId = crypto.randomUUID();

  // check if email and mobile are unique
  const query = `SELECT * FROM u_user WHERE u_user_email_address = ?`;
  const [result] = await db.query(query, [email, mobile]);

  if (result.length === 0) {
    // insert user in u_user table
    const insertQuery =
      "INSERT INTO u_user(u_user_first_name,u_user_last_name,u_user_email_address,u_user_contact_no,u_user_password) VALUES (?,?,?,?,?)";
    let [rows] = await db.query(insertQuery, [
      firstName,
      lastName,
      email,
      mobile,
      "",
    ]);

    return rows.insertId;
  } else {
    uniqueId = result[0].u_user_id;
  }

  return uniqueId;
};

const createMemberContact = async (members) => {
  if (members.length === 0) {
    return false;
  }

  const insertQuery = `INSERT INTO member_contacts (member_id, first_name, last_name, phone, email, display_name, user_type, parent_id) VALUES `;
  const studentProfileQuery = `INSERT INTO studentprofile (MainClientID, CLSTParentID, CLStudentID) VALUES `;

  let [count] = await db.query(`SELECT COUNT(*) as count FROM member_contacts`);
  let totalCount = count[0].count || 0;

  // Modified query to check both phone and email
  let phoneParams = members.map(member => member.mobile).filter(Boolean);
  let emailParams = members.map(member => member.email).filter(Boolean);
  let params = [...phoneParams, ...emailParams];
  
  // Only proceed with the query if we have parameters
  let query = '';
  let result = [];
  
  if (params.length > 0) {
    query = `SELECT * FROM member_contacts WHERE `;
    
    if (phoneParams.length > 0) {
      query += `phone IN (${phoneParams.map(() => "?").join(",")})`;  
    }
    
    if (phoneParams.length > 0 && emailParams.length > 0) {
      query += ` OR `;
    }
    
    if (emailParams.length > 0) {
      query += `email IN (${emailParams.map(() => "?").join(",")})`;
    }
    
    [result] = await db.query(query, params);
  } else {
    result = [];
  }

  let resultHash = {};
  result.forEach((member) => {
    // Store by both phone and email to catch either match
    if (member.phone) resultHash[`phone-${member.phone}`] = member;
    if (member.email) resultHash[`email-${member.email}`] = member;
  });

  let insertedIds = [];
  let newInsertedIds = [];
  let insertValues = [];
  let studentProfileValues = [];
  let indexKeyToMemberId = {};

  // Sort members to maintain parent-child sequence
  members.sort((a, b) => {
    let aParts = a.indexKey.split("-").map(Number);
    let bParts = b.indexKey.split("-").map(Number);
    return aParts[0] - bParts[0] || (aParts[1] ?? 0) - (bParts[1] ?? 0);
  });

  for (let member of members) {
    let isChild = member.indexKey.includes("-");
    let parentIndex = isChild ? member.indexKey.split("-")[0] : null;
    let parent_id = isChild ? indexKeyToMemberId[parentIndex] || null : null;

    // Check if member exists by phone or email
    let existingMember = null;
    if (member.mobile && resultHash[`phone-${member.mobile}`]) {
      existingMember = resultHash[`phone-${member.mobile}`];
    } else if (member.email && resultHash[`email-${member.email}`]) {
      existingMember = resultHash[`email-${member.email}`];
    }

    if (!existingMember) {
      let first_name = member.name.split(" ")[0] ?? "";
      let last_name = member.name.split(" ")[1] ?? "";

      let member_id = ++totalCount;
      indexKeyToMemberId[member.indexKey] = member_id; // Store mapping

      let values = [
        member_id,
        first_name,
        last_name,
        member.mobile,
        member.email ?? null,
        first_name + " " + last_name,
        member?.user_type || "main",
        parent_id
      ];

      insertValues.push(`(${values.map((value) => db.escape(value)).join(", ")})`); 
      newInsertedIds.push(member_id);

      // Insert into studentprofile table based on user_type
      let studentProfileRow = {
        MainClientID: member.user_type === "main" ? member_id : null,
        CLSTParentID: member.user_type === "parent" || member.user_type === "child" ? parent_id : null,
        CLStudentID: member.user_type === "child" ? member_id : null
      };

      studentProfileValues.push(`(${db.escape(studentProfileRow.MainClientID)}, ${db.escape(studentProfileRow.CLSTParentID)}, ${db.escape(studentProfileRow.CLStudentID)})`);
    } else {
      let existingMemberId = existingMember.id;
      insertedIds.push(existingMemberId);
      indexKeyToMemberId[member.indexKey] = existingMemberId;
    }
  }

  if (insertValues.length > 0) {
    const fullInsertQuery = insertQuery + insertValues.join(",");
    await db.query(fullInsertQuery);
  }

  if (studentProfileValues.length > 0) {
    const fullStudentProfileQuery = studentProfileQuery + studentProfileValues.join(",");
    await db.query(fullStudentProfileQuery);
  }

  console.log("Final Inserted IDs (maintaining sequence): ", insertedIds.concat(newInsertedIds));
  return insertedIds.concat(newInsertedIds);
};

const addAttendeesToCalendarGroup = async (body) => {
  const { attendees, senderId, contact_group_id, groupImage } = body;

  let group_id = contact_group_id;
  // find already contact group id in database
  let query = `SELECT *, group_name as name FROM calendar_group WHERE id = ?`;
  let [result] = await db.query(query, [contact_group_id]);

  let shouldCreateNewRecord = result.length === 0;
  if (!shouldCreateNewRecord) {
    // shouldCreateNewRecord = !checkBothArrayAreSame(
    //   result[0].members_contacts,
    //   attendees
    // );
    // update existing contact group with new members
    let updateQuery = `UPDATE calendar_group SET member_contacts = ? WHERE id = ?`;
    await db.query(updateQuery, [JSON.stringify(attendees), contact_group_id]);
    return contact_group_id;
  }

  if (shouldCreateNewRecord) {
    // Add attendees to calendar group
    let insertQuery =
      "INSERT INTO calendar_group(u_user_id, member_contacts, group_name, groupImage) VALUES (?,?,?,?)";
    let [rows] = await db.query(insertQuery, [
      senderId,
      JSON.stringify(attendees),
      !contact_group_id && contact_group_id == ""
        ? "DEFAULT"
        : contact_group_id,
      groupImage
    ]);

    group_id = rows.insertId;
  }

  return group_id;
};

// filter keys from obj1 which are not present in obj2
const getExtraKeyMembersFromGivenObject = (obj1, obj2) => {
  let extraKeys = Object.keys(obj1).filter(
    (key) => !Object.keys(obj2).includes(key)
  );
  // map the extra keys with values
  return extraKeys.map((key) => ({ [key]: obj1[key] }));
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      members = [],
      room: room_floor,
      place: place_name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
      org_mail,
      org_name,
      message,
      contact_group_id,
      website,
      eventEmail,
      eventLocation,
      timeSlots: time_slots,
    } = req.body;

    await db.beginTransaction();

    /* TODO: 
        - first create user in u_user table 
        - and assign user id to event
        - if there is an existing entry of contact group and new members are added in it then new add members entry inside member_contact table
        - if new contact group is created then add unique members inside member_contact table
        - create calendar group if not selected 
        - create event in events table
        - assign member_contacts id inside event member table 
        - append calender id and creator_id inside ics file and json file
        -
    */

    // check creatorId is available in cookies
    let creatorId;

    let timeSlots = JSON.parse(time_slots);

    const temp_members = JSON.parse(members);

    if (req.cookies?.creatorId) {
      creatorId = req.cookies?.creatorId;

      let [result] = await db.query(
        `SELECT * FROM u_user WHERE u_user_id = ?`,
        [creatorId]
      );

      if (result.length > 0) {
        creatorId = result[0].u_user_id;
      } else {
        return res.status(401).send("Unauthorized");
      }
    } else {
      creatorId = await createUserInUUserTable({
        name: org_name,
        email: org_mail,
        mobile: "",
      });
    }

    const eventId = crypto.randomUUID();
    const members_arr = JSON.parse(members);
    const uniqueMembers = [];
    let hashMembers = {};

    members_arr.forEach((member) => {
      if (!hashMembers[`${member.mobile}-${member.email}`]) {
        hashMembers[`${member.mobile}-${member.email}`] = true;
        uniqueMembers.push(member);
      }
    });

    // if (uniqueMembers.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "No members found",
    //     data: [],
    //   });
    // }

    // add sender in member_contact table

    // let [findSenderAlreadyExists] = await db.query(
    //   `SELECT * FROM member_contacts WHERE email = ?`,
    //   [org_mail]
    // );

    // if (!findSenderAlreadyExists.length) {
    //   let [count] = await db.query(
    //     `select count(*) as count from member_contacts`
    //   );
    //   let totalCount = count[0].count;

    //   let firstName = org_name.split(" ")[0] ?? "";
    //   let lastName = org_name.split(" ")[1] ?? "";
    //   await db.query(
    //     `INSERT INTO member_contacts(member_id, first_name,last_name,email,display_name) VALUES (?, ?, ?, ?,?)`,
    //     [totalCount + 1, firstName, lastName, org_mail, org_name]
    //   );
    // }

    // ------------------------------------------

    // add members in member_contact table
    let memberResult = await createMemberContact(uniqueMembers);
    let memberInsertedIds = memberResult
      ? memberResult
        .toString()
        .split(",")
        .map((id) => {
          return parseInt(id);
        })
      : false;

    let calendar_id = "";
    if (memberInsertedIds) {
      // add members to calendar group
      calendar_id = await addAttendeesToCalendarGroup({
        attendees: memberInsertedIds,
        senderId: creatorId,
        contact_group_id: contact_group_id,
        groupImage: req?.uploadedGroupImage?.path || null
      });
    }

    const address = {
      room: room_floor,
      place: place_name,
      address_line1: address_line1,
      address_line2: address_line2,
      city: city,
      state: state,
      country: country,
      postal_code: postal_code,
    };

    const uniqueLinkChatLink = `/chat/${eventId}`;

    const insertQuery =
      "INSERT INTO events (uniqueEventId, uniqueCreatorId,calendar_id, title, email, name, uniqueLink, address,message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      eventId,
      creatorId,
      calendar_id || null,
      title,
      org_mail,
      org_name,
      `${uniqueLinkChatLink}/${creatorId}`,
      JSON.stringify(address),
      message,
    ];

    let [result] = await db.query(insertQuery, values);
    if (result.affectedRows === 0) {
      throw new Error("Event creation failed");
    }

    let eventInsertId = result.insertId;

    let insertQueryOfEventTimeSlots = `INSERT INTO event_time_slots(event_id, slot_name, startDate,endDate,startTime,endTime,weekdays,type) VALUES `;

    for (let slot of timeSlots) {
      if (slot.type == 1) {
        const { startDate, endDate, startTime, endTime } = slot;
        const endDateValue = endDate ? `"${endDate}"` : `NULL`;
        const endTimeValue = endTime ? `"${endTime}"` : `NULL`;

        const startDateValue = startDate ? `"${startDate}"` : `NULL`;
        const startTimeValue = startTime ? `"${startTime}"` : `NULL`;

        insertQueryOfEventTimeSlots += `(${eventInsertId}, "${slot.slotName
          }", ${startDateValue}, ${endDateValue}, ${startTimeValue}, ${endTimeValue}, "${JSON.stringify(
            []
          )}", ${1}),`;
      } else {
        const { startDate, endDate, weekdays, startTime, endTime } = slot;
        const startDateValue = startDate ? `"${startDate}"` : `NULL`;
        const startTimeValue = startTime ? `"${startTime}"` : `NULL`;

        const endDateValue = endDate ? `"${endDate}"` : `NULL`;
        const endTimeValue = endTime ? `"${endTime}"` : `NULL`;

        insertQueryOfEventTimeSlots += `(${eventInsertId}, "${slot.slotName
          }", ${startDateValue}, ${endDateValue}, ${startTimeValue}, ${endTimeValue}, '${JSON.stringify(
            weekdays
          )}', ${2}),`;
      }
    }

    await db.query(insertQueryOfEventTimeSlots.slice(0, -1));

    let calendar_group_name = `select group_name as name from calendar_group where id = ?`;
    let [group_name] = await db.query(calendar_group_name, [contact_group_id]);
    let eventParameter = {
      uniqueMembers,
      title,
      address,
      org_mail,
      org_name,
      eventId,
      calendar_id: group_name?.[0]?.name ?? "",
      creatorId,
      timeSlots,
      eventEmail,
      eventLocation,
      website
    };

    let extraMetaData = getExtraKeyMembersFromGivenObject(
      req.body,
      eventParameter
    );

    const {
      attendees,
      event: eventData,
      modified_date,
    } = createEventData({
      ...eventParameter,
      extra: extraMetaData,
    });

    // generate ics file
    const ics_new_file_content = generateICS(eventData);
    await createICSAndJSONFile(ics_new_file_content, eventId, eventData);

    const updateQuery = `Update events SET icsDetails = ?, ics_modified = ? WHERE id = ?`;
    const updateValues = [
      JSON.stringify(eventData),
      modified_date,
      eventInsertId,
    ];
    await db.query(updateQuery, updateValues);

    // event members insert
    if (members_arr.length > 0) {
      const insertMemberQuery =
        "INSERT INTO event_member_request (eventId, uniqueEventId, member_contact_id, accept, details, is_invited) VALUES ";
      let membersInsertValues = [];
      let index = 0;
      for (let member of uniqueMembers) {
        let [member_id] = await db.query(
          `SELECT id FROM member_contacts WHERE phone = ?`,
          [member.mobile]
        );
        member_id = member_id[0].id;
        const insertMemberValues = [
          eventInsertId,
          eventId,
          member_id,
          0,
          JSON.stringify(attendees[index]),
          member.is_invited,
        ];

        // Add to values array for SQL query
        membersInsertValues.push(
          `(${insertMemberValues.map((value) => db.escape(value)).join(", ")})`
        );

        index++;
      }

      const fullInsertQuery =
        insertMemberQuery + membersInsertValues.join(", ");

      // Execute the query
      await db.query(fullInsertQuery);
    }

    let datesOfEvents = `Event Details:\n`;

    for (let slot of timeSlots) {
      let { type, startDate, endDate, startTime, endTime, weekdays, slotName } = slot;
    
      const slotNameString = slotName ? `${slotName}: ` : "";
    
      if (type === 1) {
        // Format: 12:00 PM - 1:00 PM MONDAY February 5th 2025
        const formattedTime = `${moment(`${startDate} ${startTime}`).format("h:mm A")} - ${moment(`${startDate} ${endTime}`).format("h:mm A dddd MMMM Do YYYY")}`;
        datesOfEvents += `${slotNameString}${formattedTime}\n`;
      } else if (type === 2) {
        // Format: MON, WED, SAT 12:00 PM - 1:00 PM February 5th - February 21st 2025
        const weekdaysString = weekdays.map(day => day.toUpperCase()).join(", ");
        const formattedStartDate = moment(startDate).format("MMMM Do");
        const formattedEndDate = moment(endDate).format("MMMM Do YYYY");
        const formattedTime = `${moment(`${startDate} ${startTime}`).format("h:mm A")} - ${moment(`${startDate} ${endTime}`).format("h:mm A")}`;
    
        datesOfEvents += `${slotNameString}${weekdaysString} ${formattedTime} ${formattedStartDate} - ${formattedEndDate}\n`;
      }
    }

    let contentOfMessage = `${datesOfEvents}\nLocation: ${Object.values(address).filter(Boolean).join(", ") || "-"}\nNotes: ${message || "-"}`;

    let messageQuery =
      "INSERT INTO messages (event_id,sender,rich_text_content) VALUES (?,?,?)";

    let rich_message_content = {
      type: req.uploadedFiles ? "file" : "text",
      content: encodeURIComponent(contentOfMessage),
      attachment: req.uploadedFiles
        ? req.uploadedFiles?.map((file) => {
          return {
            name: file.filename,
            path: file.path.split("/")?.slice(1)?.join("/"),
            url: `${config.baseUrl}/${file.path
              .split("/")
              ?.slice(1)
              ?.join("/")}`,
            type: file.mimetype,
          };
        })
        : [],
    };

    rich_message_content.attachment.push({
      name: "event.ics",
      path: `/ics/${eventId}.ics`,
      url: `${config.baseUrl}/ics/${eventId}.ics`,
      type: "text/calendar",
    });

    let [senderId] = await db.query(
      `SELECT * FROM member_contacts WHERE email = ?`,
      [org_mail]
    );
    
    await db.query(messageQuery, [
      eventId,
      senderId[0].id,
      JSON.stringify(rich_message_content),
    ]);

    await db.commit();

    let [eventMembers] = await db.query(
      `SELECT member_contact_id, member_contacts.id, member_contacts.phone, member_contacts.email FROM event_member_request JOIN member_contacts ON event_member_request.member_contact_id = member_contacts.id WHERE eventId = ?`,
      [eventInsertId]
    );
    console.log("members", members);
    console.log("tahir-eventMembers", eventMembers);
    const emailPromises = temp_members.map(async (member) => {
      const memberInEvent = eventMembers.find((em) => em.phone === member.mobile);
      if (!member.isEmailChecked || !member.email?.trim() || !memberInEvent) return;
      console.log(`Sending Email to ${member.email}...`);

      const messageContent = `${contentOfMessage}\n\nYou are invited to this event. Please RSVP.\n\nClick here to confirm and join chat: ${config.baseUrl}/chat/${eventId}/${memberInEvent.member_contact_id}`;
      return await sendEmail({
        receiver: member.email,
        subject: "You are invited!",
        text: messageContent,
      });
    });
    
    const smsPromises = temp_members.map(async (member) => {
      const memberInEvent = eventMembers.find((em) => em.phone === member.mobile);
      if (!member.isMobileChecked || !member.mobile?.trim() || !memberInEvent) return;
      console.log(`Sending SMS to ${member.mobile}...`);

      const messageContent = `${contentOfMessage}\n\nYou are invited to this event. Please RSVP.\n\nClick here to confirm and join chat: ${config.baseUrl}/chat/${eventId}/${memberInEvent.member_contact_id}`;
      return await sendSms(member.mobile, messageContent);
    });
    
    await Promise.all([...emailPromises, ...smsPromises]);

    let socketIo = getIO();

    socketIo.to(eventId).emit("message", {
      username: org_name,
      senderId: senderId[0].id,
      message: rich_message_content,
      created_at: new Date().toISOString(),
    });

    res.cookie("creatorId", creatorId, {
      httpOnly: true,
      maxAge: 60 * 60 * 60 * 1000,
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Event created successfully",
      eventId
    });
  } catch (err) {
    await db.rollback();
    console.log(err);
    logger.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addMessageToExistingEvent = async (req, res) => {
  try {
    await db.beginTransaction();
    let { id: eventId } = req.params;
    let {
      members,
      room_floor,
      place_name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
      message,
      timeSlots: time_slots,
      contact_group_id,
      selectedTimeSlot
    } = req.body;

    let membersArr = JSON.parse(members);
    let timeSlots = JSON.parse(time_slots);
    let uniqueMembers = membersArr;
    let selectedTimeSlotJSON = JSON.parse(selectedTimeSlot || {});
    let creatorId;

    if (req.cookies?.creatorId) {
      creatorId = req.cookies?.creatorId;
    }

    let [event] = await db.query(
      `SELECT * FROM events WHERE id = ${eventId} AND uniqueCreatorId = ?`,
      [creatorId]
    );
    event = event[0];

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not found",
      });
    }

    const address = {
      room: room_floor,
      place: place_name,
      address_line1: address_line1,
      address_line2: address_line2,
      city: city,
      state: state,
      country: country,
      postal_code: postal_code,
    };

    let insertQueryOfEventTimeSlots = `INSERT INTO event_time_slots(event_id, slot_name, startDate,endDate,startTime,endTime,weekdays,type) VALUES `;
    let updateQueryOfEventTimeSlots = `UPDATE event_time_slots SET slot_name = ?, startDate = ?, endDate = ?, startTime = ?, endTime = ?, weekdays = ?, type = ? WHERE id = ?`;
    let isNewAdded = false;

    for (let slot of timeSlots) {
      if (slot.type == 1) {
        const { startDate, endDate, startTime, endTime } = slot;

        const startDateValue = startDate ? `"${startDate}"` : `NULL`;
        const startTimeValue = startTime ? `"${startTime}"` : `NULL`;

        const endDateValue = endDate ? `"${endDate}"` : `NULL`;
        const endTimeValue = endTime ? `"${endTime}"` : `NULL`;
        if (slot.id) {
          await db.query(updateQueryOfEventTimeSlots, [
            slot.slotName,
            startDateValue,
            endDateValue,
            startTimeValue,
            endTimeValue,
            JSON.stringify(slot.weekdays),
            1,
            slot.id,
          ]);
        } else {
          insertQueryOfEventTimeSlots += `(${eventId}, "${slot.slotName
            }", ${startDateValue}, ${endDateValue}, ${startTimeValue}, ${endTimeValue}, "${JSON.stringify(
              []
            )}", ${1}),`;
          isNewAdded = true;
        }
      } else {
        const { startDate, endDate, weekdays, startTime, endTime } = slot;
        const startDateValue = startDate ? `"${startDate}"` : `NULL`;
        const startTimeValue = startTime ? `"${startTime}"` : `NULL`;

        const endDateValue = endDate ? `"${endDate}"` : `NULL`;
        const endTimeValue = endTime ? `"${endTime}"` : `NULL`;
        if (slot.id) {
          await db.query(updateQueryOfEventTimeSlots, [
            slot.slotName,
            startDateValue,
            endDateValue,
            startTimeValue,
            endTimeValue,
            JSON.stringify(weekdays),
            2,
            slot.id,
          ]);
        } else {
          insertQueryOfEventTimeSlots += `(${eventId}, "${slot.slotName
            }", ${startDateValue}, "${endDate}", ${startTimeValue}, ${endTimeValue}, '${JSON.stringify(
              weekdays
            )}', ${2}),`;
          isNewAdded = true;
        }
      }
    }
    if (isNewAdded) await db.query(insertQueryOfEventTimeSlots.slice(0, -1));

    let calendar_group_name = `select group_name as name from calendar_group where id = ?`;
    let [group_name] = await db.query(calendar_group_name, [event.calendar_id]);

    let eventParameter = {
      uniqueMembers,
      title: event.title,
      address,
      org_mail: event.email,
      org_name: event.name,
      eventId: event.uniqueEventId,
      calendar_id: group_name[0]?.name ?? "",
      creatorId,
      timeSlots,
    };

    let extraMetaData = getExtraKeyMembersFromGivenObject(
      req.body,
      eventParameter
    );

    const {
      attendees,
      event: eventData,
      modified_date,
    } = createEventData({
      ...eventParameter,
      extra: extraMetaData,
    });

    // generate ics file
    const ics_new_file_content = generateICS(eventData);
    await updateIcsFile(ics_new_file_content, event.uniqueEventId, eventData);

    let eventMembers = await db.query(
      `SELECT phone FROM event_member_request JOIN member_contacts ON event_member_request.member_contact_id = member_contacts.id WHERE eventId = ${eventId}`
    );
    eventMembers = eventMembers[0];

    let calendar_id = contact_group_id;
    if (eventMembers.length > 0) {
      // filter out unique members from event members array
      uniqueMembers = membersArr.filter((member) => {
        return !eventMembers.some((eventMember) => {
          return eventMember.phone === member.mobile;
        });
      });

    }

    let memberInsertedIds = await createMemberContact(uniqueMembers);
    if (memberInsertedIds) {
      // add members to calendar group
      calendar_id = await addAttendeesToCalendarGroup({
        attendees: memberInsertedIds,
        senderId: creatorId,
        contact_group_id: contact_group_id,
      });
    }

    // event members insert
    if (uniqueMembers.length > 0) {
      const insertMemberQuery =
        "INSERT INTO event_member_request (eventId, uniqueEventId, member_contact_id, accept, details, is_invited) VALUES ";
      let membersInsertValues = [];
      let index = 0;
      for (let member of uniqueMembers) {
        let [member_id] = await db.query(
          `SELECT id FROM member_contacts WHERE phone = ?`,
          [member.mobile]
        );
        member_id = member_id[0].id;
        const insertMemberValues = [
          eventId,
          event.uniqueEventId,
          member_id,
          0,
          JSON.stringify(attendees[index]),
          member.is_invited,
        ];

        // Add to values array for SQL query
        membersInsertValues.push(
          `(${insertMemberValues.map((value) => db.escape(value)).join(", ")})`
        );

        index++;
      }

      const fullInsertQuery =
        insertMemberQuery + membersInsertValues.join(", ");

      // Execute the query
      await db.query(fullInsertQuery);
    }

    // update event details
    const updateQuery = `UPDATE events SET calendar_id = ?, address = ?, ics_modified = ?, icsDetails = ?, message = ? WHERE id = ?`;
    await db.query(updateQuery, [
      calendar_id,
      JSON.stringify(address),
      modified_date,
      JSON.stringify(eventData),
      message,
      eventId,
    ]);

    const timeslot_id = selectedTimeSlotJSON?.timeslot_id || null;
    const recurring_id = selectedTimeSlotJSON?.recurring_id || null;

    // add message into messages table
    let messageQuery =
      "INSERT INTO messages (event_id, sender, rich_text_content, timeslot_id, recurring_id) VALUES (?, ?, ?, ?, ?)";

    let datesOfEvents = `Date:\n`;

    for (let slot of timeSlots) {
      let { startDate, endDate, startTime, endTime, weekdays, slotName } = slot;
      let endDateString = endDate
        ? `${moment(`${endDate} ${endTime || "00:00:00"}`).format(
          "MMMM Do YYYY, h:mm A"
        )}`
        : "NA";
      if (slot.type == 1) {
        datesOfEvents += `${slotName}: ${moment(
          `${startDate} ${startTime}`
        ).format("MMMM Do YYYY, h:mm A")} - ${endDateString}\n`;
      } else {
        datesOfEvents += `${slotName}: ${moment(
          `${startDate} ${startTime}`
        ).format("MMMM Do YYYY, h:mm A")} - ${endDateString} on ${weekdays.join(
          ", "
        )}\n`;
      }
    }

    let contentOfMessage = `
      ${datesOfEvents}
      Location: ${Object.values(address).join(", ")}
      Notes: ${message}
    `;

    let rich_message_content = {
      type: req.uploadedFiles ? "file" : "text",
      content: encodeURIComponent(contentOfMessage),
      attachment: req.uploadedFiles
        ? req.uploadedFiles?.map((file) => {
          return {
            name: file.filename,
            path: file.path.split("/")?.slice(1)?.join("/"),
            url: `${config.baseUrl}/${file.path
              .split("/")
              ?.slice(1)
              ?.join("/")}`,
            type: file.mimetype,
          };
        })
        : [],
    };

    rich_message_content.attachment.push({
      name: "event.ics",
      path: `/ics/${event.uniqueEventId}.ics`,
      url: `${config.baseUrl}/ics/${event.uniqueEventId}.ics`,
      type: "text/calendar",
    });

    let [senderId] = await db.query(
      `SELECT * FROM member_contacts WHERE email = ?`,
      [event.email]
    );

    await db.query(messageQuery, [
      event.uniqueEventId,
      senderId[0].id,
      JSON.stringify(rich_message_content),
      timeslot_id,
      recurring_id
    ]);

    let socketIo = getIO();

    socketIo.to(event.uniqueEventId).emit("message", {
      username: event.name,
      senderId: senderId[0].id,
      message: rich_message_content,
      created_at: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "Message Sent",
    });

    await db.commit();
  } catch (err) {
    console.log(err);
    logger.error(err);
    await db.rollback();
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const eventPage = async (req, res) => {
  let creatorId = req.cookies?.creatorId;
  let groups = [];
  if (creatorId) {
    // get creator calendar groups
    let query = `SELECT *, group_name as name FROM calendar_group WHERE u_user_id = ?`;
    let [result] = await db.query(query, [creatorId]);
    if (result.length > 0) {
      groups = result;
    }
  }

  res.render("create-event", {
    title: "Create Event",
    groups,
    weeklyArray: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
  });
};

export const allEventsPage = async (req, res) => {
  const creatorId = req.cookies?.creatorId;
  let events = [];

  if (creatorId) {
    // get creator events
    let events_query = `SELECT * FROM events WHERE uniqueCreatorId = ?`;
    let [events_result] = await db.query(events_query, [creatorId]);
    
    // Debug log to check what's coming from the database
    console.log("Events from DB:", events_result);
    
    if (events_result.length > 0) {
      events = events_result.map((event) => {
        // Format the date consistently for display and filtering
        const formattedDate = moment(event.created_at).format("DD-MM-YY h:mm A");
        return {
          title: event.title,
          created_at: formattedDate,
          uniqueEventId: event.uniqueEventId,
          creatorId: creatorId
        }
      });
    }
  }

  // Debug log to check what's being passed to the template
  console.log("Events passed to template:", events);

  return res.render("all-events", {
    title: "All Events",
    events,
    creatorId: creatorId
  });
}

export const editEventPage = async (req, res) => {
  const creatorId = req.cookies?.creatorId;
  const uniqueEventId = req.params?.eventId;

  let event = [];

  if (creatorId) {
     // get creator events
     let events_query = `SELECT * FROM events WHERE uniqueCreatorId = ? AND uniqueEventId = ?`;
     let [events_result] = await db.query(events_query, [creatorId, uniqueEventId]);
     if (events_result.length > 0) {
       event = events_result[0];
     }
  }

  res.render("edit-event", {
    title: "Edit Event",
    event,
    weeklyArray: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
  });
};

export const editEvent = async (req, res) => {
  let creatorId = req.cookies?.creatorId;
  const uniqueEventId = req.params?.eventId;

  let event = [];

  if (creatorId) {
     // get creator events
     let events_query = `SELECT * FROM events WHERE uniqueCreatorId = ? AND uniqueEventId = ?`;
     let [events_result] = await db.query(events_query, [creatorId, uniqueEventId]);
     if (events_result.length > 0) {
       event = events_result[0];
     }
  }

  res.render("edit-event", {
    title: "Edit Event",
    event,
    weeklyArray: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
  });
};

export const addMessagePage = async (req, res) => {
  let creatorId = req.cookies?.creatorId;

  let groups = [];
  let events = [];

  if (creatorId) {
    // get creator calendar groups
    let query = `SELECT *, group_name as name FROM calendar_group WHERE u_user_id = ?`;
    let [result] = await db.query(query, [creatorId]);
    if (result.length > 0) {
      groups = result;
    }

     // get creator events
     let events_query = `SELECT id,title FROM events WHERE uniqueCreatorId = ?`;
     let [events_result] = await db.query(events_query, [creatorId]);
     if (result.length > 0) {
       events = events_result;
     }
  }

  res.render("add-message", {
    title: "Add Message",
    groups,
    events,
    weeklyArray: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
  });
};

export const fetchContactGroupMembers = async (req, res) => {
  try {
    let { id } = req.params;
    let query = `SELECT member_contacts FROM calendar_group WHERE id = ?`;
    let [result] = await db.query(query, [id]);
    if (result.length > 0) {
      let members = result[0].member_contacts;
      let query = `SELECT member_id,first_name,last_name,email,phone,user_type,parent_id FROM member_contacts WHERE id IN (${members.join(
        ","
      )})`;
      let [memberResult] = await db.query(query);
      if (memberResult.length > 0) {
        memberResult = memberResult.map((member) => {
          return {
            ...member,
            member_id: member.member_id,
            name: `${member.first_name} ${member.last_name}`,
            email: member.email,
            mobile: member.phone,
            user_type: member.user_type,
            parent_id: member.parent_id,
          };
        });

        res.status(200).json({
          success: true,
          message: "Data found",
          data: memberResult,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Data not found",
          data: [],
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Data not found",
        data: [],
      });
    }
  } catch (err) {
    logger.error(err);
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getEventDetails = async (req, res) => {
  try {
    let { id } = req.params;
    
    let query = `SELECT e.id, e.uniqueEventId, e.calendar_id, e.title, e.email, e.address, et.id as timeSlotId, et.slot_name,et.startDate,et.endDate,et.startTime,et.endTime,et.weekdays,et.type  FROM events e JOIN event_time_slots et ON e.id = et.event_id WHERE e.uniqueEventId = ?`;
    let [result] = await db.query(query, [id]);
    
    // Check if result is empty or undefined
    if (!result || result.length === 0) {
      return res.status(404).render('404', { 
        message: "No event data found for the provided ID" 
      });
    }
    
    let senderMemberContactId = `SELECT id from member_contacts WHERE email = ?`;
    let [senderMemberContact] = await db.query(senderMemberContactId, [
      result[0].email,
    ]);
    
    let senderId = null;
    if (senderMemberContact.length > 0) {
      senderId = senderMemberContact[0].id;
    }

    // Extract the first result item for event details
    const eventDetails = { ...result[0] };
    delete eventDetails.timeSlotId;
    delete eventDetails.slot_name;
    delete eventDetails.startDate;
    delete eventDetails.endDate;
    delete eventDetails.startTime;
    delete eventDetails.endTime;
    delete eventDetails.weekdays;
    delete eventDetails.type;

    // Format the timeSlots array
    const timeSlots = result.map(item => ({
      timeSlotId: item.timeSlotId,
      slot_name: item.slot_name,
      startDate: item.startDate,
      endDate: item.endDate,
      startTime: item.startTime,
      endTime: item.endTime,
      weekdays: item.weekdays,
      type: item.type
    }));

    // Generate chat URL using environment variables
    const baseUrl = process.env.BASE_URL || 'http://localhost';
    const port = process.env.PORT || 3002;
    const chatUrl = `${baseUrl}:${port}/chat/${eventDetails.uniqueEventId}/${senderId}`;

    // Render the view with the data
    return res.render('event-details', {
      event: eventDetails,
      timeSlots: timeSlots,
      chatUrl: chatUrl
    });
  } catch (err) {
    logger.error(err);
    console.log("Error in getEventDetails:", err.message);
    return res.status(500).render('error', {
      message: "Internal Server Error: " + err.message
    });
  }
};

export const getEventDetailsWithUniqueId = async (req, res) => {
  try {
    let { id } = req.params;
    let query = `SELECT e.id, e.uniqueEventId, e.calendar_id, e.title, e.email, e.address, et.id as timeSlotId, et.slot_name,et.startDate,et.endDate,et.startTime,et.endTime,et.weekdays,et.type  FROM events e JOIN event_time_slots et ON e.id = et.event_id WHERE e.uniqueEventId = ?`;
    let [result] = await db.query(query, [id]);
    let senderMemberContactId = `SELECT id from member_contacts WHERE email = ?`;
    let [senderMemberContact] = await db.query(senderMemberContactId, [
      result[0].email,
    ]);
    let senderId = null;
    if (senderMemberContact.length > 0) {
      senderId = senderMemberContact[0].id;
    }

    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: "Data found",
        data: {
          chatUrl: `${config.baseUrl}/chat/${result[0].uniqueEventId}/${senderId}`,
          result,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Data not found",
        data: [],
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const fetchContacts = async (req, res) => {
  let { email } = req.params;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }

  let id = "";
  let userIdQuery = `SELECT u_user_id FROM u_user WHERE u_user_email_address = ?`;
  let [userIdResult] = await db.query(userIdQuery, [email]);
  if (userIdResult.length > 0) {
    id = userIdResult[0].u_user_id;
  }

  // fetch all contacts group members
  let query = `SELECT member_contacts FROM calendar_group WHERE u_user_id = ?`;
  let [result] = await db.query(query, [id]);

  if (!result || !result.length) {
    return res.status(400).json({
      success: false,
      message: "Data not found",
      data: [],
    });
  }

  let contactIds = new Set();

  result.forEach((group) => {
    if (group.members_contacts) {
      group.members_contacts.forEach((contact) => {
        contactIds.add(contact);
      });
    }
  });

  let contactQuery = `SELECT id, CONCAT(first_name, " ", last_name) as name,  email, phone as mobile FROM member_contacts WHERE id IN (${Array.from(
    contactIds
  ).join(",")})`;
  let [contactResult] = await db.query(contactQuery);

  if (!contactResult || !contactResult.length) {
    return res.status(400).json({
      success: false,
      message: "Data not found",
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: "Data found",
    data: contactResult,
  });
};

export const editEventDetails = async (req, res) => {
  console.log("control inside editEventDetails");
  try {
    await db.beginTransaction();

    const uniqueEventId = req.params.eventId;

    let {
      title,
      room_floor,
      place_name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
      timeSlots: time_slots,
    } = req.body;

    let timeSlots = JSON.parse(time_slots || "[]");
    let creatorId;

    if (req.cookies?.creatorId) {
      creatorId = req.cookies?.creatorId;
    }

    let [event] = await db.query(`SELECT * FROM events WHERE uniqueEventId = ?`, [uniqueEventId]);
    
    event = event[0];

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not found",
      });
    }

    let eventId = event.id;

    const address = {
      room: room_floor,
      place: place_name,
      address_line1: address_line1,
      address_line2: address_line2,
      city: city,
      state: state,
      country: country,
      postal_code: postal_code,
    };

    let insertQueryOfEventTimeSlots = `INSERT INTO event_time_slots(event_id, slot_name, startDate,endDate,startTime,endTime,weekdays,type) VALUES `;
    let updateQueryOfEventTimeSlots = `UPDATE event_time_slots SET slot_name = ?, startDate = ?, endDate = ?, startTime = ?, endTime = ?, weekdays = ?, type = ? WHERE id = ?`;
    let isNewAdded = false;

    for (let slot of timeSlots) {
        if (slot.type == 1) {
          const { startDate, endDate, startTime, endTime } = slot;

          const startDateValue = startDate ? `"${startDate}"` : `NULL`;
          const startTimeValue = startTime ? `"${startTime}"` : `NULL`;

          const endDateValue = endDate ? `"${endDate}"` : `NULL`;
          const endTimeValue = endTime ? `"${endTime}"` : `NULL`;
          if (slot.id) {
            await db.query(updateQueryOfEventTimeSlots, [
              slot.slotName,
              startDateValue,
              endDateValue,
              startTimeValue,
              endTimeValue,
              JSON.stringify(slot.weekdays),
              1,
              slot.id,
            ]);
          } else {
            insertQueryOfEventTimeSlots += `(${eventId}, "${slot.slotName
              }", ${startDateValue}, ${endDateValue}, ${startTimeValue}, ${endTimeValue}, "${JSON.stringify(
                []
              )}", ${1}),`;
            isNewAdded = true;
          }
        } else {
          const { startDate, endDate, weekdays, startTime, endTime } = slot;
          const startDateValue = startDate ? `"${startDate}"` : `NULL`;
          const startTimeValue = startTime ? `"${startTime}"` : `NULL`;

          const endDateValue = endDate ? `"${endDate}"` : `NULL`;
          const endTimeValue = endTime ? `"${endTime}"` : `NULL`;
          if (slot.id) {
            await db.query(updateQueryOfEventTimeSlots, [
              slot.slotName,
              startDateValue,
              endDateValue,
              startTimeValue,
              endTimeValue,
              JSON.stringify(weekdays),
              2,
              slot.id,
            ]);
          } else {
            insertQueryOfEventTimeSlots += `(${eventId}, "${slot.slotName
              }", ${startDateValue}, "${endDate}", ${startTimeValue}, ${endTimeValue}, '${JSON.stringify(
                weekdays
              )}', ${2}),`;
            isNewAdded = true;
          }
        }
    }

    let eventParameter = {
      uniqueMembers: [],
      title: title,
      address,
      org_mail: event.email,
      org_name: event.name,
      eventId: event.uniqueEventId,
      calendar_id: event.calendar_id,
      creatorId,
      timeSlots,
    };

    if (isNewAdded) await db.query(insertQueryOfEventTimeSlots.slice(0, -1));

    let extraMetaData = getExtraKeyMembersFromGivenObject(
      req.body,
      eventParameter
    );

    const {
      attendees,
      event: eventData,
      modified_date,
    } = createEventData({
      ...eventParameter,
      extra: extraMetaData,
    });

    // generate ics file
    const ics_new_file_content = generateICS(eventData);
    await updateIcsFile(ics_new_file_content, event.uniqueEventId, eventData);
    
    let eventMembers = await db.query(
      `SELECT phone FROM event_member_request JOIN member_contacts ON event_member_request.member_contact_id = member_contacts.id WHERE eventId = ${eventId}`
    );
    eventMembers = eventMembers[0];

    let calendar_id = event.calendar_id;

    const updateQuery = `UPDATE events SET title = ?, calendar_id = ?, address = ?, ics_modified = ?, icsDetails = ? WHERE id = ?`;

    await db.query(updateQuery, [
      title,
      calendar_id,
      JSON.stringify(address),
      modified_date,
      JSON.stringify(eventData),
      eventId
    ]);

    let [senderId] = await db.query(
      `SELECT * FROM member_contacts WHERE email = ?`,
      [event.email]
    );

    let socketIo = getIO();

    socketIo.to(event.uniqueEventId).emit("message", {
      username: event.name,
      senderId: senderId[0].id,
      message: "Event Updated!",
      created_at: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "Event changed successfully",
    });

    await db.commit();
  } catch (err) {
    console.log(err);
    logger.error(err);
    await db.rollback();
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
