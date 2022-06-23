const { application } = require("express");
const express = require("express")
const router = express.Router();
const authorController = require("../Controllers/authorController");
const blogController = require("../Controllers/blogController");
const {Authentication, Authorization} = require("../middleware/authentication");

// const deletecontroller= require("../Controllers/delete")



// create a blog, edit a blog, get the list of blogs, delete a blog(s)


router.post("/blogs",Authentication,blogController.createBlog) // code done , authentication done
router.post("/authors", authorController.createAuthor);   
router.get("/blogs",Authentication, blogController.getblog); //error in code
router.put("/blogs/:blogId",Authentication,blogController.updateBlogsById) // code done , authentication to be check
router.delete("/blogs/:blogId",Authentication,blogController.isdeleted);  //  code done , authentication to be check 
router.delete("/blogs",Authentication, blogController.deleteByQuarry)  //to be check code and Authentication

router.post("/login",authorController.loginauth) //done all 

module.exports = router;
