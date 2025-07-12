const UserService = require('../services/UserService')
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken , genneralRefreshToken } = require('./JwtService')


const createUser = (newUser) => {
    return new Promise(async (resolve , reject) =>{
            const {name , email , password , confirmPassword , phone} = newUser    
            try{
                const checkUser = await User.findOne({
                    email : email
            })
            if(checkUser !== null) {
                resolve({
                    status :'OK',
                    message : 'the email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createUser = await User.create({
                    name,
                    email,
                    password : hash,
                    confirmPassword : hash,
                    phone
            })
            if (createUser ){
                resolve({
                    status : 'OK',
                    Message : 'SUCCESS',
                    data : createUser
                })
            }
            }catch(e) {
                reject(e)
            }
    })
}
const loginUser = (userLogin) => {
    return new Promise(async (resolve , reject) =>{
            const {name , email , password , confirmPassword , phone} = userLogin    
            try{
                const checkUser = await User.findOne({
                    email : email
            })
            if(checkUser === null) {
                return resolve({
                    status :'OK',
                    message : 'the user is not define'
                })
            }
            // const comparePassword = bcrypt.compareSync(password ,checkUser.password)
            // console.log('comparePassword' , comparePassword)
            // if(!comparePassword ){
            //     return resolve({
            //         status :'OK',
            //         message : 'the password or user is incorrect'
            //     })
            // }
            const access_token = await genneralAccessToken({
                id : checkUser.id,
                isAdmin : checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id : checkUser.id,
                isAdmin : checkUser.isAdmin
            })
            console.log('access_token', access_token)
            return  resolve({
                    status : 'OK',
                    Message : 'SUCCESS',
                    access_token : access_token,
                    refresh_token : refresh_token,
                    data : checkUser
                })
            }catch(e) {
                reject(e)
            }

        
    })
}
const update_user = (id , data) => {
    return new Promise(async (resolve , reject) => {
            try{
                const checkUser = await User.findOne({
                    _id: id
                })
                console.log('checkUser' ,checkUser)
                if (checkUser === null){
                    resolve({
                        status : 'OK',
                        message : 'the user is not define'
                    })
                }
            const updateUser = await User.findByIdAndUpdate(id ,data)
            console.log('updateUser' ,updateUser)
                resolve({
                    status : 'OK',
                    Message : 'SUCCESS',
                })            
            }catch(e) {
                reject(e)
            }
    })
}
const delete_user = (id ) => {
    return new Promise(async (resolve , reject) => {
            try{
                const checkUser = await User.findOne({
                    _id: id
                })
                console.log('checkUser' ,checkUser)
                if (checkUser === null){
                    resolve({
                        status : 'OK',
                        message : 'the user is not define'
                    })
                }
            await User.findByIdAndDelete(id)
                resolve({
                    status : 'OK',
                    Message : 'Delete User success',
                })            
            }catch(e) {
                reject(e)
            }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve , reject) => {
            try{
                const allUser = await User.find()
                    resolve({
                        status : 'OK',
                        message : 'the user is not define',
                        data : allUser
                    })
            }catch(e) {
                reject(e)
            }
    })
}
const getDetailsUser = (id) => {
    return new Promise(async (resolve , reject) => {
            try{
                const user = await User.findOne({
                    _id: id
                })
                if (user === null){
                    resolve({
                        status : 'OK',
                        message : 'the user is not define'
                    })
                }
                resolve({
                    status : 'OK',
                    Message : 'Success',
                    data : user
                })            
            }catch(e) {
                reject(e)
            }
    })
}
module.exports = {
    createUser,
    loginUser,
    update_user,
    delete_user,
    getAllUser,
    getDetailsUser
}