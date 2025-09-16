import moment from "moment";
import db from "../db/index.js";
import {
  getBillingCadence,
  getFeeAmount,
  getFeeType,
  getInvoiceInstruction,
} from "../helpers/common.js";
import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { logger } from "../helpers/logger.js";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import config from "../config/index.js";
import {
  calculateTotalOccurrencesOfTheEvent,
  classifyTimeSlotsTheme,
  findingStartDateAndEndDateFromAcrossTimeSlots,
  getBillingCadenceDates,
  totalUnitCost,
  calculateTotalDays,
  calculateTotalMonths,
  fetchAllWeekDaysAcrossDayDateTimeSlots,
  generateInvoiceNumber,
  ordinalSuffix,
} from "../helpers/invoice-calculation.js";
import {
  FEE_AMOUNT,
  FEE_TYPES,
  INVOICE_INSTRUCTION,
} from "../config/invoiceConstants.js";

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getInvoicePage = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event id is required",
      });
    }

    let query = `SELECT * FROM events WHERE uniqueEventId = ?`;
    let [rows] = await db.query(query, [eventId]);
    if (!rows || !rows.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event not found",
      });
    }

    let event_members = `SELECT * FROM event_member_request WHERE eventId = ?`;
    let [members] = await db.query(event_members, [rows[0].id]);

    let membersIds = members.map((member) => member.member_contact_id);
    // fetch members details from member_contacts table
    let member_result = [];
    let member_query = `SELECT * FROM member_contacts WHERE id IN (?)`;
    if(membersIds?.length > 0) {
      let [member_db_result] = await db.query(member_query, [membersIds]);
      if (!member_db_result || !member_db_result.length) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Members not found",
        });
      }
      member_result = member_db_result;
    }

    let timeSlotsQuery = `SELECT * FROM event_time_slots WHERE event_id = ?`;
    let [timeSlots] = await db.query(timeSlotsQuery, [rows[0].id]);

    let timeSlotsArr = [];
    let classes = [];
    if (timeSlots && timeSlots.length) {
      for (let timeSlot of timeSlots) {
        timeSlotsArr.push({
          name: timeSlot.slot_name,
          id: timeSlot.id,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          startDate: timeSlot.startDate,
          endDate: timeSlot.endDate,
          weekdays: timeSlot.weekdays,
          type: timeSlot.type,
        });
      }
    }

    // fetch other classes of the event creator and their time slots

    let creatorId = rows[0].uniqueCreatorId;

    query = `SELECT * FROM events WHERE uniqueCreatorId = ? and id != ?`;
    let [otherClassesRows] = await db.query(query, [creatorId, rows[0].id]);

    if (otherClassesRows || otherClassesRows.length) {
      for (let row of otherClassesRows) {
        let timeSlotsQuery = `SELECT * FROM event_time_slots WHERE event_id = ?`;
        let [timeSlots] = await db.query(timeSlotsQuery, [row.id]);
        if (timeSlots && timeSlots.length) {
          for (let timeSlot of timeSlots) {
            classes.push({
              name: timeSlot.slot_name,
              id: timeSlot.id,
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
              startDate: timeSlot.startDate,
              endDate: timeSlot.endDate,
              weekdays: timeSlot.weekdays,
              type: timeSlot.type,
            });
          }
        }
      }
    }

    const { date_range_time_slots, date_time_slots, day_date_time_slots } =
      classifyTimeSlotsTheme(timeSlots);

    let location = Object.keys(rows[0].address)
      .map((key) => rows[0].address[key])
      .join(", ");

    let familyClasses = [
      {
        name: "John Doe",
        id: "john-doe",
        class_name: "Batch 1",
        class_id: "batch-1",
      },
      {
        name: "Jane Doe",
        id: "jane-doe",
        class_name: "Batch 2",
        class_id: "batch-2",
      },
    ];

    // to through each theme slot and find total classes and hours of one class
    let feeTypeHeader = "";
    const { totalClasses, totalHours } = calculateTotalOccurrencesOfTheEvent(
      date_time_slots,
      date_range_time_slots,
      day_date_time_slots
    );

    feeTypeHeader = `(${totalClasses} CLASSES - ${totalHours} HOURS)`;
    res.render("invoice", {
      title: "Invoice",
      eventName: rows[0].title,
      eventId: rows[0].uniqueEventId,
      calendarId: rows[0].calendar_id,
      creatorName: rows[0].name,
      address: location,
      timeSlots: timeSlotsArr,
      invoiceInstructions: INVOICE_INSTRUCTION,
      feeTypes: FEE_TYPES,
      feeAmounts: FEE_AMOUNT,
      members: member_result,
      classes: classes,
      familyClasses: familyClasses,
      displayClassifiedTimeSlots: {
        day_date_time_slots,
        date_range_time_slots,
        date_time_slots,
      },
      feeTypeHeader: feeTypeHeader,
      totalClasses,
      totalHours
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getInvoicePreviewPage = async (req, res) => {
  try {
    const { eventId, invoiceId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event id is required",
      });
    }

    let query = `SELECT * FROM events WHERE uniqueEventId = ?`;
    let [rows] = await db.query(query, [eventId]);
    if (!rows || !rows.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event not found",
      });
    }

    let timeSlotsQuery = `SELECT * FROM event_time_slots WHERE event_id = ?`;
    let [timeSlots] = await db.query(timeSlotsQuery, [rows[0].id]);

    let timeSlotsArr = [];
    if (timeSlots && timeSlots.length) {
      for (let timeSlot of timeSlots) {
        timeSlotsArr.push({
          name: timeSlot.slot_name,
          id: timeSlot.id,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          startDate: timeSlot.startDate,
          endDate: timeSlot.endDate,
          weekdays: timeSlot.weekdays,
          type: timeSlot.type,
        });
      }
    }

    const { date_range_time_slots, date_time_slots, day_date_time_slots } =
      classifyTimeSlotsTheme(timeSlots);

    let feeTypeHeader = "";
    const { totalClasses, totalHours } = calculateTotalOccurrencesOfTheEvent(
      date_time_slots,
      date_range_time_slots,
      day_date_time_slots
    );

    feeTypeHeader = `(${totalClasses} CLASSES - ${totalHours} HOURS)`;

    if (invoiceId) {
      let invoiceQuery = `select
                          i.id,
                          i.invoice_number,
                          i.event_id,
                          i.teacher_id,
                          i.student_id,
                          i.total_amount,
                          i.location,
                          i.pdf_path,
                          i.invoice_instruction_type,
                          i.created_at,
                          it.quantity,
                          it.unit_price,
                          it.item_type,
                          mc.first_name,
                          mc.last_name
                      from
                          invoices i
                          JOIN invoice_items it on i.id = it.invoice_id
                          JOIN member_contacts mc on mc.id = i.student_id
                      WHERE
                          event_id = ? and invoice_number = ?`;

      let [invoice] = await db.query(invoiceQuery, [rows[0].id, invoiceId]);
      if (!invoice || !invoice.length) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invoice not found",
        });
      }

      let eventFeeDetailsQuery = `SELECT payment_terms FROM event_fee_details WHERE event_id = ? and invoice_id = ? LIMIT 1`;
      let [eventFeeDetails] = await db.query(eventFeeDetailsQuery, [
        rows[0].id,
        invoice[0].id,
      ]);

      if (!eventFeeDetails || !eventFeeDetails.length) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Event fee details not found",
        });
      }

      let invoiceDetails = {
        id: invoice[0].id,
        invoice_number: invoice[0].invoice_number,
        created_at: invoice[0].created_at,
        total_amount: invoice[0].total_amount,
        location: invoice[0].location,
        pdf_path: invoice[0].pdf_path,
        invoice_instruction_type: getInvoiceInstruction(
          invoice[0].invoice_instruction_type
        ),
        billing_cadence: getBillingCadence(eventFeeDetails[0].payment_terms),
        quantity: invoice[0].quantity,
        unit_price: getFeeAmount(invoice[0].unit_price),
        item_type: getFeeType(invoice[0].item_type),
        studentName: `${invoice[0].first_name} ${invoice[0].last_name}`,
      };

      res.render("single-invoice-preview.hbs", {
        title: "Invoice Preview",
        eventName: rows[0].title,
        eventId: rows[0].uniqueEventId,
        timeSlots: timeSlotsArr,
        feeTypeHeader: feeTypeHeader,
        invoice: invoiceDetails,
        displayClassifiedTimeSlots: {
          day_date_time_slots,
          date_range_time_slots,
          date_time_slots,
        },
      });
      return;
    }

    let invoiceQuery = `select
                          i.id,
                          i.invoice_number,
                          i.event_id,
                          i.teacher_id,
                          i.student_id,
                          i.total_amount,
                          i.location,
                          i.pdf_path,
                          i.invoice_instruction_type,
                          i.created_at,
                          it.quantity,
                          it.unit_price,
                          it.item_type,
                          mc.first_name,
                          mc.last_name
                      from
                          invoices i
                          JOIN invoice_items it on i.id = it.invoice_id
                          JOIN member_contacts mc on mc.id = i.student_id
                      WHERE
                          event_id = ?`;

    let [invoices] = await db.query(invoiceQuery, [rows[0].id]);
    if (!invoices || !invoices.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invoice not found",
      });
    }

    let invoicesArr = [];

    for (let invoice of invoices) {
      let eventFeeDetailsQuery = `SELECT payment_terms FROM event_fee_details WHERE event_id = ? and invoice_id = ? LIMIT 1`;
      let [eventFeeDetails] = await db.query(eventFeeDetailsQuery, [
        rows[0].id,
        invoice.id,
      ]);

      if (!eventFeeDetails || !eventFeeDetails.length) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Event fee details not found",
        });
      }

      invoicesArr.push({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        created_at: invoice.created_at,
        total_amount: invoice.total_amount,
        location: invoice.location,
        pdf_path: invoice.pdf_path,
        invoice_instruction_type: getInvoiceInstruction(
          invoice.invoice_instruction_type
        ),
        billing_cadence: getBillingCadence(eventFeeDetails[0].payment_terms),
        quantity: invoice.quantity,
        unit_price: getFeeAmount(invoice.unit_price),
        item_type: getFeeType(invoice.item_type),
        studentName: `${invoice.first_name} ${invoice.last_name}`,
      });
    }

    res.render("invoice-preview.hbs", {
      title: "Invoice Preview",
      eventName: rows[0].title,
      eventId: rows[0].uniqueEventId,
      timeSlots: timeSlotsArr,
      feeTypeHeader: feeTypeHeader,
      invoices: invoicesArr,
      displayClassifiedTimeSlots: {
        day_date_time_slots,
        date_range_time_slots,
        date_time_slots,
      },
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Something went wrong",
    });
  }
};

