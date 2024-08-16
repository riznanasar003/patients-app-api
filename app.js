const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt =require("bcrypt")
const jwt = require("jsonwebtoken")
const loginModel = require("./models/admin")
const doctorModel = require("./models/doctor")
const patientModel = require("./models/patient")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://rizna10:rizna2003@cluster0.u7ke2.mongodb.net/patientsdb?retryWrites=true&w=majority&appName=Cluster0")

app.get("/test",(req,res)=>{
    res.json({"status":"success"})
})

app.post("/adminSignup",(req,res)=>{
    let input = req.body
    let hashedpassword = bcrypt.hashSync(input.password,10)
    //console.log(hashedpassword)
    input.password=hashedpassword
    console.log(input)
    let result = new loginModel(input)
    result.save()
    res.json({"status":"success"})
})

app.post("/adminSignIn",(req,res)=>{
    let input = req.body
    let result = loginModel.find({username:input.username}).then(
        (response)=>{
            if (response.length>0) {
                const validator = bcrypt.compareSync(input.password,response[0].password)
                if (validator) {
                    jwt.sign({email:input.username},"patient-app",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"status":"Token creation failed"})
                            } else {
                                res.json({"status":"success","token":token})
                            }
                    })
                } else {
                    res.json({"status":"wrong password"})
                }
            } else {
                res.json({"status":"username doesn't exist"})
            }
        }
    ).catch()
})

app.post("/addDoctor",(req,res)=>{
    let input = req.body
    let token = req.headers.token
    jwt.verify(token,"patient-app",(error,decoded)=>{
        if (decoded && decoded.email) {
            let result = new doctorModel(input)
            result.save()
            res.json({"status":"success"})
        } else {
            res.json({"status":"Invalid authentication"})
        }
    })
})

app.post("/addPatient",(req,res)=>{
    let input  = req.body
    const dateobject = new Date()
    const currentYear = dateobject.getFullYear()
    // console.log(currentYear.toString())
    const currentMonth = dateobject.getMonth()+1
    // console.log(currentMonth.toString())
    const randomNumber = Math.floor(Math.random()*9999)+1000
    // console.log(randomNumber.toString())
    const patientid = "XYZ"+currentYear.toString()+currentMonth.toString()+randomNumber.toString()
    console.log(patientid)
    input.patientid = patientid
    console.log(input)
    let result = new patientModel(input)
    result.save()
    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("server started")
})

