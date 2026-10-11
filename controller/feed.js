const { validationResult } = require('express-validator')
const { ObjectId } = require('mongodb')
const Post = require('../models/post')
const User = require('../models/user')
const path  = require('path')
const rootDir = require('../utils/rootDir')
const deleteFile = require('../utils/helper')
exports.getPost = (req, res, next)=>{
    const page = req.query.page || 1
    const PER_PAGE = 2
    console.log(page, req)
    let totalItems = 0
    Post.find().countDocuments()
    .then(count =>{
        totalItems = count
        return Post.find()
            .populate('creator')
            .skip((page-1)*PER_PAGE)
            .limit(PER_PAGE)
    })
    .then(posts=>{
        res.status(200)
        .json({
            message:'Successfully fetched the posts',
            posts,
            totalItems
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}

exports.postPost = (req, res, next)=>{
    console.log(req.body)
    const { title, content } = req.body
    const errors = validationResult(req)
    if(!req.file){
        const err = new Error('Invalid/ No image file uploaded make sure it should be png/jpg/jpeg format')
        err.statusCode = 422
        throw(err)
    }
    if(!errors.isEmpty()){
        const err = new Error(errors?.array()?.[0]?.msg ?? 'Entered value are invalid')
        err.statusCode = 422
        throw(err)
    }
    const post = new Post({
        title,
        content,
        imageUrl: req.file.path.replace('\\', '/'),
        creator: req.userId,  
    })
    post.save()
    .then(result=>{
        return User.findById(req.userId)
    })
    .then((user)=>{
        user.posts.push(post)
        return user.save()
    })
    .then((user)=>{
    res.status(201)
    .json({
        "message": 'Post created successfully!',
        post: post,
        creator: { _id: user._id, author: user.name}
    })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}

exports.getSinglePost = (req, res, next)=>{
    const postId = req.params.postId
    Post.findById(postId)
    .then(post=>{
        if(!post){
            const err = new Error(`Post for the postId: ${postId} not found`)
            err.statusCode = 404
            throw(err)
        }
        return res.status(200)
        .json({
            message: `Successfully fetched the post for postId : ${postId}`,
            post
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}

exports.updatePost = (req, res, next)=>{
    const postId = req.params.postId
    const { title, content } = req.body
    let imageUrl = req.body.image
    if(req.file){
        imageUrl = req.file.path.replace('\\', '/')
    }
    const errors = validationResult(req)
    if(!imageUrl){
        const err = new Error('Invalid/ No image file uploaded make sure it should be png/jpg/jpeg format')
        err.statusCode = 422
        throw(err)
    }
    if(!errors.isEmpty()){
        const err = new Error(errors?.array()?.[0]?.msg ?? 'Entered value are invalid')
        err.statusCode = 422
        throw(err)
    }
    Post.findById(postId)
    .then(post=>{
        post.title = title;
        post.content = content;
        console.log(imageUrl, post.imageUrl)
        if(imageUrl !== post.imageUrl){ 
            deleteFile(path.join(rootDir, post.imageUrl))
            post.imageUrl = imageUrl; 
        }
        return post.save()
    })
    .then(result=>{
        res.status(200)
        .json({
            "message": 'Post updatd successfully!',
            post: result
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}

exports.deletePost = (req, res, next) =>{
    const postId = req.params.postId
    Post.findById(postId)
    .then(post =>{
        if(!post){
            const err = new Error(`Post for the postId: ${postId} not found`)
            err.statusCode = 404
            throw(err)
        }
        if(post.creator.toString() !== req.userId){
            const err = new Error(`You are not authorised to perform this action.`)
            err.statusCode = 403
            throw(err)
        }
        deleteFile(path.join(rootDir, post.imageUrl))
        return Post.findByIdAndDelete(postId)
    })
    .then(result=>{
        return User.findById(req.userId)
    })
    .then(user=>{
        user.posts.pull(postId)
        return user.save()
    })
    .then(result =>{
        res.status(200).
        json({
            message: 'Post deleted successfully!'
        })

    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}