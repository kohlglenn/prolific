const express = require("express");
const router = express.Router();
const passport = require('passport');

// Load Task model
const Task = require('../../models/Task');

// @route GET api/tasks/:id
// @desc Get tasks for specific user
// @access Private
router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      let id = req.params.id;
  
      Task.find({$or: [{ owner: id }, {assigned: id}]}).then(tasks => {
        res.json(tasks)});
    }
  );

// @route POST api/tasks/create
// @desc Create a new task
// @access Private
router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const NEW_TASK = new Task({
        title: req.body.title,
        group: req.body.group ? req.body.group : undefined,
        owner: req.body.owner,
        assigned: req.body.assigned ? req.body.assigned : undefined,
        bucket: req.body.bucket ? req.body.bucket : undefined,
        progress: req.body.progress ? req.body.progress : undefined,
        priority: req.body.priority ? req.body.priority : undefined,
        startDate: req.body.startDate ? req.body.startDate : undefined,
        dueDate: req.body.dueDate ? req.body.dueDate : undefined,
        notes: req.body.notes ? req.body.notes : undefined,
        subtasks: req.body.subtasks ? req.body.subtasks : undefined
      });

      NEW_TASK.save()
        .then(task => res.json(task))
        .catch(err => console.log(err));
    }
  );

// @route POST api/tasks/delete
// @desc Delete an existing task
// @access Private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Task.findById(req.params.id).then(task => {
      task.remove().then(() => res.json({ success: true }));
    });
  }
);

// @route PATCH api/tasks/update
// @desc Update an existing task
// @access Private
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);

    // Task.findOneAndUpdate(
    //   { _id: req.body.id },
    //   { $set: taskFields },
    //   { new: true }
    // )
    //   .then(task => {
    //     res.json(task);
    //   })
    //   .catch(err => console.log(err));
  }
);

module.exports = router;