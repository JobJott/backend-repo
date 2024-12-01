const mongoose = require('mongoose')


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



const User = mongoose.model("myUser",userSchema)

module.exports = User;