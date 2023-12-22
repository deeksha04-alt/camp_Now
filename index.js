if(process.env.NODE_ENV!="production")
{
    require('dotenv').config();
}

const mongoose=require('mongoose');
const express=require('express');
const session = require('express-session');
const flash=require('connect-flash');
const path=require('path');
const app=express();
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const ExpressError=require('./utilities/ExpressError.js');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user.js');
const sanitize=require('express-mongo-sanitize');    //prevent mongoose injection
const campground=require('./routes/camp.js');
const review=require('./routes/review.js');
const user=require('./routes/user.js');

const dbURL=process.env.DB_URL;
const MongoStore = require('connect-mongo');
mongoose.connect(dbURL).then(()=>                   //connection check
{
    console.log("connection established");
})
.catch(err=>
{
    console.log("error establishing connection");
});


app.engine('ejs',ejsMate);                          //to set up connection wd ejs mate
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));


app.use(express.urlencoded({extended: true}));      //for taking req.params 
app.use(methodOverride('_method'));
app.use(express.static('public'));                  //setting up paths for views and public
app.use(express.static(path.join(__dirname,'public')));
app.use(sanitize());

const store = MongoStore.create({                   //to set up sessions
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
    store: store,
    name:"session" ,     
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());                     //should b used after session 
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());       //tells how do we store the user into session
passport.deserializeUser(User.deserializeUser());   //how do we unstore user out of session


app.use((req,res,next)=>{
    res.locals.curUser=req.user;
    res.locals.message=req.flash('message');
    res.locals.error=req.flash('error');
    next();
})

app.use('/campground',campground);
app.use('/campground/:id/review',review);
app.use('/user',user);



app.get('/',(req,res,next)=>
{
    try{
        res.render('./camp/landing.ejs');
    }
    catch(e)
    {
        next(e);
    }
})

app.delete('/campground/:id',async (req,res)=>
{
    const {id}=req.params;
    console.log("deleting");
    const deletedCamp=await Campground.findByIdAndDelete(id);
    res.redirect('/campground');

})
app.all('*',(req,res,next)=>
{
    next(new ExpressError('page not found',404));
})

app.use((err,req,res,next)=>        //error handling middleware
{
    const {statuscode=500}=err;
    if(!err.message)    err.message="sorry error!!";
    res.status(statuscode).render('error',{err})
})

const port=process.env.PORT||3100;
app.listen(port,()=>{
    console.log(`Listening on ${port}`);
})
