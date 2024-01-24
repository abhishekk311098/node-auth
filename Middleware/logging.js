const morgan = require("morgan");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, json, colorize } = format;

const logger = createLogger({
  transports: [
    new transports.File({
      format: combine(
        colorize(),
        timestamp(),
        printf((msg) => {
          return `${msg.timestamp} [${msg.level}] ${msg.message}`;
        })
      ),
      level: "http",
      filename: "./Log/http.log",
    }),
    new transports.File({
      format: combine(timestamp(), json()),
      level: "info",
      filename: "./Log/errors.log",
    }),
  ],
});

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

module.exports = { morganMiddleware, logger };
