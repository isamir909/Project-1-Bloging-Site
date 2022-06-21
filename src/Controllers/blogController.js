const AuthorModel = require("../Models/AuthorModel")
const blogModel = require("../Models/BlogModel")

const createBlog = async function(req, res){

    try{
        let data = req.body
        let Id = data.authorId
        let authorId = await AuthorModel.findById(Id)
        if(!authId) res.status(400).send({msg:"The AuthorId That You Have written is Invalid"})
        publishedAt = new Date().to

        let savedData = await blogModel.create(data)

        res.status(201).send({msg: savedData})
        }
        catch(error){
        res.status(500).send({msg: err})
    }
    }











    
    module.exports.createBlog = createBlog