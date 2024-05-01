const express = require("express");
let router = express.Router();
let Meat = require("../../models/meatModel");
let ContactUs = require("../../models/contactUsModel")

router.post('/insertContact', async (req, res) => {
    try {
        const { name, phoneNumber, email, message } = req.body;

        // Create a new order object
        const newContact = new ContactUs({
            name,
            phoneNumber,
            email,
            message
        });

        // Save the new order to the database
        await newContact.save();

        // Redirect to home page after successful order insertion
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/', (req, res) => {
    res.send("Hello")
  });
  

router.get("/api/meat", async function(req, res) {
    try {
        let meat = await Meat.find();
        res.render("meatList", { meat: meat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/api/meat", async (req, res) => {
   

    const newMeat = new Meat({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,

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
router.get("/api/meat/:id", async (req, res) => {
    let meat = await Meat.findById(req.params.id);
    return res.send(meat);
  });
  router.put("/api/meat/:id", async (req, res) => {
    let meat = await Meat.findById(req.params.id);
    meat.name = req.body.name
    meat.quantity =  req.body.quantity,
    meat.price =  req.body.price,
    await meat.save();
    return res.send(meat);
  });
// for deleting the data
router.delete("/api/meat/:id", async (req, res) => {
    let meat = await Meat.findByIdAndDelete(req.params.id);
    
    return res.send(meat);
  });

  module.exports = router;