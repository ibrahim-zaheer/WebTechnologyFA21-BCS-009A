const express = require('express')
const router = express.Router()
const path = require('path')
const blogs  = require('../data/blog')
const foods  = require('../data/food')
const contactUs = require('../data/contactUS')

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


module.exports = router