// Temporary route for testing pdf generation
export const getInvoicePDFPage = async (req, res) => {
  const { eventId, invoiceId } = req.params;

  if (!eventId) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Event id is required",
    });
  }

  let query = `SELECT * FROM events WHERE uniqueEventId = ?`;
  let [rows] = await db.query(query, [eventId]);

  if (!rows || !rows.length) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Event not found",
    });
  }

  query = `SELECT * FROM event_time_slots WHERE event_id = ?`;
  let [timeSlots] = await db.query(query, [rows[0].id]);
  let timeSlotsArr = [];
  if (timeSlots && timeSlots.length) {
    for (let timeSlot of timeSlots) {
      timeSlotsArr.push({
        name: timeSlot.slot_name,
        id: timeSlot.id,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        startDate: timeSlot.startDate,
        endDate: timeSlot.endDate,
        weekdays: timeSlot.weekdays,
        type: timeSlot.type,
      });
    }
  }

  const { date_range_time_slots, date_time_slots, day_date_time_slots } =
    classifyTimeSlotsTheme(timeSlots);

  let invoiceResult = null;
  if (!invoiceId) {
    let invoiceQuery = `select i.id,i.invoice_number,i.event_id,i.teacher_id,i.student_id,i.logo_path,
      i.total_amount,i.location,i.pdf_path,i.invoice_instruction_type,i.created_at,it.quantity,it.unit_price,it.item_type from invoices i
                              JOIN invoice_items it on i.id = it.invoice_id
                              WHERE event_id = ?
                              `;
    [invoiceResult] = await db.query(invoiceQuery, [rows[0].id]);
  } else {
    let invoiceQuery = `select i.id,i.invoice_number,i.event_id,i.teacher_id,i.student_id,i.logo_path,
    i.total_amount,i.location,i.pdf_path,i.invoice_instruction_type,i.created_at,it.quantity,it.unit_price,it.item_type from invoices i
                            JOIN invoice_items it on i.id = it.invoice_id
                            WHERE event_id = ? AND i.invoice_number = ?
                            `;
    [invoiceResult] = await db.query(invoiceQuery, [rows[0].id, invoiceId]);
  }

  let { startDate, endDate } = findingStartDateAndEndDateFromAcrossTimeSlots({
    date_time_slots,
    date_range_time_slots,
    day_date_time_slots,
    timeSlotsArr,
  });
  let dictionary = {
    creatorName: rows[0].name,
    title: rows[0].title,
    location: invoiceResult[0].location,
    unitCost: invoiceResult[0].unit_price,
    themeSlots: {
      day_date_time_slots,
      date_range_time_slots,
      date_time_slots,
    },
    startDate: startDate,
    endDate: endDate,
    cost: invoiceResult[0].total_amount,
    fee_type: getFeeType(invoiceResult[0].item_type),
    invoice_instruction: getInvoiceInstruction(
      invoiceResult[0].invoice_instruction_type
    ),
    occurrences: calculateTotalOccurrencesOfTheEvent(
      date_time_slots,
      date_range_time_slots,
      day_date_time_slots
    ),
    createdAt: moment(invoiceResult[0].created_at).format("MM-DD-YYYY"),
    paymentOptions: {
      card_on_file: true,
      credit_card: true,
      "e-check": true,
      cash: true,
    },
    logo: invoiceResult[0]?.logo_path
      ? `${config.baseUrl}/${invoiceResult[0]?.logo_path}`
      : `${config.baseUrl}/assets/images/logo-placeholder-image.png`,
    qrCode: `${config.baseUrl}/assets/images/qr-placeholder.png`,
  };

  res.render("invoice-pdf", dictionary);
};

