const express = require("express");
const app = express();
var router = require("./Router");
app.use("/", router)
app.listen(5000, () => {
    return "Server running on port: 5000";
})