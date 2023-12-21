const express=require('express');
const router=express.Router({mergeParams:true});        //the params from index would me merged to it and could be used while hitting the routes
const catchAsync=require('../utilities/catchAsync.js');
const Campground=require('../models/campground');  
const Review=require('../models/review.js');
const {reviewSchema}=require('../schema_validator.js');
const {isLoggedIn,validateReview,isRevAuthor}=require('../middleware.js');
const revController=require('../controllers/review.js')
const app=express();
const session=require('express-session');
const flash=require('connect-flash');
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash())


//to add reviews to camps
router.post('/',isLoggedIn,validateReview,catchAsync(revController.addReview))


//to delete review of a prod
router.delete('/:rid',isLoggedIn,isRevAuthor,catchAsync(revController.delReview));

module.exports=router;