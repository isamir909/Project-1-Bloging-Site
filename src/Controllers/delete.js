// ### DELETE /blogs/:blogId
// - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 


const { application } = require('express');
const express = require('express');
const { mongo, default: mongoose } = require('mongoose');
const router = express.Router();

const blogModel = require('../Models/BlogModel');














let deleteBlogByquery = async function (req, res) {

    try {
        let data = req.query
        
        let { authorId, category, subcategory, tags, isPublished } = data

        let filter = { isDeleted: false, isPublished: true }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "No query param received. Please query details" })
        }

        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ sttaus: false, msg: ` please enter a valid object Id` });
        }

         if (isValid(authorId) && isValidRequestBody(authorId)) {
            filter["authorId"] = authorId
        }
        if (isValid(category)) {
            filter["category"] = category
        }
        if (isValid(subcategory)) {
            filter["subcategory"] = subcategory
        }
        if (isValid(tags)) {
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