const express = require('express')
const router = express.Router()
const validator = require('../utils/validation')
const userController = require('../controller/user')
const isAuth = require('../middleware/isAuth')

router.post('/signup', validator.postSignup(), userController.postSignup)

router.post('/login', validator.postLogin(), userController.postLogin)

router.get('/status', isAuth, userController.getUserStatus)

router.put('/status', isAuth,  userController.updateUserStatus)

module.exports = router