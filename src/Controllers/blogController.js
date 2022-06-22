const AuthorModel = require("../Models/AuthorModel");
const blogModel = require("../Models/BlogModel");
// written by Animesh
const createBlog = async function (req, res) {
  try {
    let data = req.body;

    let Id = data.AuthorId;
    let authId = await AuthorModel.findById(Id);
    // for required fields
    if (!("title" in data) || !("body" in data) || !("category" in data)) {
      return res.status(422).send({ msg: "required fields missing" });
    } else if (!authId) {
      return res.status(404).send({ msg: "Author does not exist" });
    } else if (
      data.AuthorId.trim() == "" ||
      data.title.trim() == "" ||
      data.body.trim() == "" ||
      data.catagory.trim() == ""
    ) {
      return res.status(400).send({ msg: "required fields(title,body,authorId,category) can not be empty" });
    } else {
      let savedData = await blogModel.create(data);
      res.status(201).send({ msg: savedData });
    }
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.createBlog = createBlog;



//vaishnavi   + error
const getblog = async function (req,res) {
  try{
  let query = req.query
  let data = await blogModel.find({$and:[query,{isDeleted:false},{isPublished:true}]});
  
  if(data.length==0)return res.status(404).send({status:"False",msg:"The Data You Found Is not Present"}) 

  if(Object.keys(req.query).length==0){
   return res.status(200).send({status:true,data:data})
  }else{
   if(req.query.tag ){
         const getblog = await blogModel.find({tag:{$in:[ req.query.tag]},isDeleted:false,isPublished:true});
         if(filterData.length==0) return res.status(404).send({status:false,msg:"not found blog"})
         return res.status(200).send({status:true,data:filterData})

   }else if (req.query.subcatogry){
         const getblog = await blogModel.find({subcategory:{$in:[ req.query.subcatogry ]},isDeleted:false, isPublished:true});
         if(filterData = await blogModel.find({subcategory:{$in: [ req.query.subcategory ]}, isDeleted:false, isPublished:true}));
         return res.status(200).send({status:true, data:filterData})
   
   }
   if (req.query.authorId){
         if(!mongoose.isValidObjectId(req.query.authorId))return res.status(400).send({status: false, msg:"please enter valid authorId"})

   }
   const getblog = await blogModel.find(req.query);
      const isDeletAndISpublished = filterData.filter(ele => !ele.isDeleted && ele.isPublished);
   if(filterData.length <= 0) return res.status(404).send({status:false, msg:"Not found blog"})
   return res.status(200).send({status:true, data:isDeletAndISpublished})

   }

}

catch (err) {
 console.log(err.message);
 res.status(500).send({ status: false, msg: err.message })
}

}



module.exports.getblog=getblog


// ### PUT /blogs/:blogId
//   - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
//   - Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
//   - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
//   - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
//   - Also make sure in the response you return the updated blog document. 
// written by aditya
const updateBlogsById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let data = req.body;

        // body can not be empty
        if (Object.keys(data).length == 0)
            return res.status(400).send({
                status: false,
                msg: "Body is required"
            });

        let blogData = await blogModel.findOne({
            _id: blogId,
            isDeleted: false
        });


        if (!blogData) return res.status(404).send({
            status: false,
            msg: "blogs-Id related data unavailable"
        })

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

        res.status(200).send({
            status: true,
            data: blogData
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            msg: error.message
        });
    }
};

module.exports.updateBlogsById = updateBlogsById


//written by samir


let isdeleted = async function (req, res) {
  try {
      let blogid = req.params.blogId;
      // blogid=mongoose.Schema.Types.objectId
    

      //    if blog id not found
      let findBlogId = await blogModel.findOne({ _id: blogid });

      if (!findBlogId)
          return res.status(404).send({ error: "Blog id not found" });

      // if blog id is already deleted
      let ifAlreadyDeleted = await blogModel.findOne({ _id: blogid }, { isDeleted: true })
      if (ifAlreadyDeleted.isDeleted) return res.status(200).send({ msg: "Blog is already deleted" })

      //    delet blog if it is not deleted
      let date=new Date()
      // console.log(date)
      let isDeleted = await blogModel.findOneAndUpdate(
          { _id: blogid, isDeleted: false },
          { $set: { isDeleted: true,deletedAt: date }},
          { new: true }
      );


      res.status(200).send()

  } catch (error) {
      res.status(500).send({ msg: error.message });
  }
};



module.exports.isdeleted = isdeleted




//written by all members

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



      let deletedBlog = await blogModel.updateMany({ _id: { $in: blog } }, { $set: { isDeleted: true, deletedAt: Date.now } }, { new: true })
      return res.status(200).send({ status: true, msg: "Blog deleted successfully", data: deletedBlog })

  }
  catch (err) {
      res.status(500).send({ msg: "Error", error: err.message })
  }


}

module.exports.deleteByQuarry = deleteByQuarry

















// ### GET /blogs
// - Returns all blogs in the collection that aren't deleted and are published
// - Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
// - If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
// - Filter blogs list by applying filters. Query param can have any combination of below filters.
//   - By author Id
//   - By category
//   - List of blogs that have a specific tag
//   - List of blogs that have a specific subcategory
// example of a query url: blogs?filtername=filtervalue&f2=fv2


