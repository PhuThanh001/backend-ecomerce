const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const { resolve } = require('path')


// const authMiddleware = (req , res, next) => {
//     console.log('req.headers' , req.headers)
//     const token = req.headers.token.split(' ')[1]
//     const userId = req.params.id
//     console.log('token' , token)
//     jwt.verify(token,process.env.ACCESS_TOKEN , function(err ,user){
//         if(err ) {
//             return res.status(403).json({
//                 Message : 'the authentication failed' ,
//                 status :'ERROR'
//             })
//         }
//         console.log('user' , user)
//         const {payload} = user
//         if(payload?.isAdmin || payload?.id === userId){
//             next()
//         }else{
//             return res.status(404).json({
//                 message : 'the authentication me',
//                 status : 'ERROR'
//             })
//         }
//     })
// }
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.token?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'No token provided' })
        }
        const userId = req.params.id
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Authentication failed', status: 'ERROR' })
            }
            const { id, isAdmin } = user
            if (isAdmin || id === userId) {
                next()
            } else {
                return res.status(403).json({ message: 'Access denied', status: 'ERROR' })
            }
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error })
    }
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
            return res.status(404).json({
                message:'the authentication phu',
                status :'ERROR'
            })
        }
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