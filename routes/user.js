const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utilities/catchAsync.js');
const ExpressError=require('../utilities/ExpressError.js');
const User=require('../models/user');  
const session=require('express-session');
const flash=require('connect-flash');
const app=express();
const passport=require('passport');
const localStrategy=require('passport-local');
const {isLoggedIn}=require('../middleware.js');
const {storeReturnTo}=require('../middleware.js');
const userControll=require('../controllers/users.js')



app.use(flash());
app.use(passport.initialize()); 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());       //tells how do we store the user into session
passport.deserializeUser(User.deserializeUser());   //how do we unstore user out of session

router.route('/register')
    .get((req,res,next)=>
    {
        res.render('../views/users/reg.ejs');
    })
    .post(catchAsync(userControll.userRegister));

router.route('/login')
    .get((req,res,next)=>
    {
        res.render('../views/users/login.ejs')
    })
    .post(storeReturnTo,passport.authenticate('local',{failureFlash: true,failureRedirect:'/user/login'}), catchAsync(userControll.userLogin));

router.get('/logout',isLoggedIn,catchAsync(userControll.userLogout));
module.exports=router;