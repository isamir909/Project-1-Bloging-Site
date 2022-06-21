const AuthorModel = require("../Models/AuthorModel")
const BlogModel = require("../Models/BlogModel")

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


    // const createBlogData = async function (req,res){

    // try{
    //     let data = req.body;
    //     let Id = data.authorId;
    //     if(!Id){
    //         res.status(400).send("enter author id")
    //         return;
    //     }
    //     let authorId = await AuthorModel.findById(Id);
    //     if(!authorId){
    //         res.send(400).send("please enter valid Id")
    //     }
    //     let result = await BlogModel.create(data)
    //     res.status(201).send({
    //         status:true,
    //         data:result
    //     })
    // }catch(err){
    //     res.status(500).send({
    //         status:false,
    //         msg:err.message
    //     })
    // }
    // }
    const blogUpdate = async function (req,res){
        try{
            let id = req.params.BlogModel
            let findid = await BlogModel.findById (id)
            let (findId) = res.status(400).send({status:"False",message:"Id not exits"})
            let data = req.body
            let dataToUpdate = await BlogModel.findOneAndUpdate({_id:id},data,{new:true})
                res.status(201).send({status:"True",data:dataToUpdated}) 

        }
        catch(err){
            res.status(500).send({
            status:false,
            msg:err.message
            })
    }
    }


    module.exports.createBlog = createBlog
    module.exports.createBlogData = createBlogData
    module.exports.blogUpdate = blogUpdate