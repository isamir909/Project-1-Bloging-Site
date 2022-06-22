const { application } = require("express");
const express = require("express");
const router = express.Router();
const authorController = require("../Controllers/authorController");
const blogController = require("../Controllers/blogController");

const deletecontroller= require("../Controllers/delete")






router.post("/blogs",blogController.createBlog) //done
router.post("/authors", authorController.createAuthor);   //done
router.get("/blogs", blogController.getblog); //error
router.put("/blogs/:blogId",blogController.updateBlogsById) //done
router.delete("/blogs/:blogId",blogController.isdeleted);    //done
router.delete("/blogs", blogController.deleteByQuarry)  //to be check

module.exports = router;
