const express = require("express");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { authRouter, userRoute, studentRouter } = require("./Routes");
const { sessionHandler } = require("./Middleware/session");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require("./Controllers/errorController");
const { morganMiddleware } = require("./Middleware/logging");

let app = express();
app.use(helmet());

let limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message:
    "We have recieved too may request from this IP.Please try again later",
});

app.use("/api", limiter);

app.use(sessionHandler);
app.use(express.json({ limit: "20kb" }));

app.use(sanitize());
app.use(xss());

app.use("/", express.static("Public"));

app.use(morganMiddleware);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
