const express = require("express");
let router = express.Router();
let Meat = require("../../models/meatModel");
const mongoose = require("mongoose");

let cartOrder = require("../../models/cartorder");

router.get('/', (req, res) => {
    res.send("Hello")
  });

  //display all meat products
//   router.get("/list", async function(req, res) {
//     try {
//         let meat = await Meat.find();
//         res.render("meatList", { meat: meat,authenticated: req.session.authenticated });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }); 

//add this code when need to use search and filter to display products
// Display all meat products
router.get("/list", async function(req, res) {
    try {
        const { name, minPrice, maxPrice, page = 1 } = req.query;
        const itemsPerPage = 5;
        const currentPage = parseInt(page);
        let query = {};

        if (name) {
            query.name = new RegExp(name, 'i'); // Case-insensitive regex search
            // Store the search query in session
            if (!req.session.searchQueries) {
                req.session.searchQueries = [];
            }
            if (!req.session.searchQueries.includes(name)) {
                req.session.searchQueries.push(name);
            }
        }

        if (minPrice) {
            query.price = { $gte: parseFloat(minPrice) };
        }

        if (maxPrice) {
            if (!query.price) {
                query.price = {};
            }
            query.price.$lte = parseFloat(maxPrice);
        }

        const totalItems = await Meat.countDocuments(query);
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const meat = await Meat.find(query)
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        console.log(`Current Page: ${currentPage}`);
        console.log(`Items Per Page: ${itemsPerPage}`);
        console.log(`Total Items: ${totalItems}`);
        console.log(`Total Pages: ${totalPages}`);
        console.log(`Query: `, query);
        console.log(`Meat: `, meat);

        res.render("meatList", {
            meat: meat,
            authenticated: req.session.authenticated,
            searchQuery: name,
            minPrice: minPrice,
            maxPrice: maxPrice,
            currentPage: currentPage,
            totalPages: totalPages,
            previousSearches: req.session.searchQueries // Pass previous searches to the template
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// router.get("/list/:id", async function(req, res) {
//     try {
//         let meat = await Meat.findById(req.params.id);
//         if (!meat) {
//             return res.status(404).json({ message: "Meat product not found" });
//         }

//         // Check if the visitedProducts array exists in the session
//         if (!req.session.visitedProducts) {
//             req.session.visitedProducts = [];
//         }

//         // Add the current product ID to the visitedProducts array if it's not already there
//         if (!req.session.visitedProducts.includes(req.params.id)) {
//             req.session.visitedProducts.push(req.params.id);
//         }

//         res.render("meatDetail", { meat: meat, authenticated: req.session.authenticated });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.get("/list/:id", async function(req, res) {
    try {
        let meat = await Meat.findById(req.params.id);
        if (!meat) {
            return res.status(404).json({ message: "Meat product not found" });
        }

        // Check if the visitedProducts array exists in the session
        if (!req.session.visitedProducts) {
            req.session.visitedProducts = [];
        }

        // Add the current product ID to the visitedProducts array if it's not already there
        if (!req.session.visitedProducts.includes(req.params.id)) {
            req.session.visitedProducts.push(req.params.id);
        }

        res.render("meatDetail", { meat: meat, authenticated: req.session.authenticated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/meat/visited", async function(req, res) {
    try {
        // Check if the visitedProducts array exists in the session
        if (!req.session.visitedProducts || req.session.visitedProducts.length === 0) {
            return res.render("meatList", {
                meat: [],
                authenticated: req.session.authenticated,
                searchQuery: '',
                minPrice: '',
                maxPrice: '',
                currentPage: 1,
                totalPages: 1,
                previousSearches: req.session.searchQueries || [],
                message: "No visited products."
            });
        }

        // Find the visited products based on the IDs stored in the session
        let visitedMeats = await Meat.find({ _id: { $in: req.session.visitedProducts } });

        res.render("meatList", {
            meat: visitedMeats,
            authenticated: req.session.authenticated,
            searchQuery: '',
            minPrice: '',
            maxPrice: '',
            currentPage: 1,
            totalPages: 1,
            previousSearches: req.session.searchQueries || []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.get("/list/:id", async function(req, res) {
//     try {
//         const meatId = req.params.id;
//         const meat = await Meat.findById(meatId);
//         if (!meat) {
//             return res.status(404).json({ message: "Meat product not found" });
//         }
//         res.render("meatDetail", { meat: meat, authenticated: req.session.authenticated });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

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