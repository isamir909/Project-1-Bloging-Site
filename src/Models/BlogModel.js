const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Type.ObjectId

const BlogSchema = new mongoose.schema({

    title:{
        require: true,
        type:String
    },
    body:{
        require:true,
        type:String
    },
    Author:{
        type:ObjectId,
        ref:"Author"
    },
    tags:[String],
    catagory:{
        type:String,
        require:true
    },
    subcatagory:[String],
    deleteAt:{
        type:Boolean,
        default:false
    },
    publishedAt:{
        type:Boolean,
        default:false
    },


},{timestamps:true})
module.exports = mongoose.model('Blog',BlogSchema)