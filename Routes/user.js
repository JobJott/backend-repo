const express = require("express")
const register = require("../Models/signupSchema")

const router = express.Router();

router.get("/",(req,res)=>{
res.json({mssg:"all user"})
})

router.post("/register",async (req,res)=>{

    // destructured the schemas and assigned to req.body
    const {firstname,lastname,emailAddress,password,contactAddress,phoneNumber}=req.body

    try{
        // created a new schema for individual user
        const user = await register.create({firstname,lastname,emailAddress,password,contactAddress,phoneNumber})
        res.status(200).json(user)
    }
    catch(error){
        res.status(400).json({error:error.message})

    }
})
module.exports = router