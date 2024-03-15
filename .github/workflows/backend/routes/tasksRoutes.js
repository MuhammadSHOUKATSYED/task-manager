// taskRoutes.js
const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes for tasks
router.use(authMiddleware);

// Create a task
router.post('/', async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user.userId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = req.body.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Other routes for task categorization, sorting, etc. can be added similarly

module.exports = router;
