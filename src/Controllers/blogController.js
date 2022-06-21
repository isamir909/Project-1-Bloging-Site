const AuthorModel = require("../Models/AuthorModel")
const blogModel = require("../Models/BlogModel")

const createBlog = async function(req, res){

    try{
        let data = req.body
        authorid=req.body.authorid
        AuthorModel.
        if(authorid)
        let savedData = await blogModel.create(data)

        res.status(201).send({msg: savedData})
        }
        catch(error){
        res.status(500).send({msg: err})
    }
    }

    module.exports.createBlog = createBlog