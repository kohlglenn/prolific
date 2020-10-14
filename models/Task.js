const { bucket, progress, priority } = require('./Enum');

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
        type: Schema.Types.ObjectId
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
        type: String,
        enum: Object.values(bucket),
        default: bucket.NONE,
        required: true
    },
    progress: {
        type: String,
        enum: Object.values(progress),
        default: progress.NONE,
        required: true
    },
    priority: {
        type: String,
        enum: Object.values(priority),
        default: priority.MEDIUM,
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