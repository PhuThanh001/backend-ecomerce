const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { resolve } = require('path')
dotenv.config()

const authMiddleware = (req , res, next) => {
    console.log('req.headers' , req.headers)
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    console.log('token' , token)
    jwt.verify(token,process.env.ACCESS_TOKEN , function(err ,user){
        if(err ) {
            return res.status(404).json({
                Message : 'the authentication failed' ,
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
    const authHeader = req.headers.token;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token not provided or malformed',
            status: 'ERROR'
        });
    }

    const token = authHeader.split(' ')[1]; // tách "Bearer <token>"
    const userId = req.params.id;
    jwt.verify(token , process.env.ACCESS_TOKEN , function(err, user){
        if(err) {
            console.log('err' , err)
            return res.status(404).json({
                message:'the authentication phu',
                status :'ERROR'
            })
        }
        console.log('user' , user)
        if ( user?.id === userId ){
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