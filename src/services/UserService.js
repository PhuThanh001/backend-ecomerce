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
                    message : 'the email is already exist'
                })
            }
            //const hash = bcrypt.hashSync(password, 10)
            const createUser = await User.create({
                    email,
                    password : password,
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
            const { email , password } = userLogin    
            try{
                const checkUser = await User.findOne({
                    email : email,
                    password : password
            })
            if(checkUser === null) {
                return resolve({
                    status :'ERR',
                    message : 'the user is not define'
                })
            }

            const access_token = await genneralAccessToken({
                id : checkUser.id,
                isAdmin : checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id : checkUser.id,
                isAdmin : checkUser.isAdmin
            })
                return resolve({
                    status: 'success', // đồng bộ với frontend
                    message: 'SUCCESS', // key viết thường
                    access_token,
                    refresh_token,
                    data: checkUser
                });
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
                if (checkUser === null){
                    resolve({
                        status : 'OK',
                        message : 'the user is not define'
                    })
                }
            const updateUser = await User.findByIdAndUpdate(id ,data)
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
const delete_many = (ids ) => {
    return new Promise(async (resolve , reject) => {
            try{
            await User.deleteMany({ _id : ids})
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
    delete_many,
    getAllUser,
    getDetailsUser
}