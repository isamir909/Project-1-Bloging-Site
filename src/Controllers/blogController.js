const { default: mongoose } = require("mongoose");
const authorModel = require("../Models/AuthorModel");
const blogModel = require("../Models/BlogModel");
const { isValid } = require("../validator/validations")


const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let Id = data.authorId;


    // for required fields
    if (Object.keys(data).length == 0)return res.status(400).send({ status: false, msg: "Object can not be empty" });

    if (Id.length != 24) {return res.status(400).send({ status: false, msg: "invalid authorId" })}

    let authId = await authorModel.findById(Id);
    if (!authId) {return res.status(404).send({ status: false, msg: "Author does not exist" })}

    if(!isValid(data.title))return res.status(400).send({status: false,msg: "title is required"})
    if(!isValid(data.body))return res.status(400).send({status: false,msg: "body is required "})
    if(!isValid(data.category))return res.status(400).send({status: false,msg: "category is required"})
   

    if (data.isPublished) {
      let date = new Date();
      data["publishedAt"] = date;
    }

    {
      let savedData = await blogModel.create(data);
      return res.status(201).send({ status: true, data: savedData });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createBlog = createBlog;

const updateBlogsById = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;

    // body can not be empty
    if (Object.keys(data).length == 0)return res.status(400).send({status: false,msg: "Body is required"});

    let blogData = await blogModel.findOne( { _id: blogId,isDeleted: false } );
    if (!blogData)return res.status(404).send({status: false,msg: "blog not found"});

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
    
    blogData.publishedAt = Date();
    blogData.isPublished = true;
    await blogData.save();

    res.status(200).send({ status: true, data: blogData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.updateBlogsById = updateBlogsById;

let getBlogs = async function (req, res) {
  try {
    let category = req.query.category;
    let authorId = req.query.authorId;
    let subcategory = req.query.subcategory;
    let tags = req.query.tags;

    let filter = {
      isDeleted: false,
      isPublished: true,
    };

    if (authorId) {
      if (authorId.length != 24) {return res.status(400).send({ status: false, msg: "invalid authorId" })}
      filter.authorId = authorId;
    }

    if (category) {
      filter.category = category;
    }

    if (tags) {
      filter.tags = tags;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    let data = await blogModel.find(filter);
    if (data.length == 0) {return res.status(404).send({status: false,msg: "No Blog Found"})} 
    return res.status(200).send({ status: true, data: data })

  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err.message });
  }
}

module.exports.getBlogs = getBlogs;

let deleteById = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if(!blogId)return res.status(400).send({ status: false, msg: "please enter blogId " });

    let findBlogId = await blogModel.findOne({ _id: blogId,isDeleted:false });
    if (!findBlogId)return res.status(404).send({ status: false, msg: "Blog  not found" });

 
    // delete blog if it is not deleted
    let date = new Date();
   
    let isDeleted = await blogModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true }
    );

  res.status(204).send()} 
  catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.deleteById = deleteById;



let deleteByQuarry = async function (req, res) {
  try {
    let data = req.query;
    let { authorId, category, subcategory, tags, isPublished } = data;
    let filter = { isDeleted: false, isPublished: true };

    const idPresent = function (value) {
      if (typeof value === "undefined" || value === null) {return false}
      if (typeof value === "string" && value.trim().length == 0) {return false}
      return true;
    };

    const authorIdPresent = function (objectId) {return mongoose.Types.ObjectId.idPresent(objectId)};

    const validRequest = function (data) {
      return Object.keys(data).length > 0;
    };

    if (!validRequest(data)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "No query param received. Please query details",
        });
    }

    if (!authorIdPresent) {return res.status(400).send({ status: false, message: ` please enter a valid author Id` })}

    if (idPresent(authorId) && validRequest(authorId)) {
      filter["authorId"] = authorId;
    }
    if (idPresent(category)) {
      filter["category"] = category;
    }
    if (idPresent(subcategory)) {
      const subarray = subcategory
        .trim()
        .split(",")
        .map((subcat) => subcat.trim());
      filter["subcategory"] = { $all: subcategory };
    }
    if (idPresent(tags)) {
      const tagarray = tags
        .trim()
        .split(",")
        .map((tag) => tag.trim());
      filter["tags"] = { $all: tags };
    }

    let blog = await blogModel.find(filter);

    if (blog && blog.length == 0) {
      return res.status(404).send({
        status: false,
        msg: "No such document exist or it may be deleted",
      });
    }

    let deletedBlog = await blogModel.updateMany(
      { _id: { $in: blog } },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      datamsg: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.deleteByQuarry = deleteByQuarry;
