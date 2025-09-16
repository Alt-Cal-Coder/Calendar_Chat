import moment from "moment";

export const ordinalSuffix = (n) => {
  const suffixes = ["TH", "ST", "ND", "RD"];
  const remainder = n % 100;

  return (
    n + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0])
  );
};

export const findDiffBetweenTwoTimes = (start, end) => {
  const startTime = moment(start, "HH:mm");
  const endTime = moment(end, "HH:mm");

  // Calculate the difference in minutes
  const durationInMinutes = endTime.diff(startTime, "minutes");

  // Convert minutes to hours
  const durationInHours = durationInMinutes / 60;

  return durationInHours;
};

export const findDiffBetweenTwoDates = (start, end) => {
  const startDate = moment(start);
  const endDate = moment(end);
  return endDate.diff(startDate, "days") + 1;
};

export function calculateTotalOccurrencesOfTheEvent(
  date_time_slots,
  date_range_time_slots,
  day_date_time_slots
) {
  let totalHours = 0;
  let totalClasses = 0;
  date_time_slots.forEach((slot) => {
    if (slot.start_time && slot.end_time) {
      totalHours += findDiffBetweenTwoTimes(slot.start_time, slot.end_time);
    }
    totalClasses += 1;
  });

  date_range_time_slots.forEach((slot) => {
    if (slot.date_range) {
      let [start_date, end_date] = slot.date_range.split(" - ");
      totalClasses += findDiffBetweenTwoDates(start_date, end_date);
    }
    if (slot.start_time && slot.end_time) {
      totalHours += findDiffBetweenTwoTimes(slot.start_time, slot.end_time);
    }
  });

  day_date_time_slots.forEach((slot) => {
    if (slot.day) {
      const [classes, hours] = countWeekdayOccurrences(
        slot.start_date,
        slot.end_date,
        slot.day,
        true,
        slot.start_time,
        slot.end_time,
      );
      totalClasses += classes;
      totalHours += hours;
    } else {
      if (slot.start_time && slot.end_time) {
        totalHours += findDiffBetweenTwoTimes(slot.start_time, slot.end_time);
      }
    }
  });

  return { totalHours, totalClasses };
}

export function classifyTimeSlotsTheme(timeSlots) {
  const day_date_time_slots = [];
  const date_range_time_slots = [];
  const date_time_slots = [];

  timeSlots.forEach((timeSlot) => {
    if (
      timeSlot.weekdays?.length > 0 &&
      timeSlot.startDate &&
      timeSlot.endDate &&
      timeSlot.startTime &&
      timeSlot.endTime
    ) {
      // Has both day and date
      day_date_time_slots.push({
        id: timeSlot.id,
        event_id: timeSlot.event_id,
        slot_name: timeSlot.slot_name,
        day: timeSlot.weekdays.join(", "),
        start_time: moment(timeSlot.startTime, "HH:mm:ss").format("HH:mm"),
        end_time: moment(timeSlot.endTime, "HH:mm:ss").format("HH:mm"),
        start_date: moment(timeSlot.startDate).format("YYYY-MM-DD"),
        end_date: moment(timeSlot.endDate).format("YYYY-MM-DD"),
      });
    } else if (timeSlot.weekdays?.length > 0) {
      // Has only a day name
      day_date_time_slots.push({
        id: timeSlot.id,
        event_id: timeSlot.event_id,
        slot_name: timeSlot.slot_name,
        day: timeSlot.weekdays.join(", "),
        start_time: timeSlot.startTime
          ? moment(timeSlot.startTime, "HH:mm:ss").format("HH:mm")
          : null,
        end_time: timeSlot.endTime
          ? moment(timeSlot.endTime, "HH:mm:ss").format("HH:mm")
          : null,
        start_date: timeSlot.startDate
          ? moment(timeSlot.startDate).format("YYYY-MM-DD")
          : null,
        end_date: timeSlot.endDate
          ? moment(timeSlot.endDate).format("YYYY-MM-DD")
          : null,
      });
    } else if (timeSlot.startDate && timeSlot.endDate) {
      // Has only a date
      date_range_time_slots.push({
        id: timeSlot.id,
        event_id: timeSlot.event_id,
        slot_name: timeSlot.slot_name,
        date_range: `${moment(timeSlot.startDate).format(
          "YYYY-MM-DD"
        )} - ${moment(timeSlot.endDate).format("YYYY-MM-DD")}`,
        start_time: timeSlot.startTime
          ? moment(timeSlot.startTime, "HH:mm:ss").format("HH:mm")
          : null,
        end_time: timeSlot.endTime
          ? moment(timeSlot.endTime, "HH:mm:ss").format("HH:mm")
          : null,
      });
    } else if (timeSlot.startDate && !timeSlot.endDate) {
      // Has only a date
      date_time_slots.push({
        id: timeSlot.id,
        event_id: timeSlot.event_id,
        slot_name: timeSlot.slot_name,
        date: moment(timeSlot.startDate).format("YYYY-MM-DD"),
        start_time: timeSlot.startTime
          ? moment(timeSlot.startTime, "HH:mm:ss").format("HH:mm")
          : null,
        end_time: timeSlot.endTime
          ? moment(timeSlot.endTime, "HH:mm:ss").format("HH:mm")
          : null,
      });
    }
  });

  return { day_date_time_slots, date_range_time_slots, date_time_slots };
}

