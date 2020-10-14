const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var GroupSchema = new Schema();
GroupSchema.add({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: "users"
    }
});
module.exports = Task = mongoose.model("groups", GroupSchema);