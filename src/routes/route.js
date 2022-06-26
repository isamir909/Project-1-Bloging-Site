const { application } = require("express");
const express = require("express")
const router = express.Router();
const authorController = require("../Controllers/authorController");
const blogController = require("../Controllers/blogController");
const { Authentication, Authorization,AuthorizationToCreate } = require("../middleware/authentication");





// create a blog, edit a blog, get the list of blogs, delete a blog(s)


router.post("/blogs", Authentication,AuthorizationToCreate, blogController.createBlog) 
router.post("/authors", authorController.createAuthor);  
router.post("/login", authorController.loginauth) 
router.get("/blogs",Authentication,blogController.getBlogs); //error in code


router.put("/blogs/:blogId",Authentication,Authorization, blogController.updateBlogsById) 

router.delete("/blogs/:blogId", Authentication, Authorization, blogController.isdeleted); 
router.delete("/blogs", Authentication, blogController.deleteByQuarry)  //



module.exports = router;

