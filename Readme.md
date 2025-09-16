# Calendar Chat System

A real-time chat application integrated with calendar events, built with Node.js, Express, Socket.IO, and MySQL. This system allows users to communicate within the context of specific calendar events through a modern, responsive chat interface.

## 🚀 Features

### Current Chat Features
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Event-based Chat Rooms**: Each calendar event has its own chat room
- **Calendar Integration**: View messages organized by date and event
- **User Management**: Support for multiple users per event
- **Notification System**: Email notifications for new messages
- **Responsive Design**: Modern UI with mobile-friendly interface
- **Message History**: Persistent message storage and retrieval
- **Event Filtering**: Filter messages by specific events and dates

### Planned AI Features (Not Yet Implemented)
- **AI Chat Assistant**: Intelligent responses based on calendar context
- **Event Analysis**: AI-powered insights about calendar events
- **Smart Suggestions**: Automated event recommendations
- **Context-Aware Responses**: AI understanding of event details and user preferences

## 🏗️ Architecture

### Backend Structure
```
src/
├── app.js                 # Main application entry point
├── config/
│   ├── index.js          # Configuration management
│   └── validateEnv.js    # Environment validation
├── controller/
│   └── chat.js           # Chat business logic
├── db/
│   └── index.js          # Database connection
├── helpers/
│   ├── email.js          # Email notification service
│   └── logger.js         # Logging utilities
├── middleware/
│   └── multer.js         # File upload handling
├── routers/
│   └── chat.js           # Chat API routes
├── socket-server.js      # Socket.IO server setup
└── views/
    ├── chat.hbs          # Main chat interface
    ├── chat-calendar.hbs # Calendar view with messages
    └── event-calendar.hbs # Event overview with messages
```

### Database Schema
- **events**: Calendar event information
- **messages**: Chat messages with rich text content
- **member_contacts**: User information and preferences
- **event_member_request**: Event membership and acceptance status

## 🛠️ Technology Stack

### Backend
- **Node.js** (v18+)
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MySQL** - Database
- **Handlebars** - Template engine

### Frontend
- **Vanilla JavaScript** - Client-side logic
- **Socket.IO Client** - Real-time messaging
- **Flatpickr** - Date picker
- **CSS3** - Styling with modern gradients

### Additional Libraries
- **Nodemailer** - Email notifications
- **Twilio** - SMS notifications
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Calendar_Chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3002
   BASE_URL=http://localhost:3002
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=calendar_chat_db

   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_SECURE=false
   MAIL_USER=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   MAIL_SERVICE=gmail
   MAIL_FROM_EMAIL=your_email@gmail.com
   MAIL_FROM_NAME=Calendar Chat System

   # Twilio Configuration (Optional)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_ACCOUNT_AUTH_TOKEN=your_twilio_token
   TWILIO_ACCOUNT_MOBILE_NO=your_twilio_number

   # Logging Configuration
   LOGS_DIR=src/logs
   LOGS_FORMAT=combined

   # File Upload Configuration
   UPLOAD_SIZE_LIMIT=5242880
   MAX_FILE_COUNT=5
   ```

4. **Database Setup**
   ```bash
   # Create the database
   mysql -u root -p
   CREATE DATABASE calendar_chat_db;
   
   # Import the schema (if available)
   mysql -u root -p calendar_chat_db < event_dashboard.sql
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🌐 Server Configuration

### Default Server Settings
- **Port**: 3002
- **Base URL**: http://localhost:3002
- **Environment**: Development

### Production Configuration
For production deployment, update the following:

```env
NODE_ENV=production
BASE_URL=https://your-domain.com
PORT=3002
```

### Domain Configuration
- **Development**: `http://localhost:3002`
- **Production**: `https://your-domain.com` (replace with actual domain)
- **API Base**: `{BASE_URL}/api` (if API routes are added)

