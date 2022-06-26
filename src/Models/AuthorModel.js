const mongoose = require('mongoose');


const AuthorSchema = new mongoose.Schema({
   
    title:{
        type:String,
        required: true,
        enum: ["Mr","Mrs","Miss"]
    },
    
    fname:{
        type: String,
        required: true
    },

    lname:{
        type: String,
        required:true
    },

    email:{
        type:String,
        unique:true,
        required:true
    },

    password:{
        type:String,
        required:true
    },
},{timestamps:true});


module.exports = mongoose.model('Author',AuthorSchema)
