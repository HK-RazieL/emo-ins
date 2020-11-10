const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trum: true,
    },
    egn: String,
    phone: String,
    address:  String,
    comments: String,
    account_creation_date: String,
    cars: [{
        registration_number: String,
        vin: {
            type: String,
            required: true,
        },
        payments: [{
            paymentId: Number,
            paymentType: String,
            due_dates: {
                dates: [String],
                paid: [Boolean],
            }
        }]
    }]
});

module.exports = mongoose.model("User", userSchema);