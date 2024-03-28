const express = require('express')
const router = express.Router()
const path = require('path')
const blogs  = require('../data/blog')
const foods  = require('../data/food')
const contactUs = require('../data/contactUS')
const meat = require('../models/meat')
const Meat = require('../models/meat')
const multer = require("multer")

router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,"../templates/index.html"))
    res.render("index")
})



router.get('/crudOperation',(req,res)=>{
    let name = "Ibrahim Zaheer"
    
    res.render("crudOperation",{name:name})
})

router.get('/api/contactus',(req,res)=>{
    res.json(contactUs)
})
router.get('/contactus',(req,res)=>{
   res.render("showContacts",{contacts:contactUs})
})
router.get('/contactusForm',(req,res)=>{
    res.render("contactUSForm",{contacts:contactUs})
 })




// Route to render the insertData.ejs form
router.get('/insertData', (req, res) => {
    res.render('insertData');
});

// Route to handle form submission and insert data into contactUS array
router.post('/insert', (req, res) => {
    const newData = {
        "Full name": req.params.name,
        "Age": parseInt(req.params.age),
        "CNIC": req.params.cnic,
        "Location": req.params.location,
        "Meat": req.params.meat
    };
    contactUs.push(newData) // Insert new data into the contactUS array
    res.redirect('/insertData'); // Redirect back to the form after insertion
});
//now we are using mongo db to Get and post data

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads')
    }
    ,
    filename: function(res,file,cb){
        cb(null,file.fieldname + "_" + Date.now()+"_"+file.originalname);
    }
})
var upload = multer({
    storage:storage,
//referring to name image written in userform
}).single("image");

// GET route to render the meat form
router.get("/add_meat", (req, res) => {
    res.render("meatForm", { title: "Add Meat" });
});

// POST route to handle form submission and add meat data
router.post("/add_meat", upload, (req, res) => {
    const newMeat = new Meat({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        image: req.file.fieldname
    });
    newMeat.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'Meat added successfully'
            };
            res.redirect('/');
        })
        .catch((err) => {
            res.json({ message: err.message });
        });
});

module.exports = router;