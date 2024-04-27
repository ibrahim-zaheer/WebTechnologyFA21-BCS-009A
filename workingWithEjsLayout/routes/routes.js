const express = require("express");
let router = express.Router();
const app  = express();
const path = require("path"); // Import the path module
// let Meat = require("../../models/meatModel");

app.use('/api/meat', require(path.join(__dirname, './api/meatInformation')));

router.get('/',(req,res)=>{
    
    res.render("home")
})
router.get('/meat',(req,res)=>{
    
    res.render("bye")
})

module.exports = router;
