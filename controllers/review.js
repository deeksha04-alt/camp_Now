const Review=require('../models/review');
const Campground=require('../models/campground');  

module.exports.addReview=async (req,res,next)=>
{
    const newRev=new Review(req.body.review);
    const camp=await Campground.findById(req.params.id);
    camp.reviews.push(newRev);
    newRev.author=req.user._id;
    await camp.save();
    await newRev.save();
    req.flash('message','Review Added');
    res.redirect(`/campground/${camp._id}`);
} 

module.exports.delReview=async (req,res,next)=>
{
    const delrev=await Review.findByIdAndDelete(req.params.rid);
    const postdelcamp=await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.rid}});
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campground/${postdelcamp._id}`);
}