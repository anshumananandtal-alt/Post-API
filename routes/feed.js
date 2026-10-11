const { Router } = require('express')
const validator = require('../utils/validation')

const feedController = require('../controller/feed')
const router = Router()
const isAuth = require('../middleware/isAuth')

router.get('/posts', isAuth, feedController.getPost )
router.get('/post/:postId', isAuth, feedController.getSinglePost)
router.post('/post', validator.postPost(), isAuth, feedController.postPost )

router.put('/post/:postId', validator.postPost(), isAuth, feedController.updatePost)
router.delete('/post/:postId', isAuth,feedController.deletePost)


module.exports = router