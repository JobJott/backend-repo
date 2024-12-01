const express = require("express")
const User = require("../Models/userSchema")

const router = express.Router();

// end points
router.get("/",(req,res)=>{
res.json({mssg:"all details"})
})

// user login
router.post("/login",async(req,res)=>{
const {emailAddress} = req.body
try {
    // Find the user by email address
    const user = await User.findOne({ emailAddress });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }   
     // Successful login
    return res.status(200).json({ message: 'Login successful' });
} catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
}
});

// user registration
router.post("/register",async(req,res)=>{

    // destructured the schemas and assigned to req.body
    const {firstname,lastname,emailAddress,password,contactAddress,phoneNumber}=req.body
    try{
        // created a new schema for individual user
        const user = await User.create({firstname,lastname,emailAddress,password,contactAddress,phoneNumber})
        res.status(200).json(user)
    }
    catch(error){
        res.status(400).json({error:error.message})

    }
})
module.exports = router