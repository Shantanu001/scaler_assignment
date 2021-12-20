const express = require("express");
const app = express();

const main = require("./routes/main");

//recognize the incoming Request Object as a JSON Object
app.use(express.json());

//Handling routes for all controllers
app.use("/api/v1",main);


module.exports = app;