async function generatePDF(invoiceId, eventDetails) {
  const { timeSlots, formattedTimeSlots, eventId, name, title } = eventDetails;

  let invoiceQuery = `SELECT
                          i.id,
                          i.invoice_number,
                          i.event_id,
                          i.teacher_id,
                          i.student_id,
                          i.total_amount,
                          i.location,
                          i.pdf_path,
                          i.invoice_instruction_type,
                          i.logo_path,
                          i.created_at,
                          it.quantity,
                          it.unit_price,
                          it.item_type
                      FROM
                          invoices i
                          JOIN invoice_items it ON i.id = it.invoice_id
                      WHERE
                          i.id = ?
                          AND i.event_id = ?`;

  let [invoice] = await db.query(invoiceQuery, [invoiceId, eventId]);

  if (!invoice || !invoice.length) {
    throw new Error("Invoice not found");
  }

  invoice = invoice[0];

  const { date_range_time_slots, date_time_slots, day_date_time_slots } =
    classifyTimeSlotsTheme(timeSlots);

  let { startDate, endDate } = findingStartDateAndEndDateFromAcrossTimeSlots({
    date_time_slots,
    date_range_time_slots,
    day_date_time_slots,
    formattedTimeSlots,
  });

  // generate monthYear folder from createAt Field of invoice
  const monthYear = moment(invoice.created_at).format("MM-YYYY");

  // check if monthYear folder exists
  const monthYearFolderPath = path.join(
    __dirname,
    "../../public/uploads/invoices",
    monthYear
  );

  let fileName = `${invoice.invoice_number}.pdf`;
  let pdf_path = `/uploads/invoices/${monthYear}/${invoice.invoice_number}.pdf`;

  let dictionary = {
    creatorName: name,
    title: title,
    location: invoice.location,
    unitCost: invoice.unit_price,
    themeSlots: {
      day_date_time_slots,
      date_range_time_slots,
      date_time_slots,
    },
    startDate: startDate,
    endDate: endDate,
    cost: invoice.total_amount,
    fee_type: getFeeType(invoice.item_type),
    invoice_instruction: getInvoiceInstruction(
      invoice.invoice_instruction_type
    ),
    occurrences: calculateTotalOccurrencesOfTheEvent(
      date_time_slots,
      date_range_time_slots,
      day_date_time_slots
    ),
    createdAt: moment(invoice.created_at).format("MM-DD-YYYY"),
    paymentOptions: {
      card_on_file: true,
      credit_card: true,
      "e-check": true,
      cash: true,
    },
    logo: invoice?.logo_path
      ? `${config.baseUrl}/${invoice?.logo_path}`
      : `${config.baseUrl}/assets/images/logo-placeholder-image.png`,
    qrCode: `${config.baseUrl}/assets/images/qr-placeholder.png`,
  };

  const templateHtml = await fs.readFile(
    path.join(__dirname, "../views", "invoice-pdf.hbs"),
    "utf8"
  );
  const template = handlebars.compile(templateHtml);
  const html = template(dictionary, {
    helpers: {
      json: function (context) {
        return JSON.stringify(context); // Helper to stringify JSON
      },
    },
  });

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Set HTML content to the page
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Generate PDF from the page content
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
  });

  await browser.close();

  try {
    await fs.stat(monthYearFolderPath);
  } catch (err) {
    await fs.mkdir(monthYearFolderPath);
  }

  // Define the file path where the PDF will be stored
  const filePath = path.join(
    __dirname,
    `../../public/uploads/invoices/${monthYear}`,
    fileName
  );

  // Store the PDF inside the storage folder
  await fs.writeFile(filePath, pdfBuffer);

  // update invoice pdf path
  let query = `UPDATE invoices SET pdf_path = '${pdf_path}' WHERE id = '${invoice.id}'`;
  await db.query(query);
}

