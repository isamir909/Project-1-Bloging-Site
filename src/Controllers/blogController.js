const { default: mongoose } = require("mongoose");
const { async } = require("replace/bin/shared-options");
const authorModel = require("../Models/AuthorModel");
const blogModel = require("../Models/BlogModel");
// written by Animesh

const createBlog = async function (req, res) {
  try {
    let data = req.body;

    let Id = data.authorId;
    let authId = await authorModel.findById(Id);
    // for required fields
    if (Object.keys(data).length == 0)
      return res.status(400).send({ msg: "Object can not be empty" });
    else if (!("title" in data) || !("body" in data) || !("category" in data)) {
      return res.status(422).send({ msg: "required fields missing" });
    } else if (!authId) {
      return res.status(404).send({ msg: "Author does not exist" });
    } else if (
      data.authorId.trim() == "" ||
      data.title.trim() == "" ||
      data.body.trim() == "" ||
      data.category.length == 0
    ) {
      return res.status(400).send({
        msg: "required fields(title,body,authorId,category) can not be empty",
      });
    } else {
      let savedData = await blogModel.create(data);
      return res.status(201).send({ msg: savedData });
    }
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

module.exports.createBlog = createBlog;

// written by aditya
const updateBlogsById = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;

    // if(!blogId)
    // body can not be empty
    if (Object.keys(data).length == 0)
      return res.status(400).send({
        status: false,
        msg: "Body is required",
      });

    let blogData = await blogModel.findOne({
      _id: blogId,
      isDeleted: false,
    });

    if (!blogData)
      return res.status(404).send({
        status: false,
        msg: "blogs-Id not found",
      });

    if (data.title) blogData.title = data.title;
    if (data.body) blogData.body = data.body;
    if (data.category) blogData.category = data.category;

    if (data.tags) {
      if (typeof data.tags == "object") {
        blogData.tags.push(...data.tags);
      } else {
        blogData.tags.push(data.tags);
      }
    }
    if (data.subcategory) {
      if (typeof data.subcategory == "object") {
        blogData.subcategory.push(...data.subcategory);
      } else {
        blogData.subcategory.push(data.subcategory);
      }
    }
    blogData.publishedAt = Date(); //Fri Apr 29 2022 11:14:26 GMT+0530 (India Standard Time)
    blogData.isPublished = true;
    blogData.save();

    res.status(200).send({ status: true, data: blogData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.updateBlogsById = updateBlogsById;

//written by aditya
let getBlogs = async function (req, res) {
  try {
    let category = req.query.category;
    let authorId = req.query.authorId;
    let subcategory = req.query.subcategory;
    let tags = req.query.tags;

    let obj = {
      isDeleted: false,
      isPublished: true,
    };
    if (authorId) {
      obj.authorId = authorId;
      console.log(authorId);
    }
    if (category) {
      obj.category = category;
    }
    if (tags) {
      obj.tags = tags;
    }
    if (subcategory) {
      obj.subcategory = subcategory;
    }
    let data = await blogModel.find(obj);
    if (data.length == 0) {
      return res
        .status(404)
        .send({
          status: false,
          msg: "No Blog Found with provided information",
        });
    } else {
      return res.status(200).send({ status: true, msg: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports.getBlogs = getBlogs;
//written by samir

let isdeleted = async function (req, res) {
  try {
    let blogid = req.params.blogId;
    if(!blogid) return res.status(400).send({err:"please enter blogid "})


    //    if blog id not found
    let findBlogId = await blogModel.findOne({ _id: blogid });

    if (!findBlogId)
      return res.status(404).send({ error: "Blog id not found" });

    // if blog id is already deleted
    // let ifAlreadyDeleted = await blogModel.findOne(
    //   { _id: blogid },
    //   { isDeleted: true }
    // );

    //    delete blog if it is not deleted
    let date = new Date();
    // console.log(date)
    let isDeleted = await blogModel.findOneAndUpdate(
      { _id: blogid, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true }
    );

    res.status(200).send();
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

module.exports.isdeleted = isdeleted;





// //written by all members
let deleteByQuarry = async function (req, res) {

  try {
      let data = req.query


      let { authorId, category, subcategory, tags, isPublished } = data

      let filter = { isDeleted: false, isPublished: true }

      const idPresent = function (value) {

          if (typeof value === 'undefined' || value === null) {
              return false
          }
          if (typeof value === 'string' && value.trim().length == 0) {
              return false
          }
          return true

      }

      const authorIdPresent = function (objectId) {

          return mongoose.Types.ObjectId.idPresent(objectId)
      }


      const validRequest = function (data) {
          return Object.keys(data).length > 0
      }


      if (!validRequest(data)) {
          return res.status(400).send({ status: false, msg: "No query param received. Please query details" })
      }

      if (!(authorIdPresent)) {
          return res.status(400).send({ sttaus: false, msg: ` please enter a valid author Id` });
      }

      if (idPresent(authorId) && validRequest(authorId)) {
          filter["authorId"] = authorId
      }
      if (idPresent(category)) {
          filter["category"] = category
      }
      if (idPresent(subcategory)) {
          filter["subcategory"] = subcategory
      }
      if (idPresent(tags)) {
          filter["tags"] = subcategory
      }


      let blog = await blogModel.find(filter)

      if (blog && blog.length == 0) {
          return res.status(404).send({ status: false, msg: "No such document exist or it may be deleted" })
      }

      

      let deletedBlog = await blogModel.updateMany({ _id: { $in: blog } }, { $set: { isDeleted: true, deletedAt: new Date()} }, { new: true })
      return res.status(200).send({ status: true, msg: "Blog deleted successfully", data: deletedBlog })

  }
  catch (err) {
      res.status(500).send({ msg: "Error", error: err.message })
  }


}

module.exports.deleteByQuarry = deleteByQuarry