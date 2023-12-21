const Review=require('../models/review');
const Campground=require('../models/campground');  
const User=require('../models/user'); 

module.exports.userRegister=async (req,res,next)=>
{
    try{
        const newUser=new User({email:req.body.mail,username:req.body.username});
        const registUser=await User.register(newUser,req.body.password);
        req.login(registUser,err=>
    {
        if(err) return next(err);
        req.flash('message','signed up successfully!!')
        res.redirect('/campground');
    })   
    }
    catch(e)
    {
        req.flash('error','Account already exists !!')
        res.redirect('/user/register');
    }
}
module.exports.userLogin=async (req,res,next)=>
{
    req.flash('message','successfully logged in !!!');
    const redirectUrl=res.locals.returnTo || '/campground';
    res.redirect(redirectUrl); 
}
module.exports.userLogout=async (req,res,next)=>
{
    req.logout(function(err)
    {
        if(err)
        {
            return next(err);
        }
        req.flash('success','logged out successfully');
        res.redirect('/user/login');
    });
}