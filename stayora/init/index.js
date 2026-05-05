const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const initData=require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/stayora";

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB=async ()=>{
    await Listing.deleteMany({});
    await Review.deleteMany({});
    initData.data=initData.data.map((el)=>({...el, owner:"69f462bb94aa1c40c56eac5d"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();