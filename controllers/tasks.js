// utils
import { validateNumber } from "../utils/utils.js";
import { verifyJWT } from "../utils/auth.js";

// db functions
import {
  fetchUserTasks,
  fetchUserTask,
  deleteUserTask,
  insertNewUserTask,
} from "../utils/dbUtils.js";
import { catchAsync } from "../utils/error.js";

export const getUserTasks = catchAsync(async function (req, res) {
  // check for jwt
  let token = req.cookies.jwt;
  // { jwt: 'eyJhbGciOiJIUzI1asdR5cCI6IkpXVC.eyJpZdasdaNCwiaWF0IjodasdA1LCJleHAiOjE3NTdasdV9.3BnbZpU4rPn9rBAeT6jdasdLDThvXf3vAp5d2hoA'}

  // unauthorised access denied
  if (!token) {
    return res
      .status(401)
      .send("You are not logged in! Please log in to get access.");
  }
  // verify jwt
  const decoded = await verifyJWT(token); // { id: 3, iat: 174328615, exp: 1341134615 }

  // if verify fails, it will throw an error

  // Fetch user tasks based on the decoded user ID
  const data = await fetchUserTasks(decoded.id);

  // If no tasks, return explanation
  if (data?.rows?.length === 0) {
    return res.status(404).send("No data available. Please add some tasks!");
  }

  // Return the tasks
  res.status(200).json(data);
});

export const getUserTask = catchAsync(async function (req, res) {
  // check for jwt
  let token = req.cookies.jwt;
  // { jwt: 'eyJhbGciOiJIUzI1asdR5cCI6IkpXVC.eyJpZdasdaNCwiaWF0IjodasdA1LCJleHAiOjE3NTdasdV9.3BnbZpU4rPn9rBAeT6jdasdLDThvXf3vAp5d2hoA'}

  // unauthorised access denied
  if (!token) {
    return res
      .status(401)
      .send("You are not logged in! Please log in to get access.");
  }

  // verify jwt
  const decoded = await verifyJWT(token); // { id: 3, iat: 174328615, exp: 1341134615 }

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
    return res.status(404).send("No data available. Please add some tasks!");
  }

  // Return the tasks
  res.status(200).json(data);
});

export const insertTask = catchAsync(async function (req, res) {
  // check for jwt
  let token = req.cookies.jwt;
  // { jwt: 'eyJhbGciOiJIUzI1asdR5cCI6IkpXVC.eyJpZdasdaNCwiaWF0IjodasdA1LCJleHAiOjE3NTdasdV9.3BnbZpU4rPn9rBAeT6jdasdLDThvXf3vAp5d2hoA'}

  // unauthorised access denied
  if (!token) {
    return res
      .status(401)
      .send("You are not logged in! Please log in to get access.");
  }
  // verify jwt
  const decoded = await verifyJWT(token); // { id: 3, iat: 174328615, exp: 1341134615 }

  // retrieves title and description
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).send("Please provide both title and description!");
  }

  // inserts new task
  const data = await insertNewUserTask(decoded.id, title, description);

  // checks if inserted
  if (data.status === "success") {
    res.status(200).send("Task successfully added!");
  }
});

//

export const deleteTask = catchAsync(async function (req, res) {
  // check for jwt
  let token = req.cookies.jwt;
  // { jwt: 'eyJhbGciOiJIUzI1asdR5cCI6IkpXVC.eyJpZdasdaNCwiaWF0IjodasdA1LCJleHAiOjE3NTdasdV9.3BnbZpU4rPn9rBAeT6jdasdLDThvXf3vAp5d2hoA'}

  // unauthorised access denied
  if (!token) {
    return res
      .status(401)
      .send("You are not logged in! Please log in to get access.");
  }

  // verify jwt
  const decoded = await verifyJWT(token); // { id: 3, iat: 174328615, exp: 1341134615 }

  if (decoded.id) {
    // Validates ID number
    const id = validateNumber(req.params.id);
    if (id === null) {
      return res.status(400).send("Invalid number input.");
    }

    // Deletes task
    const response = await deleteUserTask(decoded.id, id);

    if (response?.status === "success") {
      return res.status(204).send("Successfully deleted!");
    } else {
      return res.status(500).send("Error Occurred: Try again later!");
    }
  }
});
