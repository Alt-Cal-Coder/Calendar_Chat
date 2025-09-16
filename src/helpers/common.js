import moment from "moment";
import fs from "fs/promises";
import {
  BILLING_CADENCE,
  FEE_AMOUNT,
  FEE_TYPES,
  INVOICE_INSTRUCTION,
} from "../config/invoiceConstants.js";

export const generateICS = (eventData) => {
  const {
    title,
    uniqueEventId,
    lastModified,
    attendees,
    location,
    mail,
    calendar_id,
    creatorId,
    timeSlots,
    extra,
  } = eventData;

  let timeodcreate = moment(new Date()).toISOString();
  let timeodcreate_evt = moment(timeodcreate)
    .utc()
    .format("YYYYMMDDTHHmmss[Z]");

  let attende_cal = "";
  if (attendees && attendees.length > 0) {
    attendees.forEach((attende) => {
      attende_cal += `ATTENDEE;RSVP=TRUE;CUTYPE="${attende.cutype}";ROLE="${attende.role}";PARTSTAT="${attende.partstat}";EMAIL="${attende.email}";CN="${attende.name}":mailto:${attende.email}\n`;
    });
  }

  let attende_str = attende_cal.substring(0, attende_cal.length - 1);

  /**
   * 1 - weekly, 2 - start-end
   * [
   *   {
   *     start: "2022-09-25T18:00:00.000Z",
   *     end: "2022-09-25T20:00:00.000Z",
   *     slot_name: "Test",
   *     type: 1
   *   },
   *   {
   *     start: "2022-09-25",
   *     end: "2022-09-25",
   *     weeklyDays: [M, T, F, SA],
   *     slot_name: "Test",
   *     type: 2
   *   }
   * ]
   *
   *
   */

  let vEvent = timeSlots.map((timeSlot, index) => {
    let text = ``;
    let { start, end, slotName, weekdays } = timeSlot;
    let starTDateString = ``;
    if (start) {
      starTDateString = `DTSTART:${start}`;
    }
    let endDateString = ``;
    if (end) {
      endDateString = `DTEND:${end}`;
    }

    if (timeSlot.type === 1) {
      text += `BEGIN:VEVENT
UID:${uniqueEventId}-${index}
${starTDateString}
${endDateString}
DTSTAMP:${timeodcreate_evt}
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${slotName}
${attende_str}
ORGANIZER;CN="${title}":MAILTO:${mail}
LAST-MODIFIED:${lastModified}
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:TRANSPARENT
X-EVENT-ID:${uniqueEventId}
X-WR-CALNAME:${calendar_id}
X-CREATOR-ID:${creatorId}
END:VEVENT

`;
    } else if (timeSlot.type === 2) {
      let weekday_reminder_days_str = "";

      if (weekdays && weekdays.length > 0) {
        weekday_reminder_days_str = `RRULE:FREQ=WEEKLY;BYDAY=${weekdays.join(
          ","
        )};UNTIL=${end}`;
      }

      text += `BEGIN:VEVENT
UID:${uniqueEventId}-${index}
${starTDateString}
${endDateString}
DTSTAMP:${timeodcreate_evt}
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${slotName}
${attende_str}
ORGANIZER;CN="${title}":MAILTO:${mail}
LAST-MODIFIED:${lastModified}
SEQUENCE:0
${weekday_reminder_days_str}
STATUS:CONFIRMED
TRANSP:TRANSPARENT
X-EVENT-ID:${uniqueEventId}
X-WR-CALNAME:${calendar_id}
X-CREATOR-ID:${creatorId}
END:VEVENT

`;
    }

    return text;
  });
  const event_ics = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:adamgibbons/ics
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
${vEvent.join("")}
X-EXTRA:${JSON.stringify(extra)}
END:VCALENDAR`;

  return event_ics;
};

export const createICSAndJSONFile = async (
  fileContent,
  fileName,
  jsonContent
) => {
  console.log("create the file")
  await fs.writeFile(`./public/ics/${fileName}.ics`, fileContent, "utf8");
  await fs.writeFile(
    `./public/ics/${fileName}.json`,
    JSON.stringify(jsonContent),
    "utf8"
  );
  console.log("file created")
};

export const updateIcsFile = async (fileContent, fileName, jsonContent) => {
  // overwrite the ics file
  console.log(fileName);
  await fs.writeFile(`./public/ics/${fileName}.ics`, fileContent, {
    encoding: "utf-8",
    flag: "w",
  });
  await fs.writeFile(
    `./public/ics/${fileName}.json`,
    JSON.stringify(jsonContent),
    {
      encoding: "utf-8",
      flag: "w",
    }
  );
};

export const getInvoiceInstruction = (instruction) => {
  return INVOICE_INSTRUCTION.find((type) => type.value === instruction);
};

export const getFeeType = (feeType) => {
  return FEE_TYPES.find((type) => type.value === feeType);
};

export const getFeeAmount = (feeAmount) => {
  let fee = FEE_AMOUNT.find((type) => type.value === feeAmount);

  if (!fee) {
    return {
      name: "custom",
      id: "fee-amount-custom",
      value: feeAmount,
      isCustom: true,
    };
  }

  return fee;
};

export const getBillingCadence = (billingCadence) => {
  return BILLING_CADENCE.find((type) => type.identifier === billingCadence);
};

export const extractAddress = (data) => {
  if (!data) return {};

  const addressComponents = data?.result?.address_components;
  
  // Helper function to get component by type
  const getComponent = (types) => {
    const component = addressComponents.find(comp => types.some(type => comp.types.includes(type)));
    return component ? component.long_name : undefined;
  };

  return {
    city: getComponent(["locality"]),
    state: getComponent(["administrative_area_level_1"]),
    country: getComponent(["country"]),
    postal_code: getComponent(["postal_code"]),
    address_line1: getComponent(["street_address", "route"]), // Street name
    address_line2: getComponent(["sublocality", "neighborhood"]), // Additional details
    room: getComponent(["room"]) || "", // Room info if available
    place: getComponent(["establishment"]) || "" // Place name if available
  };
}

// const event_ics = `BEGIN:VCALENDAR
// VERSION:2.0
// CALSCALE:GREGORIAN
// PRODID:adamgibbons/ics
// METHOD:PUBLISH
// X-PUBLISHED-TTL:PT1H
// BEGIN:VEVENT
// DTSTART:${start}
// DTEND:${end}
// DTSTAMP:${timeodcreate_evt}
// UID:${uniqueEventId}
// SUMMARY:${title}
// LOCATION:${location}
// ${attende_str}
// ORGANIZER;CN="${title}":MAILTO:${mail}
// LAST-MODIFIED:${lastModified}
// SEQUENCE:0
// STATUS:CONFIRMED
// TRANSP:TRANSPARENT
// X-EVENT-ID:${uniqueEventId}
// ${weekday_reminder_days_str}
// X-WR-CALNAME:${calendar_id}
// X-CREATOR-ID:${creatorId}
// X-EXTRA:${JSON.stringify(extra)}
// END:VEVENT
// END:VCALENDAR`;
