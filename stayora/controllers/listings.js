const Listing=require("../models/listing.js");

module.exports.index=async(req, res, next)=>{
    let allListings=await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.createListing=async(req, res, next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderNewForm=(req, res)=>{
    res.render("listings/new");
};

module.exports.showListing=async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews", populate:"author"}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
};

module.exports.updateListing=async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req, res, next)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req, res, next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing});
};