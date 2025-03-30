import express from "express";

// database
import {
  getUserTasks,
  getUserTask,
  deleteTask,
  insertTask,
} from "../controllers/tasks.js";

// creates task router
const router = express.Router();
export default router;

router.route("/").get(getUserTasks).post(insertTask);
router.route("/:id").get(getUserTask).delete(deleteTask);
