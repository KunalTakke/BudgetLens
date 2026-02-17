import express from "express"


const app = express()
const PORT = process.env.PORT || 3000;


// routes
app.get('/',(req,res)=>{
    res.send("hello world");
})

// listen to porst
app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})