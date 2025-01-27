const express = require("express");
const router = express.Router();

const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema , ReviewSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate (req.body.listing);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } 
    else{
        next();
    }
};


router.get("/", wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("\listings/index.ejs",{allListings});
}));

///new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});


///show route
router.get("/:id",
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=
    await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","The listing you are trying to access is not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

///create route
router.post("/",wrapAsync(async (req,res,next)=>{   
        const newListing=new Listing(req.body.listing) ;
        await newListing.save();
        req.flash("success","New listing is created successfully");
        res.redirect("/listings");
}));

///edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","The listing you are trying to access is not exist");
        return res.redirect("/listings");
    }
     res.render("listings/edit.ejs",{listing});
}));

////update route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
}));

///delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","listing was deleted successfully");
    res.redirect("/listings");
}));

module.exports=router;