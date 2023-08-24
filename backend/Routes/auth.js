const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const USER =mongoose.model('USER');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {Jwt_secret} = require('../keys');
const RequireLogin = require('../Middleware/RequireLogin');

router.get('/',(req,res)=>{
    res.send("hello g")
})



//---------------------------------------------------------------- SignUp  ----------------------------------------------------------------

router.post('/signup',(req,res)=>{
    // res.json('data posted successfully');
    //console.log(req.body.name);
    const {name,userName,password,email} = req.body;

    if(!name || !userName || !password || !email){
        res.status(422).json({error:"Please add all the field"})
    }
    USER.findOne({$or:[{email:email},{userName:userName}]}).then((savedUser)=>{    
    if(savedUser){
        return res.status(422).json({error:"User already exists with that email or username"})
    }
     bcrypt.hash(password, 12).then((hashedPassword)=>{
        const user= new USER({
            name,
            userName,
            password:hashedPassword,
            email})

        user.save()
        .then(user => {res.json({message:"Registered successfully"})})
        .catch(err => {console.log(err)});
         })
    })        
})

//---------------------------------------------------------------- SignIn  ----------------------------------------------------------------

router.post("/signin",(req, res) => {
    const {email,password} = req.body;

    if(!email || !password){
        res.status(422).json({error:"Please add all the field"})
    }

    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        console.log(savedUser);
         bcrypt.compare(password, savedUser.password)
        .then((match)=>{
        if(match){
           // return res.status(200).json({message:"Signedin successfully"})
            const token = jwt.sign({_id:savedUser.id},Jwt_secret)
            const {_id,name,email,userName} = savedUser
            res.json({token,user:{_id,name,email,userName}})
            console.log({token,user:{_id,name,email,userName}})
        }else{
            return res.status(422).json({error:"Invalid password"})
        }
    })
    .catch((err)=>console.log(err))
    })   
 })

module.exports = router 