// Cost Calculation for Single Date TimeSlot
export function calculateSingleDateCost(timeslot, unitCost) {
  // Unit cost for one occurrence (single class or event)
  return unitCost;
}

// Cost Calculation for Multiple Dates Across Multiple Months
export function calculateMultipleDatesCost(timeslot, unitCost) {
  const occurrences = timeslot.length; // Each date is a separate occurrence
  return occurrences * unitCost;
}

// Cost Calculation for Recurring Date Range TimeSlot
export function calculateTotalDays(startDate, endDate) {
  const start = new Date(startDate);
  let end = new Date(endDate);
  if (!endDate) {
    end = new Date(startDate);
  }
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateRecurringDateRangeCost(
  timeslot,
  unitCost,
  billingCadence
) {
  let [start_date, end_date] = timeslot.date_range.split(" - ");
  const totalDays = calculateTotalDays(start_date, end_date);
  const occurrences = Math.ceil(totalDays);

  return occurrences * unitCost;
}

function getTimeDifference(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const start = new Date(0, 0, 0, startHours, startMinutes);
  const end = new Date(0, 0, 0, endHours, endMinutes);

  const diffMs = end - start; // Difference in milliseconds
  const hours = diffMs / (1000 * 60 * 60);
  return hours; // Convert ms to hours
}

// Cost Calculation for Recurring Weekday TimeSlot
export function countWeekdayOccurrences(startDate, endDate, weekdays, getHoursAndClassesBoth = false, startTime, endTime) {
  const weekdaysArray = weekdays.split(",").map((day) => day.trim());
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hoursDiff = getTimeDifference(startTime, endTime);

  // Map weekday names to numeric values for Date object
  const weekdayMap = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  };

  let count = 0;
  let hours = 0;
  for (const weekday of weekdaysArray) {
    const targetDay = weekdayMap[weekday];
    let current = new Date(start);

    // Iterate through the date range
    while (current <= end) {
      if (current.getDay() === targetDay) {
        count++;
        hours += hoursDiff;
      }
      // Move to the next day
      current.setDate(current.getDate() + 1);
    }
  }

  if(getHoursAndClassesBoth) {
    return [count, hours];
  }
  return count;
}

export function calculateRecurringWeekdayCost(timeslot, unitCost) {
  const occurrences = countWeekdayOccurrences(
    timeslot.start_date,
    timeslot.end_date,
    timeslot.day
  );
  return occurrences * unitCost;
}

export function findStartDateAndEndDateOfMonthForSingleDate(date) {
  const dateObj = new Date(date);

  const year = dateObj.getUTCFullYear(); // Get the year in UTC
  const month = dateObj.getUTCMonth(); // Get the month in UTC (0-indexed)

  // Get the first day of the month in UTC
  const firstDayOfMonth = new Date(Date.UTC(year, month, 1));

  // Get the last day of the month by setting the day to 0 for the next month in UTC
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));

  return [firstDayOfMonth, lastDayOfMonth];
}

