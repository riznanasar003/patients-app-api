const mongoose = require("mongoose")
const patientSchema = mongoose.Schema(
    {
        patientid:{type:String,required:true},
        name:{type:String,required:true},
        address:{type:String,required:true},
        contact:{type:String,required:true},
        emailid:{type:String,required:true},
        password:{type:String,required:true}
    }
)
const patientModel = mongoose.model("patients",patientSchema)
module.exports = patientModel