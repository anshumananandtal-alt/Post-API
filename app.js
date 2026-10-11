const express = require('express')
const authRoutes = require('./routes/user')
const feedRouter = require('./routes/feed')
const app = express()
const multer = require('multer')
const crypto = require('crypto')
const { mongoConnect } = require('./utils/database')

const diskStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "images")
    },
    filename:(req, file, cb)=>{
        cb(null, `${file.originalname}-${crypto.randomUUID()}`)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        return cb(null, true)
    }
    cb(null, false)
}
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(multer({ fileFilter, storage: diskStorage}).single('image'))
app.use('/images', express.static('images'))

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

app.use(authRoutes)
app.use('/feed', feedRouter)

app.use((err, req, res , next)=>{
    const message = err.message
    const statusCode = err.statusCode || 500
    res.status(statusCode)
    .json({
        message
    })
})
mongoConnect()
.then((result)=>{
    app.listen(8080)
})
.catch(err=>{
    console.log(err)
})
