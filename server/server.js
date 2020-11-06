const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res) => {
    res.send("404 Not Found");
});

app.get("/create-new-user", (req, res) => {
    res.send("404 Not Found");
});

app.post("/create-new-user", (req, res) => {
    console.log("test");
});

app.listen(5000, () => {
    return "Server running on port: 5000";
})