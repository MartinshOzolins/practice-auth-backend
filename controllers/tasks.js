// functions
import jwt from "jsonwebtoken";
import util from "node:util";

// db functions
import {
  fetchUserTasks,
  fetchUserTask,
  deleteUserTask,
  insertNewUserTask,
} from "../utils/dbUtils.js";

export async function getUserTasks(req, res) {
  try {
    // check for jwt
    let token = req.cookies.jwt;

    // unauthorised access denied
    if (!token) {
      return res
        .status(401)
        .send("You are not loged in! Please log in to get access.");
    }
    // verify jwt
    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    ); // { id: 3, iat: 1743358615, exp: 1751134615 }
    console.log(decoded);

    if (!decoded) {
      res
        .status(401)
        .send(
          "You do not have permission to perform this action. Please login again!"
        );
    }

    // Fetch user tasks based on the decoded user ID
    const data = await fetchUserTasks(decoded.id);

    // If no tasks, return explanation
    if (data?.rows?.length === 0) {
      return res.status(200).send("No data available. Please add some tasks!");
    }

    // Return the tasks
    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error Occurred: Try again later!");
  }
}

export async function getUserTask(req, res) {
  try {
    // check for jwt
    let token = req.cookies.jwt;

    // unauthorised access denied
    if (!token) {
      return res
        .status(401)
        .send("You are not loged in! Please log in to get access.");
    }
    // verify jwt
    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    ); // { id: 3, iat: 1743358615, exp: 1751134615 }
    console.log(decoded);

    if (!decoded) {
      res
        .status(401)
        .send(
          "You do not have permission to perform this action. Please login again!"
        );
    }

    // retrieve url params /:id
    const { id } = req.params;

    // fetch task based on task id
    const data = await fetchUserTask(decoded.id, id);

    // If no tasks, return explanation
    if (data?.rows?.length === 0) {
      return res.status(200).send("No data available. Please add some tasks!");
    }

    // Return the tasks
    res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error Occurred: Try again later!");
  }
}

export async function insertTask(req, res) {
  try {
    // check for jwt
    let token = req.cookies.jwt;

    // unauthorised access denied
    if (!token) {
      return res
        .status(401)
        .send("You are not loged in! Please log in to get access.");
    }
    // verify jwt
    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    ); // { id: 3, iat: 1743358615, exp: 1751134615 }
    console.log(decoded);

    if (!decoded) {
      res
        .status(401)
        .send(
          "You do not have permission to perform this action. Please login again!"
        );
    }

    // retrieves title and description
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(200).send("Please provide both title and description!");
    }

    // inserts new task
    const data = await insertNewUserTask(decoded.id, title, description);

    // checks if inserted
    if (data.status === "success") {
      res.status(200).send("Task successfully added!");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error Occurred: Try again later!");
  }
}

export async function deleteTask(req, res) {}
