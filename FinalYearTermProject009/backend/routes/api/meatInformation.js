const express = require("express");
let router = express.Router();
let Meat = require("../../models/meatModel");
const mongoose = require("mongoose");

let cartOrder = require("../../models/cartorder");

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

router.get("/meat/:id", async function(req, res) {
    try {
        let meat = await Meat.findById(req.params.id);
        if (!meat) {
            return res.status(404).json({ message: "Meat product not found" });
        }
        res.render("meatDetail", { meat: meat, authenticated: req.session.authenticated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
  

router.get("/cart", async (req, res) => {
    let cart = req.cookies.cart;
    if (!cart) cart = [];

    try {
        // Extract and validate `id` values
        const ids = cart.map(item => {
            if (mongoose.Types.ObjectId.isValid(item.id)) {
                return new mongoose.Types.ObjectId(item.id); // Use 'new' keyword here
            } else {
                console.warn(`Invalid ObjectId: ${item.id}`);
                return null;
            }
        }).filter(id => id !== null);

        // Retrieve items from the database based on their IDs
        const meats = await Meat.find({ _id: { $in: ids } });

        // Add quantities to the retrieved items
        const meatsWithQuantities = meats.map(meat => {
            const cartItem = cart.find(item => item.id == meat._id.toString());
            meat.quantity = cartItem ? cartItem.quantity : 1;
            return meat;
        });

        // Render a template with the cart items
        res.render('cart', { meats: meatsWithQuantities });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/cart/:id", async (req, res) => {
    let cart = req.cookies.cart;
    if (!cart) cart = [];

    const itemId = req.params.id;
    const quantity = parseInt(req.query.quantity, 10); // Get the quantity from the query parameters

    if (isNaN(quantity) || quantity < 1) {
        return res.status(400).send("Invalid quantity");
    }

    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex !== -1) {
        // If the item already exists in the cart, increment its quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // If the item is not in the cart, add it with the specified quantity
        cart.push({ id: itemId, quantity: quantity });
    }

    res.cookie("cart", cart);
  
    return res.redirect("/api/meat/list"); // Redirect to the cart page to view the updated cart
});



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
    return res.render("updateMeat",{meat:meat})
  });
// for deleting the data
router.delete("/api/meat/:id", async (req, res) => {
    let meat = await Meat.findByIdAndDelete(req.params.id);
    
     return res.send(meat);
  });


  router.post('/place-order', async (req, res) => {
    const { items, subtotal } = req.body;
    // const userId;
    

    const userId = req.user.id;
    const order = new cartOrder({
        items: items,
        subtotal: subtotal,
        userId: userId
    });

    try {
        await order.save();
        // res.status(201).json({ message: 'Order placed successfully', order });
        res.redirect("/webpage/OrderSuccess");
        // res.render("orderSuccess")
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});  
// router.get("/selectItem", async function(req, res) {
//     try {
        
//         const items = await Meat.find(); 
        
//         res.render("selectItem", { items: items });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.get("/history", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;
    let cartOrders = await cartOrder.find({ userId: userId });

    return res.render("orderHistory", { cartOrders: cartOrders });
});


//use this code if cart not work:




    // router.get("/cart", async (req, res) => {
        //     let cart = req.cookies.cart;
        //     if (!cart) cart = [];
        
        //     try {
        //         // Retrieve items from the database based on their IDs
        //         const meats = await Meat.find({ _id: { $in: cart } });
        
        //         // Render a template with the cart items
        //         res.render('cart', { meats });
        //     } catch (error) {
        //         console.error("Error fetching cart items:", error);
        //         res.status(500).send("Internal Server Error");
        //     }
        // });
        
        
        // router.get("/cart/:id", async (req, res) => {
        //     let cart = req.cookies.cart;
        //     if (!cart) cart = [];
        
        //     // const itemId = req.params.id;
           
        //     cart.push(req.params.id);
        
        //     res.cookie("cart", cart);
        
        //     return res.redirect("/api/meat/list");
        // });
  module.exports = router;