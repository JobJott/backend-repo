require("dotenv").config()
// / importing necessary dependencies
const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./Routes/user")
const applicationRouter = require("./Routes/application")


// starting up express
const app = express()

// middle ware
app.use((req,res,next)=>{
    console.log(req.path,req.method);
    next()
})

// connecting to db
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("connected to db and running on port", process.env.PORT);
    })
})
.catch((err)=>{
    console.log(err);
    
})

app.use(express.json())
app.use("/api/user",userRouter)
app.use("/api/application",applicationRouter)




