const Campground=require('../models/campground');  
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapboxToken});
const {cloudinary}=require("../cloudinary");
const Joi=require('joi');



module.exports.index=async (req,res)=>
{
    const campground=await Campground.find({});
    res.render('./camp/home.ejs',{campground});
}

module.exports.newCamp=async(req,res,next)=>
{
    const geodata=await geocoder.forwardGeocode({
        query: req.body.campground.Location,
        limit: 1
    }).send();
    const newCamp=new Campground(req.body.campground);
    newCamp.geometry=geodata.body.features[0].geometry;
    newCamp.images= req.files.map(f=>({url:f.path,filename:f.filename}));
    newCamp.author=req.user._id;
    await newCamp.save();
    console.log(newCamp);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${newCamp._id}`);
   
}

module.exports.viewCamp=async(req,res,next)=>
{
    const camp=await Campground.findById(req.params.id).
    populate({path:'reviews',
    populate:{
        path:'author'
    }}).populate('author');
    if(!camp)
    {
        req.flash('error',"Sorry, Camp doesn't exist");
        res.redirect('/campground');
    }
    console.log(camp);
    res.render('./camp/show.ejs',{camp});
 
}

module.exports.editCamp=async(req,res,next)=>
{
    const camp=await Campground.findById(req.params.id);
    if(!camp)
    {
        req.flash('error',"Sorry, Camp doesn't exist");
        res.redirect('/campground');
    }
    
    res.render('./camp/edit.ejs',{camp});
 
}
module.exports.updateCampground = async(req, res,next) => {
    const { id } = req.params;
    console.log(req.body);
    const foundCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await foundCamp.images.push(...imgs);        //adding to already existing imgs , using spread operator (...) to not pass an array of array 
    await foundCamp.save();

    if (req.body.deleteImg) {
        for (let filename of req.body.deleteImg) {
            await cloudinary.uploader.destroy(filename);
        }
        await foundCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImg } } } })
        console.log(foundCamp);
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campground/${id}`);
}

module.exports.deleteCamp=async (req,res)=>
{
    const delCamp=await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campground');
}