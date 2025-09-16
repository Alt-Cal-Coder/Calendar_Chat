export const INVOICE_INSTRUCTION = [
  {
    name: "Batch this Alone",
    id: "batch-this-alone",
    value: "batch-this-alone",
  },
  {
    name: "Batch with another class",
    id: "batch-with-another-class",
    value: "batch-with-another-class",
  },
  {
    name: "Batch by Family",
    id: "batch-by-family",
    value: "batch-by-family",
  },
  {
    name: "Batch by Family with another class",
    id: "batch-by-family-with-another-class",
    value: "batch-by-family-with-another-class",
  },
];

export const FEE_TYPES = [
  {
    name: "One Time Fee",
    id: "one-time-fee",
    value: "one-time-fee",
  },
  {
    name: "All Classes",
    id: "total-class-count",
    value: "total-class-count",
  },
  {
    name: "Bill Per Class",
    id: "bill-per-class",
    value: "bill-per-class",
  },
  {
    name: "Bill Per Month",
    id: "bill-per-month",
    value: "bill-per-month",
  },
  {
    name: "Bill All in Advance",
    id: "bill-all-in-advance",
    value: "bill-all-in-advance",
  },
];

export const FEE_AMOUNT = [
  {
    name: "$30",
    id: "fee-amount-30",
    value: 30,
  },
  {
    name: "$100",
    id: "fee-amount-100",
    value: 100,
  },
  {
    name: "$500",
    id: "fee-amount-500",
    value: 500,
  },
  {
    name: "custom",
    id: "fee-amount-custom",
    value: "",
    isCustom: true,
  },
];

export const BILLING_CADENCE = [
  // Common Options
  {
    id: "common-group-today",
    name: "Today",
    value: "today",
    identifier: "today",
  },
  {
    id: "common-group-tomorrow",
    name: "Tomorrow",
    value: "tomorrow",
    identifier: "tomorrow",
  },
  {
    id: "common-before-class-start",
    name: "Before Class Starts",
    value: "before-class-start",
    identifier: "before-class-start",
    isCustomDropDown: true,
  },
  {
    id: "common-after-class-end",
    name: "After Class Ends",
    value: "after-class-end",
    identifier: "after-class-end",
    isCustomDropDown: true,
  },
  {
    id: "common-group-month",
    name: "Day Of the Month",
    value: "day-of-the-month",
    identifier: "day-of-the-month",
    isCustomDropDown: true,
  },

  // Single Date Options
  {
    id: "single-date-day-class-starts",
    name: "Day Class Starts",
    value: null, // Set dynamically based on date_time_slots[0].date
    identifier: "day-class-starts",
    type: "single-date",
  },
  {
    id: "single-date-specific-date",
    name: "Specific Date",
    value: "specific-date",
    identifier: "specific-date",
    isCustomDate: true,
    type: "single-date",
  },

  // Multiple Date Options
  {
    id: "multiple-date-each-occurrence",
    name: "Each Occurrence",
    value: "each-occurrence",
    identifier: "each-occurrence",
    type: "multiple-date",
  },
  {
    id: "multiple-date-specific-date",
    name: "Specific Date",
    value: "specific-date",
    identifier: "specific-date",
    isCustomDate: true,
    type: "multiple-date",
  },

  // Recurring Weekday Options
  {
    id: "recurring-weekday-each-start-date",
    name: "Each Start Date",
    value: "each-start-date",
    identifier: "each-start-date",
    type: "recurring-weekday",
  },
  {
    id: "recurring-weekday-each-end-date",
    name: "Each End Date",
    value: "each-end-date",
    identifier: "each-end-date",
    type: "recurring-weekday",
  },
  {
    id: "recurring-weekday-each-occurrence",
    name: "Each Occurrence",
    value: "each-occurrence",
    identifier: "each-occurrence",
    type: "recurring-weekday",
  },
  {
    id: "recurring-weekday-once-per-month",
    name: "Once Per Month",
    value: "once-per-month",
    identifier: "once-per-month",
    type: "recurring-weekday",
  },
  {
    id: "recurring-weekday-15th-of-the-month",
    name: "15th of the Month",
    value: "15th-of-the-month",
    identifier: "15th-of-the-month",
    type: "recurring-weekday",
  },
  {
    id: "recurring-weekday-last-day-of-the-month",
    name: "Last Day of the Month",
    value: "last-day-of-the-month",
    identifier: "last-day-of-the-month",
    type: "recurring-weekday",
  },

  // Combination Options
  {
    id: "combination-of-single-date-and-recurring-weekday-each-occurrence",
    name: "Each Occurrence",
    value: "each-occurrence",
    identifier: "each-occurrence",
    type: "combination",
  },
  {
    id: "combination-of-single-date-and-recurring-weekday-once-per-month",
    name: "Once Per Month",
    value: "once-per-month",
    identifier: "once-per-month",
    type: "combination",
  },
  {
    id: "combination-of-single-date-and-recurring-weekday-specific-date",
    name: "Specific Date",
    value: "specific-date",
    identifier: "specific-date",
    isCustomDate: true,
    type: "combination",
  },

  // Date Range Options
  {
    id: "date-range-once-per-month",
    name: "Once Per Month",
    value: 30,
    identifier: "once-per-month",
    type: "date-range",
  },
  {
    id: "date-range-specific-date",
    name: "Specific Date",
    value: "specific-date",
    identifier: "specific-date",
    isCustomDate: true,
    type: "date-range",
  },
];
