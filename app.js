//jshint esversion:6
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine" , "ejs");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/secretUsers");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = "thisisthesecrettextforthisapp.";

userSchema.plugin(encrypt , {secret : secret , encryptedFields:["password"]});

const User = new mongoose.model("User" , userSchema);

app.get("/" , function(req , res){
    res.render("home",{});
})

app.get("/login" , function(req , res){
    res.render("login",{});
})

app.get("/register" , function(req , res){
    res.render("register",{});
})

app.post("/register" , function(req , res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets" , {});
        }
    });
})


app.post("/login" , function(req , res){
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email:email , password : password} , function(err , result){
        if(result != null){
            res.render("secrets" , {});
        }else{
            res.send("<h1>You are not registered. Register and try again later</h1>")
        }
    })
})









app.listen(3000, function () {
    console.log("Server has just got out of despression and is running at port 3000");
})