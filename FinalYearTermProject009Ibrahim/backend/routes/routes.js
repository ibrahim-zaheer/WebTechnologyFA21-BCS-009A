// const express = require("express");
// let router = express.Router();
// const app  = express();
// const path = require("path"); // Import the path module
// // let Meat = require("../../models/meatModel");

// app.use('/api/meat', require(path.join(__dirname, './api/meatInformation')));
// // app.use('/order', require(path.join(__dirname, './api/order')));
// app.use('/order', require(path.join(__dirname, './api/order')));


// router.get('/',(req,res)=>{
    
//     res.render("home")
// })
// router.get('/meat',(req,res)=>{
    
//     res.render("bye")
// })

// module.exports = router;




const express = require("express");
const router = express.Router();
const path = require("path");
let Meat = require("../models/meatModel");
// Mounting the routers
router.use('/api/meat', require(path.join(__dirname, './api/meatInformation')));
router.use('/order', require(path.join(__dirname, './api/order')));
router.use('/user', require(path.join(__dirname, './api/userInformation')));
router.use('/admin', require(path.join(__dirname, './api/admin')));
router.use('/webpage', require(path.join(__dirname, './webpages/navlinks')));

// // Define your routes
// router.get('/', (req, res) => {
//     res.render("home",{ authenticated: false});
// });

// Define your routes
// router.get('/', (req, res) => {
//     res.render("home", { authenticated: req.session.authenticated || false });
// });
router.get("/", async function(req, res) {
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

router.get('/meat', (req, res) => {
    res.render("bye",{ authenticated: req.session.authenticated || false });
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = router;
