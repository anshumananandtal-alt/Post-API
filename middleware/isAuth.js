const jwtToken = require('jsonwebtoken')

const isAuth = (req, res, next)=>{
    const authHeader = req.get('Authorization')
    let decodedToken
    if(!authHeader){
        const error = new Error('Not authorised')
        error.statusCode = 401
        throw(error)
    }
    const token = authHeader.split(" ")?.[1] ?? ''
    try{
        decodedToken = jwtToken.verify(token, 'my-secret')
    }catch(err){
        err.statusCode = 500
        throw(err)
    }
    if(!decodedToken){
        const error = new Error('Not authorised')
        error.statusCode = 401
        throw(error)
    }
    req.userId = decodedToken.userId
    next()
}

module.exports = isAuth