async function generatePDFs(eventId, invoiceIds) {
  try {
    if (!eventId) {
      throw new Error("Event id is required");
    }

    let query = `SELECT * FROM events WHERE uniqueEventId = ?`;
    let [rows] = await db.query(query, [eventId]);
    if (!rows || !rows.length) {
      throw new Error("Event not found");
    }

    query = `SELECT * FROM event_time_slots WHERE event_id = ?`;
    let [timeSlots] = await db.query(query, [rows[0].id]);

    let timeSlotsArr = [];
    if (timeSlots && timeSlots.length) {
      for (let timeSlot of timeSlots) {
        timeSlotsArr.push({
          name: timeSlot.slot_name,
          id: timeSlot.id,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          startDate: timeSlot.startDate,
          endDate: timeSlot.endDate,
          weekdays: timeSlot.weekdays,
          type: timeSlot.type,
        });
      }
    }

    for (let invoiceId of invoiceIds) {
      await generatePDF(invoiceId, {
        timeSlots: timeSlots,
        formattedTimeSlots: timeSlotsArr,
        eventId: rows[0].id,
        uniqueEventId: rows[0].uniqueEventId,
        name: rows[0].name,
        title: rows[0].title,
      });
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    throw new Error("Unable to generate PDF");
  }
}

export const generateInvoice = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event id is required",
      });
    }

    // fetch event details from db for generating invoice {creatorId, name, title, etc...}
    let query = `SELECT * FROM events WHERE uniqueEventId = ?`;
    let [rows] = await db.query(query, [eventId]);

    if (!rows || !rows.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Event not found",
      });
    }

    let {
      members,
      invoice_instruction,
      fee_type,
      fee_amount,
      billing_cadence,
      themeSlots,
    } = req.body;

    billing_cadence = JSON.parse(billing_cadence ?? "{}");
    themeSlots = JSON.parse(themeSlots ?? "{}");
    members = JSON.parse(members ?? "{}");

    if (
      !invoice_instruction ||
      !fee_type ||
      !fee_amount ||
      !billing_cadence ||
      !members
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "All fields are required",
      });
    }
    const { date_time_slots, day_date_time_slots, date_range_time_slots } =
      themeSlots;

    let cost = totalUnitCost(
      fee_amount,
      billing_cadence,
      date_time_slots,
      day_date_time_slots,
      date_range_time_slots
    );

    let dates = getBillingCadenceDates(billing_cadence, themeSlots);

    let { startDate, endDate } =
      findingStartDateAndEndDateFromAcrossTimeSlots(themeSlots);

    let location = Object.keys(rows[0].address)
      .map((key) => rows[0].address[key])
      .join(", ");

    let dictionary = {
      creatorName: rows[0].name,
      location: location,
      timeSlot: themeSlots,
      unitCost: fee_amount,
      billingCadence: billing_cadence,
      date_time_slots: date_time_slots,
      day_date_time_slots: day_date_time_slots,
      date_range_time_slots: date_range_time_slots,
      startDate: startDate,
      endDate: endDate,
      weekdays: fetchAllWeekDaysAcrossDayDateTimeSlots(day_date_time_slots),
      cost: cost,
      fee_type: fee_type,
      fee_amount: fee_amount,
      invoice_instruction: invoice_instruction,
      totalMonths: calculateTotalMonths(startDate, endDate),
      totalDays: calculateTotalDays(startDate, endDate),
      occurrences: calculateTotalOccurrencesOfTheEvent(
        date_time_slots,
        date_range_time_slots,
        day_date_time_slots
      ),
    };

    switch (billing_cadence.group.identifier) {
      case "15th-of-the-month":
        dictionary["dayOfMonth"] = 15;
        break;
      case "last-day-of-the-month":
        dictionary["dayOfMonth"] = "last";
        break;
      case "day-of-the-month":
        dictionary["dayOfMonth"] = parseInt(billing_cadence.selectedValue);
        break;
    }

    db.beginTransaction();
    // store invoice in the database
    query = `INSERT INTO invoices (invoice_number,event_id,teacher_id,student_id,total_amount,location,invoice_instruction_type,logo_path) values (?,?,?,?,?,?,?,?)`;
    let invoiceIds = [];
    for (let member of members) {
      let logoPath = req?.uploadedFile && req?.uploadedFile?.path
        ? req?.uploadedFile?.path?.split("/")?.slice(1)?.join("/")
        : null;
      let values = [
        generateInvoiceNumber(),
        rows[0].id,
        rows[0].uniqueCreatorId,
        member,
        cost,
        dictionary.location,
        dictionary.invoice_instruction,
        logoPath,
      ];

      let [result] = await db.query(query, values);

      if (!result.affectedRows) {
        throw new Error("Something went wrong");
      }

      let insertedId = result.insertId;

      invoiceIds.push(insertedId);
      // store invoice details in the database
      let itemsQuery = `INSERT INTO invoice_items (invoice_id,quantity,unit_price,total_amount,item_type) values (?,?,?,?,?)`;

      let itemsValues = [
        insertedId,
        dictionary.occurrences.totalClasses,
        Number(dictionary.unitCost),
        Number(dictionary.cost),
        dictionary.fee_type,
      ];

      [result] = await db.query(itemsQuery, itemsValues);

      if (!result.affectedRows) {
        throw new Error("Something went wrong");
      }

      // store invoice recurrences in the database
      let eventFeesQuery = `INSERT INTO event_fee_details (event_id,invoice_id,batch_date,payment_terms) values (?,?,?,?)`;

      for (let date of dates) {
        let values = [
          rows[0].id,
          insertedId,
          date,
          billing_cadence.group.identifier,
        ];
        let [result] = await db.query(eventFeesQuery, values);
        if (!result.affectedRows) {
          throw new Error("Something went wrong");
        }
      }
    }

    await generatePDFs(eventId, invoiceIds);
    db.commit();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Invoice generated successfully",
    });
  } catch (err) {
    console.log(err);
    db.rollback();
    logger.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Something went wrong",
    });
  }
};
