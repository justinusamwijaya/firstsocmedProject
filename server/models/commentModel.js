const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    content:String,
    postParent:{ type:Schema.Types.ObjectId, ref:'Post' },
    uploader:{ type:Schema.Types.ObjectId,ref:'User' },
},{timestamps:{ createdAt:'createdAt',updatedAt:'updatedAt' }})

const commentModel = mongoose.model('Comment', commentSchema)

module.exports = { commentModel,commentSchema }