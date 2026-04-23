const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {listingSchema}=require("../schema.js");

const validateListing=(req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
    else{
        return next();
    }
};

router.get("/", wrapAsync(async(req, res, next)=>{
    let allListings=await Listing.find({});
    res.render("listings/index", {allListings});
}));

router.post("/", validateListing, wrapAsync(async(req, res, next)=>{
    let listing=new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

router.get("/new", (req, res)=>{
    res.render("listings/new");
});

router.get("/:id", wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
}));

router.put("/:id", validateListing, wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

router.get("/:id/edit", wrapAsync(async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing});
}));

module.exports=router;