const { application } = require("express");
const express = require("express");
const router = express.Router();
const authorController = require("../Controllers/authorController");
const blogController = require("../Controllers/blogController");
const { Authentication, Authorization,AuthorizationToQuery } = require("../middleware/authentication");

//....................create blog........../
router.post("/blogs", Authentication,AuthorizationToQuery, blogController.createBlog); 

//....................create Author........../
router.post("/authors", authorController.createAuthor); 

//....................Author login........../
router.post("/login", authorController.loginAuthor); 

//....................get blog........../
router.get("/blogs",Authentication,blogController.getBlogs);

//....................update blog by id........../
router.put("/blogs/:blogId",Authentication,Authorization, blogController.updateBlogsById); 

//....................delete blog by params........../
router.delete("/blogs/:blogId", Authentication, Authorization, blogController.deleteById);  

//....................delete blog by params........./
router.delete("/blogs", Authentication,AuthorizationToQuery, blogController.deleteByQuarry);

//....................in case of invalid URL.....(static route)...../
router.all('*',function (req,res){res.status(404).send({msg:"this page does not exist"})})

module.exports = router;

