const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const express=require("express");
const app=express();

let port=3000;

const MONGO_URL="mongodb://127.0.0.1:27017/stayora";

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

app.get("/", (req, res)=>{
    res.send("Hi, I am root!");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.use((req, res, next)=>{
    return next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"}=err;
    res.status(statusCode).render("error", {message});
});

app.listen(port, ()=>{
    console.log(`app is listening on port: ${port}`);
});