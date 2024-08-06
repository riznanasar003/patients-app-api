const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt =require("bcrypt")
const jwt = require("jsonwebtoken")
const loginModel = require("./models/admin")

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
                    res.json({"status":"success"})
                } else {
                    res.json({"status":"wrong password"})
                }
            } else {
                res.json({"status":"username doesn't exist"})
            }
        }
    ).catch()
})

app.listen(8080,()=>{
    console.log("server started")
})

