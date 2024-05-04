const express = require("express");
let router = express.Router();
let Meat = require("../../models/meatModel");
let ContactUs = require("../../models/contactUsModel")
const { body, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Userinfo = require("../../models/userModel");
// last part of the json web token that will be secret
const jwtSecret = "mynameisibrahimnicetomeetyou";


// Route for signing up a new user
router.post('/signup', [
    // Validate user input
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('passwords').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    //const user = await Userinfo.findOne({ email: req.body.email });
    

    try {
        const user = await Userinfo.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exist' }] });
        }
        else{
        // Generate hash for password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.passwords, salt);

        // Create user in database
        await Userinfo.create({
            name: req.body.name,
            passwords: hashedPassword,
            phonenumbers: req.body.phonenumbers,
            email: req.body.email
        });

        //res.json({ success: true });
        res.redirect('/user/login');
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get('/signup',(req,res)=>{
res.render("signup",{layout:false});
})

// // Route for logging in a user
// router.post('/login', [
//     // Validate user input
//     body('email').isEmail(),
//     body('passwords').isLength({ min: 5 })
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const user = await Userinfo.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(400).json({ errors: [{ msg: 'User doesnot exist' }] });
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(req.body.passwords, user.passwords);
//         if (!isMatch) {
//             return res.status(400).json({ errors: [{ msg: 'Password is wrong' }] });
//         }

//         // Create and return JWT token
//         const payload = {
//             user: {
//                 id: user.id
//             }
//         };

//         jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
//             if (err) throw err;
//             //res.json({ success: true, token });
//             res.redirect('/')
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// });


router.post('/login', [
    // Validate user input
    body('email').isEmail(),
    body('passwords').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await Userinfo.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'User doesnot exist' }] });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(req.body.passwords, user.passwords);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Password is wrong' }] });
        }

        // Set authenticated to true in session
        req.session.authenticated = true;

        // Create and return JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            //res.json({ success: true, token });
            res.redirect('/');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
router.get('/login', (req, res) => {
    
    res.render('login',{layout:false}); 
  });


// router.post('/createUser', // username must be an email
//   body('email').isEmail(),
//   body('name').isLength({ min: 3 }),
//   // password must be at least 5 chars long
//   body('passwords').isLength({ min: 4 }),

//   // Finds the validation errors in this request and wraps them in an object with handy functions



//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     //all functions in bcrypt are async
//     const salt = await bcrypt.genSalt(10);
//     let secPassword = await bcrypt.hash(req.body.passwords,salt);
//     try {
//       await Userinfo.create({
//         name: req.body.name,
//         passwords: secPassword,
//         phonenumbers: req.body.phonenumbers,
//         email: req.body.email
//       })
//       res.json({ success: true });
//     }
//     catch (error) {
//       console.log(error)
//       res.json({ success: false })
//     }
//   })

//   router.post('/loginUser',body('email').isEmail(), async (req, res) => {
//     let email  = req.body.email;
//     try {
//       let userEmail = await User.findOne({email});
//      if(!userEmail){
//       return res.status(400).json({ errors:"Entered Email is not in the list"});}

//       //we will use bcrypt to compare the password stored as hash in mongodb to user entered password
//       const pwdCompare = await bcrypt.compare(req.body.passwords,userEmail.passwords);
//      if(!pwdCompare){
//       return res.status(400).json({ errors:"Entered password for the email is wrong"});}
//       //after comparing we will sent authorization token to make sure that whenever user comes again, it is the same user
//       // and the data left by him like unused cart is available to him

//       //the purpose of data is simple make authtoken of what, we choose id because it will always be unique
//       const data={
//         user:{
//           id:userEmail.id
//         }
//       }
//       //then this is where authToken is created
//       const authToken = jwt.sign(data,jwtSecret)

//      // now we are sending authtoken as well
//     return res.json({success:true,authToken:authToken}) 
//     // now as we know if login siccessful we will pass the authtoken value to the front end for this go
//     // to login.js and pass the value of json.authToken 
//     }
    
//     catch (error) {
//       console.log(error)
//       res.json({ success: false })
//     }});


router.post('/insertContact', async (req, res) => {
    try {
        const { name, phoneNumber, email, message } = req.body;

        // Create a new order object
        const newContact = new ContactUs({
            name,
            phoneNumber,
            email,
            message
        });

        // Save the new order to the database
        await newContact.save();

        // Redirect to home page after successful order insertion
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/', (req, res) => {
    res.send("Hello")
  });
  

router.get("/api/meat", async function(req, res) {
    try {
        let meat = await Meat.find();
        res.render("meatList", { meat: meat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/api/meat", async (req, res) => {
   

    const newMeat = new Meat({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,

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