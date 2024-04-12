const express = require('express')
const router = express.Router()
const path = require('path')
const blogs  = require('../data/blog')
const foods  = require('../data/food')
const contactUs = require('../data/contactUS')
const meat = require('../models/meatModel')
const Meat = require('../models/meatModel')
const multer = require("multer")
const Order = require('../models/orderModel')

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
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
    
})
var upload = multer({
    storage:storage,
//referring to name image written in userform
}).single("image");

// for json data
// router.get("/get_meat",async function(req,res){
//     let meat = await Meat.find()
//     res.json(meat)
// })

// GET route to render the meat list
router.get("/get_meat", async function(req, res) {
    try {
        let meat = await Meat.find();
        res.render("meatList", { meat: meat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// this get and post method is written together to allow us to get form and post that form
// to review data we have to create another get end point to recieve that data
// GET route to render the meat form
router.get("/add_meat", (req, res) => {
    res.render("meatForm", { title: "Add Meat" });
});
// POST route to handle form submission and add meat data
router.post("/add_meat", upload, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const newMeat = new Meat({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        image: req.file.fieldname // Use req.file.filename instead of req.file.fieldname
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
            res.status(500).json({ message: err.message });
        });
});

//for updating the data
router.get("/get_meat/:id", async (req, res) => {
    let meat = await Meat.findById(req.params.id);
    return res.send(meat);
  });
  router.put("/get_meat/:id", async (req, res) => {
    let meat = await Meat.findById(req.params.id);
    meat.name = req.body.name
    meat.quantity =  req.body.quantity,
    meat.price =  req.body.price,
    await meat.save();
    return res.send(meat);
  });
// for deleting the data
router.delete("/get_meat/:id", async (req, res) => {
    let meat = await Meat.findByIdAndDelete(req.params.id);
    
    return res.send(meat);
  });


// for placing the order:
router.post('/insertOrder', async (req, res) => {
    try {
        const { name, phoneNumber, email, outlet, address, animal, quantity, deliveryDay, message } = req.body;

        // Create a new order object
        const newOrder = new Order({
            name,
            phoneNumber,
            email,
            outlet,
            address,
            animal,
            quantity,
            deliveryDay,
            message
        });

        // Save the new order to the database
        await newOrder.save() .then(() => {
            req.session.message = {
                type: 'success',
                message: 'user added successfully'
            };
            res.redirect('/');
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;