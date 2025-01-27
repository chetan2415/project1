const express=require("express");
const router=express.Router();
const User=require("../models/user.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", async(req,res)=>{
    let {username,email,password}=req.body;
    console.log('Request body:', req.body);
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password);
    console.log(email,username,password);
    console.log(registeredUser);
    res.redirect("/listings");
});

module.exports=router;