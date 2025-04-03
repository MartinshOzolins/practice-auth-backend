// functions
import bcrypt from "bcrypt";

// utils
import { attachJWTCookie, signToken } from "../utils/auth.js";
import { fetchUser, insertNewUser } from "../utils/dbUtils.js";

// wrapper function to handle errors
import { catchAsync } from "../utils/error.js";

// singup controller
export const signup = catchAsync(async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please provide email and password");
  }

  // Hashes password
  const hash = await bcrypt.hash(password, 15);
  const newUser = { email, password: hash };

  // inserts new user
  const { userId } = await insertNewUser(newUser);

  // creates a jwt
  const token = signToken(userId);

  //sets a cookie with a jwt within response header
  attachJWTCookie(res, token);

  res.status(201).json({ status: "success" });
});

// login controller
export const login = catchAsync(async function (req, res) {
  // retrieves email and password
  const { email, password } = req.body;

  // returns error if invalid detais
  if (!email || !password) {
    return res.status(401).send("Error: Invalid username or password");
  }

  // reads users array from db.json
  const data = await fetchUser(email);
  // {user: [{id: 2, email: email@example.com, password: ...}]}

  // if no such email, returns { user: [] }
  if (data.user.length === 0) {
    return res.status(401).send("Error: Incorrect email or password");
  }

  // compares user's password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    data.user[0].password
  );

  if (!isPasswordCorrect) {
    return res.status(401).send("Error: Incorrect email or password");
  }

  // creates a new jwt
  const token = signToken(data.user[0].id);

  //sets a cookie with a jwt within response header
  attachJWTCookie(res, token);

  res.status(200).send("Success");
});
