const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema. 
// How to design recursive schema from https://stackoverflow.com/questions/33825773/recursive-elements-in-schema-mongoose-modelling
var TaskSchema = new Schema();
TaskSchema.add({
    title: {
        type: String,
        required: true
    },
    group: {
        type: String
        },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    assigned: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    bucket: {
        // TODO: Refactor out enum
        type: String,
        enum: ['None','Todo', 'Recurring', 'In Progress', 'Blocked', 'Done'],
        default: 'None',
        required: true
    },
    progress: {
        // TODO: Refactor out enum
        type: String,
        enum: ['None', 'In Progress', 'Done'],
        default: 'None',
        required: true
    },
    priority: {
        // TODO: Refactor out enum
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    },
    notes: {
        type: String
    },
    subtasks: {
        type: [TaskSchema]
    }
});
module.exports = Task = mongoose.model("tasks", TaskSchema);