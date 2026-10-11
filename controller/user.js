const {validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwtToken = require('jsonwebtoken')

exports.postSignup = (req, res, next)=>{
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error(errors?.array()?.[0].msg)
        error.statusCode = 422
        throw error
    }
    bcrypt.hash(password, 12)
    .then(hashPassword=>{
        const user = new User({
            name,
            email,
            password: hashPassword,
            status: 'active',
            posts: []
        })
        return user.save()
    .then(result=>{
        res.status(200)
        .json({
            message: 'User created successfully',
            result
        })
    })    
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        console.log(err)
        next(err)

    })
}

exports.postLogin = (req, res, next)=>{
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    let loadedUser 
    if(!errors.isEmpty()){
        const error = new Error(errors?.array()?.[0]?.msg || 'Invalid email/password')
        error.statusCode = 422
        throw error
    }
    User.findOne({ email })
    .then(user=>{
        if(!user){
            const error = new Error("User with the given email doesn't exit")
            error.statusCode = 401
            throw error
        }
        loadedUser = user
        return bcrypt.compare(password, user.password)
    })
    .then((isEqual)=>{
        if(!isEqual){
            const error = new Error("Password is invalid")
            error.statusCode = 401
            throw error
        }
       const token =  jwtToken.sign({
            email,
            userId: loadedUser._id.toString() ,
            name: loadedUser.name
        },'my-secret', { expiresIn: '1h'})

        res.status(200)
        .json({
            token,
            userId: loadedUser._id.toString()        
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        console.log(err)
        next(err)

    })
}

exports.getUserStatus = (req, res, next) =>{
    User.findById(req.userId)
    .then(user =>{
        if(!user){
            const err = new Error('user not found')
            err.statusCode = 404
            throw(err)
        }
        res.status(200)
        .json({
            message: 'User status fetched successfully',
            status: user.status
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        console.log(err)
        next(err)
    })    
}

exports.updateUserStatus = (req, res, next)=>{
    const updatedStatus = req.body.status
    User.findById(req.userId)
    .then(user =>{
        if(!user){
            const err = new Error('user not found')
            err.statusCode = 404
            throw(err)
        }
        user.status = updatedStatus
        return user.save()
    })
    .then(result =>{
        res.status(200).json({
            userId: req.userId,
            message: 'User status updated successfully'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        console.log(err)
        next(err)
    }) 
}