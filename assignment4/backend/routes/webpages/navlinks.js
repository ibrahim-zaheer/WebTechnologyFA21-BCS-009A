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
  //when contact is is successfull  
  router.get('/thankYou',(req,res)=>{
    res.render("contactSuccess")
  })
  router.get('/OrderSuccess',(req,res)=>{
    res.render("orderSuccess")
  })

module.exports = router;