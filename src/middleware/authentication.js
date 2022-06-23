let jwt = require("jsonwebtoken");


let Authentication= async function (req,res,next){
try {

    let key=req.headers["x-api-key"]
    if(!key) key=req.headers["X-Api-Key"]
    if(!key ) return res.status(400).send({msg:"x-api-key header is required"})

    let isKeyTrue= jwt.verify(key, "Blog site project, team No.= 12")
    if(!isKeyTrue) return res.status(400).send({err:"invalid key"})

    next();
}
catch (error) {
    return res.status(500).send({err:error.message})
}
}

module.exports.Authentication=Authentication