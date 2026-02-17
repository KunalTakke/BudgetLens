import express from "express"
import { error } from "node:console";


const app = express()
const PORT = process.env.PORT || 3000;




// routes
app.get('/',(req,res)=>{
    res.send("BudgetLens is running");
})

app.post("/expenses", (req, res) => {

  const expense = req.body;

  console.log(expense);

  res.json({
    message: "Expense received",
    data: expense
  });

});

app.get("/expenses",(req,res)=>{
    res.json({data: "lol"})
})

// listen to port
try{
    app.listen(PORT,()=>{
    console.log(`App listening on port http://localhost:${PORT}`)
});
} catch (error) {
    console.log(`Cannot listen to server ${error.message}`)
}
