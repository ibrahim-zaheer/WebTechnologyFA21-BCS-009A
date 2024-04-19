const express = require("express");
let router = express.Router();
// let Meat = require("../../models/meatModel");

app.use('/api/meat', require(path.join(__dirname, 'routes/api/meatInformation')));