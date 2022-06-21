const{application} = require ('express');
const express=require('express');
const router =express.Router();
const authorController=require("../Controllers/authorController")
const blogController=require("../Controllers/blogController")
const jscontroller=require("../Controllers/jscontroller")


router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)
router.put("/blogUpdate",blogController.blogUpdate)



router.get("/getblog",jscontroller.getblog)

module.exports=router;