import express from "express";

// functions
import fs, { readFile } from "node:fs/promises";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

// creates auth router
const router = express.Router();
export default router;

// utils
async function getAllUsers() {
  const data = await fs.readFile("db.json", "utf-8");
  const jsonData = JSON.parse(data);
  return jsonData;
}

// Routes
// 1. Sign up
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    // Creates random user id
    const userId = uuidv4();

    // Hashes password
    const hash = await bcrypt.hash(password, 15);
    const newUser = { email, password: hash, id: userId };

    // reads users array from db.json
    const jsonData = await getAllUsers();

    // checks if email already exist
    const user = jsonData.users.find((user) => user.email === email);

    if (user) {
      res.status(400).send("Such email already exists!. Try loggin in.");
    }

    // inserts new user
    jsonData.users.push(newUser);

    // writes updated users array back to db.json
    await fs.writeFile("db.json", JSON.stringify(jsonData, null, 2), "utf-8");

    // creates a jwt
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // sets a cookie with a jwt within response header
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      //secure: true, // only for production
    });

    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Occurred: Try again later!");
  }
});

// 2. Login
router.post("/login", async (req, res) => {
  try {
    // retrieves email and password
    const { email, password } = req.body;

    // returns error if invalid detais
    if (!email || !password) {
      return res.status(401).send("Invalid username or password");
    }

    // reads users array from db.json
    const jsonData = await getAllUsers();

    // retrieves user based on email
    const user = jsonData.users.find((user) => user.email === email);

    // returns error if invalid detais
    if (!user) {
      return res.status(404).send("Email not found");
    }

    // compares user's password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).send("Incorrect email or password");
    }

    res.status(200).send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Occurred: Try again later!");
  }
});
