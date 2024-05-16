const express = require("express");
const router = express.Router();


router.get('/aboutUs', (req, res) => {
    
    res.render('about'); 
  });
  
  router.get('/list', (req, res) => {
    
    res.redirect("/api/meat/list") 
  });
  router.get('/service',(req,res)=>{
    res.render("serviceByUS")
  })
  router.get('/contactUs',(req,res)=>{
    res.render("contactUs")
  })
    


module.exports = router;