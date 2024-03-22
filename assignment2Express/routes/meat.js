const express = require('express')
const router = express.Router()
const path = require('path')
const blogs  = require('../data/blog')
const foods  = require('../data/food')
const contactUs = require('../data/contactUS')

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"../templates/index.html"))
})


router.get('/crudOperation',(req,res)=>{
    let name = "Ibrahim Zaheer"
    
    res.render("crudOperation",{name:name})
})

router.get('/api/contactus',(req,res)=>{
    res.json(contactUs)
})
router.get('/contactus',(req,res)=>{
   res.render("showContacts",{contacts:contactUs})
})




module.exports = router