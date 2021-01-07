const express = require("express");
const app = express();
var router = require("./Router");
const port = 5000;

app.use("/", router)

app.listen(port, () => {
    return `Server running on port: ${port}`;
})