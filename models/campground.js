const mongoose=require('mongoose');
const Review = require('./review')

const imageSchema=new mongoose.Schema({
    url:String,
    filename: String
});

//lightweight to just get the url nd make changes in it
imageSchema.virtual('thumbnail').get(function()
{
    return this.url.replace('/upload','/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };
const campSchema=new mongoose.Schema
({
    title:{ type:String, required:true},
    images: [imageSchema],
    price:{type: Number},
    geometry:
    {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
            },
            coordinates: {
            type: [Number],
            required: true
            }
    },
    description:{type:String,required:true},
    Location:{type:String},
    author:{type:mongoose.Schema.ObjectId,ref:'User'},
    reviews:[{type:mongoose.Schema.ObjectId,ref:'Review'}]

},opts);


campSchema.virtual('properties.mark').get(function()            //adding virtuals
{
    return `<a href="/campground/${this._id}">${this.title}</a>`
});
campSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('Campground',campSchema) ;