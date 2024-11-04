const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const interviewSchema = mongoose.Schema({
    interviewId : {
        type : String,
    },
    timeOfCreation : {
        type : Date
    }
})

module.exports = mongoose.model("Interview" , interviewSchema);