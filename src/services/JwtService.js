const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { resolve } = require('path')
const { rejects } = require('assert')
dotenv.config()
const genneralAccessToken = async (payload) => {
    //console.log('payload' , payload)
    const access_token = jwt.sign({
       ...payload 
    }, process.env.ACCESS_TOKEN, { expiresIn :'10s'})
    
    return access_token
}  
const genneralRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload 
    },process.env.REFRESH_TOKEN , { expiresIn :'365d'})
    
    return refresh_token
}  
// const refreshTokenJwtService = async (token) => {
//     return new Promise((resolve, reject) => {
//         try {
//             if (!token || typeof token !== 'string') {
//                 return resolve({
//                     status: 'ERROR',
//                     message: 'Token is missing or invalid',
//                 });
//             }

//             jwt.verify(token, process.env.REFRESH_TOKEN, async (err, decoded) => {
//                 if (err) {
//                     return resolve({
//                         status: 'ERROR',
//                         message: 'Token verification failed',
//                     });
//                 }

//                 const { payload } = decoded;

//                 const access_token = await genneralAccessToken({
//                     id: payload?.id,
//                     isAdmin: payload?.isAdmin
//                 });

//                 return resolve({
//                     status: 'OK',
//                     message: 'Token refreshed successfully',
//                     data: { access_token }
//                 });
//             });

//         } catch (e) {
//             reject(e);
//         }
//     });
// };
const refreshTokenJwtService = async (token) => {
    return new Promise( async (resolve , rejects) => {
        try{
            console.log('token', token);
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    console.log('err', err);
                    return resolve({
                        status: 'ERROR',
                        message: 'The authentication failed',
                    });
                }
                const access_token =  await genneralAccessToken({
                    id : user?.id,
                    isAdmin: user?.isAdmin
                })
                console.log('user' , user)
                resolve({
                    status: 'OK', 
                    message: 'SUCCESS',
                    access_token : access_token
                });
                });
                //console.log('access-token' , access_token)
                // Nếu verify thành công
        }catch (e){
            rejects(e)
        }
    })
}
module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}