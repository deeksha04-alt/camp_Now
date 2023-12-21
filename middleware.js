const {campSchema,reviewSchema}=require('./schema_validator.js');
const ExpressError=require('./utilities/ExpressError.js');
const Campground=require('./models/campground.js')
const Review=require('./models/review.js')

module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.returnTo=req.originalUrl;
        req.flash('error','you need to be logged in!!');
        return res.redirect('/user/login');
    }
    next();
}

//since the req.session.returnTo ==> this states automatically gets deleted so we made a middleware 
//to store the info of req.session.returnTo and save it into locals
//req.user ==> contains info abt all the fields of that concerned schema

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validatecamp=(req,res,next)=>         
{
    const {error}=campSchema.validate(req.body);
    console.log(req.body)
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else    
    {
        next();
    }
}
module.exports.isAuthor=async (req,res,next)=>
{
    const user1=await Campground.findById(req.params.id);
    if(!user1.author.equals(req.user._id))
    {
        req.flash('error','Access denied');
        return res.redirect('/campground');
    }
    next();
}

module.exports.validateReview=(req,res,next)=>
{
    const {error}=reviewSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else
    {
        next();
    }
}

module.exports.isRevAuthor= async (req,res,next)=>
{
    const {id}=req.params;
    const revAuth=await Review.findById(req.params.rid);
    if(!revAuth.author.equals(req.user._id))
    {
        req.flash('error','Access denied')
        return res.redirect(`/campground/${id}`);
    }
    next();
}