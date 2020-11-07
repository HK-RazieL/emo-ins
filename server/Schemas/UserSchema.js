const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    egn: Number,
    phone: Number,
    address: String,
    comments: String,
    account_creation_date: String
});

module.exports = mongoose.model("User", userSchema);