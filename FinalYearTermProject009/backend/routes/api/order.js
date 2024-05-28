



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



module.exports = router;
