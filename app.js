//jshint esversion:6

// enviroment variables
require ("dotenv").config();
// enviroment variables
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); 


// Conexion BDmongoose
const MONGO_URL =


"mongodb://127.0.0.1:27017/userDB";

  mongoose.set("strictQuery", true);
  mongoose.connect(MONGO_URL)
  .then(()=>{
    console.log('conectado a la bd')
  }).catch(err=>{
    console.error(err)
  })
// Conexion BDmongoose

// Modelo necesitamos  usar new mongoose.schema obj para poder usar mongoose ecrypt

const userSchema= new mongoose.Schema({
    email:String,
    pasword:String
});


//encryptamos toda la base de datos
// userSchema.plugin(encrypt,{secret:secret})
//encryptamos solo un campo si queremos a;adir mas solo los ponemos en el array 

// para traer var envi process.env.SECRET
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("articles",userSchema);



// this is the routes to go between views
app.get("/",function(req,res){
    res.render("home")
})
app.get("/login",function(req,res){
    res.render("login")
})
app.get("/register",function(req,res){
    res.render("register")
})
// this is the routes to go between views

app.post("/register",function(req,res){
    const newUser = User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
        }
    });
});

app.post("/login", function(req,res){
    const username =req.body.username;
    const password = req.body.pasword;
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets")
                }
            }
        }
    });
});

app.listen(3001, function() {
    console.log("Server started on port 3001");
  }); 
  