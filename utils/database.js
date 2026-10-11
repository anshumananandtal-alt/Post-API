const mongoose = require('mongoose')


exports.mongoConnect = () =>{
    return mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@node.3l7dvs8.mongodb.net/${process.env.DEFAULT_DATABASE}`)
}