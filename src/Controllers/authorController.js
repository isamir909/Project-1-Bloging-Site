const authorModel = require("../Models/AuthorModel")



const createAuthor = async function(req, res){

    try{
    let data = req.body
    let savedData = await authorModel.create(data)
    res.status(201).send({msg: savedData})
    }
    catch(error){
    res.status(500).send({msg: error.message})
}
}



module.exports.createAuthor = createAuthor

