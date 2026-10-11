const {check, body} = require('express-validator')
const User = require('../models/user')
exports.postPost = function (){
    return [
        body('title', 'Title is invalid')
        .matches(/^[A-Za-z ]+$/)
        .isLength({ min : 5})
        .trim(),
        body('content', 'Invalid content')
        .isLength({ min : 5})
        .trim()
    ]
}

exports.postSignup = function (){
    return [
        body('name', "Name should be valid")
        .matches(/^[A-Za-z ]+$/)
        .isLength({ min : 5})
        .trim(),
        body('password', "Password should be valid")
        .isLength({min: 8})
        .isAlphanumeric()
        .trim(),
        body('email', "Email should be valid")
        .isEmail()
        .trim()
        .custom((value, {req})=>{
            console.log(value)
            return User.findOne({ email : value})
            .then(result=>{
                if(result){
                    return Promise.reject('Email already exit')
                }
                return true
            }).catch(err=>{
                console.log(err)
            })
        })

    ]
}

exports.postLogin = function (){
    return [
        body('email', "Email is invalid")
        .isEmail()
        .trim(),
        body('password', "Password should be valid")
        .isLength({min: 8})
        .trim()
    ]
}