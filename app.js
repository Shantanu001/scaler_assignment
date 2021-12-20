const express = require("express");
const app = express();

const main = require("./routes/main");


app.use(express.json());
app.use("/api/v1",main);


module.exports = app;