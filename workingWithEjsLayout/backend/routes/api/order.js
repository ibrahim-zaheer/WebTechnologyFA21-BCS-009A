// const express = require("express");
// let router = express.Router();
// let Meat = require("../../models/meatModel");
// const Order = require('../models/orderModel')
// router.get('/', (req, res) => {
//     res.send("Hello")
//   });
  

// router.get("/api/meat", async function(req, res) {
//     try {
//         let meat = await Meat.find();
//         res.render("meatList", { meat: meat });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.post("/api/meat", async (req, res) => {
   

//     const newMeat = new Meat({
//         name: req.body.name,
//         quantity: req.body.quantity,
//         price: req.body.price,

//     });

//     newMeat.save()
//         .then(() => {
//             req.session.message = {
//                 type: 'success',
//                 message: 'Meat added successfully'
//             };
//             res.redirect('/');
//         })
//         .catch((err) => {
//             res.status(500).json({ message: err.message });
//         });
// });

// //for updating the data
// router.get("/api/meat/:id", async (req, res) => {
//     let meat = await Meat.findById(req.params.id);
//     return res.send(meat);
//   });
//   router.put("/api/meat/:id", async (req, res) => {
//     let meat = await Meat.findById(req.params.id);
//     meat.name = req.body.name
//     meat.quantity =  req.body.quantity,
//     meat.price =  req.body.price,
//     await meat.save();
//     return res.send(meat);
//   });
// // for deleting the data
// router.delete("/api/meat/:id", async (req, res) => {
//     let meat = await Meat.findByIdAndDelete(req.params.id);
    
//     return res.send(meat);
//   });

//   module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Meat = require("../../models/meatModel");
// const Order = require("../../models/orderModel");

// router.get("/", async function (req, res) {
//     try {
//         let meat = await Meat.find();
//         res.render("meatList", { meat: meat });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.get("/hello", (req, res) => {
//     res.send("Hello from the order router!");
// });

// router.post("/", async (req, res) => {
//     const newMeat = new Meat({
//         name: req.body.name,
//         quantity: req.body.quantity,
//         price: req.body.price,
//     });

//     newMeat
//         .save()
//         .then(() => {
//             req.session.message = {
//                 type: "success",
//                 message: "Meat added successfully",
//             };
//             res.redirect("/");
//         })
//         .catch((err) => {
//             res.status(500).json({ message: err.message });
//         });
// });

// // for updating the data
// router.get("/:id", async (req, res) => {
//     let meat = await Meat.findById(req.params.id);
//     return res.send(meat);
// });

// router.put("/:id", async (req, res) => {
//     let meat = await Meat.findById(req.params.id);
//     meat.name = req.body.name;
//     meat.quantity = req.body.quantity;
//     meat.price = req.body.price;
//     await meat.save();
//     return res.send(meat);
// });

// // for deleting the data
// router.delete("/:id", async (req, res) => {
//     let meat = await Meat.findByIdAndDelete(req.params.id);

//     return res.send(meat);
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Meat = require("../../models/meatModel");
const Order = require("../../models/orderModel");

router.get("/", async function (req, res) {
    try {
        let meat = await Meat.find();
        res.render("meatList", { meat: meat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/hello", (req, res) => {
    res.send("Hello from the order router!");
});

// This route handles the insertion of orders
// router.post('/insertOrder', async (req, res) => {
//     try {
//         const { name, phoneNumber, email, outlet, address, animal, quantity, deliveryDay, message } = req.body;

//         // Create a new order object
//         const newOrder = new Order({
//             name,
//             phoneNumber,
//             email,
//             outlet,
//             address,
//             animal,
//             quantity,
//             deliveryDay,
//             message
//         });

//         // Save the new order to the database
//         await newOrder.save();

//         // Redirect to home page after successful order insertion
//         res.redirect('/');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // Error handling middleware
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });
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
        await newOrder.save();

        // Redirect to home page after successful order insertion
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get("/chart",async (req,res)=>{
    try {
        let order = await Order.find();
        res.render("components/Chart/order/orderData", { order:order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
// router.get("/cart", async (req, res) => {
//     let cart = req.cookies.cart;
//     if (!cart) cart = [];
//     let order = await Order.find({ _id: { $in: cart } });
//     res.render("cart", { order });
//   });
// router.get("/chart", async (req, res) => {
//     try {
//         const orders = await Order.find();
//         res.render("components/Chart/order/orderData", { orders: JSON.stringify(orders) }); // Convert orders to JSON
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })


module.exports = router;
