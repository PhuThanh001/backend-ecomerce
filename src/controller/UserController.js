const { resolve } = require('path')
const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req , res) => {
        try{    
                const  {name , email , password, confirmPassword, phone } = req.body
                const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
                const isCheckemail = reg.test(email) 
                if (!name || !email || !password || !confirmPassword || !phone){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the input is required'
                    })
                }else if (!isCheckemail) {
                    return res.status(200).json({
                        status :'ERR' ,
                        message :'the input is email'
                    })
                }else if (password !== confirmPassword){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the password is equal confirmPassword'
                    })
                }
                //console.log('isCheckemail' ,isCheckemail)
                const response = await UserService.createUser(req.body)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const loginUser = async (req , res) => {
        try{    
                const  {name , email , password, confirmPassword, phone } = req.body
                const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
                const isCheckemail = reg.test(email) 
                if (!name || !email || !password || !confirmPassword || !phone){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the input is required'
                    })
                }else if (!isCheckemail) {
                    return res.status(200).json({
                        status :'ERR' ,
                        message :'the input is email'
                    })
                }else if (password !== confirmPassword){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the password is equal confirmPassword'
                    })
                }
                //console.log('isCheckemail' ,isCheckemail)
                const response = await UserService.loginUser(req.body)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const update_user = async (req , res) => {
        try{    
             const userId = req.params.id
             const data = req.body
             if(!userId){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the password is equal confirmPassword'
                    })
             }
             console.log('userId',userId)
             const response = await UserService.update_user(userId , data)   
             return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const delete_user = async (req , res) => {
        try{    
             const userId = req.params.id
             const token = req.headers
             if(!userId){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the password is equal confirmPassword'
                    })
             }
             console.log('userId',userId)
             const response = await UserService.delete_user(userId )   
             return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const getAllUser = async (req , res) => {
        try{    
             const response = await UserService.getAllUser() 
             return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const getDetailsUser = async (req , res) => {
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status :'ERR',
                message : 'The UserId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e){
        return res.status(404).json({
            message: e
        })
    }
}
const refreshToken = async (req, res) => {
    try {
        const token =  req.headers.token.split(" ")[1];
        if(!token) {
            return res.status(200).json({
                status :'ERR',
                message : 'The UserId is requried'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
        }
    catch (e){
         return res.status(500).json({
            status: 'ERROR',
            message: e.message || 'Internal server errorrrr'
        });
    }

}
module.exports = {
    createUser,
    loginUser,
    update_user,
    delete_user,
    getAllUser,
    getDetailsUser,
    refreshToken
}