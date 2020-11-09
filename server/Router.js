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
    res.send("404 Not Found");
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

router.put("/users/:id", jsonParser, (req, res) => {
    User.findOne({
        _id: req.params.id
    }, (err, user) => {
        if (err) return console.error(err);
        if(req.body.addingNewCar) {
            console.log(`-----\nAdding new car ${req.body.addingNewCar.registration_number} for user ${user.name} - ${user._id}\n-----`);
            User.updateOne({ _id: req.params.id}, {
                $push: {
                    cars : [{
                        registration_number: req.body.addingNewCar.registration_number,
                        vin: req.body.addingNewCar.vin
                    }]
                }
            }, (err, result) => {
                if(err) {
                    res.send(err);
                } else {
                    res.send(user.cars);
                }
            })
        }
    });
})

module.exports = router;