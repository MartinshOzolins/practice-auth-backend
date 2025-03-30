import express from "express";

// for middlewares
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

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

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
