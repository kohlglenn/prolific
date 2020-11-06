const express = require("express");
const router = express.Router();
const passport = require('passport');

// Load Task model
const Group = require('../../models/Group');
const createGroup = require('./util');

// @route GET api/groups/:id
// @desc Get a group by id
// @access Private
router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let id = req.params.id;
        Group.findById(id).then(group => { res.json(group) });
    }
);

// @route GET api/groups/users/:id
// @desc Get all groups for a given user id
// @access Private
router.get(
    "/users/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let id = req.params.id;
        Group.find({ users: { $in: [id] } }).then(groups => res.json(groups));
    }
);


// @route POST api/groups/create
// @desc Creates a new group
// @access Private
router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    createGroup
);

// @route DELETE api/groups/delete/:id
// @desc Deletes a group by id
// @access Private
router.delete(
    "/delete/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        Group.findById(req.params.id).then(group => {
            return group.remove();
        }).then(() => res.json({ success: true }))
            .catch(err => res.json({ success: false }));
    }
);

// @route PATCH api/groups/update
// @desc Updates an existing group
// @access Private
router.post(
    "/update",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let groupFields = {
            name: req.body.name,
            users: JSON.parse(req.body.users)
        };

        Group.findOneAndUpdate(
            { _id: req.body.id },
            { $set: groupFields },
            { new: true }
        )
            .then(task => {
                res.json(task);
            })
            .catch(err => console.log(err));
    }
);


module.exports = router;