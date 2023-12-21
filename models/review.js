const mongoose=require('mongoose');
const reviewSchema=new mongoose.Schema(
    {
        body:{type:String ,required:true},
        rating:Number,
        author:{type:mongoose.Schema.ObjectId,ref:'User'}
    }
);
const Review=mongoose.model('Review',reviewSchema);

module.exports=Review;