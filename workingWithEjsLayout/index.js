const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const session = require("express-session");
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/meat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database is connected');
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
})
.catch(err => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: "My secret key",
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
// we are going to use it as urls.py as we did in python django projects
app.use('/', require(path.join(__dirname, 'routes/routes.js')));
// app.use('/', require(path.join(__dirname, 'routes/api/order')));
// app.use('/', require(path.join(__dirname, 'routes/api/userInformation')));
app.use(express.static(path.join(__dirname, "uploads")));
// Specify the default layout
app.set('layout', 'layouts/base');