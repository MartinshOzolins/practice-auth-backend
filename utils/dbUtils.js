import db from "../db/db.js";

// Fetch user by email
export async function fetchUser(email) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) {
        reject({ dbError: "Database query failed", details: err.message });
      } else {
        resolve({ user: rows });
      }
    });
  });
}

// Insert a new user
export async function insertNewUser({ email, password }) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password],
      function (err) {
        if (err) {
          reject({ dbRegError: "Database query failed", details: err.message });
        } else {
          resolve({ userId: this.lastID });
        }
      }
    );
  });
}

// Fetch all user tasks
export async function fetchUserTasks(userId) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
      if (err) {
        reject({ dbError: "Database query failed", details: err.message });
      } else {
        resolve({ rows: rows });
      }
    });
  });
}

// Fetch all user tasks
export async function fetchUserTask(userId, taskId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM tasks WHERE user_id = ? AND id = ?",
      [userId, taskId],
      (err, rows) => {
        if (err) {
          reject({ dbError: "Database query failed", details: err.message });
        } else {
          resolve({ rows: rows });
        }
      }
    );
  });
}

// Insert a new task
export async function insertNewUserTask(userId, title, description) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description],
      (err) => {
        if (err) {
          reject({
            dbError: "Database query failed",
            details: err.message,
          });
        } else {
          resolve({ status: "success" });
        }
      }
    );
  });
}

// Delete a task
export async function deleteUserTask(userId, taskId) {
  return new Promise((resolve, reject) => {
    // First, fetch the task to check if exists
    db.get(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [taskId, userId],
      (err, row) => {
        if (err) {
          return reject({
            dbError: "Database query failed",
            details: err.message,
          });
        }
        if (!row) {
          return reject({ dbDeleteError: "Task not found" });
        }

        // If task exists, delete it
        db.run(
          "DELETE FROM tasks WHERE id = ? AND user_id = ?",
          [taskId, userId],
          function (err) {
            if (err) {
              return reject({
                dbError: "Failed to delete task",
                details: err.message,
              });
            }
            resolve({ status: "success" });
          }
        );
      }
    );
  });
}
