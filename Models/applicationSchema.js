const mongoose = require('mongoose')

const Schema = mongoose.Schema

const applicationSchema = mongoose.Schema({

    companyName:{
        type:String,
        required:true
    },
    positionApplied:{
        type:String,
        required:true
    },
    dateApplied:{
        type:String,
        required:true
    }
},{timestamps:true})

const applicationDetails = mongoose.model("employeeApplication",applicationSchema)

module.exports = applicationDetails