// Cost Calculation for Combination of Single Date and Weekday
export function calculateCombinationCost(timeslot, unitCost) {
  // Calculate the single date cost
  const singleDateCost = calculateSingleDateCost(
    {
      date: timeslot.start_date,
    },
    unitCost
  );

  let [start_date, end_date] = findStartDateAndEndDateOfMonthForSingleDate(
    timeslot.start_date
  );

  // Calculate recurring weekday cost
  let slot = {
    ...timeslot,
    start_date: start_date.toISOString().split("T")[0],
    end_date: end_date.toISOString().split("T")[0],
  };

  const recurringCost = calculateRecurringWeekdayCost(slot, unitCost);
  // Total cost is the combination of both
  return singleDateCost + recurringCost;
}

// Cost Calculation for Recurring Weekdays Across Multiple Months
export function calculateRecurringWeekdaysAcrossMonthsCost(timeslot, unitCost) {
  const occurrences = countWeekdayOccurrences(
    timeslot.start_date,
    timeslot.end_date,
    timeslot.day
  );
  return occurrences * unitCost;
}

export function calculateTotalMonths(startDate, endDate) {
  // Create Date objects from the input strings
  const start = new Date(startDate);
  let end = new Date(endDate);

  if (!endDate) {
    end = new Date(startDate);
  }

  // Calculate total months
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;

  return totalMonths;
}

export function calculateMonthlyCost(timeslot, unitCost, type) {
  let startDate = timeslot.start_date;
  let endDate = timeslot.end_date;
  if (type === "date_range") {
    [startDate, endDate] = timeslot.date_range.split(" - ");
  }
  const months = calculateTotalMonths(startDate, endDate);
  return months * unitCost;
}

