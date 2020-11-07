const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./Schemas/UserSchema");


const app = express();
var jsonParser = bodyParser.json();
mongoose.connect("mongodb://localhost/users", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to DB");
});

app.get("/", (req, res) => {
    res.send("404 Not Found");
});

app.get("/create-new-user", (req, res) => {
    res.send("404 Not Found");
});

app.post("/create-new-user", jsonParser, (req, res) => {
    const user = new User({...req.body})
    user.save((err, user) => {
        if (err) return console.error(err);
        console.log(`--\nA new user was added to the DB!\n${user}\n--`);
    })
});

app.listen(5000, () => {
    return "Server running on port: 5000";
})