### Folder Structure
```
/Users/asadjalil/Documents/Office Work/Clients/Raquel De Lavandeyra/Calendar_Chat/
├── public/                 # Static assets
│   ├── assets/            # Images and icons
│   ├── styles/            # CSS files
│   ├── scripts/           # Client-side JavaScript
│   └── uploads/           # User uploaded files
├── src/                   # Source code
│   ├── views/             # Handlebars templates
│   ├── logs/              # Application logs
│   └── public/            # Additional public assets
└── docs/                  # Documentation and screenshots
```

## 📱 Application Flow

### 1. User Authentication & Event Access
1. User accesses the system via `/main` endpoint
2. System redirects to event management (`/event`)
3. User selects or creates a calendar event
4. System generates unique event ID and user ID

### 2. Chat Interface Access
1. User navigates to chat via `/chat/{eventId}/{userId}`
2. System validates event and user existence
3. Chat interface loads with:
   - Event information display
   - Message history
   - Real-time messaging capability
   - Calendar view option

### 3. Real-time Messaging Flow
1. User joins chat room via Socket.IO
2. System stores user session with event context
3. Messages are sent in real-time to all participants
4. Messages are persisted to database
5. Email notifications sent to offline users

### 4. Calendar Integration
1. Users can switch to calendar view (`/chat/calendar/{eventId}/{userId}`)
2. Messages are organized by date
3. Interactive calendar shows dates with activity
4. Users can filter messages by specific dates

### 5. Event Management
1. Users can view all their events (`/chat/events-calendar/{userId}`)
2. System displays events with message activity
3. Users can navigate between different event chats
4. Event filtering and search capabilities

## 🔧 API Endpoints

### Chat Routes
- `GET /chat/{eventId}/{userId}` - Main chat interface
- `GET /chat/calendar/{eventId}/{userId}` - Calendar view with messages
- `GET /chat/events-calendar/{userId}` - All events calendar view
- `GET /chat/user-events/{userId}` - Get user's events
- `GET /chat/events-by-date/{date}/{userId}` - Get events by specific date

### Socket.IO Events
- `joinGroup` - Join a chat room
- `sendMessage` - Send a message
- `message` - Receive a message
- `userJoined` - User joined notification
- `userLeft` - User left notification

## 🎨 User Interface

### Chat Interface Features
- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Messages appear instantly without page refresh
- **Message History**: Scrollable message history with timestamps
- **User Identification**: Clear sender identification and message ownership
- **Attachment Support**: File attachment capabilities (planned)

### Calendar View Features
- **Interactive Calendar**: Click on dates to view messages
- **Event Filtering**: Filter by specific events
- **Message Grouping**: Messages grouped by sender and date
- **Visual Indicators**: Calendar dates with activity are highlighted
- **Date Navigation**: Easy navigation between different dates

## 🔮 Future AI Integration

### Planned AI Features
1. **Intelligent Chat Assistant**
   - Context-aware responses based on event details
   - Natural language processing for event management
   - Smart suggestions for event scheduling

2. **Event Analysis**
   - AI-powered insights about calendar patterns
   - Automated event recommendations
   - Conflict detection and resolution

3. **Smart Notifications**
   - Intelligent notification timing
   - Personalized message summaries
   - Priority-based message filtering

4. **Calendar Intelligence**
   - Automatic event categorization
   - Time zone optimization
   - Meeting efficiency analysis

### AI Integration Architecture
```
AI Service Layer (Future)
├── OpenAI Integration
├── Event Context Analysis
├── Natural Language Processing
├── Smart Response Generation
└── Calendar Intelligence Engine
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Future)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

### Log Files
- **Debug Logs**: `src/logs/debug/`
- **Error Logs**: `src/logs/error/`
- **Access Logs**: Morgan HTTP request logging

### Health Checks
- Database connection status
- Socket.IO connection monitoring
- Email service availability

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin request handling
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs/`

---

**Note**: This system currently provides a robust chat interface for calendar events. AI integration is planned for future development to enhance the user experience with intelligent features and automated assistance.
