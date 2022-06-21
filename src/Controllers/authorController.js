const authorModel = require("../Models/AuthorModel")



const createAuthor = async function(req, res){

    try{
    let data = req.body
    let savedData = await authorModel.create(data)
    res.status(200).send({msg: savedData})
    }
    catch(error){
    res.status(500).send({msg: err})
}
}



module.exports.createAuthor = createAuthor

