const express = require("express")
const ProductService = require("../services/ProductService.js")


const create_product = async (req , res) => {
        try{    
                const {name ,image , type,countInStock ,price ,rating, description} = req.body
                console.log('req.body', req.body)
                if (!name || !image || !type || !countInStock || !price ||!rating || !description){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the input is required'
                    })
                }
                //console.log('isCheckemail' ,isCheckemail)
                const response = await ProductService.createProduct(req.body)
                console.log('response' , response)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const update_product = async (req , res) => {
        try{    
             const productid = req.params.id
             const data = req.body
             if(!productid){
                    return res.status(404).json({
                        status :'ERR',
                        message :'the product is not exist'
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
const delete_product = async (req , res) => {
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
module.exports = {
    create_product,
    update_product,
    delete_product
}
