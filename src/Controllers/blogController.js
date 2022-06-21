const AuthorModel = require('../Models/AuthorModel');
const blogModel = require("../Models/BlogModel")


const createBlog = async function(req, res){

    try{
        let data = req.body
<<<<<<< HEAD
        let Id = data.AuthorId
        let authId = await AuthorModel.findById(Id) 
        
        if(!authId){
            res.status(404).send({msg: 'invalid ID'})
        }      
       
        else if (!('title' in data) || !('body' in data) || !('category' in data))
       { return res.status(422).send({ msg: "required fields missing" })
    
    }
    else if(data.AuthorId.trim() == "" || data.title.trim() == "" || data.body.trim() == "" || data.catagory.trim() == "" ){
    return res.status(400).send({ msg: "empty field" })}
=======
<<<<<<< HEAD
        let Id = data.authorId
        let authorId = await AuthorModel.findById(Id)
        if(!authId) res.status(400).send({msg:"The AuthorId That You Have written is Invalid"})
        publishedAt = new Date().to

=======
        authorid=req.body.authorid
        AuthorModel.
        if(authorid)
>>>>>>> b447c5d59a41677f0f94f628eac306572be16206
        let savedData = await blogModel.create(data)
>>>>>>> f5d8a8eb709e314c1350a024ded2de8821384d37

    else{ 
            let savedData = await blogModel.create(data)
            res.status(201).send({msg: savedData})
        
    }
    }
        catch(error){
        res.status(500).send({msg: error.message})
    }  
}












    
    module.exports.createBlog = createBlog