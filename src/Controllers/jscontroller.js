const blogModel = require("../Models/BlogModel")
const authorModel = require("../Models/AuthorModel")

const getblog = async function (req,res) {
     let query = req.query
     let data = await blogModel.find({$and:[query,{isDeleted:false},{isPublished:true}]})
     
     if(!data) res.status(404).send({status:"False",msg:"The Data You Found Is not Present"})
     res.status(200).send({msg:"true",data:data})
}

module.exports.getblog=getblog