import express from "express";

import rateLimit from "express-rate-limit";

// functions
import fs from "fs";
import bcrypt from "bcrypt";

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

// Routes
app.post("/api/auth/signup", async (req, res) => {
  // retrieves password and email from req.body
  const { email, password } = req.body;

  // checks if email and passwords exists
  if (!email || !password) {
    res.send("Please provide email and password");
  }

  // bcrypt password
  bcrypt.hash(password, 15, function (err, hash) {
    if (err) {
      return res.status(500).send("Error Occured: Try again later!");
    }
    const newUser = { email: email, password: hash };

    // reads whole users array from db.json
    fs.readFile("db.json", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).send("Error Occured: Try again later!");
      }
      // parses json into js
      const jsonData = JSON.parse(data);
      // pushs new user into users array
      jsonData.users.push(newUser);

      // saves whole json array back into db.json with the new user
      fs.writeFile(
        "db.json",
        JSON.stringify(jsonData, null, 2),
        "utf-8",
        (err) => {
          if (err) {
            return res.status(500).send("Error Occured: Try again later!");
          }
          res.status(200).send("Success");
        }
      );
    });
  });
});
