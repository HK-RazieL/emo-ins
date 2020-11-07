const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trum: true
    },
    lname: {
        type: String,
        required: true,
        trum: true
    },
    egn: {
        type: Number,
        unique: true,
        required: true
    },
    phone: Number,
    address: String,
    comments: String,
    account_creation_date: String
});

module.exports = mongoose.model("User", userSchema);