const express = require('express')
const router = new express.Router({mergeParams: true})
const User = require('../views/models/user')
const jwt = require("jsonwebtoken");
const jwtKey = "private_key";
const jwtExpirySeconds = 600;


router.post('/users/signup', (req, res) => {
    console.log(req.body);
    const username = 'server';
    const email = req.body.email;
    const password = req.body.password;
  console.log('rec');
  if (!email || !password || !username) {
    res.send("Invalid REQUEST");
  } else {
    User.create({
      username: username,
      email: email,
      password: password
    },(error, result)=>{
      
    })
    const token = jwt.sign({ email }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });
    console.log("token:", token);
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
    console.log('cookie sent');
    // res.send('')
    res.redirect('/');
    
  }
})

router.post('/users/signin', (req, res)=>{

  console.log('hello')
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email,
    password: password
  },(error, fonundUser)=>{
    if(error){
      console.log('error')
      res.redirect('/signin');
    }
    if(fonundUser){
      res.render('home',fonundUser);
    } else{
      res.redirect('/signup');
    }
  })
})

module.exports = router


