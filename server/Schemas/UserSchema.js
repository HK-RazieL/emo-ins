const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trum: true
    },
    egn: String,
    phone: String,
    address: String,
    comments: String,
    account_creation_date: String
});

module.exports = mongoose.model("User", userSchema);