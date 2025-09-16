import config from "./config/index.js";
import express from "express";
import path from "path";
import router from "./routers/index.js";
import expressHandlebars from "express-handlebars";
import { engine } from "express-handlebars";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import moment from "moment";
import { logger, stream } from "./helpers/logger.js";
import morgan from "morgan";
import { initSocket } from './socket-server.js';
import cors from "cors";
let app = express();

const hbs = expressHandlebars.create({
  helpers: {
    eq: function(a, b) {
      return a === b;
    },
    formatDate: function(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    formatWeekdays: function(weekdays) {
      if (!weekdays || !weekdays.length) return 'N/A';
      
      const dayMap = {
        'MO': 'Monday',
        'TU': 'Tuesday',
        'WE': 'Wednesday',
        'TH': 'Thursday',
        'FR': 'Friday',
        'SA': 'Saturday',
        'SU': 'Sunday'
      };
      
      return weekdays.map(day => dayMap[day] || day).join(', ');
    },
    truncateText: function(text, length) {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length);
    }
  }
});

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(path.resolve(), "src/views/layout"),
    partialsDir: path.join(path.resolve(), "src/views/partials"),
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
      formatDate: function (date, format, expectedFormat) {
        if (!date) return 'N/A';
        
        try {
          // Check if format is a valid string
          const safeFormat = typeof format === 'string' ? format : 'YYYY-MM-DD';
          const safeExpectedFormat = typeof expectedFormat === 'string' ? expectedFormat : 'YYYY-MM-DD';
          
          if (expectedFormat) {
            return moment(date, safeFormat).format(safeExpectedFormat);
          }
          return moment(date).format(safeFormat);
        } catch (error) {
          console.error('Error formatting date:', error, 'with date:', date, 'format:', format, 'expectedFormat:', expectedFormat);
          return 'Invalid Date';
        }
      },
      formatTime: function (time, format, expectedFormat) {
        if (expectedFormat) {
          return moment(time, format).format(expectedFormat);
        }
        return moment(time).format(format);
      },
      eq: function(a, b) {
        return a === b;
      },
      formatWeekdays: function(weekdays) {
        if (!weekdays || !weekdays.length) return 'N/A';
        
        const dayMap = {
          'MO': 'Monday',
          'TU': 'Tuesday',
          'WE': 'Wednesday',
          'TH': 'Thursday',
          'FR': 'Friday',
          'SA': 'Saturday',
          'SU': 'Sunday'
        };
        
        return weekdays.map(day => dayMap[day] || day).join(', ');
      },
      truncateText: function(text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length);
      }
    },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow all origins
    },
    credentials: true, // Allow cookies, authorization headers
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(path.resolve(), "src/views"));

app.use(express.static(path.join("public")));
app.use("/src-public", express.static(path.join(path.resolve(), "src/public")));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https://cdn.jsdelivr.net"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
        ],
        scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
      },
    },
  })
);
app.use(hpp());
// app.use(morgan(config.logs.format, { stream }));

// app.get("/chat/:eventId/:memberId", (req, res, next) => {
//   if(!req.url?.includes("?render=false")) {
//     return res.sendFile(path.join(path.resolve(), "public/react-app", "index.html"));
//   }
//   next();
// });

app.get("/main", (req, res) => {
  res.render("buttons", {
    title: "Dashboard"
  });
});

router.use((req, res, next) => {
  if (req.path === '/') {
    return res.redirect('/event');
  }
  next();
});

app.use("/", router);

// Improve error handling and logging
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION ERROR:", err);
  logger.error("Promise Rejection Error", { 
    error: err.message, 
    stack: err.stack,
    name: err.name
  });
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION ERROR:", err);
  logger.error("Uncaught Exception Error", { 
    error: err.message, 
    stack: err.stack,
    name: err.name
  });
  
  // Give the logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Add a global error handler middleware at the end of all routes
app.use((err, req, res, next) => {
  console.error("Express error handler caught:", err);
  logger.error("Express Error", { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : err.message || "Something went wrong"
  });
});

let server = createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

server.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});

export { server, io };
