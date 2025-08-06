const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  validateData,
  getTasksByPriority,
  validateTaskExists
} = require("./controllers/TaskController");

const router = express.Router();

router.get("/tasks", getTasks);
router.get("/tasks/:id", validateTaskExists, getTaskById);
router.post("/tasks", validateData, createTask);
router.put("/tasks/:id", validateTaskExists, validateData, updateTask);
router.delete("/tasks/:id", validateTaskExists, deleteTask);
router.get("/tasks/priority/:level", getTasksByPriority)

module.exports = router;