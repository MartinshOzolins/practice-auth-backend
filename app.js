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
