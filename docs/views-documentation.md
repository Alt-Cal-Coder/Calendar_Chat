# Views Documentation

## 1. Create Event View (`create-event.hbs`)
### Form Structure
- Main form with enctype="multipart/form-data"
- Uses multiple partial templates:
  - `{{> eventDetails}}`
  - `{{> dateSlots}}`
  - `{{> weeklySlots}}`
  - `{{> messageInput}}`
  - `{{> locationInput}}`

### JavaScript Components
- Initializes on DOMContentLoaded
- Key Components:
  - File Management (`selectedFiles` array)
  - Payment Flag (`isPaid` boolean)
  - Recipients List Management
  - Dynamic Form Components

### Key Functions
```javascript
initializeComponents():
- setupDropdownMenus()
- setupRecipientManagement()
- setupFileManagement()
- setupFormSubmission()
- setupGroupSelection()
- setupUserModal()
- initializeTimeSlotContainers()
- checkForCreator()
- initializeReviewScreenAction()
```

### Related Components
- Uses `userModal` partial
- Uses `loader` partial
- Integrates with location services

## 2. Edit Event View (`edit-event.hbs`)
### Form Structure
- Event editing form with file upload support
- Partials Used:
  - `{{> eventTitleInput}}`
  - `{{> dateSlots}}`
  - `{{> weeklySlots}}`
  - `{{> locationInput}}`

### Key Features
- Fetches existing event data
- Supports time slot management
- Location editing capabilities
- File attachment handling

### Data Flow
1. Fetches event by uniqueEventId
2. Populates form fields
3. Handles form submission with updated data
4. Manages time slots and weekly slots separately

## 3. Invoice View (`invoice.hbs`)
### Form Components
- Logo upload
- Invoice instructions
- Fee configuration
- Billing settings
- Member management

### Data Processing
```javascript
let data = {
    invoice_instruction: selectedInvoiceInstruction,
    fee_type: selectedFeeType,
    fee_amount: selectedFeeAmount,
    billing_cadence: selectedBillingCadence,
    themeSlots: JSON.parse(displayClassifiedTimeSlots),
    members: members_ids
}
```

### Integration Points
- Connects with Python backend (`pythonBaseUrl`)
- Handles PDF generation
- Manages file uploads

## 4. Add Message View (`add-message.hbs`)
### Form Structure
- Group selection
- Recipient management
- Event selection
- Message composition
- File attachments

### JavaScript Logic
- File management system
- Time slot selection
- Review screen functionality
- Dynamic recipient management

### Helper Functions
```javascript
formatDateToLocalDateString()
formatTime()
getDayOfWeek()
collectTimeSlots()
collectWeeklySlots()
```

## 5. List View (`list.hbs`)
### Table Structure
- Event listing
- Download capabilities
- Attendee tracking
- Event sharing

### Data Display
- Event ID
- Title
- Start/End dates
- Attendee count
- ICS file download

## 6. Single Event View (`single-event.hbs`)
### Display Components
- Event details
- Unique identifiers
- Calendar integration
- Location information
- ICS download option

## 7. All Events View (`all-events.hbs`)
### Table Structure
- Event listing
- Creation timestamp
- Action buttons:
  - Message
  - Edit

### Integration
- Links to chat system
- Edit functionality
- Message system integration

## Common Components Across Views

### 1. Form Validation
- Client-side validation
- File type checking
- Required field validation
- Date/Time validation

### 2. File Handling
- Multiple file upload support
- File type restrictions
- File size limitations
- Upload progress indicators

### 3. Date/Time Management
- Flatpickr integration
- Time slot management
- Weekly recurring slots
- Date formatting utilities

### 4. Location Services
- Address autocomplete
- Place details fetching
- Location validation
- Address formatting

### 5. User Interface Components
- Loading indicators
- Modal dialogs
- Dynamic form fields
- Error messaging

## Data Flow Architecture

### 1. Form Submission Flow
1. Client-side validation
2. File processing
3. Data formatting
4. API submission
5. Response handling

### 2. Data Relationships
- Events → Time Slots
- Events → Messages
- Events → Invoices
- Events → Recipients

### 3. State Management
- Form state tracking
- Selected files
- Time slot collections
- Recipient lists

## Security Considerations
- CSRF protection
- File upload restrictions
- Input sanitization
- Authentication requirements

## Notes
- All forms implement responsive design
- Multiple file upload capability
- Dynamic form field generation
- Real-time validation
- Integration with external services