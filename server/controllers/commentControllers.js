const { Comment } = require('../models')
const mongoose = require('mongoose')

module.exports = {
    addComment:(req,res)=>{
        let { content, postParentId } = req.body
        let newComment = new Comment({
            content,
            uploader: mongoose.Types.ObjectId(req.user.id),
            postParent: mongoose.Types.ObjectId(postParentId)
        })
        Comment.create(newComment)
        .then(result =>{
            res.status(200).json({
                msg: 'data berhasil ditambahkan!',
                result
            })
        })
        .catch(error =>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    getAllComment:(req,res)=>{
        Comment.find({ postParent: req.params.postId })
        .populate('uploader')
        .populate('postParent')
        .exec()
        .then(commentsFound =>{
            console.log(commentsFound)
            res.status(200).json({
                msg:'comment berhasil didapatkan!',
                commentsFound
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    updateComment:(req,res)=>{
        Comment.findById(req.params.id)
        .then(commentFound =>{
            if(req.user.id !== commentFound.uploader.toString()) return res.status(403).json({
                msg:"you can't edit comment that isn't yours!"
            })
            let { content } = req.body
            let updatedComment = {
                content
            }

            Comment.updateOne({ _id: req.params.id }, updatedComment)
            .then(()=>{
                Comment.findById(req.params.id)
                .then(commentFound=>{
                    res.status(200).json({
                        msg:'data berhasil diupdate!',
                        commentFound
                    })
                })
                .catch(error=>{
                    res.status(400).json({
                        msg:'terjadi kesalahan',
                        error
                    })
                })
            })
            .catch(error=>{
                res.status(400).json({
                    msg:'terjadi kesalahan',
                    error
                })
            })

        })
    },
    deleteComment:(req,res)=>{
        Comment.findById(req.params.id)
        .then(commentFound => {
            if(req.user.id !== commentFound.uploader.toString()) return res.status(403).json({
                msg:"you can't delete comment that isn't yours!"
            })
            commentFound.remove(error =>{
                if(error) return res.status(400).json({
                    msg:'terjadi kesalahan',
                    error
                })
                res.status(200).json({
                    msg:'data berhasil dihapus!'
                })
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
}