// Specific Day Cost: Calculates the cost for events occurring on specific days of the month (e.g., 15th, last day, or a custom day).
export function calculateSpecificDayCost(
  timeslot,
  unitCost,
  dayOfMonth,
  value
) {
  const { start_date, end_date } = timeslot; // Assuming timeslot contains a date range with startDate and endDate
  let totalOccurrences = 0;

  // Convert startDate and endDate to Date objects
  let currentDate = new Date(start_date);
  const lastDate = new Date(end_date);

  while (currentDate <= lastDate) {
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    // Get the specific day of the current month
    let specificDay;
    if (dayOfMonth === "15th") {
      specificDay = new Date(year, month, 15);
    } else if (dayOfMonth === "last-day") {
      specificDay = new Date(year, month + 1, 0); // Last day of the month
    } else if (dayOfMonth === "day-of-the-month") {
      // specific day can be 1-30
      specificDay = new Date(year, month, value);
    }
    // Check if the specific day falls within the date range
    if (specificDay >= new Date(start_date) && specificDay <= lastDate) {
      totalOccurrences++;
    }

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Calculate total cost
  const totalCost = totalOccurrences * unitCost;
  return totalCost;
}

// billing cadence and calculate the corresponding cost
// Billing Cadence Calculation: Determines the cost based on various billing cadences such as “today”, “tomorrow”, “before class start”, “after class end”, etc.
export function calculateBillingByCadence(
  timeSlot,
  unitCost,
  billingCadence,
  slotTheme
) {
  let identifier = billingCadence.group.identifier;
  switch (identifier) {
    case "today":
    // Handle 'Today' option
    case "tomorrow":
    // Handle 'Tomorrow' option
    case "before-class-start":
    // Handle 'Before Class Starts' option
    case "after-class-end":
    // Handle 'After Class Ends' option
    case "day-class-starts":
    // Handle 'Day Class Starts' option (Single date)
    case "specific-date":
    // Handle 'Specific Date' option (Custom date for single or multiple occurrences)
    case "each-start-date":
    // Handle 'Each Start Date' option (Recurring weekday, date range)
    case "each-end-date":
    // Handle 'Each End Date' option (Recurring weekday, date range)
    case "each-occurrence":
      // Handle 'Each Occurrence' option (Multiple date, recurring weekday)
      // Billing Cadence Calculation: Determines the cost based on various billing cadences such as “today”, “tomorrow”, “before class start”, “after class end”, etc.
      switch (slotTheme) {
        case "recurring_weekdays_across_months":
          return calculateRecurringWeekdaysAcrossMonthsCost(timeSlot, unitCost);
        case "recurring_weekday":
          return calculateRecurringWeekdayCost(timeSlot, unitCost);
        case "date_range":
          return calculateRecurringDateRangeCost(
            timeSlot,
            unitCost,
            billingCadence
          );
      }
      return 0;
    case "day-of-the-month":
      // Handle 'Day Of the Month' option
      // Specific Day Cost: Calculates the cost for events occurring on specific days of the month (e.g., 15th, last day, or a custom day).
      return calculateSpecificDayCost(
        timeSlot,
        unitCost,
        "day-of-the-month",
        parseInt(billingCadence.selectedValue)
      );
    case "once-per-month":
      // Handle 'Once Per Month' option (Recurring weekday, date range)
      // Monthly Cost: Calculates the cost on a monthly basis for different types of events.
      return calculateMonthlyCost(timeSlot, unitCost, slotTheme);
    case "15th-of-the-month":
      // Handle '15th of the Month' option
      // Specific Day Cost: Calculates the cost for events occurring on specific days of the month (e.g., 15th, last day, or a custom day).
      return calculateSpecificDayCost(timeSlot, unitCost, "15th");
    case "last-day-of-the-month":
      // Handle 'Last Day of the Month' option
      // Specific Day Cost: Calculates the cost for events occurring on specific days of the month (e.g., 15th, last day, or a custom day).
      return calculateSpecificDayCost(timeSlot, unitCost, "last-day");
    default:
      console.log(`Unknown identifier: ${identifier}`);
      break;
  }
}

export function totalUnitCost(
  unitCost,
  billingCadence,
  date_time_slots,
  day_date_time_slots,
  date_range_time_slots
) {
  // Total Unit Cost: Aggregates costs across different types of time slots (date, day-date, date-range).
  let cost = 0;
  // date
  if (date_time_slots.length > 0) {
    if (date_time_slots.length === 1) {
      // Single Date Cost: Calculates the cost for a single occurrence of an event.
      cost += calculateSingleDateCost(date_time_slots[0], unitCost);
    } else {
      // Multiple Dates Cost: Calculates the cost for multiple occurrences across different dates.
      cost += calculateMultipleDatesCost(date_time_slots, unitCost);
    }
  }
  // recurring weekdays
  if (day_date_time_slots.length > 0) {
    day_date_time_slots.forEach((slot) => {
      const { start_date, end_date } = slot;
      if (start_date && end_date) {
        // Check Across MultipleMonths or Not
        if (new Date(start_date).getMonth() !== new Date(end_date).getMonth()) {
          // Recurring Weekdays Across Months Cost: Calculates the cost for events recurring on weekdays across multiple months.
          cost += calculateBillingByCadence(
            slot,
            unitCost,
            billingCadence,
            "recurring_weekdays_across_months"
          );
        } else {
          // Recurring Weekday Cost: Calculates the cost for events recurring on specific weekdays.
          cost += calculateBillingByCadence(
            slot,
            unitCost,
            billingCadence,
            "recurring_weekday"
          );
        }
      }
    });
  }
  // date range
  if (date_range_time_slots.length > 0) {
    date_range_time_slots.forEach((slot) => {
      // Recurring Date Range Cost: Calculates the cost for events recurring over a date range.
      cost += calculateBillingByCadence(
        slot,
        unitCost,
        billingCadence,
        "date_range"
      );
    });
  }

  return cost;
}

export function findingStartDateAndEndDateFromAcrossTimeSlots(timeSlots) {
  const { date_time_slots, day_date_time_slots, date_range_time_slots } =
    timeSlots;

  let startDate = null;
  let endDate = null;
  let startDay = "";
  let endDay = "";

  if (date_time_slots.length > 0) {
    date_time_slots.forEach((slot) => {
      const { date } = slot;
      if (date) {
        if (!startDate) startDate = date;
        else {
          if (new Date(startDate) > new Date(date)) {
            startDate = date;
          }
        }
      }
      if (date) {
        if (!endDate) endDate = date;
        else {
          if (new Date(endDate) < new Date(date)) {
            endDate = date;
          }
        }
      }
    });
  }

  if (day_date_time_slots.length > 0) {
    day_date_time_slots.forEach((slot) => {
      const { start_date, end_date, day } = slot;
      if (start_date) {
        if (!startDate) {
          startDate = start_date;
          startDay = day.split(",")[0];
        } else {
          if (new Date(startDate) > new Date(start_date)) {
            startDate = start_date;
            startDay = day.split(",")[0];
          }
        }
      }
      if (end_date) {
        if (!endDate) {
          endDate = end_date;
          endDay = day.split(" ")[day.split(",").length - 1];
        } else {
          if (new Date(endDate) < new Date(end_date)) {
            endDate = end_date;
            endDay = day.split(",")[day.split(",").length - 1];
          }
        }
      }
    });
  }

  if (date_range_time_slots.length > 0) {
    date_range_time_slots.forEach((slot) => {
      const [start_date, end_date] = slot.date_range.split(" - ");
      if (start_date) {
        if (!startDate) startDate = start_date;
        else {
          if (new Date(startDate) > new Date(start_date)) {
            startDate = start_date;
          }
        }
      }
      if (end_date) {
        if (!endDate) endDate = end_date;
        else {
          if (new Date(endDate) < new Date(end_date)) {
            endDate = end_date;
          }
        }
      }
    });
  }

  return { startDate, endDate, startDay, endDay };
}

// Date Adjustments: Calculates dates before or after a given date by a specified number of days.
export function adjustDate(date, value, indication) {
  // Create a Date object from the input date
  const originalDate = new Date(date);

  // Check for valid date
  if (isNaN(originalDate.getTime())) {
    throw new Error("Invalid date format. Please use a valid date string.");
  }

  // Check if the indication is 'after' or 'before'
  if (indication === "after") {
    // Add the value (in days) to the date
    originalDate.setDate(originalDate.getDate() + value);
  } else if (indication === "before") {
    // Subtract the value (in days) from the date
    originalDate.setDate(originalDate.getDate() - value);
  } else {
    throw new Error("Invalid indication. Use 'after' or 'before'.");
  }

  // Return the new adjusted date
  return originalDate.toISOString().split("T")[0]; // Returns a Date object
}

// Occurrence Calculations: Finds occurrences of events based on various criteria like each start date, each end date, specific dates of the month, etc.
export function fetchEachOccurrence(startDate, endDate, weekdays) {
  const weekdaysArray = weekdays.split(",").map((day) => day.trim());
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Map weekday names to numeric values for Date object
  const weekdayMap = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  };

  let occurrence = [];
  for (const weekday of weekdaysArray) {
    const targetDay = weekdayMap[weekday];
    let current = new Date(start);

    // Iterate through the date range
    while (current <= end) {
      if (current.getDay() === targetDay) {
        occurrence.push(new Date(current).toISOString().split("T")[0]);
      }
      // Move to the next day
      current.setDate(current.getDate() + 1);
    }
  }
  return occurrence;
}

