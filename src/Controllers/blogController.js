const blogModel = require("../Models/BlogModel")

const createBlog = async function(req, res){

    try{
        let data = req.body
        let savedData = await blogModel.create(data)
        res.status(200).send({msg: savedData})
        }
        catch(error){
        res.status(500).send({msg: err})
    }
    }

    module.exports.createBlog = createBlog