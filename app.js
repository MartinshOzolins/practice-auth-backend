import express from "express";

// for middlewares
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

// routers
import authRouter from "./routes/authRouter.js";
import taskRouter from "./routes/taskRouter.js";

// creates instance of app
export const app = express();

// Middlewares
// 1. Middleware function to limit the requests from a single IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP address, please try again later",
});
app.use("/api", limiter);

// 2. For parsing application/json
app.use(express.json());

// 3. Adds cookie-parser middleware
app.use(cookieParser());

// 4. Protection
app.use(helmet());

// 5. Logs HTTP requests
app.use(morgan("tiny"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

// Non-existing routes handler
app.use("*", (req, res) => {
  res.status(400).send(`Such route does not exist.`);
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  // Sends specific error messages related to jwt verify failure
  if (err.name === "JsonWebTokenError") {
    return res.status(401).send("Invalid token. Please log in again.");
  } else if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .send("Your session has expired. Please log in again.");
  }

  // Sends a generic server error response for any unhandled errors
  res.status(500).send("Error Occurred: Try again later!");

  // auth
  console.log(err);
  if (err.dbError) {
    res.status(401).send("Error Occured. Such email already exists.");
  } else {
    res.status(500).send("Error Occurred: Try again later!");
  }

  //login
  console.log(err);
  if (err.dbError) {
    res.status(401).send("Error Occured: Password or email incorrect!");
  } else {
    res.status(500).send("Error Occurred: Try again later!");
  }
});
