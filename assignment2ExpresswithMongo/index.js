// const express = require('express')
// const app = express()
// const port = 3000
// const path = require('path')
// require('dotenv').config();


// const session = require("express-session")


// const mongoose = require('mongoose');

// mongoose.connect("mongodb://127.0.0.1:27017/meat", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Database is connected'))
// .catch(err => console.log(err));
// app.use(express.urlencoded({extended: false}))
// app.use(express.json())
// app.use(
//     session({
//         secret:"My secret key",
//         saveUninitialized: true,
//         resave: false
//     })
// )

// app.use((req,res,next)=>{
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// })

// // Set EJS as the view engine
// app.set('view engine', 'ejs');
// //making your own middleware

// // const IbrahimMiddleware = (req,res,next)=>{
// // console.log(req)
// // //add next to allow middle ware to run next
// // next()
// // }
// // app.use(IbrahimMiddleware)

// app.use(express.static(path.join(__dirname,"static")))
// app.use('/',require(path.join(__dirname,'routes/meat.js')))

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   })
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

app.use(express.static(path.join(__dirname, "static")));
app.use('/', require(path.join(__dirname, 'routes/meat.js')));
app.use(express.static(path.join(__dirname, "uploads")));
