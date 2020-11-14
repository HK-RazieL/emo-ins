const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to DB");
});


const User = require("./Schemas/UserSchema");

var jsonParser = bodyParser.json();
var router = express.Router();

router.get("/", (req, res) => {
    res.send("test")
});

router.get("/notifications", (req, res) => {
    User.find({}, (err, result) => {
        if (err) console.error(err);

        var dueDates = [];

        for (var user of result) {
            if (!user.cars) return;
            var notification = {
                name: "",
                car: "",
                date: "",
            };
            for (var cars of user.cars) {
                if (!cars.payments) return;
                for (var payments of cars.payments) {
                    var today = new Date();
                }
            }

        }

        res.send(result)
    })
});

router.get("/create-new-user", (req, res) => {
    res.send("404 Not Found");
});

router.post("/create-new-user", jsonParser, (req, res) => {
    const user = new User(_.cloneDeep(req.body));
    user.save((err, user) => {
        if (err) return console.error(err);
        console.log(`-----\nA new user was added to the DB!\n${user}\n-----`);
        res.send(req.status);
    });
});

router.post("/search-user", jsonParser, (req, res) => {
    User.find({
        name: req.body.name,
    }, (err, users) => {
        if (err) return console.error(err);
        res.send(users);
    });
});

router.get("/users/:id", jsonParser, (req, res) => {
    User.find({
        _id: req.params.id
    }, (err, user) => {
        if (err) return console.error(err);
        console.log(user)
        res.send(user);
    });
})

router.patch("/users/:id", jsonParser, (req, res) => {
    User.findByIdAndUpdate({
        _id: req.body._id
    }, {
        $set:_.cloneDeep(req.body)
    }, {useFindAndModify:false}, (err, user) => {
        if (err) return console.error(err);
        res.send(user);
    });
})

module.exports = router;