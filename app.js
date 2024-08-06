const express=require("express");
const app = express();
const port=8080;
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session =require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const Localstratogy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./router/listing.js");
const reviewsRouter=require("./router/review.js");
const userRouter=require("./router/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


main().then(()=>{
    console.log("working db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust1");
};

const sessionOptions={
    secret:"mysupersecertcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstratogy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

///app.get("/demouser",async (req,res)=>{
   /// let newuser=new User({
      ///  email:"student@thormail.com",
        ///username:"Thor-student",
    ///});
    ///let registerUser=await User.register(newuser,"hellostudent");
    //res.send(registerUser);
//});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


///basic code
app.get("/",(req,res)=>{
    res.send("Iam port");
});




app.all("*",(req,res,next)=>{
    next(new ExpressError (404,"page not found!"))
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!"}=err;
    res.status(status).render("error.ejs",{message});
    ///res.status(status).send(message);
});

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
});