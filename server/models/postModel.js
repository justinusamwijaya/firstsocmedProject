const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    content:String,
    comments:[{ type:Schema.Types.ObjectId, ref: 'Comment' }],
    uploader:{ type:Schema.Types.ObjectId,ref:'User' },
    likes: [{ type:Schema.Types.ObjectId, ref: 'User' }]
},{timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}})

const postModel = mongoose.model('Post', postSchema)

module.exports = { postModel,postSchema }