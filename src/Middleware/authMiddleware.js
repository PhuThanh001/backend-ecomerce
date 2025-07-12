const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { resolve } = require('path')
dotenv.config()
const authMiddleware = (req , res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    console.log('token' , token)
    jwt.verify(token,process.env.ACCESS_TOKEN , function(err ,user){
        if(err ) {
            return res.status(404).json({
                Message : 'the authentication phu' ,
                status :'ERROR'
            })
        }
        console.log('user' , user)
        const {payload} = user
        if(payload?.isAdmin || payload?.id === userId){
            next()
        }else{
            return res.status(404).json({
                message : 'the authentication me',
                status : 'ERROR'
            })
        }
    })
}
const authUserMiddleWare = (req , res, next ) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token , process.env.ACCESS_TOKEN , function(err, user){
        if(err) {
            console.log('err' , err)
            return res.status(404).json({
                message:'the authentication phu',
                status :'ERROR'
            })
        }
        const {payload } = user 
        if (payload?.isAdmin || payload?.id === userId){
            next()
        }else {
            return res.status(404).json({
                message : 'the authentication ',
                status : 'ERROR'
            })
        }

    })
}
module.exports =  {
    authMiddleware,
    authUserMiddleWare
}