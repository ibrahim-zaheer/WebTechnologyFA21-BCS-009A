const express = require("express");
let router = express.Router();
let Meat = require("../../models/meatModel");

router.get('/', (req, res) => {
    res.send("Hello")
  });

  //display all meat products
  router.get("/list", async function(req, res) {
    try {
        let meat = await Meat.find();
        res.render("meatList", { meat: meat,authenticated: req.session.authenticated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 
  
router.get("/cart", async (req, res) => {
    let cart = req.cookies.cart;
    if (!cart) cart = [];
    let meat = await Meat.find({ _id: { $in: cart } });
    res.render("cart", { meat:meat });
  });
  router.get("/cart/:id", async (req, res) => {
    let cart = req.cookies.cart;
    if (!cart) cart = [];
    cart.push(req.params.id);
    res.cookie("cart", cart);
  
    // return res.send(req.cookies);
    return res.redirect("/");
  });

// router.get("/api/meat", async function(req, res) {
//     try {
//         let meat = await Meat.find();
//         res.render("meat/meatList", { meat: meat });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
router.get("/api/meat", async function(req, res) {
    try {
        // Assuming imageUrl is retrieved from the query parameter or session
        const imageUrl = req.query.imageUrl; // or req.session.imageUrl, depending on your implementation
        
        res.render("components/Form/meatForm", { imageUrl: imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post("/api/meat", async (req, res) => {
   

    const newMeat = new Meat({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        image:req.body.image

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