const express = require("express")
// const UserApplication = require("../Models/applicationSchema")
// const router = require("./user")
const Applications = require("../Models/applicationSchema")

const applicationRouter = express.Router()

applicationRouter.get("/",(req,res)=>{
res.json({
    mssg:"application endpoint"
})
})

applicationRouter.post("/create",async(req,res)=>{

    // application schema destructuring
    const {companyName,positionApplied,dateApplied}= req.body
    try{
        // created a new entry
        const job = await Applications.create({companyName,positionApplied,dateApplied})
        res.status(200).json(job)
    }
    catch (error){
        res.status(400).json({error:error.message})

    }
})

module.exports = applicationRouter;
