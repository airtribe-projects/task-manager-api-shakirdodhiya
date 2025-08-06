const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  validateData
} = require("./controllers/TaskController");

const router = express.Router();

router.get("/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", validateData, createTask);
router.put("/tasks/:id", validateData, updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;