const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");

router.get("/", wrapAsync(async(req, res, next)=>{
    let allListings=await Listing.find({});
    res.render("listings/index", {allListings});
}));

router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next)=>{
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

router.get("/new", isLoggedIn, (req, res)=>{
    res.render("listings/new");
});

router.get("/:id", wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews", populate:"author"}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
}));

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing});
}));

module.exports=router;