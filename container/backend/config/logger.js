// Import the Winston logging library.
// Winston is a more powerful alternative to console.log.
// It lets us control log levels, formatting, and destinations (console, files, etc.).
const winston = require("winston");

// Pull out the formatting tools we want to use from Winston.
// These are small building blocks that will process each log message.
const {
  combine, // Runs multiple formatting steps in sequence
  timestamp, // Adds the current time to every log message
  colorize, // Adds color to log levels in the console (info, error, warn)
  printf, // Lets us define exactly how a log line should look
  errors, // Ensures Error objects include stack traces
} = winston.format;

// Define a custom log format that looks similar to Spring Boot logs.
// This function runs once for every log message.
const springBootFormat = printf((logInfo) => {
  // Destructure the main fields we care about from the log object.
  //
  // This is equivalent to writing:
  //   const timestamp = logInfo.timestamp;
  //   const level = logInfo.level;
  //   const message = logInfo.message;
  //
  // The `...meta` part means:
  // - create a NEW object called `meta`
  // - put all remaining properties of `logInfo` into it
  //   (for example: userId, role, requestId, etc.)
  const { timestamp, level, message, ...meta } = logInfo;

  // If extra data (metadata) exists, convert it to JSON.
  // If there is no extra data, keep the log line clean.
  const extra = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

  // Build the final log line:
  // time → log level → message → optional metadata
  return `${timestamp} ${level}: ${message}${extra}`;
});

// Create one shared logger for the entire application.
// This logger can be imported and reused anywhere.
const logger = winston.createLogger({
  // Set the minimum log level.
  // "info" means: info, warn, and error logs will be shown.
  level: "info",

  // Define where logs should be sent.
  transports: [
    // Send logs to the console (terminal).
    new winston.transports.Console({
      // Define how console logs should be formatted.
      format: combine(
        // If a log contains an Error object,
        // include its stack trace automatically.
        errors({ stack: true }),

        // Add a timestamp in HH:mm:ss format.
        timestamp({ format: "HH:mm:ss" }),

        // Color only the log level text (info, error, warn).
        // This makes logs easier to scan visually.
        colorize({ level: true }),

        // Apply our custom Spring Boot–style formatter last.
        springBootFormat,
      ),
    }),
  ],
});

// Export the logger so it can be used in other files:
// const logger = require("./logger");
module.exports = logger;
