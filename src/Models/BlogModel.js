const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Type.ObjectId

const BlogSchema = new mongoose.schema({

    title: {
        require: true,
        type: String
    },
    body: {
        require: true,
        type: String
    },
    AuthorId: {
        type: ObjectId,
        ref: "Author",
        require: true
    },
    tags:
        [{
            type: String

        }],
    category: [{
        type: String,
        require: true
    }],
    subcategory:
        [{
            type: String
        }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })
module.exports = mongoose.model('Blog', BlogSchema)