import sqlite3 from "sqlite3";

// Creates database
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.log("Error creating database:", err.message);
  } else {
    console.log("Connected to database.");
  }
});

// Creates users table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

// Creates tasks table
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`);

export default db;
