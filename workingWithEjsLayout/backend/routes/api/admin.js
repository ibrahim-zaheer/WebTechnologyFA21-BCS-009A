const express = require("express");
const router = express.Router();
const multer = require('multer');
const cloudinary = require("../../utils/cloudinary");
let Meat = require("../../models/meatModel");
// Configure Multer for file upload
let Userinfo = require("../../models/userModel");
// let Contactinfo = require("../../models/contactUsModel");
const ContactUs = require("../../models/contactUsModel");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// GET route to render the form
router.get('/upload', function (req, res) {
  res.render('components/uploadForm'); // Assuming you have an EJS file named 'uploadForm.ejs'
});
router.post('/upload', upload.single('image'), function (req, res) {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
      if (err ) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error"
        });
      }
  
      // Construct the image URL using the secure URL provided by Cloudinary
      const imageUrl = result.secure_url;
  
      // Redirect to the meat upload form with the image URL as a query parameter
      res.redirect(`/api/meat/api/meat?imageUrl=${encodeURIComponent(imageUrl)}`);
    });
  });
  
  
  // Route for displaying upload success page
  router.get('/upload/success', function(req, res) {
    const imageUrl = req.query.url; // Get the image URL from the query parameter
    res.render('uploadSuccess', { imageUrl: imageUrl });
  });
  
router.get('users',async function (req,res) {
    try {
        const users = await Userinfo.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
router.get('contacts',async function (req,res) {
  try {
      const users = await ContactUs.find();
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
})
  

  
module.exports = router;
