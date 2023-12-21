const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utilities/catchAsync.js');
const ExpressError=require('../utilities/ExpressError.js');
const Campground=require('../models/campground'); 
const campcontroll=require('../controllers/camp.js');
const {storage}=require('../cloudinary');
const multer=require('multer');
const upload=multer({storage: storage}); 

const session=require('express-session');
const flash=require('connect-flash');
const {isLoggedIn,isAuthor,validatecamp}=require('../middleware.js');
const app=express();
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

router.route('/')
    .get(catchAsync(campcontroll.index))
    .post(isLoggedIn,upload.array(`campground[image]`),validatecamp,catchAsync (campcontroll.newCamp));
   
router.get('/new',isLoggedIn,(req,res)=>
{
    res.render('./camp/new.ejs');
})

router.route('/:id')
   .get(catchAsync(campcontroll.viewCamp))         
   .put(isLoggedIn,upload.array(`campground[image]`),validatecamp,catchAsync (campcontroll.updateCampground))
   .delete(isLoggedIn,isAuthor,catchAsync(campcontroll.deleteCamp))  

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campcontroll.editCamp));
module.exports=router;