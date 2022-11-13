let jwt = require("jsonwebtoken");
const blogModel = require("../Models/BlogModel");
const authorModel = require("../Models/AuthorModel");

let Authentication = async function (req, res, next) {
  try {
    let key = req.headers["x-api-key"];
    if (!key) key = req.headers["X-Api-Key"];
    if (!key)return res.status(400).send({status:false,message: "x-api-key header is required" });

    let isKeyTrue = jwt.verify(key, "Blog site project, team No.= 12");
    if (!isKeyTrue) return res.status(400).send({status:false, message: "invalid key" });
    req.body["loginUserId"]=isKeyTrue.id
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).send({ status:false,message: error.message });
  }
};

module.exports.Authentication = Authentication;

let Authorization = async function (req, res, next) {
  try {
   
    let loginUserId =req.body.loginUserId
    let  requestBlogId = req.params.blogId.toString();

    if (requestBlogId.length != 24)return res.status(400).send({status:false, message: "enter valid blogId" });

    let findAuthorID = await blogModel.findOne({ _id: requestBlogId });
    if (!findAuthorID) return res.status(404).send({status:false, message: "Blog not found " });

    let authorID = findAuthorID.authorId.toString();

    if (loginUserId != authorID)return res.status(403).send({status:false, message: "login user user is not authorized " });

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({status:false, message: error.message });
  }
};
module.exports.Authorization = Authorization;


let AuthorizationToQuery = async function (req, res, next) {
  try {
   
    let loginUserId =req.body.loginUserId
    requestAuthorId = req.body.authorId; 
    if (!requestAuthorId) requestAuthorId = req.query.authorId; 
    if (!requestAuthorId)
      return res.status(400).send({status:false, message: "please enter authorID" }); 

    if (requestAuthorId.length != 24)
      return res.status(400).send({status:false, message: "enter valid AuthorID" });

    let findAuthorID = await authorModel.findOne({ _id: requestAuthorId });
    if (!findAuthorID)return res.status(404).send({status:false, message: "Author id  not found " });

    if (loginUserId != requestAuthorId)return res.status(403).send({status:false, message: "login  user is not authorized " });

      next();

  } catch (error) {
    console.log(error);
    return res.status(500).send({status:false,message:error.message });
  }
};

module.exports.AuthorizationToQuery = AuthorizationToQuery;
