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
    // salt makes the hash unpredictable and protect against password-cracking techniques
    // the value in the salt(10) means round the more rounds the more cpu time takes and more encrypted password from brute-forces attacks
    // Even if passwords share the same initial characters, the salt ensures that each password is hashed differently
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