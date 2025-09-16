# Application Routes & Form Fields Documentation

## Create Event Form (`/event` - POST)
View: `create-event.hbs`
Form Fields:
- Event Details:
  - `title` (text) - Event name
  - `org_name` (text) - Organizer name
  - `org_mail` (email) - Organizer email

- Recipients:
  - `user_type` (select) - Options: main, parent, child
  - `name` (text) - Recipient name
  - `email` (text) - Recipient email
  - `email_check` (checkbox) - Email notification preference
  - `mobile` (text) - Mobile number with country code
  - `mobile_check` (checkbox) - Mobile notification preference

- Time Slots:
  - `startDate` (date)
  - `endDate` (date)
  - `startTime` (time)
  - `endTime` (time)
  - `slot_name` (text)
  - `weekdays` (checkbox group) - For weekly slots

- Location:
  - `eventLocation` (text)
  - `website` (text)
  - `eventEmail` (email)

- Additional:
  - `files` (file upload, multiple)
  - `groupImage` (file upload)
  - `contact_group_id` (hidden)
  - `isPaid` (boolean)

## Edit Event Form (`/event/edit/:eventId` - POST)
View: `edit-event.hbs`
Form Fields:
- `title` (text) - Event name
- Time Slots:
  - `startDate` (date)
  - `endDate` (date)
  - `startTime` (time)
  - `endTime` (time)
  - `slot_name` (text)
  - `weekdays` (checkbox group) - For weekly slots
- Location fields (same as create event)

## Add Message Form (`/event/add-message/:id` - POST)
View: `add-message.hbs`
Form Fields:
- Group Selection:
  - `groupSelect` (select)
  - `newGroupInput` (text) - For new group creation

- Recipients (same structure as create event)

- Event Selection:
  - `eventSelect` (select) - List of events
  - Selected time slot data:
    - `timeslot_id` (hidden)
    - `recurring_id` (hidden)

- Message:
  - `message` (textarea)
  - `files` (file upload, multiple)

- Location (same as create event)

## Invoice Generation Form (`/invoice/generate/:eventId` - POST)
View: `invoice.hbs`
Form Fields:
- Creator Information:
  - `creatorName` (text)

- Payor Information:
  - `name` (text)

- Payment Options:
  - `card_on_file` (boolean)
  - `cash` (boolean)
  - `e_check` (boolean)
  - `credit_card` (boolean)
  - `qr_code` (text)

- Batch Preferences:
  - `batch_method` (select)
  - `payment_due_date` (date)

- Additional:
  - `upload_image` (file) - Logo upload
  - `invoice_instruction` (text)
  - `fee_type` (select)
  - `fee_amount` (number)
  - `billing_cadence` (select)
  - `members` (array)

## User Notification Preferences (`/user/:id/notification-preference` - PUT)
Form Fields:
- Notification preferences (specific fields not visible in provided code)

## Notes:
- All forms include CSRF protection tokens (not listed)
- File uploads are handled through `multer` middleware
- Some forms may include additional hidden fields for tracking and processing
- Form validation is handled both client-side and server-side
- Many forms support dynamic addition/removal of fields (especially recipients)