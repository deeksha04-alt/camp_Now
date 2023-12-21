const mongoose=require('mongoose');
const Campground=require('../models/campground');          //schema connection
const cities=require('./cities');
const {places,descriptors}=require('./helper');


mongoose.connect('mongodb://127.0.0.1:27017/yelmCamp')     //connection check
.then(()=>
{
    console.log("connection established");
})
.catch(err=>
{
    console.log("error establishing connection");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB=async()=>
{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const randnum=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+1000;
        const camp=new Campground({
            author:"6543c2edf35e431204d985ac",
            title: `${sample(descriptors)} ${sample(places)}`,
            Location: `${cities[randnum].city},${cities[randnum].state}`,
            description: "beautiful lush green",
            price: `${price}`,
            geometry: 
            {
                type:"Point",
                coordinates: [cities[randnum].longitude,cities[randnum].latitude]
            },
            images:
            [
                {
                    url: 'https://res.cloudinary.com/dna19owrn/image/upload/v1699860392/YalmCamp/nykzm4npt7dhirhjd3hu.jpg',
                    filename: 'YalmCamp/nykzm4npt7dhirhjd3hu'
                },
                {
                    url: 'https://res.cloudinary.com/dna19owrn/image/upload/v1699853042/YalmCamp/ivq0fafbcxuqqaxl9mbq.jpg',
                    filename: 'YalmCamp/ivq0fafbcxuqqaxl9mbq'
                } 
            ]
        })
    await camp.save();
    }
}
seedDB().then(()=>
{
    mongoose.connection.close();
});