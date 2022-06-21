const mongoose = require('mongoose')


const AuthorSchema = new mongoose.schema({

    title:{
        require: true,
        enum: ['Mr','Miss','Miss']
    },
    
    firstName:{
        type: String,
        require: true
    },

    LastName:{
        type: String,
        require:true
    },

    email:{
        unique:true,
        require:true
    },

    password:{
        type:String,
        require:true
    }
},{timestamps:true});


module.exports = mongoose.model('Author',AuthorSchema)
