const { application } = require("express");
const express = require("express")
const router = express.Router();
const authorController = require("../Controllers/authorController");
const blogController = require("../Controllers/blogController");
const { Authentication, Authorization,AuthorizationToQuary } = require("../middleware/authentication");





// create a blog, edit a blog, get the list of blogs, delete a blog(s)


router.post("/blogs", Authentication,AuthorizationToQuary, blogController.createBlog) //done
router.post("/authors", authorController.createAuthor);  //done
router.post("/login", authorController.loginauth) //done
router.get("/blogs",Authentication,blogController.getBlogs); //done


router.put("/blogs/:blogId",Authentication,Authorization, blogController.updateBlogsById) //done

router.delete("/blogs/:blogId", Authentication, Authorization, blogController.isdeleted); //done    

router.delete("/blogs", Authentication,AuthorizationToQuary, blogController.deleteByQuarry)  //done



module.exports = router;

