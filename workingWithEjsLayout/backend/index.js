// const expressLayouts = require('express-ejs-layouts');
// const express = require('express');
// const app = express();
// const port = 3001;
// const path = require('path');
// const session = require("express-session");
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// mongoose.connect("mongodb://127.0.0.1:27017/meat", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })


// .then(() => {
//     console.log('Database is connected');
//     app.listen(port, () => {
//         console.log(`Example app listening on port ${port}`);
//     });
// })
// .catch(err => console.log(err));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(session({
//     secret: "My secret key",
//     saveUninitialized: true,
//     resave: false
// }));

// app.use((req, res, next) => {
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// });
// const isAuthenticated = (req, res, next) => {
//     // Check if user is authenticated, set authenticated to true or false accordingly
//     const authenticated = req.user ? true : false;
//     res.locals.authenticated = authenticated;
//     next();
// };
// app.use(isAuthenticated);
// // app.use(session);
// app.set('view engine', 'ejs');
// app.use(expressLayouts);
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));
// // we are going to use it as urls.py as we did in python django projects
// app.use('/', require(path.join(__dirname, 'routes/routes.js')));
// // app.use('/', require(path.join(__dirname, 'routes/api/order')));
// // app.use('/', require(path.join(__dirname, 'routes/api/userInformation')));
// app.use(express.static(path.join(__dirname, "uploads")));
// // Specify the default layout

// // Define a middleware to set authenticated status
// const setAuthenticatedStatus = (req, res, next) => {
//     // Check if the user is authenticated
//     res.locals.authenticated = req.session.authenticated || false;
//     next();
// };

// // Apply the middleware to all routes
// app.use(setAuthenticatedStatus);

// // Now, this middleware will run on every request and add the authenticated status to res.locals

// app.set('layout', 'layouts/base');


const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const session = require("express-session");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let cookieParser = require("cookie-parser");



mongoose.connect("mongodb://127.0.0.1:27017/meat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database is connected');
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}).catch(err => console.log(err));

const { cookie }= require("express/lib/response");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "My secret key",
    saveUninitialized: true,
    resave: false
}));

// Middleware to set authenticated status
const isAuthenticated = (req, res, next) => {
    const authenticated = req.session.authenticated || false;
    res.locals.authenticated = authenticated;
    next();
};
const adminMiddleware = (req,res,next)=>
    {
     console.log("this is admin");
     
    //  const adminAuthenticated =  req.session.admin || false;
    //  res.locals.adminAuthenticated = adminAuthenticated;
    res.locals.adminAuthenticated = req.session.adminAuthenticated || false;
     next();
    
   
}
app.use(adminMiddleware)

app.use(isAuthenticated);

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
app.use('/', require(path.join(__dirname, 'routes/routes.js')));
app.use(express.static(path.join(__dirname, "uploads")));
app.set('layout', 'layouts/base');