// Occurrence Calculations: Finds occurrences of events based on various criteria like each start date, each end date, specific dates of the month, etc.
export function findEachOccurrenceOfClass(timeSlots) {
  const { date_time_slots, day_date_time_slots, date_range_time_slots } =
    timeSlots;
  let eachOccurrence = [];

  if (date_time_slots.length > 0) {
    date_time_slots.forEach((slot) => {
      const { date } = slot;
      if (date) {
        eachOccurrence.push(date);
      }
    });
  }

  if (day_date_time_slots.length > 0) {
    day_date_time_slots.forEach((slot) => {
      const { start_date, end_date, day } = slot;
      let occurrence = fetchEachOccurrence(start_date, end_date, day);

      if (occurrence.length > 0) {
        eachOccurrence = [...eachOccurrence, ...occurrence];
      }
    });
  }

  if (date_range_time_slots.length > 0) {
    date_range_time_slots.forEach((slot) => {
      const [start_date, end_date] = slot.date_range.split(" - ");
      let start = new Date(start_date);
      let end = new Date(end_date);

      while (start <= end) {
        eachOccurrence.push(start);
        start.setDate(start.getDate() + 1);
      }
    });
  }

  return eachOccurrence;
}

// Occurrence Calculations: Finds occurrences of events based on various criteria like each start date, each end date, specific dates of the month, etc.
export function findDayOfTheMonthOccurrenceForClass(start_date, end_date, day) {
  // Convert start_date and end_date to Date objects
  const startDate = new Date(start_date);
  let endDate = end_date ? new Date(end_date) : null;
  const occurrences = [];

  // Helper function to get the last day of a month
  function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Helper function to create a date object for a specific day, ensuring correct timezone
  function createDate(year, month, day) {
    return new Date(Date.UTC(year, month, day));
  }

  // If endDate is null, we only check the startDate
  if (!endDate) {
    if (day === "last") {
      const lastDay = createDate(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        getLastDayOfMonth(startDate.getUTCFullYear(), startDate.getUTCMonth())
      );
      occurrences.push(lastDay.toISOString().split("T")[0]);
    } else {
      const dayNum = parseInt(day, 10);
      if (
        dayNum <=
        getLastDayOfMonth(startDate.getUTCFullYear(), startDate.getUTCMonth())
      ) {
        const specificDay = createDate(
          startDate.getUTCFullYear(),
          startDate.getUTCMonth(),
          dayNum
        );
        if (specificDay >= startDate) {
          occurrences.push(specificDay.toISOString().split("T")[0]);
        }
      }
    }
  } else {
    // Iterate from start_date to end_date month by month
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (day === "last") {
        const lastDayOfCurrentMonth = createDate(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          getLastDayOfMonth(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth()
          )
        );
        if (lastDayOfCurrentMonth <= endDate) {
          occurrences.push(lastDayOfCurrentMonth.toISOString().split("T")[0]);
        }
      } else {
        const dayNum = parseInt(day, 10);
        if (
          dayNum <=
          getLastDayOfMonth(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth()
          )
        ) {
          const specificDay = createDate(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            dayNum
          );
          if (specificDay >= startDate && specificDay <= endDate) {
            occurrences.push(specificDay.toISOString().split("T")[0]);
          }
        }
      }

      // Move to the next month
      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
      currentDate.setUTCDate(1); // Reset to the 1st of the month to prevent overflow
    }
  }

  return occurrences;
}

