const mongoose = require('mongoose')
const bcrypt = require("bcrypt")


const Schema = mongoose.Schema

const userSchema = new Schema({

    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    emailAddress:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    contactAddress:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

// applying bcrypt
userSchema.pre('save', async function(next){
try{
const salt  = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(this.password, salt)
this.password = hashedPassword
next()
}
catch (error){
next(error)
}
})

const User = mongoose.model("myUser",userSchema)

module.exports = User;