// functions
import bcrypt from "bcrypt";

// utils
import { signToken } from "../utils/auth.js";
import { fetchUser, insertNewUser } from "../utils/dbUtils.js";

// singup controller
export async function signup(req, res) {
  try {
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
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      //secure: true, // only for production
    });
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    if (err.dbError) {
      res.status(401).send("Error Occured. Such email already exists.");
    } else {
      res.status(500).send("Error Occurred: Try again later!");
    }
  }
}

// login controller
export async function login(req, res) {
  try {
    // retrieves email and password
    const { email, password } = req.body;

    // returns error if invalid detais
    if (!email || !password) {
      return res.status(401).send("Invalid username or password");
    }

    // reads users array from db.json
    const jsonData = await fetchUser();

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

    // creates a new jwt
    const token = signToken(user.id);

    // sets a cookie with a jwt within response header
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      //secure: true, // only for production
    });

    res.status(200).send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Occurred: Try again later!");
  }
}