// Occurrence Calculations: Finds occurrences of events based on various criteria like each start date, each end date, specific dates of the month, etc.
export function getEachMonthFirstDateBetweenDates(startDate, endDate) {
  // Convert start_date and end_date to Date objects
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // Set startDateObj to the first day of its month
  startDateObj.setDate(1);

  let currentDate = new Date(startDateObj);
  let dates = [];

  // Iterate from start_date to end_date
  while (currentDate <= endDateObj) {
    // Only add the date if it's within the range
    if (currentDate >= startDateObj) {
      dates.push(currentDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return dates;
}

// Occurrence Calculations: Finds occurrences of events based on various criteria like each start date, each end date, specific dates of the month, etc.
export function findRecurringWeekdayOccurrences(
  start_date,
  end_date,
  recurringDays,
  indication
) {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Mapping for weekdays to their index in JavaScript Date (0 = Sunday, 6 = Saturday)
  const dayMapping = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  };

  const occurrences = [];

  // Find all occurrences of the recurring days between start and end date
  let currentDate = new Date(startDate);

  // Loop through each day from start to end date
  while (currentDate <= endDate) {
    const currentDayOfWeek = currentDate.getDay();

    // Check if the current day is in the list of recurringDays based on the indication (start or end)
    if (
      recurringDays.includes(
        Object.keys(dayMapping).find(
          (key) => dayMapping[key] === currentDayOfWeek
        )
      )
    ) {
      occurrences.push(currentDate.toISOString().split("T")[0]);
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // If the indication is 'start', return occurrences for the first day in recurringDays
  // If the indication is 'end', return occurrences for the last day in recurringDays
  if (indication === "start") {
    // Return all occurrences for the earliest day in the recurringDays list
    return occurrences.filter((date) => {
      const dayOfWeek = new Date(date).getDay();
      return dayOfWeek === dayMapping[recurringDays[0]];
    });
  } else if (indication === "end") {
    // Return all occurrences for the last day in the recurringDays list
    return occurrences.filter((date) => {
      const dayOfWeek = new Date(date).getDay();
      return dayOfWeek === dayMapping[recurringDays[recurringDays.length - 1]];
    });
  }
}

export function findAllDateOccurrencesBetweenDates(startDate, endDate, value) {
  // For billing cadences like "tomorrow", we should return the specified date
  // regardless of whether it falls within the event date range
  
  // If value is a date string (like "2025-05-22" for tomorrow)
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Simply return the specified date as the billing date
    return [value];
  }
  
  // Original implementation for other cases
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  let currentDate = new Date(startDateObj);

  let date = new Date(value);
  let dates = [];
  while (currentDate <= endDateObj) {
    if (currentDate.getDate() === date.getDate()) {
      dates.push(currentDate.toISOString().split("T")[0]);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // If no dates were found, at least return the value date
  if (dates.length === 0 && typeof value === 'string') {
    return [value];
  }
  
  return dates;
}

export function getBillingCadenceDates(billingCadence, timeSlots) {
  let identifier = billingCadence.group.identifier;
  console.log("identifier", identifier);
  console.log("billingCadence.selectedValue", billingCadence.selectedValue);
  let { startDate, endDate, startDay, endDay } =
    findingStartDateAndEndDateFromAcrossTimeSlots(timeSlots);
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log("startDay", startDay);
    console.log("endDay", endDay);
  
  let dates = [];
  
  switch (identifier) {
    case "today":
      // Handle 'Today' option
      dates = findAllDateOccurrencesBetweenDates(
        startDate,
        endDate,
        billingCadence.selectedValue
      );
      break;
    case "tomorrow":
      // Handle 'Tomorrow' option
      dates = findAllDateOccurrencesBetweenDates(
        startDate,
        endDate,
        billingCadence.selectedValue
      );
      break;
    case "before-class-start":
      // Handle 'Before Class Starts' option
      let date = adjustDate(
        startDate,
        parseInt(billingCadence.selectedValue),
        "before"
      );
      dates = findAllDateOccurrencesBetweenDates(startDate, endDate, date);
      break;
    case "after-class-end":
      // Handle 'After Class Ends' option
      date = adjustDate(
        endDate,
        parseInt(billingCadence.selectedValue),
        "after"
      );
      dates = findAllDateOccurrencesBetweenDates(startDate, endDate, date);
      break;
    case "day-class-starts":
      // Handle 'Day Class Starts' option (Single date)
      dates = findAllDateOccurrencesBetweenDates(startDate, endDate, startDate);
      break;
    case "specific-date":
      // Handle 'Specific Date' option (Custom date for single or multiple occurrences)
      dates = findAllDateOccurrencesBetweenDates(
        startDate,
        endDate,
        billingCadence.selectedValue
      );
      break;
    case "each-occurrence":
      // Handle 'Each Occurrence' option (Multiple date, recurring weekday)
      dates = findEachOccurrenceOfClass(timeSlots);
      break;
    case "day-of-the-month":
      // Handle 'Day Of the Month' option
      dates = findDayOfTheMonthOccurrenceForClass(
        startDate,
        endDate,
        parseInt(billingCadence.selectedValue)
      );
      break;
    case "each-start-date":
      // Handle 'Each Start Date' option (Recurring weekday)
      dates = findRecurringWeekdayOccurrences(
        startDate,
        endDate,
        [startDay, endDay],
        "start"
      );
      break;
    case "each-end-date":
      // Handle 'Each End Date' option (Recurring weekday)
      dates = findRecurringWeekdayOccurrences(
        startDate,
        endDate,
        [startDay, endDay],
        "end"
      );
      break;
    case "once-per-month":
      // Handle 'Once Per Month' option (Recurring weekday, date range)
      dates = getEachMonthFirstDateBetweenDates(startDate, endDate);
      break;
    case "15th-of-the-month":
      dates = findDayOfTheMonthOccurrenceForClass(startDate, endDate, 15);
      break;
    case "last-day-of-the-month":
      // Handle 'Last Day of the Month' option
      dates = findDayOfTheMonthOccurrenceForClass(startDate, endDate, "last");
      break;
    default:
      console.log(`Unknown identifier: ${identifier}`);
      break;
  }
  console.log("dates: ", dates)
  // Ensure we always return at least one date
  if (!dates || dates.length === 0) {
    console.log("No dates found, using fallback date");
    // If no dates were found, use the billing cadence selected value if it's a date
    if (billingCadence.selectedValue && typeof billingCadence.selectedValue === 'string' && 
        billingCadence.selectedValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return [billingCadence.selectedValue];
    }
    // Otherwise, use today's date as a fallback
    return [new Date().toISOString().split('T')[0]];
  }
  
  return dates;
}

export function fetchAllWeekDaysAcrossDayDateTimeSlots(day_date_time_slots) {
  let weekDays = new Set();

  if (day_date_time_slots.length > 0) {
    day_date_time_slots.forEach((slot) => {
      const { day } = slot;
      let days = day.split(",").map((day) => day.trim());
      days.forEach((day) => {
        weekDays.add(day);
      });
    });
  }
  return Array.from(weekDays);
}

export function generateInvoiceNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}
