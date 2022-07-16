let jwt = require("jsonwebtoken");
const blogModel = require("../Models/BlogModel");
const authorModel = require("../Models/AuthorModel");

let Authentication = async function (req, res, next) {
  try {
    let key = req.headers["x-api-key"];
    if (!key) key = req.headers["X-Api-Key"];
    if (!key)
      return res.status(400).send({ msg: "x-api-key header is required" });

    let isKeyTrue = jwt.verify(key, "Blog site project, team No.= 12");
    if (!isKeyTrue) return res.status(400).send({ err: "invalid key" });

    next();
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
};

module.exports.Authentication = Authentication;

let Authorization = async function (req, res, next) {
  try {
    let logedInUserKey = req.headers["x-api-key"] || req.headers["X-Api-Key"];

    let decodeToken = jwt.verify(
      logedInUserKey,
      "Blog site project, team No.= 12"
    );
    logedinUserID = decodeToken.id;

    requestBlogId = req.params.blogId.toString();
    if (requestBlogId.length != 24) 
      return res.status(400).send({ msg: "enter valit blogid" });

    findAuthorID = await blogModel.findOne({ _id: requestBlogId });
    if (!findAuthorID) return res.status(404).send({ err: "id not found " });

    let authorID = findAuthorID.authorId.toString();

    if (logedinUserID != authorID)
      return res.status(403).send({ msg: "logedin user is not authorized " });

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
};
module.exports.Authorization = Authorization;

// Authorization for creating blog

let AuthorizationToQuary = async function (req, res, next) {
  try {
    let logedInUserKey = req.headers["x-api-key"] || req.headers["X-Api-Key"];

    let decodeToken = jwt.verify(
      logedInUserKey,
      "Blog site project, team No.= 12"
    );
    logedinUserID = decodeToken.id;

    requestAuthorId = req.body.authorId; 
    if (!requestAuthorId) requestAuthorId = req.query.authorId; 
    if (!requestAuthorId)
      return res.status(400).send({ err: "please enter authorID" }); 

    if (requestAuthorId.length != 24)
      return res.status(400).send({ msg: "enter valid AuthorID" });

    findAuthorID = await authorModel.findOne({ _id: requestAuthorId });
    if (!findAuthorID)
      return res.status(404).send({ err: "Author id  not found " });

    let authorID = findAuthorID._id.toString();

    if (logedinUserID != authorID)
      return res
        .status(403)
        .send({ msg: "logedin user is not authorized To create blog " });

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
};

module.exports.AuthorizationToQuary = AuthorizationToQuary;
