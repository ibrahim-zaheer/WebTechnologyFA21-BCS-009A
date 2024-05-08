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

// Mounting the routers
router.use('/api/meat', require(path.join(__dirname, './api/meatInformation')));
router.use('/order', require(path.join(__dirname, './api/order')));
router.use('/user', require(path.join(__dirname, './api/userInformation')));
router.use('/admin', require(path.join(__dirname, './api/admin')));

// // Define your routes
// router.get('/', (req, res) => {
//     res.render("home",{ authenticated: false});
// });

// Define your routes
router.get('/', (req, res) => {
    res.render("home", { authenticated: req.session.authenticated || false });
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
