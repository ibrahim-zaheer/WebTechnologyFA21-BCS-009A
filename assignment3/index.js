const express = require('express')
const app = express()
const port = 3000
const path = require('path')



// Set EJS as the view engine
app.set('view engine', 'ejs');
//making your own middleware

// const IbrahimMiddleware = (req,res,next)=>{
// console.log(req)
// //add next to allow middle ware to run next
// next()
// }
// app.use(IbrahimMiddleware)

app.use(express.static(path.join(__dirname,"static")))
app.use('/',require(path.join(__dirname,'routes/meat.js')))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })